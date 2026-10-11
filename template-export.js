/* Fill the retained blank DOCX locally, without requests or uploaded answers. */
(() => {
  'use strict';
  const W = 'http://schemas.openxmlformats.org/wordprocessingml/2006/main';
  const XML = 'http://www.w3.org/XML/1998/namespace';
  const encoder = new TextEncoder();
  const elements = (node, name) => Array.from(node.getElementsByTagNameNS(W, name));
  const children = (node, name) => Array.from(node.childNodes).filter(n => n.nodeType === 1 && n.namespaceURI === W && n.localName === name);
  const cleanText = value => (Array.isArray(value) ? value.join('、') : typeof value === 'string' ? value : '')
    .replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g, '');
  function templateFor(key) {
    if (!['learning', 'emotional'].includes(key) || !window.TEMPLATE_DATA?.[key]) throw new Error('找不到原範本。');
    return window.TEMPLATE_DATA[key];
  }
  function appendText(run, value) {
    value.split('\n').forEach((line, i) => {
      if (i) run.appendChild(run.ownerDocument.createElementNS(W, 'w:br'));
      const text = run.ownerDocument.createElementNS(W, 'w:t');
      text.setAttributeNS(XML, 'xml:space', 'preserve'); text.textContent = line; run.appendChild(text);
    });
  }
  function answerRun(p, value, preferRun = null, plain = false) {
    const doc = p.ownerDocument, run = doc.createElementNS(W, 'w:r');
    const properties = (preferRun && children(preferRun, 'rPr')[0]) ||
      (children(p, 'pPr')[0] && children(children(p, 'pPr')[0], 'rPr')[0]);
    if (properties) {
      const copy = properties.cloneNode(true);
      if (plain) for (const name of ['bdr', 'u']) for (const n of children(copy, name)) copy.removeChild(n);
      run.appendChild(copy);
    }
    appendText(run, value); return run;
  }
  function setBlank(p, value) {
    // Keep paragraph properties, bookmarks and any opaque source structures.
    const runs = children(p, 'r'), sourceRun = runs[0] || null;
    const run = answerRun(p, value, sourceRun);
    for (const node of elements(p, 't')) node.textContent = '';
    p.appendChild(run);
  }
  function replaceRange(p, start, length, value) {
    let at = 0, written = false;
    for (const text of elements(p, 't')) {
      const original = text.textContent || '', end = at + original.length;
      if (end > start && at < start + length) {
        const left = Math.max(0, start - at), right = Math.min(original.length, start + length - at);
        text.textContent = original.slice(0, left) + (written ? '' : value) + original.slice(right);
        text.setAttributeNS(XML, 'xml:space', 'preserve'); written = true;
      }
      at = end;
    }
    if (!written) throw new Error('原範本欄位位置不符。');
  }
  function expandNewlines(p) {
    for (const text of elements(p, 't')) {
      if (!text.textContent.includes('\n')) continue;
      const parent = text.parentNode;
      text.textContent.split('\n').forEach((line, i) => {
        if (i) parent.insertBefore(p.ownerDocument.createElementNS(W, 'w:br'), text);
        const part = text.cloneNode(false); part.textContent = line; parent.insertBefore(part, text);
      });
      parent.removeChild(text);
    }
  }
  function fillDocument(formKey, answers = {}) {
    const template = templateFor(formKey);
    const doc = new DOMParser().parseFromString(template.documentXml, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length) throw new Error('原範本無法讀取。');
    const paragraphs = elements(doc, 'p');
    // Descending text ranges keep offsets stable where several fields share one line.
    const slots = [...template.slots].sort((a, b) => a.p - b.p || (b.start || 0) - (a.start || 0));
    for (const slot of slots) {
      const value = cleanText(answers[slot.id]);
      if (!value.trim()) continue; // Unfilled fields retain the exact blank source layout.
      const p = paragraphs[slot.p]; if (!p) throw new Error('原範本欄位不存在。');
      if (slot.kind === 'blank') setBlank(p, value);
      else if (slot.kind === 'range') {
        let insert = value;
        if (slot.pad) {
          const width = Array.from(value).reduce((sum, char) => sum + (/[^\u0000-\u00ff]/.test(char) ? 2 : 1), 0);
          insert += ' '.repeat(Math.max(2, slot.length - width));
        }
        replaceRange(p, slot.start, slot.length, insert);
      } else if (slot.kind === 'after-label') {
        const label = elements(p, 't').find(text => text.textContent === slot.label);
        if (!label || label.parentNode.localName !== 'r') throw new Error('原範本的訪談標籤不符。');
        const labelRun = label.parentNode;
        p.insertBefore(answerRun(p, ' ' + value, labelRun, true), labelRun.nextSibling);
      }
    }
    for (const p of paragraphs) expandNewlines(p);
    return doc;
  }
  function fillXml(formKey, answers = {}) {
    const xml = new XMLSerializer().serializeToString(fillDocument(formKey, answers));
    return xml.startsWith('<?xml') ? xml : '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' + xml;
  }
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) { let c = i; for (let j = 0; j < 8; j++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1; crcTable[i] = c >>> 0; }
  function crc32(bytes) { let c = 0xffffffff; for (const byte of bytes) c = crcTable[(c ^ byte) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
  function makeZip(entries) {
    const chunks = [], central = []; let offset = 0;
    const u16 = (v, at, value) => v.setUint16(at, value, true), u32 = (v, at, value) => v.setUint32(at, value, true);
    for (const [name, value] of entries) {
      const filename = encoder.encode(name), bytes = typeof value === 'string' ? encoder.encode(value) : value, crc = crc32(bytes);
      const head = new Uint8Array(30 + filename.length), hv = new DataView(head.buffer);
      u32(hv, 0, 0x04034b50); u16(hv, 4, 20); u16(hv, 6, 0x0800); u16(hv, 12, 0x0021); u32(hv, 14, crc); u32(hv, 18, bytes.length); u32(hv, 22, bytes.length); u16(hv, 26, filename.length); head.set(filename, 30);
      const cd = new Uint8Array(46 + filename.length), cv = new DataView(cd.buffer);
      u32(cv, 0, 0x02014b50); u16(cv, 4, 20); u16(cv, 6, 20); u16(cv, 8, 0x0800); u16(cv, 14, 0x0021); u32(cv, 16, crc); u32(cv, 20, bytes.length); u32(cv, 24, bytes.length); u16(cv, 28, filename.length); u32(cv, 42, offset); cd.set(filename, 46);
      chunks.push(head, bytes); central.push(cd); offset += head.length + bytes.length;
    }
    const centralSize = central.reduce((n, c) => n + c.length, 0), end = new Uint8Array(22), ev = new DataView(end.buffer);
    u32(ev, 0, 0x06054b50); u16(ev, 8, entries.length); u16(ev, 10, entries.length); u32(ev, 12, centralSize); u32(ev, 16, offset);
    const result = new Uint8Array(offset + centralSize + end.length); let at = 0;
    for (const chunk of [...chunks, ...central, end]) { result.set(chunk, at); at += chunk.length; }
    return result;
  }
  function decodeBase64(value) { const binary = atob(value), bytes = new Uint8Array(binary.length); for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i); return bytes; }
  function buildDocx(formKey, answers = {}) {
    const template = templateFor(formKey);
    const entries = template.entries.map(entry => [entry.name, decodeBase64(entry.data)]);
    entries.push(['word/document.xml', fillXml(formKey, answers)]);
    return makeZip(entries);
  }
  window.TemplateExport = Object.freeze({buildDocx, fillXml, fillDocument});
})();
