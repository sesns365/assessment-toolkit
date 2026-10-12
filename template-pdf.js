/* PDF generation from the same filled Word template used by DOCX export.
 * All processing is local. The bundled font and PDF engine are script assets. */
(function (global) {
  'use strict';
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const FONT_METRIC_HEIGHT = 1.437;
  let supportedChars, supportedBoldChars;
  const local = node => node && (node.localName || node.nodeName.split(':').pop());
  const children = (node, name) => Array.from(node ? node.childNodes : []).filter(n => n.nodeType === 1 && n.namespaceURI === W && (!name || local(n) === name));
  const child = (node, name) => children(node, name)[0] || null;
  const val = (node, name = 'val', fallback = null) => node ? (node.getAttributeNS(W, name) || fallback) : fallback;
  const num = (node, name, fallback = 0) => Number(val(node, name, fallback));
  const flag = node => node ? !['0', 'false', 'off', 'none'].includes(val(node, 'val', 'true')) : undefined;
  const xml = text => new DOMParser().parseFromString(text, 'application/xml');
  const decode = text => new TextDecoder().decode(Uint8Array.from(atob(text), c => c.charCodeAt(0)));
  const color = value => /^[0-9A-Fa-f]{6}$/.test(value || '') ? '#' + value : undefined;
  function part(formKey, name) {
    const found = global.TEMPLATE_DATA[formKey].entries.find(entry => entry.name === name);
    return found ? xml(decode(found.data)) : null;
  }
  function props(node) {
    const out = {};
    children(node).forEach(item => {
      out[local(item)] = {};
      Array.from(item.attributes).forEach(a => out[local(item)][local(a)] = a.value);
    });
    return out;
  }
  function mergeProps(...objects) {
    const out = {};
    objects.forEach(obj => Object.entries(obj || {}).forEach(([key, value]) => out[key] = {...out[key], ...value}));
    return out;
  }
  function charStyle(p) {
    const result = {};
    if (p.sz) result.fontSize = Number(p.sz.val) / 2;
    if (p.b) result.bold = !['0', 'false'].includes(p.b.val);
    if (p.i) result.italics = !['0', 'false'].includes(p.i.val);
    if (p.color && color(p.color.val)) result.color = color(p.color.val);
    if (p.u && !['none', '0'].includes(p.u.val)) result.decoration = 'underline';
    if (p.strike && !['0', 'false'].includes(p.strike.val)) result.decoration = 'lineThrough';
    if (p.shd) result.background = p.shd.val === 'pct15' ? '#D9D9D9' : color(p.shd.fill);
    return result;
  }
  function context(formKey) {
    const styles = part(formKey, 'word/styles.xml');
    const root = styles && styles.documentElement;
    const defaults = child(root, 'docDefaults');
    const defaultP = props(child(child(defaults, 'pPrDefault'), 'pPr'));
    const defaultR = props(child(child(defaults, 'rPrDefault'), 'rPr'));
    const map = {};
    let normal;
    children(root, 'style').forEach(s => {
      map[val(s, 'styleId')] = s;
      if (val(s, 'default') === '1' && val(s, 'type') === 'paragraph') normal = val(s, 'styleId');
    });
    const cache = {};
    function style(id, chain = []) {
      if (cache[id]) return cache[id];
      const s = map[id];
      if (!s || chain.includes(id)) return {p: defaultP, r: defaultR};
      const baseId = val(child(s, 'basedOn'));
      const base = baseId ? style(baseId, [...chain, id]) : {p: defaultP, r: defaultR};
      return cache[id] = {p: mergeProps(base.p, props(child(s, 'pPr'))), r: mergeProps(base.r, props(child(s, 'rPr')))};
    }
    const numbering = part(formKey, 'word/numbering.xml');
    const counters = {};
    function listPrefix(pPr) {
      const np = child(pPr, 'numPr');
      if (!np || !numbering) return '';
      const id = val(child(np, 'numId'));
      const level = val(child(np, 'ilvl'), 'val', '0');
      const n = children(numbering.documentElement, 'num').find(x => val(x, 'numId') === id);
      const abstractId = val(child(n, 'abstractNumId'));
      const ab = children(numbering.documentElement, 'abstractNum').find(x => val(x, 'abstractNumId') === abstractId);
      const lv = children(ab, 'lvl').find(x => val(x, 'ilvl') === level);
      if (!lv) return '';
      const counterKey = id + ':' + level;
      counters[counterKey] = counters[counterKey] === undefined ? num(child(lv, 'start'), 'val', 1) : counters[counterKey] + 1;
      const count = counters[counterKey];
      const fmt = val(child(lv, 'numFmt'));
      const digits = '零一二三四五六七八九';
      const chinese = count < 10 ? digits[count] : count < 20 ? '十' + (count % 10 ? digits[count % 10] : '') : digits[Math.floor(count / 10)] + '十' + (count % 10 ? digits[count % 10] : '');
      const display = /taiwanese|chinese|ideograph/i.test(fmt || '') ? chinese : String(count);
      return (val(child(lv, 'lvlText'), 'val', '%1.') || '').replace(/%\d/g, display) + ' ';
    }
    return {formKey, style, normal, listPrefix};
  }
  function runs(node, inherited) {
    const result = [];
    function visit(element, current) {
      children(element).forEach(n => {
        const name = local(n);
        if (['pPr', 'rPr', 'pict', 'drawing', 'txbxContent', 'del', 'instrText'].includes(name)) return;
        if (name === 'r') {
          const r = child(n, 'rPr');
          if (flag(child(r, 'vanish'))) return;
          visit(n, mergeProps(current, props(r)));
        } else if (name === 't') {
          const style = charStyle(current);
          // The original Kai font uses half-em blank cells. Noto's ordinary
          // spaces are narrower, so retain those underlined field widths.
          const text = style.decoration === 'underline' ? n.textContent.replace(/ /g, '\u2002') : n.textContent;
          if (style.bold && supportedBoldChars && Array.from(text).some(c => !/\s/.test(c) && !supportedBoldChars.has(c.codePointAt(0)))) style.bold = false;
          result.push({text, ...style});
        }
        else if (name === 'br' || name === 'cr') result.push({text: '\n', ...charStyle(current)});
        else if (name === 'tab') result.push({text: '    ', ...charStyle(current)});
        else if (name === 'noBreakHyphen') result.push({text: '-', ...charStyle(current)});
        else visit(n, current);
      });
    }
    visit(node, inherited);
    return result;
  }
  function paragraph(p, ctx) {
    const direct = child(p, 'pPr');
    const base = ctx.style(val(child(direct, 'pStyle'), 'val', ctx.normal));
    const pp = mergeProps(base.p, props(direct));
    // w:pPr/w:rPr styles the paragraph mark, not every existing text run.
    const rp = children(p, 'r').length ? base.r : mergeProps(base.r, props(child(direct, 'rPr')));
    let text = runs(p, rp);
    const prefix = ctx.listPrefix(direct);
    if (prefix) text.unshift({text: prefix, ...charStyle(rp)});
    if (!text.length) text = [{text: ' ', ...charStyle(rp)}];
    if (!text.map(t => t.text).join('').trim()) text.forEach(t => delete t.decoration);
    const fontSize = Math.max(...text.map(t => t.fontSize || 11));
    const spacing = pp.spacing || {};
    const ind = pp.ind || {};
    let linePt = spacing.lineRule === 'exact' ? Number(spacing.line || 0) / 20 : 0;
    if (!linePt) linePt = ctx.formKey === 'emotional' ? 18 : 15;
    // PDF fonts use typographic ascent+descent; convert the template's point
    // line pitch to that metric so the original blank-form spacing is retained.
    const lineHeight = Math.max(0.55, linePt / (fontSize * FONT_METRIC_HEIGHT));
    const align = pp.jc && pp.jc.val;
    const output = {
      text,
      font: 'TemplateSerif',
      fontSize,
      lineHeight,
      alignment: align === 'center' || align === 'right' ? align : 'left',
      margin: [Number(ind.left || 0) / 20, Number(spacing.before || 0) / 20, Number(ind.right || 0) / 20, Number(spacing.after || 0) / 20],
      preserveLeadingSpaces: true
    };
    if (pp.pageBreakBefore && !['0', 'false'].includes(pp.pageBreakBefore.val)) output.pageBreak = 'before';
    if (pp.keepNext && !['0', 'false'].includes(pp.keepNext.val)) output.headlineLevel = 1;
    const joined = text.map(run => run.text).join('');
    if (ctx.formKey === 'emotional' && /^家長[:：]/.test(joined) && /導師[:：]/.test(joined)) {
      const portions = joined.match(/^家長[:：]([\s\S]*?)導師[:：]([\s\S]*)$/);
      if (portions) {
        const smallLabel = label => ({
          table: {widths: [29], body: [[{text: label, fontSize: 12, lineHeight: 0.85}]]},
          layout: {hLineWidth: () => 0.5, vLineWidth: () => 0.5, paddingLeft: () => 1, paddingRight: () => 1, paddingTop: () => 0, paddingBottom: () => 0},
          border: [false, false, false, false]
        });
        return {
          table: {widths: [36, '*'], heights: [36, 18], dontBreakRows: false, body: [
            [smallLabel('家長:'), {text: portions[1].trim() || ' ', fontSize: 12, lineHeight: 18 / (12 * FONT_METRIC_HEIGHT), border: [false, false, false, false]}],
            [smallLabel('導師:'), {text: portions[2].trim() || ' ', fontSize: 12, lineHeight: 18 / (12 * FONT_METRIC_HEIGHT), border: [false, false, false, false]}]
          ]},
          layout: {hLineWidth: () => 0, vLineWidth: () => 0, paddingLeft: () => 0, paddingRight: () => 0, paddingTop: () => 0, paddingBottom: () => 0},
          margin: output.margin
        };
      }
    }
    return output;
  }
  function table(t, ctx, availableWidth) {
    const tp = child(t, 'tblPr');
    const cm = child(tp, 'tblCellMar');
    const pad = side => num(child(cm, side), 'w', side === 'left' || side === 'right' ? 108 : 0) / 20;
    const left = pad('left'), right = pad('right'), top = pad('top'), bottom = pad('bottom');
    const borders = child(tp, 'tblBorders');
    const border = child(borders, 'top');
    const borderWidth = num(border, 'sz', 4) / 8;
    const borderColor = color(val(border, 'color')) || '#D9D9D9';
    const grid = children(child(t, 'tblGrid'), 'gridCol').map(c => num(c, 'w') / 20);
    const total = grid.reduce((sum, n) => sum + n, 0);
    const ratio = total > availableWidth ? availableWidth / total : 1;
    const widths = grid.map(w => Math.max(1, w * ratio - left - right - borderWidth));
    const sourceRows = children(t, 'tr');
    const body = sourceRows.map(tr => {
      const row = [];
      children(tr, 'tc').forEach(tc => {
        const cp = child(tc, 'tcPr');
        const span = num(child(cp, 'gridSpan'), 'val', 1);
        const stack = children(tc).filter(n => ['p', 'tbl'].includes(local(n))).map(n => local(n) === 'p' ? paragraph(n, ctx) : table(n, ctx, availableWidth));
        const cell = {stack: stack.length ? stack : [{text: ' '}], margin: 0};
        const fill = color(val(child(cp, 'shd'), 'fill'));
        if (fill) cell.fillColor = fill;
        if (span > 1) cell.colSpan = span;
        row.push(cell);
        for (let i = 1; i < span; i++) row.push({});
      });
      return row;
    });
    const headerRows = sourceRows.findIndex(tr => !child(child(tr, 'trPr'), 'tblHeader'));
    const heights = sourceRows.map(tr => Math.max(0, num(child(child(tr, 'trPr'), 'trHeight'), 'val') / 20 - top - bottom));
    return {
      table: {widths, body, heights, headerRows: Math.max(0, headerRows), dontBreakRows: false, keepWithHeaderRows: 0},
      layout: {
        hLineWidth: () => borderWidth, vLineWidth: () => borderWidth,
        hLineColor: () => borderColor, vLineColor: () => borderColor,
        paddingLeft: () => left, paddingRight: () => right,
        paddingTop: () => top, paddingBottom: () => bottom
      },
      margin: [0, 0, 0, 0]
    };
  }
  function buildDefinition(formKey, answers) {
    if (!global.TemplateExport || !global.TEMPLATE_DATA || !global.TEMPLATE_DATA[formKey]) throw new Error('找不到原始表單。');
    if (global.TEMPLATE_PDF_CODEPOINTS) {
      supportedChars ||= new Set(global.TEMPLATE_PDF_CODEPOINTS);
      supportedBoldChars ||= new Set(global.TEMPLATE_PDF_BOLD_CODEPOINTS || global.TEMPLATE_PDF_CODEPOINTS);
      const input = Object.values(answers || {}).flat().filter(v => typeof v === 'string').join('');
      const missing = [...new Set(Array.from(input).filter(c => !/[\s\u0000-\u001f\u200b-\u200f\ufe0e\ufe0f]/.test(c) && !supportedChars.has(c.codePointAt(0))))];
      if (missing.length) throw new Error('PDF 字型不支援「' + missing.slice(0, 8).join('') + '」。請下載 Word，以保留原文字。');
    }
    const doc = global.TemplateExport.fillDocument(formKey, answers || {});
    const body = child(doc.documentElement, 'body');
    const section = child(body, 'sectPr');
    const size = child(section, 'pgSz');
    const margins = child(section, 'pgMar');
    const pageSize = {width: num(size, 'w', 11906) / 20, height: num(size, 'h', 16838) / 20};
    const pageMargins = ['left', 'top', 'right', 'bottom'].map(s => num(margins, s, 720) / 20);
    const ctx = context(formKey);
    const availableWidth = pageSize.width - pageMargins[0] - pageMargins[2];
    const content = children(body).filter(n => ['p', 'tbl'].includes(local(n))).map(n => local(n) === 'p' ? paragraph(n, ctx) : table(n, ctx, availableWidth));
    const title = global.FORM_DEFINITIONS && global.FORM_DEFINITIONS[formKey] ? global.FORM_DEFINITIONS[formKey].title : '訪談紀錄表';
    // The source keeps the year in an anchored text box. A right-aligned
    // first-page header preserves that content without flattening the title.
    const boxes = Array.from(doc.getElementsByTagNameNS(W, 'txbxContent'));
    const textboxText = boxes.map(n => Array.from(n.getElementsByTagNameNS(W, 't')).map(t => t.textContent).join('')).join(' ');
    const def = {
      pageSize, pageMargins, content,
      defaultStyle: {font: 'TemplateSerif', fontSize: formKey === 'emotional' ? 12 : 11, lineHeight: 1, color: '#000000'},
      info: {title, author: '', subject: '', creator: '鑑定評估小工具箱'},
      compress: true,
      pageBreakBefore(currentNode, followingNodesOnPage) { return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0; }
    };
    if (formKey === 'learning') def.footer = page => ({text: '第 ' + page + ' 頁', fontSize: 9, alignment: 'right', margin: [36, 12, 36, 0]});
    if (textboxText) def.background = page => page === 1 ? {text: textboxText, fontSize: 10, absolutePosition: {x: pageSize.width - pageMargins[2] - 60, y: 51}, alignment: 'left'} : null;
    return def;
  }
  function setup() {
    if (!global.pdfMake || !global.TEMPLATE_PDF_FONTS) throw new Error('PDF 元件尚未載入完成。');
    global.pdfMake.addVirtualFileSystem(global.TEMPLATE_PDF_FONTS);
    global.pdfMake.addFonts({TemplateSerif: {
      normal: 'NotoSerifTC-Regular.otf', bold: 'NotoSerifTC-Bold.otf',
      italics: 'NotoSerifTC-Regular.otf', bolditalics: 'NotoSerifTC-Bold.otf'
    }});
  }
  function buildBlob(formKey, answers) {
    return new Promise((resolve, reject) => {
      try {
        setup();
        // With local VFS fonts getStream() builds synchronously. In pdfmake
        // 0.2 the callback-based getBlob() hides a Promise rejection, leaving
        // callers pending when font decoding or document layout fails.
        const stream = global.pdfMake.createPdf(buildDefinition(formKey, answers)).getStream();
        const chunks = [];
        stream.on('data', chunk => chunks.push(chunk));
        stream.on('error', reject);
        stream.once('end', () => {
          try { resolve(new Blob(chunks, {type: 'application/pdf'})); }
          catch (error) { reject(error); }
        });
        stream.end();
      } catch (error) { reject(error); }
    });
  }
  global.TemplatePdf = Object.freeze({buildBlob, buildDefinition});
})(window);
