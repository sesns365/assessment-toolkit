/* Browser-only interview editor. No analytics, requests, or remote storage. */
(() => {
  'use strict';
  const STORAGE_PREFIX = 'assessment-hub:interviews:v1:';
  const BACKUP_FORMAT = 'assessment-interview-backup';
  const MAX_FILE_BYTES = 40 * 1024 * 1024;
  const MAX_TEXT = 100000;
  const MAX_DRAFTS = 100;
  const encoder = new TextEncoder();
  let def, formKey, fieldList, fieldMap, state, storageKey;
  let saveTimer, toastTimer, nameMode = 'rename', dirty = false;
  let storageBlocked = false, storageReason = '', lastStorageRaw = null;
  let lastSavedAt = null;
  const $ = id => document.getElementById(id);
  const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
  const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
  const now = () => new Date().toISOString();
  const displayTime = value => new Date(value).toLocaleString('zh-TW', { hour12:false, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' });
  const uuid = () => globalThis.crypto?.randomUUID ? crypto.randomUUID() : 'draft-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);

  function makeDraft(transient = false) {
    const time = now();
    return { id:uuid(), name:'未命名草稿', createdAt:time, updatedAt:time, answers:{}, transient };
  }
  function getActive() { return state.drafts.find(draft => draft.id === state.activeId); }
  function cleanName(value) {
    if (typeof value !== 'string' || !value.trim() || value.length > 100) throw new Error('草稿名稱需為 1 至 100 個字。');
    return value.trim();
  }
  function validateAnswers(answers, definition) {
    if (!isRecord(answers)) throw new Error('備份內容缺少有效的填寫資料。');
    const fields = new Map(definition.sections.flatMap(section => section.fields).map(field => [field.id, field]));
    const result = {};
    for (const [id, value] of Object.entries(answers)) {
      const field = fields.get(id);
      if (!field || ['__proto__','constructor','prototype'].includes(id)) throw new Error('備份包含這份表單沒有的欄位，請使用相符版本的工具。');
      if (field.type === 'checkboxes') {
        if (!Array.isArray(value) || value.length > (field.options || []).length || value.some(item => typeof item !== 'string' || !(field.options || []).includes(item))) throw new Error('勾選欄位的備份格式不正確。');
        result[id] = [...new Set(value)];
      } else {
        if (typeof value !== 'string' || value.length > MAX_TEXT) throw new Error('文字欄位格式不正確，或內容過長。');
        if (field.type === 'select' && value && !(field.options || []).includes(value)) throw new Error('選單欄位的備份內容不符合這份表單。');
        if (field.type === 'date' && value) {
          const parsed = new Date(value + 'T00:00:00Z');
          if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value.startsWith('0000-') || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0,10) !== value) throw new Error('日期欄位格式不正確。');
        }
        result[id] = value;
      }
    }
    return result;
  }
  function validateBackup(data, expectedKey, definition) {
    if (!isRecord(data) || data.format !== BACKUP_FORMAT || data.version !== 1) throw new Error('這不是本工具支援的 JSON 備份檔。');
    if (data.formKey !== expectedKey) throw new Error('這是另一種訪談紀錄表的備份。請先返回工具集，開啟對應的表單再讀回。');
    if (!isRecord(data.draft)) throw new Error('備份缺少草稿內容。');
    return { name:cleanName(data.draft.name), answers:validateAnswers(data.draft.answers, definition) };
  }
  function validateStore(data, expectedKey, definition) {
    if (!isRecord(data) || data.schemaVersion !== 1 || data.formKey !== expectedKey || !Array.isArray(data.drafts) || data.drafts.length > MAX_DRAFTS) throw new Error('本機暫存格式無法辨識。');
    const ids = new Set();
    const drafts = data.drafts.map(draft => {
      if (!isRecord(draft) || typeof draft.id !== 'string' || !/^[a-zA-Z0-9_-]{1,100}$/.test(draft.id) || ids.has(draft.id)) throw new Error('本機暫存的草稿代號不正確。');
      ids.add(draft.id);
      for (const key of ['createdAt','updatedAt']) if (typeof draft[key] !== 'string' || !Number.isFinite(Date.parse(draft[key]))) throw new Error('本機暫存的時間格式不正確。');
      return { id:draft.id, name:cleanName(draft.name), createdAt:draft.createdAt, updatedAt:draft.updatedAt, answers:validateAnswers(draft.answers, definition), transient:false };
    });
    if (drafts.length && !ids.has(data.activeId)) throw new Error('找不到本機暫存正在編輯的草稿。');
    return { schemaVersion:1, formKey:expectedKey, activeId:data.activeId, drafts };
  }
  function serializableStore() {
    const drafts = state.drafts.filter(draft => !draft.transient).map(({id,name,createdAt,updatedAt,answers}) => ({id,name,createdAt,updatedAt,answers}));
    return { schemaVersion:1, formKey, activeId:drafts.some(draft => draft.id === state.activeId) ? state.activeId : (drafts[0]?.id || null), drafts };
  }
  function setStatus(message, kind = '') {
    $('save-status').textContent = message;
    $('save-status').className = kind;
  }
  function storageWarning(message, reason = 'unavailable') {
    storageBlocked = true;
    storageReason = reason;
    $('storage-warning').hidden = false;
    $('storage-warning-text').textContent = message;
    $('retry-storage').textContent = reason === 'conflict' ? '重新載入其他分頁的草稿' : reason === 'corrupt' ? '建立新的本機暫存' : '重試本機暫存';
    setStatus('尚未存入本機，請下載備份。', 'failed');
  }
  function saveNow() {
    clearTimeout(saveTimer);
    if (!dirty) return true;
    if (storageBlocked) return false;
    try {
      const currentRaw = localStorage.getItem(storageKey);
      if (currentRaw !== lastStorageRaw) {
        storageWarning('另一個分頁已修改這份表單的本機草稿。為避免互相覆蓋，本分頁已停止自動暫存。請先下載目前草稿備份，再重新載入。', 'conflict');
        return false;
      }
      const nextRaw = JSON.stringify(serializableStore());
      localStorage.setItem(storageKey, nextRaw);
      lastStorageRaw = nextRaw;
      lastSavedAt = now();
      dirty = false;
      $('storage-warning').hidden = true;
      storageReason = '';
      setStatus(getActive().transient ? '開始填寫後，會自動暫存在本機。' : '已暫存在本機 · ' + displayTime(lastSavedAt));
      return true;
    } catch (error) {
      const quota = error && (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED');
      storageWarning(quota ? '瀏覽器的本機儲存空間不足，這次變更尚未存入。內容仍留在目前分頁，請立即下載備份；可刪除不需要的舊草稿後重試。' : '瀏覽器目前不允許本機暫存。內容仍留在目前分頁，請在離開前下載備份或 Word。');
      return false;
    }
  }
  function markChanged({immediate = false} = {}) {
    dirty = true;
    if (!storageBlocked) setStatus('正在暫存於本機…', 'unsaved');
    clearTimeout(saveTimer);
    if (immediate) saveNow(); else saveTimer = setTimeout(saveNow, 450);
  }
  function toast(message) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').hidden = false;
    toastTimer = setTimeout(() => { $('toast').hidden = true; }, 5500);
  }
  function renderDrafts() {
    const select = $('draft-select');
    select.replaceChildren();
    for (const draft of state.drafts) {
      const option = document.createElement('option');
      option.value = draft.id;
      option.textContent = draft.name;
      option.selected = draft.id === state.activeId;
      select.append(option);
    }
    const active = getActive();
    $('draft-meta').textContent = active.transient ? '尚未建立暫存，開始填寫即可。' : '建立於 ' + displayTime(active.createdAt) + ' · 共 ' + state.drafts.filter(draft => !draft.transient).length + ' 份草稿';
  }
  function filled(value) { return Array.isArray(value) ? value.length > 0 : typeof value === 'string' && value.trim().length > 0; }
  function updateProgress() {
    const answers = getActive().answers;
    const count = fieldList.filter(field => filled(answers[field.id])).length;
    $('progress-count').textContent = count + '／' + fieldList.length;
    $('form-progress').max = fieldList.length || 1;
    $('form-progress').value = count;
    def.sections.forEach((section, index) => {
      const item = $('section-count-' + index);
      if (item) item.textContent = section.fields.filter(field => filled(answers[field.id])).length + '／' + section.fields.length;
    });
  }
  function appendText(parent, tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    element.textContent = text;
    parent.append(element);
    return element;
  }
  function buildForm() {
    const form = $('interview-form');
    const nav = $('section-nav');
    for (const [index, section] of def.sections.entries()) {
      const sectionId = 'part-' + index;
      const link = document.createElement('a');
      link.href = '#' + sectionId;
      link.className = 'section-link' + (index === 0 ? ' active' : '');
      appendText(link, 'span', 'section-number', String(index + 1));
      appendText(link, 'span', 'section-label', section.title);
      const count = appendText(link, 'span', 'section-status', '0／' + section.fields.length);
      count.id = 'section-count-' + index;
      link.addEventListener('click', () => {
        nav.querySelectorAll('a').forEach(anchor => { anchor.classList.remove('active'); anchor.removeAttribute('aria-current'); });
        link.classList.add('active'); link.setAttribute('aria-current','step');
      });
      nav.append(link);
      const block = document.createElement('section');
      block.className = 'form-section';
      block.id = sectionId;
      block.setAttribute('aria-labelledby', 'heading-' + index);
      const heading = document.createElement('div');
      heading.className = 'section-heading';
      appendText(heading, 'span', 'section-number', String(index + 1));
      const h2 = appendText(heading, 'h2', '', section.title);
      h2.id = 'heading-' + index;
      block.append(heading);
      if (section.description) appendText(block, 'p', 'section-description', section.description);
      for (const field of section.fields) {
        const wrapper = document.createElement('div');
        wrapper.className = 'field';
        const inputId = 'input-' + field.id;
        let container = wrapper;
        if (field.type === 'checkboxes') {
          container = document.createElement('fieldset');
          wrapper.append(container);
          appendText(container, 'legend', '', field.label);
        } else {
          const label = appendText(container, 'label', '', field.label);
          label.htmlFor = inputId;
        }
        if (field.hint) {
          const hint = appendText(container, 'p', 'field-hint', field.hint);
          hint.id = inputId + '-hint';
        }
        if (field.type === 'checkboxes') {
          const options = document.createElement('div');
          options.className = 'checkbox-list';
          if (field.hint) container.setAttribute('aria-describedby', inputId + '-hint');
          for (const [optionIndex, value] of (field.options || []).entries()) {
            const label = document.createElement('label');
            label.className = 'checkbox-option';
            const input = document.createElement('input');
            input.type = 'checkbox'; input.value = value; input.name = field.id; input.id = inputId + '-' + optionIndex; input.dataset.field = field.id;
            label.append(input); appendText(label,'span','',value); options.append(label);
          }
          container.append(options);
        } else {
          const control = document.createElement(field.type === 'textarea' ? 'textarea' : field.type === 'select' ? 'select' : 'input');
          control.id = inputId; control.name = field.id; control.dataset.field = field.id;
          if (field.type === 'select') {
            const blank = document.createElement('option'); blank.value = ''; blank.textContent = '請選擇'; control.append(blank);
            for (const value of field.options || []) { const option = document.createElement('option'); option.value = value; option.textContent = value; control.append(option); }
          } else if (field.type === 'textarea') { control.rows = 4; control.maxLength = MAX_TEXT; }
          else { control.type = field.type === 'date' ? 'date' : 'text'; if (control.type === 'text') control.maxLength = MAX_TEXT; }
          control.autocomplete = 'off';
          control.spellcheck = false;
          if (field.hint) control.setAttribute('aria-describedby', inputId + '-hint');
          container.append(control);
        }
        block.append(wrapper);
      }
      form.append(block);
    }
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(entries => {
        const visible = entries.filter(entry => entry.isIntersecting).sort((a,b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (!visible.length) return;
        const id = visible[0].target.id;
        nav.querySelectorAll('a').forEach(anchor => {
          const active = anchor.getAttribute('href') === '#' + id;
          anchor.classList.toggle('active', active);
          if (active) anchor.setAttribute('aria-current','step'); else anchor.removeAttribute('aria-current');
        });
      }, {rootMargin:'-130px 0px -55% 0px', threshold:0});
      form.querySelectorAll('.form-section').forEach(section => observer.observe(section));
    }
  }
  function populateForm() {
    const answers = getActive().answers;
    for (const control of $('interview-form').querySelectorAll('[data-field]')) {
      const value = answers[control.dataset.field];
      if (control.type === 'checkbox') control.checked = Array.isArray(value) && value.includes(control.value);
      else control.value = typeof value === 'string' ? value : '';
    }
    renderDrafts(); updateProgress();
  }
  function handleInput(event) {
    const control = event.target;
    if (!control.dataset.field) return;
    const field = fieldMap.get(control.dataset.field);
    if (!field) return;
    const active = getActive();
    if (field.type === 'checkboxes') {
      active.answers[field.id] = Array.from($('interview-form').querySelectorAll('input[type="checkbox"]')).filter(input => input.dataset.field === field.id && input.checked).map(input => input.value);
    } else active.answers[field.id] = control.value;
    active.updatedAt = now();
    const wasTransient = active.transient;
    active.transient = false;
    if (wasTransient) renderDrafts();
    updateProgress(); markChanged();
  }
  function showNameDialog(mode) {
    if (mode === 'new' && state.drafts.filter(draft => !draft.transient).length >= MAX_DRAFTS) { toast('已達 100 份草稿，請先備份並刪除不需要的草稿。'); return; }
    nameMode = mode;
    $('name-dialog-title').textContent = mode === 'new' ? '新增本機草稿' : '更改草稿名稱';
    $('draft-name').value = mode === 'new' ? '' : getActive().name;
    $('name-dialog').showModal();
    $('draft-name').focus(); $('draft-name').select();
  }
  function createNamedDraft(name) {
    const draft = makeDraft(); draft.name = name;
    state.drafts = state.drafts.filter(item => !item.transient);
    state.drafts.push(draft); state.activeId = draft.id;
    populateForm(); markChanged({immediate:true});
  }
  function answerText(field, answers) {
    const value = answers[field.id];
    if (field.type === 'checkboxes') return (field.options || []).map(option => (Array.isArray(value) && value.includes(option) ? '■ ' : '□ ') + option).join('　');
    return typeof value === 'string' && value.trim() ? value : '［未填寫］';
  }
  function exportText(definition, draft) {
    const lines = [definition.title, '填寫整理版（依原範本問項整理，版面與原範本不同）', '草稿名稱：' + draft.name, '匯出時間：' + displayTime(now()), ''];
    if (definition.description) lines.push(definition.description, '');
    for (const section of definition.sections) {
      lines.push(section.title, '─'.repeat(28));
      if (section.description) lines.push(section.description, '');
      for (const field of section.fields) {
        lines.push(field.label);
        if (field.hint) lines.push('填寫提示：' + field.hint);
        lines.push(answerText(field, draft.answers), '');
      }
      lines.push('');
    }
    return lines.join('\r\n');
  }
  function safeFilename(name) { return name.replace(/[\\/:*?"<>|\u0000-\u001f]/g,'_').replace(/[. ]+$/,'').slice(0,90) || '訪談紀錄'; }
  function download(data, filename, mime) {
    const blob = data instanceof Blob ? data : new Blob([data], {type:mime});
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename;
    document.body.append(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }
  function exportBackup() {
    saveNow();
    const draft = getActive();
    const data = {format:BACKUP_FORMAT,version:1,formKey,formTitle:def.title,exportedAt:now(),draft:{name:draft.name,createdAt:draft.createdAt,updatedAt:draft.updatedAt,answers:draft.answers}};
    download(JSON.stringify(data,null,2), safeFilename(def.title + '_' + draft.name) + '_備份.json', 'application/json;charset=utf-8');
    toast('已交由瀏覽器下載備份。請確認檔案已保存在裝置中。');
  }
  async function importBackup(file) {
    if (!file) return;
    try {
      if (file.size > MAX_FILE_BYTES) throw new Error('備份檔超過 40 MB，請確認選取的是本工具的 JSON 備份。');
      if (state.drafts.filter(draft => !draft.transient).length >= MAX_DRAFTS) throw new Error('已達 100 份草稿，請先備份並刪除不需要的草稿。');
      const data = validateBackup(JSON.parse((await file.text()).replace(/^\uFEFF/,'')), formKey, def);
      const draft = makeDraft();
      draft.name = (data.name.slice(0,92) + '（讀回）').slice(0,100); draft.answers = data.answers;
      state.drafts = state.drafts.filter(item => !item.transient);
      state.drafts.push(draft); state.activeId = draft.id;
      populateForm(); markChanged({immediate:true});
      toast(storageBlocked ? '已讀回為新草稿；目前無法暫存，請保留原備份檔。' : '已讀回為新草稿，原有草稿完整保留。');
    } catch (error) {
      toast(error instanceof SyntaxError ? '檔案不是有效的 JSON 格式，未變更任何草稿。' : error.message || '無法讀取備份，未變更任何草稿。');
    } finally { $('import-file').value = ''; }
  }

  // Minimal standards-compliant OOXML package, with ZIP stored entries and CRC-32.
  // Generated locally so no content or dependencies leave the browser.
  const crcTable = new Uint32Array(256);
  for (let i=0;i<256;i++) { let c=i; for(let j=0;j<8;j++) c=(c&1) ? 0xedb88320^(c>>>1) : c>>>1; crcTable[i]=c>>>0; }
  function crc32(bytes) { let c=0xffffffff; for(const byte of bytes)c=crcTable[(c^byte)&255]^(c>>>8); return (c^0xffffffff)>>>0; }
  function makeZip(entries) {
    const chunks=[], central=[]; let offset=0;
    const u16=(view,at,value)=>view.setUint16(at,value,true), u32=(view,at,value)=>view.setUint32(at,value,true);
    for(const [name,value] of entries) {
      const filename=encoder.encode(name), bytes=typeof value==='string'?encoder.encode(value):value, crc=crc32(bytes);
      const head=new Uint8Array(30+filename.length), hv=new DataView(head.buffer);
      u32(hv,0,0x04034b50);u16(hv,4,20);u16(hv,6,0x0800);u16(hv,8,0);u16(hv,12,0x0021);u32(hv,14,crc);u32(hv,18,bytes.length);u32(hv,22,bytes.length);u16(hv,26,filename.length);head.set(filename,30);
      const cd=new Uint8Array(46+filename.length), cv=new DataView(cd.buffer);
      u32(cv,0,0x02014b50);u16(cv,4,20);u16(cv,6,20);u16(cv,8,0x0800);u16(cv,10,0);u16(cv,14,0x0021);u32(cv,16,crc);u32(cv,20,bytes.length);u32(cv,24,bytes.length);u16(cv,28,filename.length);u32(cv,42,offset);cd.set(filename,46);
      chunks.push(head,bytes);central.push(cd);offset+=head.length+bytes.length;
    }
    const centralSize=central.reduce((sum,chunk)=>sum+chunk.length,0), end=new Uint8Array(22), ev=new DataView(end.buffer);
    u32(ev,0,0x06054b50);u16(ev,8,entries.length);u16(ev,10,entries.length);u32(ev,12,centralSize);u32(ev,16,offset);
    const result=new Uint8Array(offset+centralSize+end.length); let at=0;
    for(const chunk of [...chunks,...central,end]){result.set(chunk,at);at+=chunk.length;}return result;
  }
  function xml(value) { return String(value).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/g,'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;'); }
  function paragraph(value, style='Normal', bold=false) {
    const lines=String(value).replace(/\r\n/g,'\n').split('\n');
    return '<w:p><w:pPr><w:pStyle w:val="'+style+'"/></w:pPr><w:r>'+(bold?'<w:rPr><w:b/></w:rPr>':'')+lines.map((line,index)=>(index?'<w:br/>':'')+'<w:t xml:space="preserve">'+xml(line)+'</w:t>').join('')+'</w:r></w:p>';
  }
  function buildDocx(definition, draft) {
    const body=[paragraph(definition.title,'Title'),paragraph('填寫整理版（依原範本問項整理，版面與原範本不同）','Subtitle'),paragraph('草稿名稱：'+draft.name,'Meta'),paragraph('匯出時間：'+displayTime(now()),'Meta')];
    if(definition.description) body.push(paragraph(definition.description,'Description'));
    for(const section of definition.sections){
      body.push(paragraph(section.title,'Heading1'));
      if(section.description)body.push(paragraph(section.description,'Description'));
      for(const field of section.fields){
        body.push(paragraph(field.label,'Question',true));
        if(field.hint)body.push(paragraph('填寫提示：'+field.hint,'Hint'));
        body.push(paragraph(answerText(field,draft.answers),'Answer'));
      }
    }
    const ns='http://schemas.openxmlformats.org/wordprocessingml/2006/main';
    const documentXml='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="'+ns+'" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><w:body>'+body.join('')+'<w:sectPr><w:footerReference w:type="default" r:id="rId2"/><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567"/><w:cols w:space="425"/></w:sectPr></w:body></w:document>';
    const styles='<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="'+ns+'"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Microsoft JhengHei"/><w:sz w:val="22"/><w:lang w:val="zh-TW" w:eastAsia="zh-TW"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="100" w:line="320" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style><w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:after="220"/></w:pPr><w:rPr><w:b/><w:color w:val="214C43"/><w:sz w:val="36"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Subtitle"><w:name w:val="Subtitle"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/></w:pPr><w:rPr><w:color w:val="666666"/><w:sz w:val="20"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Meta"><w:name w:val="Metadata"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="666666"/><w:sz w:val="18"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="320" w:after="140"/><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="214C43"/><w:sz w:val="28"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Question"><w:name w:val="Question"/><w:basedOn w:val="Normal"/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="60"/></w:pPr><w:rPr><w:b/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Answer"><w:name w:val="Answer"/><w:basedOn w:val="Normal"/><w:pPr><w:spacing w:after="160"/><w:ind w:left="140"/></w:pPr></w:style><w:style w:type="paragraph" w:styleId="Description"><w:name w:val="Description"/><w:basedOn w:val="Normal"/><w:rPr><w:color w:val="666666"/><w:sz w:val="20"/></w:rPr></w:style><w:style w:type="paragraph" w:styleId="Hint"><w:name w:val="Hint"/><w:basedOn w:val="Description"/><w:pPr><w:keepNext/></w:pPr></w:style></w:styles>';
    const relns='http://schemas.openxmlformats.org/package/2006/relationships';
    return makeZip([
      ['[Content_Types].xml','<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>'],
      ['_rels/.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="'+relns+'"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>'],
      ['word/document.xml',documentXml],['word/styles.xml',styles],
      ['word/_rels/document.xml.rels','<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="'+relns+'"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>'],
      ['word/footer1.xml','<?xml version="1.0" encoding="UTF-8"?><w:ftr xmlns:w="'+ns+'"><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t>第 </w:t></w:r><w:fldSimple w:instr="PAGE"/><w:r><w:rPr><w:sz w:val="18"/></w:rPr><w:t> 頁</w:t></w:r></w:p></w:ftr>']
    ]);
  }
  function preparePrint() {
    const target=$('print-view'),draft=getActive(); target.replaceChildren();
    appendText(target,'h1','',def.title);
    appendText(target,'p','print-meta','填寫整理版（依原範本問項整理，版面與原範本不同）');
    appendText(target,'p','print-meta','草稿名稱：'+draft.name+'　｜　匯出時間：'+displayTime(now()));
    if(def.description)appendText(target,'p','print-description',def.description);
    for(const section of def.sections){
      appendText(target,'h2','',section.title);
      if(section.description)appendText(target,'p','print-description',section.description);
      for(const field of section.fields){
        const block=document.createElement('div');block.className='print-field';
        appendText(block,'h3','print-label',field.label);
        if(field.hint)appendText(block,'p','print-description','填寫提示：'+field.hint);
        appendText(block,'p','print-answer'+(filled(draft.answers[field.id])?'':' print-empty'),answerText(field,draft.answers));
        target.append(block);
      }
    }
  }
  function wireEvents() {
    $('interview-form').addEventListener('submit',event=>event.preventDefault());
    $('interview-form').addEventListener('input',handleInput);
    $('draft-select').addEventListener('change',event=>{
      saveNow(); state.activeId=event.target.value; populateForm(); markChanged({immediate:true});
    });
    $('new-draft').addEventListener('click',()=>showNameDialog('new'));
    $('rename-draft').addEventListener('click',()=>showNameDialog('rename'));
    $('name-cancel').addEventListener('click',()=>$('name-dialog').close());
    $('name-dialog-form').addEventListener('submit',event=>{
      event.preventDefault();
      const name=$('draft-name').value.trim(); if(!name){$('draft-name').setCustomValidity('請輸入草稿名稱。');$('draft-name').reportValidity();return;}
      if(nameMode==='new')createNamedDraft(name);
      else {const draft=getActive();draft.name=name;draft.updatedAt=now();draft.transient=false;renderDrafts();markChanged({immediate:true});}
      $('name-dialog').close();
    });
    $('draft-name').addEventListener('input',()=>$('draft-name').setCustomValidity(''));
    $('delete-draft').addEventListener('click',()=>{
      const draft=getActive();
      if(!window.confirm('確定刪除「'+draft.name+'」的本機草稿？\n此操作無法復原，建議先下載備份。'))return;
      clearTimeout(saveTimer);state.drafts=state.drafts.filter(item=>item.id!==draft.id);
      if(!state.drafts.length)state.drafts.push(makeDraft(true));
      state.activeId=state.drafts[0].id;populateForm();
      if(storageReason==='unavailable'){storageBlocked=false;}
      markChanged({immediate:true});
      toast(storageBlocked?'已從目前分頁移除，但本機儲存尚未更新。':'已刪除這份本機草稿。');
    });
    $('retry-storage').addEventListener('click',()=>{
      if(storageReason==='conflict'){
        if(window.confirm('重新載入會捨棄本分頁尚未存入的修改。\n請先下載備份，確認後再重新載入。')){dirty=false;location.reload();}return;
      }
      if(storageReason==='corrupt' && !window.confirm('建立新的本機暫存，將取代目前無法辨識的舊資料。\n目前畫面中的內容會保留，是否繼續？'))return;
      try{if(storageReason==='corrupt')lastStorageRaw=localStorage.getItem(storageKey);storageBlocked=false;dirty=true;saveNow();}catch(error){storageWarning('目前仍無法使用本機暫存，請下載備份保存內容。');}
    });
    $('export-json').addEventListener('click',exportBackup);
    $('import-json').addEventListener('click',()=>$('import-file').click());
    $('import-file').addEventListener('change',event=>importBackup(event.target.files[0]));
    $('export-txt').addEventListener('click',()=>{
      saveNow(); download('\uFEFF'+exportText(def,getActive()),safeFilename(def.title+'_'+getActive().name)+'.txt','text/plain;charset=utf-8');toast('已交由瀏覽器下載純文字檔。');
    });
    $('export-docx').addEventListener('click',()=>{
      saveNow();const button=$('export-docx');button.disabled=true;
      try{download(buildDocx(def,getActive()),safeFilename(def.title+'_'+getActive().name)+'_填寫整理版.docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document');toast('已交由瀏覽器下載可編輯的 Word 整理版。');}
      catch(error){toast('Word 匯出未完成，請先下載備份保留內容。');}
      finally{button.disabled=false;}
    });
    $('print-form').addEventListener('click',()=>{saveNow();preparePrint();window.print();});
    window.addEventListener('beforeprint',preparePrint);
    window.addEventListener('beforeunload',event=>{if(dirty&&!saveNow()){event.preventDefault();event.returnValue='';}});
    window.addEventListener('pagehide',saveNow);
    document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='hidden')saveNow();});
    window.addEventListener('storage',event=>{
      if(event.key!==storageKey||event.newValue===lastStorageRaw)return;
      storageWarning('另一個分頁已修改或刪除這份表單的本機草稿。為避免互相覆蓋，本分頁已停止自動暫存；請先下載目前草稿備份，再重新載入。','conflict');
    });
    document.addEventListener('click',event=>{const details=document.querySelector('.more-actions');if(details.open&&!details.contains(event.target))details.open=false;});
  }
  function init() {
    try {
      formKey=new URLSearchParams(location.search).get('form')||'learning';
      if(!['learning','emotional'].includes(formKey)||!window.FORM_DEFINITIONS?.[formKey])throw new Error('找不到這份訪談紀錄表。請返回工具集，重新選擇表單。');
      def=window.FORM_DEFINITIONS[formKey];fieldList=def.sections.flatMap(section=>section.fields);fieldMap=new Map(fieldList.map(field=>[field.id,field]));
      if(fieldMap.size!==fieldList.length)throw new Error('表單欄位設定有重複，無法安全載入。');
      storageKey=STORAGE_PREFIX+formKey;
      $('page-title').textContent=def.title;$('form-description').textContent=def.description||'';document.title=def.title+'｜鑑定評估工具集';
      $('blank-template').href=def.download;$('blank-template').setAttribute('download','');
      state={schemaVersion:1,formKey,activeId:null,drafts:[]};
      try {
        lastStorageRaw=localStorage.getItem(storageKey);
        if(lastStorageRaw!==null)state=validateStore(JSON.parse(lastStorageRaw),formKey,def);
      }catch(error){storageWarning(lastStorageRaw!==null?'已發現本機暫存，但內容格式無法辨識。舊資料尚未被覆蓋；目前可以填寫及下載，若要重新建立暫存，請按下方按鈕。':'瀏覽器目前不允許本機暫存。請在離開前下載備份或 Word。',lastStorageRaw!==null?'corrupt':'unavailable');}
      if(!state.drafts.length){const draft=makeDraft(true);state.drafts.push(draft);state.activeId=draft.id;}
      buildForm();populateForm();wireEvents();
      if(!storageBlocked)setStatus(getActive().transient?'開始填寫後，會自動暫存在本機。':'已讀取本機草稿 · 上次更新 '+displayTime(getActive().updatedAt));
      $('editor').hidden=false;
    }catch(error){$('fatal-error').textContent=error.message||'目前無法載入表單，請返回工具集重試。';$('fatal-error').hidden=false;}
  }
  // Exposed pure functions enable package-integrity and import-validation tests.
  window.AssessmentFormUtils=Object.freeze({validateAnswers,validateBackup,validateStore,buildDocx,exportText,makeZip,crc32});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
