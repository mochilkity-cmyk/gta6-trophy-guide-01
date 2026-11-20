// Leonida Trophy Guide — offline tracker for the 55 GTA VI trophies.
// Loads its data from data/trophies.json (a local file, no network), saves
// earned ticks in localStorage, and supports export/import plus filters,
// search and a spoiler-safe mode. Screenshot views are chosen with ?shot=.

const STORE_KEY = 'gta6-trophy-checklist-v1';
const SPOILER_KEY = 'gta6-trophy-spoiler-v1';
const params = new URLSearchParams(location.search);
const shot = params.get('shot') || '';

const listEl = document.getElementById('trophyList');
const emptyEl = document.getElementById('emptyMsg');
const shownEl = document.getElementById('shownCount');
const searchEl = document.getElementById('search');
const gradeEl = document.getElementById('gradeFilter');
const spoilerEl = document.getElementById('spoilerToggle');
const detailEl = document.getElementById('detail');
const detailBody = document.getElementById('detailBody');

const response = await fetch('data/trophies.json');
const doc = await response.json();
const trophies = doc.trophies;

// Demo progress for screenshot views: a fixed, in-memory set of earned
// trophies so the progress bar and checklist read at a glance. Real user
// progress (localStorage) is used whenever no ?shot= view is requested.
const demoEarned = new Set(['Just Like Paradise', 'Paradise Lost', 'Trust', 'Master of None', 'Whip It Good']);
let earned;
try {
  earned = new Set(JSON.parse(localStorage.getItem(STORE_KEY) ?? '[]'));
} catch {
  earned = new Set();
}
if (shot) earned = new Set(demoEarned);

let kindFilter = 'all';
let spoiler = false;
try {
  spoiler = localStorage.getItem(SPOILER_KEY) === '1';
} catch {
  spoiler = false;
}
if (shot === 'filters') spoiler = true;
spoilerEl.checked = spoiler;

function saveProgress() {
  if (shot) return; // screenshot views never overwrite the reader's progress
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify([...earned]));
  } catch {
    // private mode or storage full: the checklist still works in memory
  }
}

function saveSpoiler() {
  try {
    localStorage.setItem(SPOILER_KEY, spoiler ? '1' : '0');
  } catch {
    // ignore
  }
}

function isUnconfirmed(t) {
  return t.guide.startsWith('NOT YET CONFIRMED');
}

function displayName(t) {
  if (spoiler && t.kind === 'story' && !earned.has(t.name)) return 'Hidden story trophy';
  return t.name;
}

function displayDesc(t) {
  if (spoiler && t.kind === 'story' && !earned.has(t.name)) return 'Hidden until earned — spoiler-safe mode is on.';
  return t.description;
}

function displayGuide(t) {
  if (spoiler && t.kind === 'story' && !earned.has(t.name)) return 'Earn this story trophy to reveal its guide.';
  return t.guide;
}

function kindLabel(t) {
  if (t.kind === 'story') return 'Story';
  if (t.kind === 'missable') return 'Missable';
  if (t.kind === 'collectible') return 'Collectible';
  if (t.kind === 'activity') return 'Activity';
  return 'Other';
}

function trophyMatches(t) {
  const q = searchEl.value.trim().toLowerCase();
  if (q) {
    const hay = (t.name + ' ' + t.description + ' ' + t.guide + ' ' + t.source).toLowerCase();
    if (!hay.includes(q)) return false;
  }
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  if (kindFilter === 'unearned' && earned.has(t.name)) return false;
  if (kindFilter !== 'all' && kindFilter !== 'unearned' && t.kind !== kindFilter) return false;
  return true;
}

function renderProgress() {
  const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) {
    if (earned.has(t.name)) counts[t.grade] = (counts[t.grade] || 0) + 1;
  }
  const n = earned.size;
  document.getElementById('earnedCount').textContent = String(n);
  document.getElementById('progressFill').style.width = (n / trophies.length * 100) + '%';
  document.getElementById('progressBar').setAttribute('aria-valuenow', String(n));
  document.getElementById('progressDetail').textContent =
    counts.platinum + ' platinum · ' + counts.gold + ' gold · ' + counts.silver + ' silver · ' + counts.bronze + ' bronze';
  document.getElementById('progressPct').textContent =
    Math.round(n / trophies.length * 100) + '% to the platinum';
}

function renderList() {
  listEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!trophyMatches(t)) continue;
    shown += 1;
    const li = document.createElement('li');
    li.className = 'trophy' + (earned.has(t.name) ? ' earned' : '') + (t.missable ? ' missable-flag' : '');
    li.id = 'trophy-' + t.id;
    const top = document.createElement('div');
    top.className = 'trophy-top';
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.className = 'trophy-check';
    box.checked = earned.has(t.name);
    box.setAttribute('aria-label', 'Mark ' + t.name + ' as earned');
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name); else earned.delete(t.name);
      saveProgress();
      renderProgress();
      renderList();
    });
    const nameWrap = document.createElement('div');
    const name = document.createElement('span');
    name.className = 'trophy-name';
    name.textContent = displayName(t);
    const grade = document.createElement('span');
    grade.className = 'grade grade-' + t.grade;
    grade.textContent = t.grade;
    nameWrap.append(name, grade);
    top.append(box, nameWrap);
    const desc = document.createElement('p');
    desc.className = 'trophy-desc';
    desc.textContent = '“' + displayDesc(t) + '”';
    const guide = document.createElement('p');
    guide.className = 'trophy-guide';
    guide.textContent = displayGuide(t);
    // The source URL is shown as plain text on purpose: the app makes no
    // network request, so no external link is ever loaded or followed.
    const source = document.createElement('p');
    source.className = 'trophy-source';
    source.innerHTML = '';
    const srcLabel = document.createElement('span');
    srcLabel.textContent = 'Source: ';
    const srcName = document.createElement('span');
    srcName.className = 'src-name';
    srcName.textContent = t.source;
    const srcUrl = document.createElement('span');
    srcUrl.textContent = ' — ' + t.source_url;
    source.append(srcLabel, srcName, srcUrl);
    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = kindLabel(t) + ' · Roadmap step ' + t.roadmap;
    tags.append(kindTag);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'tag tag-missable';
      m.textContent = '⚠ POSSIBLY MISSABLE — Chapter 1';
      tags.append(m);
    }
    if (isUnconfirmed(t)) {
      const u = document.createElement('span');
      u.className = 'tag tag-unconfirmed';
      u.textContent = 'Not yet confirmed';
      tags.append(u);
    }
    if (earned.has(t.name)) {
      const e = document.createElement('span');
      e.className = 'tag';
      e.textContent = '✓ Earned';
      tags.append(e);
    }
    li.append(top, desc, guide, source, tags);
    li.addEventListener('click', (event) => {
      if (event.target === box) return;
      openDetail(t.id);
    });
    listEl.append(li);
  }
  shownEl.textContent = '— showing ' + shown + ' of ' + trophies.length;
  emptyEl.hidden = shown !== 0;
}

function openDetail(id) {
  const t = trophies.find((x) => x.id === id);
  if (!t) return;
  detailBody.replaceChildren();
  const grade = document.createElement('span');
  grade.className = 'grade grade-' + t.grade;
  grade.textContent = t.grade;
  const h = document.createElement('h2');
  h.textContent = displayName(t);
  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = '“' + displayDesc(t) + '”';
  const meta = document.createElement('p');
  meta.textContent = kindLabel(t) + ' trophy · Roadmap step ' + t.roadmap +
    (earned.has(t.name) ? ' · ✓ Earned' : ' · Not yet earned');
  detailBody.append(grade, h, desc, meta);
  if (t.missable) {
    const warn = document.createElement('div');
    warn.className = 'warn';
    const wt = document.createElement('p');
    wt.innerHTML = '';
    wt.textContent = '⚠ POSSIBLY MISSABLE — do the Chapter 1 balcony meditation: one morning at Jason’s house, Lucia says she will meditate and walks to the balcony. Follow her and accept the optional quest. Gone after Chapter 1.';
    warn.append(wt);
    detailBody.append(warn);
  }
  const gh = document.createElement('h3');
  gh.textContent = 'How to get it';
  const guide = document.createElement('p');
  guide.textContent = displayGuide(t);
  const sh = document.createElement('h3');
  sh.textContent = 'Source';
  const box = document.createElement('div');
  box.className = 'source-box';
  const s1 = document.createElement('p');
  s1.textContent = 'Guide facts from: ' + t.source + ' — ' + t.source_url;
  const s2 = document.createElement('p');
  s2.textContent = 'The guide above is written in our own words; the source is cited, never copied. The trophy name and description are shown exactly as PlayStation publishes them.';
  box.append(s1, s2);
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'kind-btn';
  toggle.textContent = earned.has(t.name) ? '✓ Earned — click to unmark' : 'Mark as earned';
  toggle.addEventListener('click', () => {
    if (earned.has(t.name)) earned.delete(t.name); else earned.add(t.name);
    saveProgress();
    renderProgress();
    renderList();
    openDetail(id);
  });
  // Source first, then the guide: the citation stays visible even when the
  // guide is long enough to run past the fold.
  detailBody.append(sh, box, gh, guide, toggle);
  detailEl.hidden = false;
  if (shot !== 'detail') detailEl.scrollIntoView({ block: 'start' });
}

function closeDetail() {
  detailEl.hidden = true;
}

document.getElementById('detailClose').addEventListener('click', closeDetail);
searchEl.addEventListener('input', renderList);
gradeEl.addEventListener('change', renderList);
spoilerEl.addEventListener('change', () => {
  spoiler = spoilerEl.checked;
  saveSpoiler();
  renderList();
});

document.getElementById('kindFilters').addEventListener('click', (event) => {
  const btn = event.target.closest('[data-kind]');
  if (!btn) return;
  kindFilter = btn.dataset.kind;
  for (const b of document.querySelectorAll('.kind-btn[data-kind]')) {
    b.classList.toggle('active', b === btn);
  }
  renderList();
});

document.getElementById('exportBtn').addEventListener('click', () => {
  const payload = JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned].sort() }, null, 2);
  const blob = new Blob([payload], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
  document.getElementById('saveNote').textContent = 'Exported ' + earned.size + ' earned trophies to gta6-trophy-progress.json.';
});

document.getElementById('importFile').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('no earned list');
    const known = new Set(trophies.map((t) => t.name));
    earned = new Set(names.filter((n) => known.has(n)));
    saveProgress();
    renderProgress();
    renderList();
    document.getElementById('saveNote').textContent = 'Imported ' + earned.size + ' earned trophies from ' + file.name + '.';
  } catch {
    document.getElementById('saveNote').textContent = 'That file could not be imported — it needs an "earned" list of trophy names.';
  }
  event.target.value = '';
});

document.getElementById('resetBtn').addEventListener('click', () => {
  earned = new Set();
  saveProgress();
  renderProgress();
  renderList();
  document.getElementById('saveNote').textContent = 'Progress reset. Progress saves in this browser (localStorage).';
});

document.getElementById('missableAlert').addEventListener('click', (event) => {
  const link = event.target.closest('[data-open]');
  if (!link) return;
  event.preventDefault();
  openDetail(Number(link.dataset.open));
});

// Screenshot views, chosen with ?shot= (default: the full checklist).
if (shot === 'cover') {
  document.body.classList.add('shot-cover');
} else if (shot === 'roadmap') {
  document.body.classList.add('shot-roadmap');
} else if (shot === 'filters') {
  document.body.classList.add('shot-filters');
} else if (shot === 'detail') {
  document.body.classList.add('shot-detail');
}
renderProgress();
renderList();
if (shot === 'cover' || shot === 'detail') openDetail(28);
