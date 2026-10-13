'use strict';

const search = document.getElementById('search');
const cards = [...document.querySelectorAll('.resource-card')];
const filters = [...document.querySelectorAll('[data-filter]')];
let filter = 'all';

function applyFilter() {
  const query = search.value.trim().toLocaleLowerCase('zh-TW');
  let count = 0;
  cards.forEach(card => {
    const text = `${card.dataset.keywords} ${card.querySelector('h3').textContent}`.toLocaleLowerCase('zh-TW');
    const show = (filter === 'all' || card.dataset.category === filter) && text.includes(query);
    card.hidden = !show;
    if (show) count++;
  });
  document.querySelectorAll('[data-group]').forEach(group => {
    group.hidden = !cards.some(card => card.dataset.category === group.dataset.group && !card.hidden);
  });
  document.getElementById('result-count').textContent = `顯示 ${count} 項資源`;
  document.getElementById('empty').hidden = count !== 0;
}

function resetFilter() {
  search.value = '';
  filters.find(button => button.dataset.filter === 'all').click();
}

function refreshDrafts() {
  for (const key of ['learning', 'emotional', 'autism']) {
    let count = 0;
    let available = true;
    try {
      const raw = localStorage.getItem(`assessment-hub:interviews:v1:${key}`);
      const data = raw ? JSON.parse(raw) : null;
      if (data?.schemaVersion === 1 && data?.formKey === key && Array.isArray(data.drafts)) {
        count = data.drafts.length;
      }
    } catch {
      available = false;
    }
    const status = document.querySelector(`[data-draft-form="${key}"]`);
    if (!status) continue;
    status.hidden = available && count === 0;
    status.textContent = available ? (count ? `本機有 ${count} 份草稿` : '') : '無法讀取本機草稿';
  }
}

if (search) {
  search.addEventListener('input', applyFilter);
  filters.forEach(button => button.addEventListener('click', () => {
    filter = button.dataset.filter;
    filters.forEach(item => {
      item.classList.toggle('selected', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    applyFilter();
  }));
  document.getElementById('reset-search').addEventListener('click', () => {
    resetFilter();
    search.focus();
  });
  document.addEventListener('keydown', event => {
    const active = document.activeElement;
    if (event.key === '/' && !event.ctrlKey && !event.metaKey && !event.altKey &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName) && !active.isContentEditable) {
      event.preventDefault();
      search.focus();
    }
  });
  refreshDrafts();
  window.addEventListener('pageshow', refreshDrafts);
  window.addEventListener('storage', refreshDrafts);
  document.querySelectorAll('a[href="#interviews"]').forEach(link => link.addEventListener('click', resetFilter));
}

document.getElementById('print-guide')?.addEventListener('click', () => window.print());

const relatedDisclosure = document.getElementById('related-disclosure');
if (relatedDisclosure) {
  const openRelated = () => { relatedDisclosure.open = true; };
  document.querySelectorAll('a[href="#related-sites"]').forEach(link => link.addEventListener('click', openRelated));
  const followRelatedHash = () => {
    if (location.hash === '#related-sites') openRelated();
  };
  window.addEventListener('hashchange', followRelatedHash);
  followRelatedHash();
}
