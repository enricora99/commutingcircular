/*
 * Circular Commuting 2.0 beta — interfaccia a domande singole.
 *
 * Ogni schermata è una domanda. Le schermate sono raggruppate in capitoli che seguono gli otto blocchi
 * del Canvas. Lo stato vive nel browser; dopo il consenso, le risposte anonime partono verso il foglio di
 * validazione tramite la web app Apps Script (_backend/Code.js). Il nome dell'organizzazione resta locale.
 */
(function () {
  'use strict';

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwko-WdJPu1TeI5oevLKS0PgMGf6oMQNX6nbP4Vu_gwgJ-8NFQiGi8eakfWbHAekQc/exec';
  const STORE_KEY = 'ccf-beta-2';
  const UI_VERSION = '2.1';
  const I18N = window.CCF_I18N;
  const CONTENT = window.CCF_CONTENT;
  const ICON = window.CCF_ICON;
  const SCALE = window.CCF_SCALE;
  const CODES = ['I1', 'I2', 'I3', 'I4', 'I5'];
  const DIRECT = ['I2', 'I3'];
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  const TOTAL_CH = 9;
  const RESULTS_CH = 8;
  const REGIONS = [
    ['Emilia-Romagna', 'Friuli-Venezia Giulia', 'Liguria', 'Lombardia', 'Piemonte', 'Trentino-Alto Adige', "Valle d'Aosta", 'Veneto'],
    ['Lazio', 'Marche', 'Toscana', 'Umbria'],
    ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Molise', 'Puglia', 'Sardegna', 'Sicilia']
  ];
  const CHAPTER_FACT = { 1: 'reporting', 2: 'remote', 3: 'occupancy', 4: 'bike', 5: 'parking', 6: 'wellbeing', 7: 'package', 9: 'optimal' };
  const MODE_ICON = { car_solo: 'carSolo', car_pool: 'carPool', car_ev: 'carEv', moto: 'moto', shuttle: 'shuttle', bus: 'bus', bus_el: 'busEv', train: 'train', ebike: 'ebike', active: 'bike' };
  const MODE_COLOR = { car_solo: '#1D2130', car_pool: '#383F5D', car_ev: '#586CC9', moto: '#6B7280', shuttle: '#3F51A8', bus: '#7C8FDB', bus_el: '#9DB0E8', train: '#B9C8F2', ebike: '#14B8A6', active: '#5EEAD4' };
  const GCS_ICON = ['person', 'users', 'truck', 'columns', 'network'];
  const INEFF_ICON = { I1: 'i1', I2: 'i2', I3: 'i3', I4: 'i4', I5: 'i5' };
  const CI_REF = CCF.MODES[0].e / CCF.MODES[0].o * CCF.PHI.fossil;   // auto termica con una sola persona
  const RADAR_SHORT = { I1: 'I1', I2: 'I2', I3: 'I3', I4: 'I4', I5: 'I5', CI: 'CI', DATA: 'DMS', GOV: 'GCS' };

  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  // ---------- stato ----------
  const store = {
    load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; } },
    save(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* storage non disponibile: si lavora in memoria */ } },
    clear() { try { localStorage.removeItem(STORE_KEY); } catch (e) { /* idem */ } }
  };

  // Con ?test=1 le analisi sono marcate TEST- e si possono togliere dal foglio (cleanupTests nel backend).
  function newSid() {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = new Uint8Array(8);
    window.crypto.getRandomValues(bytes);
    const prefix = new URLSearchParams(location.search).has('test') ? 'TEST-' : 'CC-';
    return prefix + Array.from(bytes, b => abc[b % abc.length]).join('');
  }

  function fresh() {
    return {
      schema: 2, sid: newSid(), pos: 'intro', maxCh: 0, consent: false, hp: '',
      profile: { orgName: '', siteName: '', orgType: '', sector: '', employees: '', region: '', shiftPct: '', pscl: '', dms: '' },
      mns: { qe: '', qp: '', qr: '' },
      baseline: { oneWay: '', days: '', daysWeek: '', modes: {} },
      acc: Array(7).fill(''), cdr: Array(5).fill(''),
      direct: { I2: '', I3: '' }, directNotes: { I2: '', I3: '' }, overrides: {}, skipped: {},
      interventions: {}, monitoring: {},
      feedback: {}, contact: { ok: false, email: '' },
      timings: {}, reached: {}, rev: 0, sentHash: '', code: '', outbox: []
    };
  }

  // Le analisi iniziate con la prima versione dell'interfaccia (schema 1) conservano i dati.
  function migrate(old) {
    const s = Object.assign(fresh(), old);
    const byStep = ['intro', 'ch1', 'ch2', 'ch3', 'ch4', 'ch5', 'ch6', 'ch7', 'results', 'ch9'];
    s.schema = 2;
    s.pos = old.code ? 'thanks' : (byStep[old.step] || 'intro');
    s.maxCh = old.maxStep || 0;
    const days = CCF.num(old.baseline && old.baseline.days);
    s.baseline = Object.assign({ oneWay: '', days: '', daysWeek: '', modes: {} }, old.baseline, { daysWeek: days ? String(Math.round(days / 44 * 2) / 2) : '' });
    s.skipped = {};
    return s;
  }

  let S = store.load();
  if (!S || (S.schema !== 1 && S.schema !== 2)) S = fresh();
  else if (S.schema === 1) S = migrate(S);
  if (!Array.isArray(S.outbox)) S.outbox = [];
  if (!S.skipped) S.skipped = {};
  let lang = pickLang();
  let R = evaluate();
  let enteredAt = Date.now();
  let saveTimer = null;
  let autoTimer = null;

  function pickLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'it') return q;
    if (S.lang === 'en' || S.lang === 'it') return S.lang;
    try { return localStorage.getItem('ccf-lang') === 'en' ? 'en' : 'it'; } catch (e) { return 'it'; }
  }

  function persist() {
    S.lang = lang;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.save(S), 150);
  }

  // Distanze proposte per bici, piedi e micromobilità quando la media della sede è più alta.
  function defaultOneWay(id) {
    const avg = CCF.num(S.baseline.oneWay);
    if (avg === null) return null;
    if (id === 'active') return Math.min(avg, 3);
    if (id === 'ebike') return Math.min(avg, 7);
    return avg;
  }

  function engineState() {
    const modes = {};
    CCF.MODES.forEach(m => {
      const src = Object.assign({}, S.baseline.modes[m.id] || {});
      if (CCF.num(src.oneWay) === null && (m.id === 'active' || m.id === 'ebike')) src.oneWay = defaultOneWay(m.id);
      modes[m.id] = src;
    });
    const dw = CCF.num(S.baseline.daysWeek);
    const cdr = S.cdr.slice();
    if (String(S.profile.shiftPct) === '0' && cdr[3] === '') cdr[3] = 'nd';   // senza turni la voce non si applica
    const interventions = {};
    Object.keys(S.interventions).forEach(id => {
      const u = S.interventions[id];
      const pct = CCF.num(u.leverPct);
      interventions[id] = Object.assign({}, u, { lever: pct === null ? null : pct / 100 });
    });
    return {
      profile: S.profile, mns: S.mns,
      baseline: { oneWay: S.baseline.oneWay, days: dw !== null ? dw * 44 : S.baseline.days, modes },
      acc: S.acc, cdr, direct: S.direct, overrides: S.overrides, interventions
    };
  }

  function evaluate() { return CCF.evaluate(engineState()); }

  // ---------- utilità ----------
  function t(path, vars) {
    const pick = dict => path.split('.').reduce((o, k) => (o === undefined || o === null ? undefined : o[k]), dict);
    let v = pick(I18N[lang]);
    if (v === undefined) v = pick(I18N.it);
    if (typeof v === 'string' && vars) v = v.replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
    return v;
  }
  const esc = s => String(s === null || s === undefined ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  function fmt(n, d) {
    if (n === null || n === undefined || !isFinite(n)) return '—';
    return Number(n).toLocaleString(lang === 'it' ? 'it-IT' : 'en-GB', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  }
  const round = (v, d) => (v === null || v === undefined || !isFinite(v) ? null : Math.round(v * Math.pow(10, d)) / Math.pow(10, d));
  const getPath = path => path.split('.').reduce((o, k) => (o === undefined || o === null ? undefined : o[k]), S);
  function setPath(path, value) {
    const keys = path.split('.');
    let o = S;
    keys.slice(0, -1).forEach(k => { if (o[k] === undefined || o[k] === null || typeof o[k] !== 'object') o[k] = {}; o = o[k]; });
    o[keys[keys.length - 1]] = value;
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const entries = obj => Object.keys(obj).map(k => [k, obj[k]]);
  const has = v => v !== '' && v !== undefined && v !== null;

  // ---------- definizione delle schermate ----------
  function screens() {
    const list = [];
    const add = s => list.push(s);
    const o = t('options');
    const q = t('q');

    add({ id: 'intro', ch: 0, kind: 'intro', help: 'intro', answered: () => S.consent });

    // Capitolo 1 · la sede
    add({ id: 'ch1', ch: 1, kind: 'chapter' });
    add({ id: 'orgType', ch: 1, kind: 'choice', path: 'profile.orgType', layout: 'grid-5', auto: true, help: 'sample', title: q.orgType.title,
      options: entries(o.orgType).map(([v, [ic, l]]) => ({ value: v, icon: ic, label: l })) });
    add({ id: 'sector', ch: 1, kind: 'choice', path: 'profile.sector', layout: 'grid-4', auto: true, help: 'sample', title: q.sector.title,
      options: entries(o.sector).map(([v, [ic, l]]) => ({ value: v, icon: ic, label: l })) });
    add({ id: 'employees', ch: 1, kind: 'number', path: 'profile.employees', help: 'employees', title: q.employees.title, sub: q.employees.sub,
      unit: t('ui.people'), chips: [50, 100, 250, 500, 1000], min: 1, max: 100000, answered: () => CCF.num(S.profile.employees) >= 1 });
    add({ id: 'region', ch: 1, kind: 'region', path: 'profile.region', auto: true, help: 'sample', title: q.region.title });
    add({ id: 'shifts', ch: 1, kind: 'percent', path: 'profile.shiftPct', help: 'shifts', title: q.shifts.title, sub: q.shifts.sub, chips: [0, 10, 25, 50, 75, 100] });
    add({ id: 'pscl', ch: 1, kind: 'choice', path: 'profile.pscl', layout: 'grid-3', auto: true, help: 'pscl', title: q.pscl.title, sub: q.pscl.sub,
      options: entries(o.pscl).map(([v, [ic, l]]) => ({ value: v, icon: ic, label: l })) });
    add({ id: 'dms', ch: 1, kind: 'choice', path: 'profile.dms', layout: 'grid-3', auto: true, help: 'dms', title: q.dms.title, sub: q.dms.sub,
      options: o.dms.map(([ic, l, sub], i) => ({ value: String(i), icon: ic, label: l, sub, key: i })) });

    // Capitolo 2 · presenza
    add({ id: 'ch2', ch: 2, kind: 'chapter' });
    add({ id: 'mns', ch: 2, kind: 'mns', help: 'mns', title: q.mns.title, sub: q.mns.sub, answered: () => R.mns.valid });
    add({ id: 'daysWeek', ch: 2, kind: 'choice', path: 'baseline.daysWeek', layout: 'grid-5 days', auto: true, help: 'daysWeek', title: q.daysWeek.title, sub: q.daysWeek.sub,
      options: [1, 2, 3, 4, 5].map(d => ({ value: String(d), big: String(d), label: d === 1 ? q.daysWeek.unit[0] : q.daysWeek.unit[1] })) });

    // Capitolo 3 · spostamenti
    add({ id: 'ch3', ch: 3, kind: 'chapter' });
    add({ id: 'distance', ch: 3, kind: 'distance', path: 'baseline.oneWay', help: 'distance', title: q.distance.title, sub: q.distance.sub,
      chips: [5, 10, 15, 20, 30, 50], answered: () => CCF.num(S.baseline.oneWay) > 0 });
    add({ id: 'modes', ch: 3, kind: 'modes', help: 'modes', title: q.modes.title, answered: () => R.baseline.N > 0 });
    if (R.baseline.rows.filter(r => r.n > 0).length >= 2) {
      add({ id: 'modeDistances', ch: 3, kind: 'modeDistances', help: 'modeDistances', title: q.modeDistances.title, sub: q.modeDistances.sub, answered: () => true });
    }

    // Capitolo 4 · alternative all'auto
    add({ id: 'ch4', ch: 4, kind: 'chapter' });
    q.acc.forEach((item, k) => add({ id: 'acc' + k, ch: 4, kind: 'scale', arr: 'acc', k, auto: true, help: 'acc', helpVars: { k: k + 1 }, icon: item.icon, title: item.title, items: item.options }));

    // Capitolo 5 · il ruolo dell'auto
    add({ id: 'ch5', ch: 5, kind: 'chapter' });
    q.cdr.forEach((item, k) => {
      if (k === 3 && String(S.profile.shiftPct) === '0') return;
      add({ id: 'cdr' + k, ch: 5, kind: 'scale', arr: 'cdr', k, auto: true, help: 'cdr', helpVars: { k: k + 1 }, icon: item.icon, title: item.title, items: item.options });
    });

    // Capitolo 6 · dove si spreca
    add({ id: 'ch6', ch: 6, kind: 'chapter' });
    CODES.forEach(code => add({ id: code, ch: 6, kind: 'ineff', code, help: code, title: q.ineff[code].title, answered: () => ineffAnswered(code) }));

    // Capitolo 7 · cosa fare
    add({ id: 'ch7', ch: 7, kind: 'chapter' });
    add({ id: 'ivSelect', ch: 7, kind: 'ivSelect', help: 'ivSelect', answered: () => true });
    const chosen = orderedCandidates().filter(x => x.selected);
    chosen.forEach((x, i) => add({ id: 'iv:' + x.id, ch: 7, kind: 'iv', ivId: x.id, k: i + 1, n: chosen.length, help: 'iv', answered: () => { const y = ivResult(x.id); return !!(y && y.ipi !== null); } }));

    // Capitolo 8 · risultati
    add({ id: 'results', ch: 8, kind: 'results', help: 'results', answered: () => true });

    // Capitolo 9 · valutazione
    add({ id: 'ch9', ch: 9, kind: 'chapter' });
    ['f1', 'f2', 'f3', 'f4', 'f5', 'f6'].forEach(f => add({ id: f, ch: 9, kind: 'truth', path: 'feedback.' + f, auto: true, help: 'truth', title: q.truth.items[f] }));
    add({ id: 'c1', ch: 9, kind: 'yesno', path: 'feedback.c1', textPath: 'feedback.c1text', help: 'c1', title: q.c1.title, textLabel: q.c1.text });
    add({ id: 'c2', ch: 9, kind: 'yesno', path: 'feedback.c2', textPath: 'feedback.c2text', help: 'c2', title: q.c2.title, textLabel: q.c2.text });
    add({ id: 'role', ch: 9, kind: 'choice', path: 'feedback.role', layout: 'grid-4', auto: true, help: 'profile', title: q.role.title,
      options: entries(q.role.options).map(([v, l]) => ({ value: v, icon: o.roleIcons[v], label: l })) });
    add({ id: 'experience', ch: 9, kind: 'choice', path: 'feedback.experience', layout: 'grid-4', auto: true, help: 'profile', title: q.experience.title,
      options: entries(q.experience.options).map(([v, l], i) => ({ value: v, scale: i + 1, label: l })) });
    add({ id: 'final', ch: 9, kind: 'final', help: 'final', answered: () => true });
    add({ id: 'thanks', ch: 10, kind: 'thanks', help: 'thanks', answered: () => true });
    return list;
  }

  function answered(sc) {
    if (sc.answered) return !!sc.answered();
    if (sc.kind === 'chapter') return true;
    if (sc.kind === 'scale') return has(S[sc.arr][sc.k]);
    if (sc.path) return has(getPath(sc.path));
    return true;
  }

  function ineffAnswered(code) {
    if (S.skipped[code]) return true;
    if (DIRECT.includes(code)) return has(S.direct[code]);
    return R.diagnosis[code].value !== null;
  }

  function orderedCandidates() {
    const iv = R.interventions;
    const order = iv.observed.slice().sort((a, b) => R.diagnosis[b].value - R.diagnosis[a].value);
    const out = [];
    order.forEach(code => iv.list.filter(x => x.ineff === code).sort((a, b) => (a.role === b.role ? 0 : a.role === 'primary' ? -1 : 1)).forEach(x => out.push(x)));
    return out;
  }
  const ivResult = id => R.interventions.list.find(x => x.id === id);

  function chapterCount(list, ch) { return list.filter(s => s.ch === ch && s.kind !== 'chapter').length; }

  // ---------- componenti ----------
  function head(sc, extra) {
    return `<header class="q-head">
      ${sc.icon ? `<span class="q-ico">${ICON(sc.icon)}</span>` : ''}
      ${sc.eyebrow ? `<span class="eyebrow">${esc(sc.eyebrow)}</span>` : ''}
      <h1 class="q-title" tabindex="-1">${esc(sc.title)}</h1>
      ${sc.sub ? `<p class="q-sub">${esc(sc.sub)}</p>` : ''}${extra || ''}</header>`;
  }

  function optButton(path, o, i, current, extraAttr) {
    const on = String(current) === String(o.value);
    const inner = `${o.icon ? ICON(o.icon, 'opt-ico') : ''}${o.big ? `<span class="opt-big">${esc(o.big)}</span>` : ''}${o.scale ? SCALE(o.scale) : ''}
      <span class="opt-label">${esc(o.label)}</span>${o.sub ? `<span class="opt-sub">${esc(o.sub)}</span>` : ''}${o.tag ? `<span class="opt-tag">${esc(o.tag)}</span>` : ''}`;
    return `<button type="button" class="opt" data-choose="${esc(path)}" data-value="${esc(o.value)}" aria-pressed="${on}" ${extraAttr || ''}>
      ${inner}<span class="opt-key">${o.key !== undefined ? o.key : i + 1}</span><span class="opt-check">${ICON('check')}</span></button>`;
  }

  function seaLayer(cls) {
    return `<div class="sea ${cls || ''}" aria-hidden="true"><div class="blob b1"></div><div class="blob b2"></div><div class="blob b3"></div>
      <svg class="waves w1" viewBox="0 0 2880 240" preserveAspectRatio="none"><path d="M0 120C240 60 480 180 720 120S1200 60 1440 120 1920 180 2160 120 2640 60 2880 120V240H0Z"/></svg>
      <svg class="waves w2" viewBox="0 0 2880 240" preserveAspectRatio="none"><path d="M0 140C180 100 540 190 720 140S1260 90 1440 140 1980 190 2160 140 2700 90 2880 140V240H0Z"/></svg><div class="grain"></div></div>`;
  }

  function factCard(key) {
    const f = CONTENT.facts[key];
    if (!f) return '';
    const x = f[lang];
    return `<article class="fact"><span class="eyebrow">${ICON('bulb')}${esc(t('ui.factLabel'))}</span>
      ${f.icon ? `<div class="fact-big fact-icon">${ICON(f.icon)}</div>` : `<div class="fact-big">${esc(f.big)}</div>`}<p class="fact-text">${esc(x.text)}</p><p class="fact-src">${esc(x.src)}</p></article>`;
  }

  function authorsGrid() {
    return `<div class="authors">${CONTENT.authors.map(a => `<div class="author">
      <span class="avatar" aria-hidden="true">${esc(a.initials)}</span>
      <div><div class="author-name">${esc(a.name)}</div><div class="author-role">${esc(a.role[lang])}</div><p>${esc(a.bio[lang])}</p></div></div>`).join('')}</div>`;
  }

  // ---------- viste ----------
  const VIEWS = {
    intro() {
      const x = t('intro');
      const resume = S.consent && S.maxCh > 0
        ? `<div class="resume card"><div><strong>${esc(t('ui.resumeTitle'))}</strong><p>${esc(t('ui.resumeText', { chapter: t('chapters')[Math.min(S.maxCh, 9)] }))}</p></div>
            <div class="resume-actions"><button type="button" class="btn btn-primary" data-act="resume">${esc(t('ui.resumeBtn'))}</button><button type="button" class="btn btn-ghost" data-act="restart">${esc(t('ui.restart'))}</button></div></div>` : '';
      return `<div class="hero-band">${seaLayer('sea-soft')}
          <div class="hero-band-inner">
            <span class="eyebrow">${esc(x.eyebrow)}</span>
            <h1 class="q-title" tabindex="-1">${esc(x.title)}</h1>
            <p class="lede">${esc(x.lede)}</p>
            <div class="meta-row">${x.meta.map(([v, l]) => `<div><div class="meta-v">${esc(v)}</div><div class="meta-l">${esc(l)}</div></div>`).join('')}</div>
          </div></div>
        ${resume}
        <div class="intro-cards">${x.cards.map(c => `<div class="card intro-card">${ICON(c.icon)}<h3>${esc(c.t)}</h3><p>${esc(c.d)}</p></div>`).join('')}</div>
        <section class="card research">
          <span class="eyebrow">${esc(x.researchTitle)}</span>
          ${x.research.map((p, i) => `<p${i === 0 ? ' class="research-lead"' : ''}>${esc(p.replace('{title}', CONTENT.paperTitle))}</p>`).join('')}
          <h3 class="authors-title">${esc(x.authorsTitle)}</h3>${authorsGrid()}
        </section>
        <div class="card consent">
          <label class="check"><input type="checkbox" data-bind="consent"${S.consent ? ' checked' : ''}><span>${esc(x.consent)}</span></label>
          <div class="consent-links"><button type="button" class="linklike" data-act="privacy">${esc(x.consentLink)}</button>
          <a class="linklike" href="../semplificato/">${esc(x.liteLink)}</a></div>
          <p class="consent-need" id="consent-need"${S.consent ? ' hidden' : ''}>${esc(x.consentNeed)}</p>
          <input type="text" class="hp" name="website" data-bind="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
        </div>`;
    },

    chapter(sc, list) {
      const ci = t('chapterIntro')[sc.ch];
      const n = chapterCount(list, sc.ch);
      const warn = sc.ch === 7 && R.interventions.dataFirst ? `<div class="note warn">${ICON('database')}<span>${esc(t('q.ivSelect.dataFirst'))}</span></div>` : '';
      return `<div class="chapter-hero">${seaLayer('sea-soft')}
          <div class="chapter-inner">
            <div class="chapter-num num">${String(sc.ch).padStart(2, '0')}</div>
            <div><span class="eyebrow">${esc(t('ui.chapterOf', { n: sc.ch, t: TOTAL_CH }))}</span>
            <h1 class="q-title" tabindex="-1">${esc(ci.title)}</h1>
            <p class="lede">${esc(ci.desc)}</p>
            <p class="chapter-meta">${esc(t('ui.chapterMeta', { n, m: Math.max(1, Math.round(n / 3)) }))}</p></div>
          </div></div>
        ${factCard(CHAPTER_FACT[sc.ch])}${warn}`;
    },

    choice(sc) {
      const cur = getPath(sc.path);
      return head(sc) + `<div class="opts ${sc.layout || ''}" role="group">${sc.options.map((o, i) => optButton(sc.path, o, i, cur)).join('')}</div>`;
    },

    number(sc) {
      const v = getPath(sc.path);
      return head(sc) + `<div class="bignum">
          <button type="button" class="step" data-step="${sc.path}" data-d="-1" aria-label="−">−</button>
          <input class="bignum-input num" type="number" inputmode="numeric" min="${sc.min}" max="${sc.max}" data-bind="${sc.path}" value="${esc(has(v) ? v : '')}" placeholder="0" aria-label="${esc(sc.title)}">
          <button type="button" class="step" data-step="${sc.path}" data-d="1" aria-label="+">+</button>
          <span class="bignum-unit">${esc(sc.unit)}</span></div>
        <div class="chips">${sc.chips.map(c => `<button type="button" class="chip" data-set="${sc.path}" data-value="${c}">${fmt(c)}</button>`).join('')}</div>`;
    },

    region(sc) {
      const cur = S.profile.region;
      const g = t('q.region.groups');
      let i = 0;
      const group = (names, label) => `<div class="region-group"><div class="region-label">${esc(label)}</div><div class="region-chips">${names.map(n => {
        i += 1;
        return `<button type="button" class="chip${cur === n ? ' on' : ''}" data-choose="profile.region" data-value="${esc(n)}" aria-pressed="${cur === n}">${esc(n)}</button>`;
      }).join('')}</div></div>`;
      return head(sc) + `<div class="regions">${REGIONS.map((names, k) => group(names, g[k])).join('')}
        <div class="region-group"><div class="region-chips"><button type="button" class="chip${cur === 'abroad' ? ' on' : ''}" data-choose="profile.region" data-value="abroad" aria-pressed="${cur === 'abroad'}">${esc(t('q.region.abroad'))}</button></div></div></div>`;
    },

    percent(sc) {
      const v = getPath(sc.path);
      const val = has(v) ? Number(v) : null;
      return head(sc) + `<div class="dial">
          <div class="dial-value num" id="pct-value">${val === null ? '—' : fmt(val)}<span>%</span></div>
          <input type="range" class="range${val === null ? ' unset' : ''}" min="0" max="100" step="5" value="${val === null ? 0 : val}" data-bind="${sc.path}" aria-label="${esc(sc.title)}">
          <div class="range-ends"><span>0%</span><span>50%</span><span>100%</span></div></div>
        <div class="chips">${sc.chips.map(c => `<button type="button" class="chip" data-set="${sc.path}" data-value="${c}">${c}%</button>`).join('')}</div>`;
    },

    mns(sc) {
      const x = t('q.mns');
      const set = R.mns.valid;
      const qe = set ? Number(S.mns.qe) : 50, qp = set ? Number(S.mns.qp) : 30;
      return head(sc) + `<div class="split3${set ? '' : ' preview'}" id="split3">
          <div class="seg seg-a" style="width:${qe}%"><span class="seg-v num">${qe}%</span></div>
          <div class="seg seg-b" style="width:${qp}%"><span class="seg-v num">${qp}%</span></div>
          <div class="seg seg-c" style="width:${100 - qe - qp}%"><span class="seg-v num">${100 - qe - qp}%</span></div>
          <button type="button" class="handle" data-h="0" role="slider" aria-label="${esc(x.aria[0])}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${qe}" style="left:${qe}%"></button>
          <button type="button" class="handle" data-h="1" role="slider" aria-label="${esc(x.aria[1])}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${qe + qp}" style="left:${qe + qp}%"></button>
        </div>
        <div class="split-legend">${x.seg.map((l, i) => `<div class="leg leg-${'abc'[i]}"><i></i><span>${esc(l)}</span><strong class="num" id="leg-${i}">${[qe, qp, 100 - qe - qp][i]}%</strong></div>`).join('')}</div>
        ${set ? '' : `<button type="button" class="btn btn-ghost confirm-default" data-act="mnsConfirm">${esc(lang === 'it' ? 'Va bene così' : 'Looks right')}</button>`}`;
    },

    distance(sc) {
      const v = CCF.num(S.baseline.oneWay);
      return head(sc) + `<div class="dial">
          <div class="dial-value num" id="dist-value">${v === null ? '—' : fmt(v, v % 1 ? 1 : 0)}<span> km</span></div>
          <input type="range" class="range${v === null ? ' unset' : ''}" min="1" max="100" step="0.5" value="${v === null ? 1 : v}" data-bind="baseline.oneWay" aria-label="${esc(sc.title)}">
          <div class="range-ends"><span>1 km</span><span>50 km</span><span>100 km</span></div></div>
        <div class="chips">${sc.chips.map(c => `<button type="button" class="chip" data-set="baseline.oneWay" data-value="${c}">${c} km</button>`).join('')}</div>`;
    },

    modes(sc) {
      const x = t('q.modes');
      const tot = CCF.num(S.profile.employees);
      const tiles = CCF.MODES.map(m => {
        const n = (S.baseline.modes[m.id] || {}).n;
        return `<div class="mode-tile${CCF.num(n) > 0 ? ' on' : ''}" data-tile="${m.id}">
          <span class="mode-ico">${ICON(MODE_ICON[m.id])}</span><span class="mode-label">${esc(t('options.modes')[m.id])}</span>
          <div class="stepper"><button type="button" data-mstep="${m.id}" data-d="-1" aria-label="−">−</button>
            <input type="number" inputmode="numeric" min="0" class="num" data-bind="baseline.modes.${m.id}.n" value="${esc(has(n) ? n : '')}" placeholder="0" aria-label="${esc(t('options.modes')[m.id])}">
            <button type="button" data-mstep="${m.id}" data-d="1" aria-label="+">+</button></div>
          <button type="button" class="fill-rest" data-fill="${m.id}">${esc(x.fill)}</button></div>`;
      }).join('');
      const pc = x.paramCols;
      const params = CCF.MODES.map(m => `<tr><th scope="row">${esc(t('options.modes')[m.id])}</th>
        ${['e', 'o', 'k', 'phi'].map(p => `<td><input type="number" class="num" min="0" step="any" data-bind="baseline.modes.${m.id}.${p}" value="${esc(has((S.baseline.modes[m.id] || {})[p]) ? S.baseline.modes[m.id][p] : '')}" placeholder="${p === 'phi' ? CCF.PHI[m.carrier] : m[p]}" aria-label="${esc(pc[p])}"></td>`).join('')}
        <td class="num" id="lf-${m.id}"></td></tr>`).join('');
      return head(Object.assign({}, sc, { sub: x.sub.replace('{tot}', tot ? fmt(tot) : '—') })) + `
        <div class="modes-summary card">
          <div class="stack" id="modes-stack"></div>
          <div class="modes-meta"><span id="modes-assigned"></span><span class="teaser" id="modes-teaser"></span></div>
        </div>
        <div class="modes-grid">${tiles}</div>
        <details class="params"><summary>${esc(x.advanced)}</summary><p class="muted">${esc(x.advancedNote)}</p>
          <div class="table-wrap"><table class="params-table"><thead><tr><th>${esc(pc.mode)}</th><th>${esc(pc.e)}</th><th>${esc(pc.o)}</th><th>${esc(pc.k)}</th><th>${esc(pc.phi)}</th><th>${esc(pc.lf)}</th></tr></thead><tbody>${params}</tbody></table></div></details>`;
    },

    modeDistances(sc) {
      const rows = R.baseline.rows.filter(r => r.n > 0).map(r => {
        const own = CCF.num((S.baseline.modes[r.id] || {}).oneWay);
        const v = own !== null ? own : defaultOneWay(r.id);
        return `<div class="dist-row"><span class="mode-ico">${ICON(MODE_ICON[r.id])}</span><span class="dist-label">${esc(t('options.modes')[r.id])}</span>
          <input type="range" class="range" min="0.5" max="100" step="0.5" value="${v}" data-bind="baseline.modes.${r.id}.oneWay" aria-label="${esc(t('options.modes')[r.id])}">
          <span class="dist-v num" id="dv-${r.id}">${fmt(v, v % 1 ? 1 : 0)} km</span></div>`;
      }).join('');
      return head(sc) + `<div class="card dist-card">${rows}</div>`;
    },

    scale(sc) {
      const cur = S[sc.arr][sc.k];
      const total = sc.arr === 'acc' ? 7 : 5;
      const options = sc.items.map((label, j) => ({ value: String(5 - j), label, scale: 5 - j }));
      const eyebrow = `${t('chapters')[sc.arr === 'acc' ? 4 : 5]} · ${sc.k + 1}/${total}`;
      return head(Object.assign({}, sc, { eyebrow })) + `<div class="opts row-5" role="group">${options.map((o, i) => optButton(`${sc.arr}.${sc.k}`, o, i, cur)).join('')}</div>
        <div class="dontknow-row"><button type="button" class="chip${cur === 'nd' ? ' on' : ''}" data-choose="${sc.arr}.${sc.k}" data-value="nd" data-dontknow aria-pressed="${cur === 'nd'}">${esc(t('ui.dontKnow'))} <kbd>0</kbd></button></div>`;
    },

    ineff(sc) {
      const x = t('q.ineff');
      const code = sc.code;
      const d = R.diagnosis[code];
      const direct = DIRECT.includes(code);
      const bands = t('options.bands');
      const derivedBand = !direct && d.derived !== null ? CCF.band(d.derived) : null;
      const cur = direct ? S.direct[code] : (S.overrides[code] ? String(CCF.band(Number(S.overrides[code].value))) : (derivedBand ? String(derivedBand) : ''));
      const options = x[code].options.map((label, i) => ({ value: String(i + 1), label, scale: i + 1, tag: derivedBand === i + 1 ? t('ui.estimateTag') : '' }));
      let note = '';
      if (direct && code === 'I2') {
        const sh = R.baseline.rows.find(r => r.id === 'shuttle');
        note = sh && sh.n > 0 ? x.hintI2.replace('{n}', fmt(sh.n)) : x.hintI2none;
      } else if (direct && code === 'I3') {
        const a = S.acc[3];
        const label = a === 'nd' || !has(a) ? t('ui.dontKnow') : t('q.acc')[3].options[5 - Number(a)];
        note = x.hintI3.replace('{a}', label).replace('{c}', has(S.profile.shiftPct) ? S.profile.shiftPct : '—');
      } else {
        note = derivedBand ? x.estimate.replace('{band}', bands[derivedBand - 1]) : x.estimateNone;
      }
      const overridden = !direct && S.overrides[code] && derivedBand !== null;
      const reason = overridden ? `<label class="reason"><span>${esc(x.reason)}</span><textarea rows="2" data-bind="overrides.${code}.note">${esc(S.overrides[code].note || '')}</textarea></label>` : '';
      const dk = direct || derivedBand === null
        ? `<div class="dontknow-row"><button type="button" class="chip${S.skipped[code] ? ' on' : ''}" data-act="ineffSkip" data-code="${code}" data-dontknow>${esc(x.dontKnow)} <kbd>0</kbd></button></div>` : '';
      return head(Object.assign({}, sc, { eyebrow: `${code} · ${x[code].name}`, icon: INEFF_ICON[code] }), `<p class="q-note">${ICON(direct ? 'search' : 'radar')}<span>${esc(note)}</span></p>`)
        + `<div class="opts col-5" role="group">${options.map((o, i) => optButton('ineff.' + code, o, i, cur)).join('')}</div>${reason}${dk}`;
    },

    ivSelect() {
      const x = t('q.ivSelect');
      const cands = orderedCandidates();
      if (!cands.length) return head({ title: x.none });
      const title = cands.length === 1 ? x.titleOne : x.title.replace('{n}', cands.length);
      const warn = R.interventions.dataFirst ? `<div class="note warn">${ICON('database')}<span>${esc(x.dataFirst)}</span></div>` : '';
      return head({ title, sub: x.sub }) + warn + `<div class="iv-list">${cands.map(c => `<button type="button" class="iv-pick" data-toggle-iv="${c.id}" aria-pressed="${c.selected}">
          <span class="iv-pick-check">${ICON('check')}</span>
          <span class="iv-pick-body"><span class="iv-pick-name">${esc(t('interventions')[c.id])}</span>
          <span class="iv-pick-meta"><span class="pill ${c.role}">${esc(x[c.role])}</span>${esc(x.treats.replace('{name}', t('q.ineff')[c.ineff].name))}</span></span>
          ${ICON(INEFF_ICON[c.ineff], 'iv-pick-ico')}</button>`).join('')}</div>`;
    },

    iv(sc) {
      const x = t('q.iv');
      const r = ivResult(sc.ivId);
      if (!r) return '';
      const u = S.interventions[sc.ivId] || {};
      const lever = r.scenario ? `<label class="lever"><span id="iv-lever-label"></span>
          <input type="range" class="range" min="0" max="100" step="1" value="${CCF.num(u.leverPct) !== null ? u.leverPct : Math.round(r.scenario.lever * 100)}" data-bind="interventions.${sc.ivId}.leverPct"></label>` : '';
      const row = (dim, label, opts, glyph) => `<div class="qrow"><div class="qrow-label">${esc(label)}</div>
          <div class="chips5" role="group">${opts.map((l, i) => `<button type="button" class="c5" data-ivset="${sc.ivId}" data-dim="${dim}" data-value="${i + 1}" aria-pressed="false">
            ${glyph === 'gcs' ? ICON(GCS_ICON[i]) : SCALE(i + 1)}<span>${esc(l)}</span></button>`).join('')}</div>
          <div class="qrow-note" id="note-${dim}"></div></div>`;
      return head({ eyebrow: x.eyebrow.replace('{k}', sc.k).replace('{n}', sc.n).replace('{name}', t('q.ineff')[r.ineff].name), title: t('interventions')[sc.ivId] })
        + `<div class="iv-grid">
          <div class="card iv-estimate"><span class="eyebrow">${ICON('leaf')}${esc(x.reduction)}</span>
            <div class="iv-dg num" id="iv-dg">—</div><div class="iv-unit" id="iv-unit">${esc(x.unit)}</div><div class="iv-pct" id="iv-pct"></div>${lever}
          </div>
          <div class="iv-questions">
            ${row('cost', x.qCost, x.cost)}${row('acc', x.qAcc, x.acc)}${row('data', x.qData, x.data)}
            <details class="more" id="more-gcs"><summary><span>${esc(x.qGcs)}</span><strong id="sum-gcs"></strong></summary>${row('gcs', x.qGcs, x.gcs, 'gcs')}</details>
            <details class="more" id="more-impact"${r.impactProposed === null ? ' open' : ''}><summary><span>${esc(x.qImpact)}</span><strong id="sum-impact"></strong></summary>${row('impact', x.qImpact, x.impact)}</details>
          </div></div>
        <div class="iv-result" id="iv-result"></div>`;
    },

    results() {
      const x = t('q.results');
      const D = R.diagnosis;
      const prev = R.prevailing[0];
      const kp = x.kpi;
      const B = R.baseline;
      const warns = [R.dms.dataFirst ? x.dataFirst : '', R.dms.lowReliability.length ? x.lowRel : ''].filter(Boolean)
        .map(w => `<div class="note warn">${ICON('database')}<span>${esc(w)}</span></div>`).join('');
      const kpi = (ico, [label, unit], val) => `<div class="kpi card">${ICON(ico)}<div class="kpi-v num">${val}</div><div class="kpi-l">${esc(label)}</div><div class="kpi-u">${esc(unit)}</div></div>`;
      const ineffRows = CODES.map(c => D[c]).sort((a, b) => (b.value === null ? -1 : b.value) - (a.value === null ? -1 : a.value)).map(d => `
        <div class="ineff-row">${ICON(INEFF_ICON[d.code])}<div class="ineff-name"><strong>${esc(t('q.ineff')[d.code].name)}</strong><span>${d.code}${d.overridden ? ' · ' + (lang === 'it' ? 'corretta da te' : 'corrected by you') : ''}</span></div>
          <div class="bar"><i class="sevbg${d.value === null ? '' : ' b' + d.band}" style="width:${d.value === null ? 0 : d.value}%"></i></div>
          <span class="sev ${d.value === null ? 'na' : 'b' + d.band}">${d.value === null ? 'n.d.' : d.value + ' · ' + esc(t('options.bands')[d.band - 1])}</span></div>`).join('');
      const IV = R.interventions;
      let plan = '';
      if (IV.dataFirst) plan += `<div class="plan-row d0"><span class="rank">#0</span><div class="plan-body"><strong>${esc(x.d0)}</strong><span>${esc(x.d0note)}</span></div><span class="prio A">DMS</span></div>`;
      if (!IV.ranked.length) plan += `<p class="muted">${esc(IV.observed.length ? x.planEmpty : x.noCandidates)}</p>`;
      plan += IV.ranked.map((r, i) => `<div class="plan-row"><span class="rank num">#${i + 1}</span><div class="plan-body"><strong>${esc(t('interventions')[r.id])}</strong>
          <span>${esc(t('q.ineff')[r.ineff].name)}${r.estimate.estimable && r.estimate.dG > 0 ? ' · −' + fmt(r.estimate.dG / 1e6, 1) + ' t CO₂e' : ''}${r.governancePlan ? ' · ' + esc(t('q.iv.govPlan')) : ''}</span></div>
          <span class="ipi num">${fmt(r.ipi, 1)}</span><span class="prio ${r.cls}">${r.cls}</span></div>`).join('');
      IV.ranked.forEach(r => { if (!S.monitoring[r.id]) S.monitoring[r.id] = { freq: 'semiannual', owner: 'mm' }; });
      const monitor = IV.ranked.length ? `<section class="res-sec"><h2>${esc(x.monitorTitle)}</h2><div class="table-wrap"><table class="mon-table"><thead><tr><th>${esc(x.monitorCols.intv)}</th><th>${esc(x.monitorCols.ind)}</th><th>${esc(x.monitorCols.freq)}</th><th>${esc(x.monitorCols.owner)}</th></tr></thead><tbody>
          ${IV.ranked.map(r => { const m = S.monitoring[r.id]; return `<tr><td>${esc(t('interventions')[r.id])}</td><td>${esc(x.indicators[CCF.MONITORING[r.ineff]])}</td>
            <td>${selectHTML('monitoring.' + r.id + '.freq', entries(x.freq), m.freq)}</td><td>${selectHTML('monitoring.' + r.id + '.owner', entries(x.owners), m.owner)}</td></tr>`; }).join('')}
          </tbody></table></div><p class="muted small">${esc(x.systemInd)}</p></section>` : '';
      return head({ eyebrow: x.eyebrow, title: x.title, sub: x.sub }) + `
        <div class="res-top">
          <div class="card radar-card">${radarSVG(true)}</div>
          <div class="res-side">
            <div class="card prev">${prev ? `${ICON(INEFF_ICON[prev])}<span class="eyebrow">${esc(x.prevailing)}</span><h2>${esc(t('q.ineff')[prev].name)}</h2>
              <span class="sev b${D[prev].band}">${prev} · ${D[prev].value}/100 · ${esc(t('options.bands')[D[prev].band - 1])}</span>` : `<span class="eyebrow">${esc(x.noPrevailing)}</span>`}</div>
            <div class="kpis">
              ${kpi('leaf', kp.g, B.complete ? fmt(B.tCO2e, 1) : '—')}${kpi('radar', kp.ci, B.complete ? fmt(B.CI, 0) : '—')}
              ${kpi('bolt', kp.ei, B.complete ? fmt(B.EI, 3) : '—')}${kpi('home', kp.acr, R.acr ? fmt(R.acr.ACR * 100, 0) + '%' : '—')}
            </div>${warns}
          </div></div>
        <section class="res-sec"><h2>${esc(x.ineffTitle)}</h2><div class="card ineff-list">${ineffRows}</div></section>
        <section class="res-sec"><h2>${esc(x.planTitle)}</h2><div class="card plan">${plan}</div></section>
        ${monitor}
        <section class="res-sec card name-card"><div><h2>${esc(x.nameTitle)}</h2><p class="muted">${esc(x.nameNote)}</p></div>
          <div class="name-fields"><label><span>${esc(x.orgName)}</span><input type="text" data-bind="profile.orgName" value="${esc(S.profile.orgName)}" autocomplete="organization"></label>
          <label><span>${esc(x.siteName)}</span><input type="text" data-bind="profile.siteName" value="${esc(S.profile.siteName)}"></label></div></section>`;
    },

    truth(sc) {
      const x = t('q.truth');
      const cur = getPath(sc.path);
      return `<header class="q-head truth-head"><span class="eyebrow">${esc(x.eyebrow)}</span><h1 class="q-title statement" tabindex="-1">«${esc(sc.title)}»</h1></header>
        <div class="opts row-5 truth" role="group">${x.options.map((l, i) => optButton(sc.path, { value: String(i + 1), label: l, scale: i + 1 }, i, cur)).join('')}</div>`;
    },

    yesno(sc) {
      const cur = getPath(sc.path);
      const txt = getPath(sc.textPath) || '';
      return head(sc) + `<div class="opts grid-2 yesno" role="group">
          ${optButton(sc.path, { value: 'yes', label: t('q.yes') }, 0, cur)}${optButton(sc.path, { value: 'no', label: t('q.no') }, 1, cur)}</div>
        ${cur === 'yes' ? `<label class="reason"><span>${esc(sc.textLabel)}</span><textarea rows="3" data-bind="${sc.textPath}">${esc(txt)}</textarea></label>` : ''}`;
    },

    final() {
      const x = t('q.final');
      const ch = S.feedback.channel || '';
      return head({ title: x.title }) + `<div class="card final-card">
          <div class="field"><span class="field-label">${esc(x.channel)} <em>${esc(t('ui.optional'))}</em></span>
            <div class="chips">${entries(x.channels).map(([v, l]) => `<button type="button" class="chip${ch === v ? ' on' : ''}" data-choose="feedback.channel" data-value="${v}" aria-pressed="${ch === v}">${esc(l)}</button>`).join('')}</div></div>
          <label class="field"><span class="field-label">${esc(x.open)} <em>${esc(t('ui.optional'))}</em></span><textarea rows="3" data-bind="feedback.open">${esc(S.feedback.open || '')}</textarea></label>
          <label class="check"><input type="checkbox" data-bind="contact.ok" data-rerender${S.contact.ok ? ' checked' : ''}><span>${esc(x.contact)}</span></label>
          ${S.contact.ok ? `<label class="field"><span class="field-label">${esc(x.email)}</span><input type="email" data-bind="contact.email" value="${esc(S.contact.email)}" autocomplete="email"></label><p class="muted small">${esc(x.contactNote)}</p>` : ''}
          <p class="form-msg" id="form-msg" role="alert"></p></div>`;
    },

    thanks() {
      const x = t('q.thanks');
      return `<div class="hero-band thanks-band">${seaLayer('sea-soft')}<div class="hero-band-inner">
          <span class="thanks-check">${ICON('check')}</span>
          <h1 class="q-title" tabindex="-1">${esc(x.title)}</h1><p class="lede">${esc(x.body)}</p>
          <p class="sync" id="sync-status" role="status"></p></div></div>
        <div class="card thanks-card">
          <p class="code num">${esc(x.code.replace('{code}', S.code))}</p><p class="muted">${esc(x.codeNote)}</p>
          <div class="thanks-actions"><button type="button" class="btn btn-primary btn-lg" data-act="print">${ICON('download')}${esc(x.download)}</button>
          <button type="button" class="btn btn-ghost btn-lg" data-act="newrun">${esc(x.newRun)}</button>
          <a class="btn btn-ghost btn-lg" href="../${lang === 'en' ? '?lang=en' : ''}">${esc(x.home)}</a></div>
          <p class="muted small">${esc(x.printHint)}</p></div>`;
    }
  };

  function selectHTML(path, options, value) {
    return `<select data-bind="${path}">${options.map(([v, l]) => `<option value="${esc(v)}"${v === value ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  }

  // ---------- ottagono dei risultati ----------
  function radarAxes() {
    const D = R.diagnosis, B = R.baseline;
    const ranked = R.interventions.ranked;
    const gcsMean = ranked.length ? ranked.reduce((s, r) => s + r.gcs, 0) / ranked.length : null;
    return [
      ['I1', D.I1.value], ['I2', D.I2.value], ['I3', D.I3.value], ['I4', D.I4.value], ['I5', D.I5.value],
      ['CI', B.complete ? clamp(B.CI / CI_REF * 100, 0, 100) : null],
      ['DATA', R.dms.effective !== null ? (5 - R.dms.effective) * 20 : null],
      ['GOV', gcsMean !== null ? (gcsMean - 1) / 4 * 100 : null]
    ];
  }

  function radarSVG(animated) {
    const axes = radarAxes();
    const labels = t('q.results.axes');
    const N = axes.length, cx = 280, cy = 212, Rr = 138;
    const ang = i => -Math.PI / 2 + i * 2 * Math.PI / N;
    const pt = (i, r) => [cx + r * Math.cos(ang(i)), cy + r * Math.sin(ang(i))];
    const poly = r => axes.map((_, i) => pt(i, r).map(v => v.toFixed(1)).join(',')).join(' ');
    const sevColor = v => ['#10B981', '#84CC16', '#F59E0B', '#F97316', '#DC2626'][CCF.band(v) - 1];
    let g = '';
    [0.2, 0.4, 0.6, 0.8, 1].forEach(k => { g += `<polygon points="${poly(Rr * k)}" class="ring${k === 1 ? ' outer' : ''}"/>`; });
    axes.forEach((_, i) => { const [x, y] = pt(i, Rr); g += `<line x1="${cx}" y1="${cy}" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" class="spoke"/>`; });
    const shape = axes.map(([, v], i) => pt(i, Rr * (v === null ? 0 : v) / 100).map(n => n.toFixed(1)).join(',')).join(' ');
    g += `<g class="shape${animated ? ' animate' : ''}" style="transform-origin:${cx}px ${cy}px"><polygon points="${shape}" class="area"/>`;
    axes.forEach(([, v], i) => {
      if (v === null) return;
      const [x, y] = pt(i, Rr * v / 100);
      g += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" class="vertex" style="stroke:${sevColor(v)}"/>`;
    });
    g += '</g>';
    axes.forEach(([key, v], i) => {
      const [x, y] = pt(i, Rr + 34);
      const cos = Math.cos(ang(i));
      const anchor = Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end';
      const words = labels[key].split(' ');
      const lines = words.length > 1 && labels[key].length > 14 ? [words.slice(0, Math.ceil(words.length / 2)).join(' '), words.slice(Math.ceil(words.length / 2)).join(' ')] : [labels[key]];
      const dy = y < cy - 20 ? -((lines.length - 1) * 14) - 6 : y > cy + 20 ? 10 : -((lines.length - 1) * 7);
      g += `<text x="${x.toFixed(1)}" y="${(y + dy).toFixed(1)}" text-anchor="${anchor}" class="axis-label axis-full">${lines.map((l, k) => `<tspan x="${x.toFixed(1)}" dy="${k === 0 ? 0 : 14}">${esc(l)}</tspan>`).join('')}<tspan x="${x.toFixed(1)}" dy="15" class="axis-value">${v === null ? 'n.d.' : Math.round(v)}</tspan></text>`;
      // sugli schermi stretti: sigla e valore grandi, con la legenda sotto il grafico
      const [sx, sy] = pt(i, Rr + 30);
      g += `<text x="${sx.toFixed(1)}" y="${(sy + 8).toFixed(1)}" text-anchor="${anchor}" class="axis-short">${esc(RADAR_SHORT[key])} ${v === null ? '–' : Math.round(v)}</text>`;
    });
    const legend = axes.map(([key, v]) => `<span><strong>${esc(RADAR_SHORT[key])}</strong> ${esc(labels[key])}</span>`).join('');
    return `<svg class="radar" viewBox="0 0 560 434" role="img" aria-label="${esc(t('q.results.title'))}">${g}</svg><div class="radar-legend">${legend}</div>`;
  }

  // ---------- rendering ----------
  let currentList = [];
  function current() { return currentList.find(s => s.id === S.pos); }

  function render(direction) {
    R = evaluate();
    currentList = screens();
    let idx = currentList.findIndex(s => s.id === S.pos);
    if (idx < 0) {
      // la schermata non esiste più (per esempio un intervento deselezionato): torna all'inizio del capitolo
      const ch = S.pos.startsWith('iv:') ? 7 : 0;
      idx = Math.max(0, currentList.findIndex(s => s.ch === ch));
      S.pos = currentList[idx].id;
    }
    if (!S.consent && idx > 0) { idx = 0; S.pos = 'intro'; }
    const sc = currentList[idx];
    renderChrome(sc);
    const body = VIEWS[sc.kind](sc, currentList);
    const nav = navHTML(sc, idx);
    const app = $('#app');
    // la navigazione sta fuori dalla sezione animata: un antenato con transform ne romperebbe il position:fixed
    app.innerHTML = `<section class="screen kind-${sc.kind} ${direction === 'back' ? 'enter-back' : 'enter'}" data-screen="${esc(sc.id)}">${body}</section>${nav}`;
    liveUpdate();
    const h = $('.q-title', app);
    if (h && direction) h.focus({ preventScroll: true });
    if (direction) window.scrollTo(0, 0);
  }

  function navHTML(sc, idx) {
    if (sc.kind === 'thanks') return '';
    const ok = answered(sc);
    const back = idx > 0 ? `<button type="button" class="btn btn-ghost" data-act="back">${ICON('arrowLeft')}${esc(t('ui.back'))}</button>` : '<span></span>';
    let label = t('ui.next'), act = 'next';
    if (sc.kind === 'intro') label = t('ui.start');
    else if (sc.kind === 'chapter') label = t('ui.startChapter');
    else if (sc.kind === 'results') label = t('q.results.toEval');
    else if (sc.kind === 'final') { label = t('q.final.submit'); act = 'submit'; }
    const hint = sc.kind === 'choice' || sc.kind === 'scale' || sc.kind === 'truth' || sc.kind === 'ineff' ? `<span class="q-hint">${esc(t('ui.keysHint'))}</span>` : `<span class="q-hint">${esc(t('ui.saved'))}</span>`;
    return `<nav class="q-nav">${back}${hint}<button type="button" class="btn btn-primary btn-lg" data-act="${act}" id="next-btn"${ok ? '' : ' disabled'}>${esc(label)}${ICON('arrowRight')}</button></nav>`;
  }

  function renderChrome(sc) {
    document.documentElement.lang = lang;
    document.title = t('meta.title');
    const md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('meta.description'));
    $$('.lang-switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n, { v: CCF.VERSION }); });
    const fab = $('#help-fab .sr-only'); if (fab) fab.textContent = t('ui.helpAria');
    const home = $('#brand-link'); if (home) home.setAttribute('href', '../' + (lang === 'en' ? '?lang=en' : ''));
    // barra di avanzamento per capitoli
    const rail = $('#rail');
    rail.hidden = sc.ch < 1;
    const chNow = Math.min(Math.max(sc.ch, 1), TOTAL_CH);
    const inCh = currentList.filter(s => s.ch === sc.ch);
    const pos = Math.max(0, inCh.findIndex(s => s.id === sc.id));
    const bars = [];
    for (let c = 1; c <= TOTAL_CH; c++) {
      const w = sc.ch > TOTAL_CH || c < chNow ? 100 : c > chNow ? 0 : Math.round((pos + 1) / Math.max(1, inCh.length) * 100);
      bars.push(`<i><b style="width:${w}%"></b></i>`);
    }
    rail.innerHTML = `<div class="rail-label"><span class="num">${esc(t('ui.chapterOf', { n: chNow, t: TOTAL_CH }))}</span><span class="rail-name">${esc(t('chapters')[chNow])}</span></div><div class="rail-bars" aria-hidden="true">${bars.join('')}</div>`;
  }

  // Aggiornamenti in tempo reale che non ridisegnano la schermata (così i cursori non si interrompono).
  function liveUpdate() {
    const sc = current();
    if (!sc) return;
    const btn = $('#next-btn');
    if (btn) btn.disabled = !answered(sc);
    if (sc.kind === 'intro') { const need = $('#consent-need'); if (need) need.hidden = !!S.consent; }
    if (sc.kind === 'percent') { const v = getPath(sc.path); const el = $('#pct-value'); if (el) el.innerHTML = `${has(v) ? fmt(Number(v)) : '—'}<span>%</span>`; }
    if (sc.kind === 'distance') { const v = CCF.num(S.baseline.oneWay); const el = $('#dist-value'); if (el) el.innerHTML = `${v === null ? '—' : fmt(v, v % 1 ? 1 : 0)}<span> km</span>`; }
    if (sc.kind === 'modes') modesLive();
    if (sc.kind === 'modeDistances') R.baseline.rows.forEach(r => { const el = $('#dv-' + r.id); if (el) { const v = r.oneWay; el.textContent = `${fmt(v, v % 1 ? 1 : 0)} km`; } });
    if (sc.kind === 'iv') ivLive(sc);
    if (sc.kind === 'thanks') syncStatus();
  }

  function modesLive() {
    const x = t('q.modes');
    const B = R.baseline;
    const tot = CCF.num(S.profile.employees);
    const stack = $('#modes-stack');
    if (stack) {
      const denom = Math.max(B.N, tot || 0, 1);
      stack.innerHTML = B.rows.filter(r => r.n > 0).map(r => `<i style="width:${r.n / denom * 100}%;background:${MODE_COLOR[r.id]}" title="${esc(t('options.modes')[r.id])}: ${fmt(r.n)}"></i>`).join('');
    }
    const assigned = $('#modes-assigned');
    if (assigned) {
      let s = x.assigned.replace('{sum}', fmt(B.N)).replace('{tot}', tot ? fmt(tot) : '—');
      if (tot && B.N < tot) s += ' · ' + x.remaining.replace('{n}', fmt(tot - B.N));
      if (tot && B.N > tot) s += ' · ' + x.over.replace('{n}', fmt(B.N - tot));
      assigned.textContent = s;
      assigned.className = tot && B.N > tot ? 'over' : '';
    }
    const teaser = $('#modes-teaser');
    if (teaser) teaser.textContent = B.complete ? x.teaser.replace('{t}', fmt(B.tCO2e, 1)) : x.teaserNone;
    B.rows.forEach(r => {
      const tile = $(`[data-tile="${r.id}"]`); if (tile) tile.classList.toggle('on', r.n > 0);
      const lf = $('#lf-' + r.id); if (lf) lf.textContent = r.LF === null ? '—' : fmt(r.LF * 100, 0) + '%';
    });
    $$('.fill-rest').forEach(b => { b.hidden = !(tot && B.N < tot); });
  }

  function ivLive(sc) {
    const x = t('q.iv');
    const r = ivResult(sc.ivId);
    if (!r) return;
    const e = r.estimate;
    const dg = $('#iv-dg'), pct = $('#iv-pct'), unit = $('#iv-unit');
    if (dg) {
      if (!e.estimable) { dg.textContent = '—'; unit.textContent = x.reasons[e.reason] || ''; pct.textContent = ''; }
      else if (e.dG <= 0) { dg.textContent = fmt(0); unit.textContent = x.negative; pct.textContent = ''; }
      else { countTo(dg, e.dG / 1e6, 1); unit.textContent = x.unit; pct.textContent = x.pct.replace('{p}', fmt(r.dGpct, 1)); }
    }
    const lab = $('#iv-lever-label');
    if (lab && r.scenario) {
      const sc2 = r.scenario, p = Math.round((e.lever !== undefined ? e.lever : sc2.lever) * 100);
      lab.textContent = sc2.type === 'shift' ? x.lever.shift.replace('{pct}', p).replace('{to}', t('options.modes')[e.target || sc2.to[0]])
        : sc2.type === 'cut' ? x.lever.cut.replace('{pct}', p)
        : sc2.base === 'acr' ? x.lever.avoid_acr.replace('{pct}', p).replace('{acr}', R.acr ? fmt(R.acr.ACR * 100, 0) : '—') : x.lever.avoid_total.replace('{pct}', p);
    }
    const values = { cost: r.cost, acc: r.acc, data: r.data, gcs: r.gcs, impact: r.impact };
    Object.keys(values).forEach(dim => {
      $$(`[data-ivset="${sc.ivId}"][data-dim="${dim}"]`).forEach(b => {
        const v = Number(b.dataset.value);
        b.setAttribute('aria-pressed', String(values[dim] === v));
        b.classList.toggle('preset', (dim === 'gcs' && v === r.gcsDefault) || (dim === 'impact' && v === r.impactProposed));
        b.disabled = dim === 'data' && r.dataCap && v > 2;
      });
    });
    const note = (id, text) => { const el = $('#note-' + id); if (el) el.textContent = text; };
    note('data', r.dataCap ? x.capped : '');
    note('gcs', r.governancePlan ? x.govPlan : '');
    const sg = $('#sum-gcs'); if (sg) sg.textContent = r.gcs ? x.gcs[r.gcs - 1] : '—';
    const si = $('#sum-impact'); if (si) si.textContent = r.impact ? x.impact[r.impact - 1] : '—';
    const res = $('#iv-result');
    if (res) {
      res.className = 'iv-result' + (r.ipi === null ? ' pending' : ' cls-' + r.cls);
      res.innerHTML = r.ipi === null ? `<span>${esc(x.pending)}</span>`
        : `<span class="prio ${r.cls}">${r.cls}</span><div><strong>${esc(x.priority.replace('{c}', r.cls))}</strong><span>${esc(x.cls[r.cls])} · ${esc(x.ipi.replace('{v}', fmt(r.ipi, 1)))}</span></div>`;
    }
    const btn = $('#next-btn'); if (btn) btn.disabled = r.ipi === null;
  }

  function countTo(el, target, digits) {
    const from = Number(el.dataset.v || 0);
    el.dataset.v = target;
    const start = performance.now(), dur = 450;
    const step = now => {
      const k = Math.min(1, (now - start) / dur);
      el.textContent = fmt(from + (target - from) * (1 - Math.pow(1 - k, 3)), digits);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  // ---------- navigazione ----------
  function go(delta) {
    clearTimeout(autoTimer);
    const idx = currentList.findIndex(s => s.id === S.pos);
    const sc = currentList[idx];
    if (delta > 0 && sc && !answered(sc)) return;
    const next = clamp(idx + delta, 0, currentList.length - 1);
    if (next === idx) return;
    const target = currentList[next];
    const now = Date.now();
    if (sc) S.timings[sc.ch] = Math.round((S.timings[sc.ch] || 0) + (now - enteredAt) / 1000);
    enteredAt = now;
    S.pos = target.id;
    if (target.ch <= TOTAL_CH) S.maxCh = Math.max(S.maxCh, target.ch);
    if (S.consent && !S.reached[target.ch] && target.ch <= TOTAL_CH) { S.reached[target.ch] = true; beacon(target.ch); }
    if (target.kind === 'results') queueAssessment();
    persist();
    render(delta < 0 ? 'back' : 'fwd');
  }

  function scheduleNext() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(() => go(1), 380);
  }

  function reset() {
    const pending = S.outbox;   // gli invii non ancora confermati sopravvivono alla nuova analisi
    store.clear();
    S = fresh();
    S.outbox = pending;
    enteredAt = Date.now();
    persist();
    render('back');
  }

  // ---------- eventi ----------
  function afterChange(rerender) {
    R = evaluate();
    persist();
    if (rerender) {
      const y = window.scrollY;
      render();
      window.scrollTo(0, y);
    } else {
      currentList = screens();
      liveUpdate();
    }
  }

  function onClick(e) {
    const el = e.target.closest('[data-act],[data-choose],[data-set],[data-step],[data-mstep],[data-fill],[data-toggle-iv],[data-ivset]');
    if (!el || el.disabled) return;
    const sc = current();

    if (el.dataset.choose) return choose(el, sc);
    if (el.dataset.set) {
      setPath(el.dataset.set, String(el.dataset.value));
      afterChange(true);
      return;
    }
    if (el.dataset.step) {
      const path = el.dataset.step;
      const v = CCF.num(getPath(path)) || 0;
      const inc = v >= 1000 ? 50 : v >= 200 ? 10 : 1;
      setPath(path, String(Math.max(1, v + Number(el.dataset.d) * inc)));
      const input = $(`[data-bind="${path}"]`); if (input) input.value = getPath(path);
      afterChange(false);
      return;
    }
    if (el.dataset.mstep) {
      const id = el.dataset.mstep;
      const path = `baseline.modes.${id}.n`;
      const v = CCF.num(getPath(path)) || 0;
      setPath(path, String(Math.max(0, v + Number(el.dataset.d))));
      const input = $(`[data-bind="${path}"]`); if (input) input.value = getPath(path);
      afterChange(false);
      return;
    }
    if (el.dataset.fill) {
      const id = el.dataset.fill;
      const tot = CCF.num(S.profile.employees) || 0;
      const rest = tot - R.baseline.N;
      if (rest > 0) {
        const path = `baseline.modes.${id}.n`;
        setPath(path, String((CCF.num(getPath(path)) || 0) + rest));
        const input = $(`[data-bind="${path}"]`); if (input) input.value = getPath(path);
        afterChange(false);
      }
      return;
    }
    if (el.dataset.toggleIv) {
      const id = el.dataset.toggleIv;
      const cur = ivResult(id);
      setPath(`interventions.${id}.selected`, !(cur && cur.selected));
      el.setAttribute('aria-pressed', String(!(cur && cur.selected)));
      afterChange(false);
      return;
    }
    if (el.dataset.ivset) {
      const id = el.dataset.ivset, dim = el.dataset.dim;
      let value = String(el.dataset.value);
      const r = ivResult(id);
      // scegliere il valore proposto dal framework non è una correzione: resta automatico
      if (dim === 'impact' && r && String(r.impactProposed) === value) value = '';
      if (dim === 'gcs' && r && String(r.gcsDefault) === value) value = '';
      setPath(`interventions.${id}.${dim}`, value);
      afterChange(false);
      return;
    }

    const act = el.dataset.act;
    if (act === 'next') go(1);
    else if (act === 'back') go(-1);
    else if (act === 'resume') { S.pos = currentList.filter(s => s.ch === Math.min(S.maxCh, TOTAL_CH))[0].id; persist(); render('fwd'); }
    else if (act === 'restart') { if (window.confirm(t('ui.restartConfirm'))) reset(); }
    else if (act === 'newrun') { if (window.confirm(t('q.thanks.newConfirm'))) reset(); }
    else if (act === 'privacy') openPrivacy();
    else if (act === 'closePrivacy') $('#privacy').close();
    else if (act === 'print') printReport();
    else if (act === 'submit') submit();
    else if (act === 'mnsConfirm') { setMns(50, 80); afterChange(true); }
    else if (act === 'ineffSkip') {
      const code = el.dataset.code;
      S.skipped[code] = true;
      if (DIRECT.includes(code)) S.direct[code] = '';
      afterChange(false);
      scheduleNext();
    }
  }

  function choose(el, sc) {
    const path = el.dataset.choose;
    const value = el.dataset.value;
    if (path.startsWith('ineff.')) {
      const code = path.split('.')[1];
      delete S.skipped[code];
      if (DIRECT.includes(code)) S.direct[code] = value;
      else {
        const d = R.diagnosis[code];
        const derivedBand = d.derived !== null ? CCF.band(d.derived) : null;
        if (derivedBand === Number(value)) delete S.overrides[code];
        else S.overrides[code] = { value: String(CCF.BAND_VALUES[Number(value) - 1]), note: (S.overrides[code] && S.overrides[code].note) || '' };
      }
      const needsReason = !DIRECT.includes(code) && !!S.overrides[code] && R.diagnosis[code].derived !== null;
      afterChange(true);
      if (!needsReason) scheduleNext();
      return;
    }
    setPath(path, value);
    if (path === 'baseline.daysWeek') S.baseline.days = String(Number(value) * 44);
    $$(`[data-choose="${CSS.escape(path)}"]`).forEach(b => { b.setAttribute('aria-pressed', String(b === el)); b.classList.toggle('on', b === el); });
    if (sc.kind === 'yesno') { afterChange(true); if (value === 'no') scheduleNext(); return; }
    afterChange(false);
    if (sc.auto) scheduleNext();
  }

  function onInput(e) {
    const el = e.target.closest('[data-bind]');
    if (!el || el.type === 'checkbox' || el.tagName === 'SELECT') return;
    setPath(el.dataset.bind, el.value);
    if (el.type === 'range') el.classList.remove('unset');
    afterChange(false);
  }

  function onChange(e) {
    const el = e.target.closest('[data-bind]');
    if (!el) return;
    setPath(el.dataset.bind, el.type === 'checkbox' ? el.checked : el.value);
    afterChange(el.hasAttribute('data-rerender'));
  }

  // Barra della presenza necessaria: due cursori trascinabili, anche da tastiera.
  function setMns(a, b) {
    a = clamp(Math.round(a / 5) * 5, 0, 100);
    b = clamp(Math.round(b / 5) * 5, a, 100);
    S.mns = { qe: String(a), qp: String(b - a), qr: String(100 - b) };
  }
  function paintMns() {
    const wrap = $('#split3');
    if (!wrap) return;
    const qe = Number(S.mns.qe), qp = Number(S.mns.qp), qr = Number(S.mns.qr);
    wrap.classList.remove('preview');
    const segs = $$('.seg', wrap);
    [qe, qp, qr].forEach((v, i) => { segs[i].style.width = v + '%'; $('.seg-v', segs[i]).textContent = v + '%'; const l = $('#leg-' + i); if (l) l.textContent = v + '%'; });
    const hs = $$('.handle', wrap);
    hs[0].style.left = qe + '%'; hs[0].setAttribute('aria-valuenow', qe);
    hs[1].style.left = (qe + qp) + '%'; hs[1].setAttribute('aria-valuenow', qe + qp);
    const confirm = $('.confirm-default'); if (confirm) confirm.hidden = true;
  }
  function mnsBounds() {
    const valid = R.mns.valid;
    const a = valid ? Number(S.mns.qe) : 50;
    return [a, valid ? a + Number(S.mns.qp) : 80];
  }
  function onPointerDown(e) {
    const h = e.target.closest('.handle');
    if (!h) return;
    e.preventDefault();
    const wrap = $('#split3');
    const idx = Number(h.dataset.h);
    h.setPointerCapture(e.pointerId);
    const move = ev => {
      const rect = wrap.getBoundingClientRect();
      const p = clamp((ev.clientX - rect.left) / rect.width * 100, 0, 100);
      let [a, b] = mnsBounds();
      if (idx === 0) a = Math.min(p, b); else b = Math.max(p, a);
      setMns(a, b);
      R = evaluate();
      paintMns();
      liveUpdate();
    };
    const up = () => { h.removeEventListener('pointermove', move); h.removeEventListener('pointerup', up); persist(); };
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', up);
    move(e);
  }

  function onKey(e) {
    if ($('#help-drawer').classList.contains('open')) { if (e.key === 'Escape') closeHelp(); return; }
    if ($('#privacy').open) return;
    const tag = e.target.tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    const h = e.target.closest && e.target.closest('.handle');
    if (h && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End')) {
      e.preventDefault();
      let [a, b] = mnsBounds();
      const d = e.key === 'ArrowLeft' ? -5 : e.key === 'ArrowRight' ? 5 : e.key === 'Home' ? -100 : 100;
      if (h.dataset.h === '0') a = clamp(a + d, 0, b); else b = clamp(b + d, a, 100);
      setMns(a, b); R = evaluate(); paintMns(); liveUpdate(); persist();
      return;
    }
    if (typing || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key === 'Enter' && !e.target.closest('button,a,summary,label')) {
      const btn = $('#next-btn'); if (btn && !btn.disabled) { e.preventDefault(); btn.click(); }
      return;
    }
    if (/^[1-9]$/.test(e.key)) {
      const opts = $$('#app .opts [data-choose]');
      const b = opts[Number(e.key) - 1];
      if (b) { e.preventDefault(); b.click(); }
      return;
    }
    if (e.key === '0') { const dk = $('#app [data-dontknow]'); if (dk) { e.preventDefault(); dk.click(); } }
  }

  function setLang(l) {
    if (l === lang) return;
    lang = l;
    try { localStorage.setItem('ccf-lang', l); } catch (e) { /* preferenza non salvabile */ }
    persist();
    render();
    if ($('#help-drawer').classList.contains('open')) openHelp();
    if ($('#privacy').open) openPrivacy();
  }

  // ---------- aiuto "?" ----------
  let lastFocus = null;
  function openHelp() {
    const sc = current();
    const H = t('help');
    let title, body, fw;
    if (sc.kind === 'chapter') {
      title = t('chapterIntro')[sc.ch].title; body = H.chapter.body; fw = H.chapterFw[sc.ch];
    } else {
      const h = H[sc.help] || H.intro;
      title = h.title; body = h.body; fw = h.fw ? h.fw.replace('{k}', sc.helpVars ? sc.helpVars.k : '') : '';
    }
    $('#help-body').innerHTML = `<h3 id="help-title">${esc(title)}</h3>${(body || []).map(p => `<p>${esc(p)}</p>`).join('')}
      ${fw ? `<div class="help-fw"><strong>${esc(t('ui.helpFw'))}</strong>${esc(fw)}</div>` : ''}`;
    $('#help-eyebrow').textContent = t('ui.helpEyebrow');
    $('.help-close').setAttribute('aria-label', t('ui.close'));
    if (!$('#help-drawer').classList.contains('open')) lastFocus = document.activeElement;
    $('#help-drawer').classList.add('open');
    setTimeout(() => $('.help-close').focus(), 60);
  }
  function closeHelp() {
    $('#help-drawer').classList.remove('open');
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }

  // ---------- informativa e richieste ----------
  function openPrivacy() {
    const p = k => t('privacy.' + k);
    const dlg = $('#privacy');
    dlg.innerHTML = `<div class="dlg"><div class="dlg-head"><h2 id="privacy-title">${esc(p('title'))}</h2><button type="button" class="help-close" data-act="closePrivacy" aria-label="${esc(p('close'))}">${ICON('close')}</button></div>
      <div class="dlg-body">${p('sections').map(([h, txt]) => `<h3>${esc(h)}</h3><p>${esc(txt)}</p>`).join('')}
        <p class="dlg-authors"><strong>${esc(p('authors'))}:</strong> ${esc(CONTENT.authors.map(a => a.name).join(', '))}</p>
        <form class="request" id="request-form" novalidate><h3>${esc(p('requestTitle'))}</h3>
          <div class="grid2">
            <label class="field"><span class="field-label">${esc(p('requestCode'))}</span><input name="code" type="text" value="${esc(S.code || '')}"></label>
            <label class="field"><span class="field-label">${esc(p('requestKind'))}</span><select name="kind">${entries(p('requestKinds')).map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select></label>
          </div>
          <label class="field"><span class="field-label">${esc(p('requestMessage'))}</span><textarea name="message" rows="3"></textarea></label>
          <label class="field"><span class="field-label">${esc(p('requestEmail'))}</span><input name="email" type="email" autocomplete="email"></label>
          <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <button type="submit" class="btn btn-primary">${esc(p('requestSend'))}</button>
          <p class="muted small" id="rq-out" role="status"></p>
        </form></div></div>`;
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  }

  async function sendRequest(form) {
    const out = $('#rq-out');
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    if (!EMAIL_RE.test(email)) { out.textContent = t('privacy.requestError'); return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    const msg = { id: newMsgId(), type: 'requests', row: { code: data.get('code'), kind: data.get('kind'), message: data.get('message'), email }, hp: data.get('website') || '' };
    const ok = await post(msg).catch(() => false);
    btn.disabled = false;
    out.textContent = ok ? t('privacy.requestSent') : t('privacy.requestError');
    if (ok) form.reset();
  }

  // ---------- invio dati ----------
  // Apps Script esegue doPost e poi risponde con un redirect verso la pagina del risultato, che può impiegare
  // decine di secondi. Il redirect basta a sapere che la riga è scritta: con redirect 'manual' non lo seguiamo,
  // e keepalive porta a termine l'invio anche se la pagina si chiude.
  async function post(msg) {
    const res = await fetch(ENDPOINT, {
      method: 'POST', redirect: 'manual', keepalive: true,
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(msg)
    });
    if (res.type === 'opaqueredirect') return true;
    if (!res.ok) return false;
    const data = await res.json().catch(() => null);
    return !!(data && data.ok);
  }

  function newMsgId() {
    const bytes = new Uint8Array(9);
    window.crypto.getRandomValues(bytes);
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  // Coda degli invii: salvata nel browser, svuotata quando il server conferma, ritentata finché serve.
  let flushing = false, retryTimer = null;
  function enqueue(type, row) {
    S.outbox.push({ id: newMsgId(), type, row, hp: S.hp || '' });
    store.save(S);
    flush();
  }

  async function flush() {
    if (flushing || !S.outbox.length) return;
    flushing = true;
    clearTimeout(retryTimer);
    for (const msg of S.outbox.slice()) {
      const ok = await post(msg).catch(() => false);
      if (!ok) break;
      S.outbox = S.outbox.filter(m => m.id !== msg.id);
      store.save(S);
    }
    flushing = false;
    syncStatus();
    if (S.outbox.length) retryTimer = setTimeout(flush, 20000);
  }

  function syncStatus() {
    const el = $('#sync-status');
    if (!el) return;
    const pending = S.outbox.length > 0;
    el.textContent = pending ? t('q.thanks.syncing') : t('q.thanks.synced');
    el.classList.toggle('ok', !pending);
  }

  function beacon(ch) {
    if (!S.consent || !navigator.sendBeacon) return;
    try {
      const body = JSON.stringify({ type: 'progress', row: { sid: S.sid, step: ch, version: CCF.VERSION, lang }, hp: S.hp || '' });
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: 'text/plain;charset=utf-8' }));
    } catch (e) { /* il tracciamento dell'avanzamento è accessorio */ }
  }

  function hash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
    return String(h >>> 0);
  }

  function researchInputs() {
    const p = S.profile;
    return {
      ui: UI_VERSION,
      profile: { orgType: p.orgType, sector: p.sector, employees: p.employees, region: p.region, shiftPct: p.shiftPct, pscl: p.pscl, dms: p.dms },
      mns: S.mns, baseline: S.baseline, acc: S.acc, cdr: S.cdr, direct: S.direct, directNotes: S.directNotes,
      overrides: S.overrides, skipped: S.skipped, interventions: S.interventions, monitoring: S.monitoring
    };
  }

  function researchResults() {
    const B = R.baseline;
    return {
      dms: R.dms,
      mns: round(R.mns.value, 2),
      acc: { value: round(R.acc.value, 2), answered: R.acc.answered, nd: R.acc.nd, reliable: R.acc.reliable },
      cdr: { value: round(R.cdr.value, 2), answered: R.cdr.answered, nd: R.cdr.nd, reliable: R.cdr.reliable },
      baseline: {
        N: B.N, A: Math.round(B.A), tCO2e: round(B.tCO2e, 2), CI: round(B.CI, 2), EI: round(B.EI, 4), daysWeek: round(B.daysWeek, 2),
        rows: B.rows.filter(x => x.n > 0).map(x => ({ id: x.id, n: x.n, d: x.d, g: x.g, e: x.e, o: x.o, k: x.k, phi: x.phi, A: Math.round(x.A), EI: round(x.EI, 4), LF: round(x.LF, 3), CI: round(x.CI, 2), tCO2e: round(x.G / 1e6, 3) }))
      },
      acr: R.acr ? { ACR: round(R.acr.ACR, 4), daysNow: round(R.acr.daysNow, 2), daysNeeded: round(R.acr.daysNeeded, 2) } : null,
      diagnosis: CODES.map(c => { const x = R.diagnosis[c]; return { code: c, value: x.value, derived: x.derived, overridden: x.overridden, reliable: x.reliable, rule: !!x.coherenceRule }; }),
      prevailing: R.prevailing,
      radar: radarAxes().map(([k, v]) => [k, round(v, 1)]),
      interventions: R.interventions.list.map(x => ({
        id: x.id, selected: x.selected, lever: x.estimate.lever === undefined ? null : x.estimate.lever, estimable: x.estimate.estimable, reason: x.estimate.reason || null,
        dG_t: x.estimate.estimable ? round(x.estimate.dG / 1e6, 3) : null, dGpct: round(x.dGpct, 2),
        impactProposed: x.impactProposed, impact: x.impact, impactOverridden: x.impactOverridden,
        data: x.data, dataCapped: x.dataCapped, acc: x.acc, cost: x.cost, gcs: x.gcs, gcsDefault: x.gcsDefault, ipi: round(x.ipi, 3), cls: x.cls
      })),
      ranked: R.interventions.ranked.map(x => x.id),
      dataFirst: R.interventions.dataFirst
    };
  }

  function assessmentRow() {
    const D = R.diagnosis, B = R.baseline, top = R.interventions.ranked[0];
    const elapsed = Object.keys(S.timings).reduce((s, k) => s + S.timings[k], 0) + (Date.now() - enteredAt) / 1000;
    return {
      sid: S.sid, version: CCF.VERSION, lang, duration_sec: Math.round(elapsed),
      org_type: S.profile.orgType, sector: S.profile.sector, employees: CCF.num(S.profile.employees), region: S.profile.region,
      shift_pct: CCF.num(S.profile.shiftPct), pscl: S.profile.pscl,
      dms_declared: R.dms.declared, dms_effective: R.dms.effective, low_reliability: R.dms.lowReliability.join(' '),
      mns: round(R.mns.value, 1), acc: round(R.acc.value, 1), acc_answered: R.acc.answered, cdr: round(R.cdr.value, 1), cdr_answered: R.cdr.answered,
      employees_modal: B.N, pax_km: Math.round(B.A), tco2e: round(B.tCO2e, 2), ci_g_paxkm: round(B.CI, 1), ei_kwh_paxkm: round(B.EI, 4),
      acr: R.acr ? round(R.acr.ACR, 3) : null,
      i1: D.I1.value, i2: D.I2.value, i3: D.I3.value, i4: D.I4.value, i5: D.I5.value,
      i1_overridden: D.I1.overridden, i4_overridden: D.I4.overridden, i5_overridden: D.I5.overridden,
      prevailing: R.prevailing.join(' '), observed: R.interventions.observed.join(' '),
      n_evaluated: R.interventions.ranked.length,
      top1: top ? top.id : '', top1_ipi: top ? round(top.ipi, 2) : null, top1_class: top ? top.cls : '',
      data_first: R.interventions.dataFirst,
      inputs_json: JSON.stringify(researchInputs()),
      results_json: JSON.stringify(researchResults())
    };
  }

  // Accoda la valutazione quando si arriva ai risultati; se nel frattempo è cambiata, ne accoda una nuova revisione.
  function queueAssessment() {
    if (!S.consent) return;
    R = evaluate();
    if (!R.baseline.complete && !R.prevailing.length) return;
    const row = assessmentRow();
    const h = hash(row.inputs_json + row.results_json);
    if (h === S.sentHash) return;
    S.rev += 1;
    S.sentHash = h;
    row.rev = S.rev;
    enqueue('assessments', row);
  }

  function feedbackRow() {
    const f = S.feedback;
    return {
      sid: S.sid, version: CCF.VERSION, lang,
      f1_understandable: CCF.num(f.f1), f2_prevailing_matches: CCF.num(f.f2), f3_plausible_link: CCF.num(f.f3),
      f4_priority_useful: CCF.num(f.f4), f5_data_available: CCF.num(f.f5), f6_would_use: CCF.num(f.f6),
      c1_uncovered: f.c1, c1_text: f.c1 === 'yes' ? (f.c1text || '') : '', c2_overlap: f.c2, c2_text: f.c2 === 'yes' ? (f.c2text || '') : '',
      role: f.role, experience: f.experience, channel: f.channel || '', open_text: f.open || ''
    };
  }

  function toast(text) {
    let el = $('#toast');
    if (!el) { el = document.createElement('div'); el.id = 'toast'; el.className = 'toast'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3600);
  }

  function submit() {
    const msg = $('#form-msg');
    const missing = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'c1', 'c2', 'role', 'experience'].find(k => !S.feedback[k]);
    if (missing) {
      toast(lang === 'it' ? 'Manca ancora una risposta: ti riporto lì.' : 'One answer is still missing: taking you there.');
      S.pos = missing;
      render('back');
      return;
    }
    if (S.contact.ok && !EMAIL_RE.test((S.contact.email || '').trim())) { if (msg) msg.textContent = t('q.final.invalidEmail'); return; }
    queueAssessment();
    enqueue('feedback', feedbackRow());
    // l'email resta nel browser solo finché il server non conferma l'invio
    if (S.contact.ok) enqueue('contacts', { lang, email: S.contact.email.trim(), interview_consent: true });
    S.code = S.sid;
    S.contact.email = '';
    S.pos = 'thanks';
    persist();
    render('fwd');
    printReport();
  }

  // ---------- report stampabile ----------
  function reportHTML() {
    const x = t('q.results');
    const r = x.report;
    const B = R.baseline, D = R.diagnosis, IV = R.interventions;
    const title = [S.profile.orgName, S.profile.siteName].filter(Boolean).join(' — ') || r.untitled;
    const date = new Date().toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const rowsN = B.rows.filter(z => z.n > 0);
    const tile = (lab, val, sub) => `<div class="rep-tile"><div class="rep-l">${esc(lab)}</div><div class="rep-v num">${val}</div><div class="rep-s">${esc(sub || '')}</div></div>`;
    const bandTxt = v => (v === null ? 'n.d.' : v + ' · ' + t('options.bands')[CCF.band(v) - 1]);
    const s1 = `<div class="rep-tiles">${tile(r.dmsDeclared, R.dms.declared === null ? '—' : R.dms.declared + '/5')}${tile(r.dmsEffective, R.dms.effective === null ? '—' : R.dms.effective + '/5')}${tile(x.kpi.g[0], fmt(B.tCO2e, 1), x.kpi.g[1])}</div>
      ${B.complete ? `<table class="rep-table"><thead><tr><th>${esc(r.cols.mode)}</th><th>${esc(r.cols.n)}</th><th>${esc(r.cols.share)}</th><th>${esc(r.cols.paxkm)}</th><th>${esc(r.cols.g)}</th></tr></thead><tbody>
        ${rowsN.map(z => `<tr><td>${esc(t('options.modes')[z.id])}</td><td>${fmt(z.n)}</td><td>${fmt(z.n / B.N * 100, 1)}%</td><td>${fmt(z.A)}</td><td>${fmt(z.G / 1e6, 1)}</td></tr>`).join('')}
        </tbody><tfoot><tr><td>${esc(r.total)}</td><td>${fmt(B.N)}</td><td>100%</td><td>${fmt(B.A)}</td><td>${fmt(B.tCO2e, 1)}</td></tr></tfoot></table>` : ''}`;
    const s2 = `<div class="rep-radar">${radarSVG(false)}</div>
      <table class="rep-table"><tbody>${CODES.map(c => `<tr><td>${c} · ${esc(t('q.ineff')[c].name)}${D[c].overridden ? ' ✎' : ''}</td><td>${esc(bandTxt(D[c].value))}</td></tr>`).join('')}</tbody></table>
      <div class="rep-tiles">${tile('MNS', R.mns.valid ? fmt(R.mns.value, 0) + '/100' : '—')}${tile('ACC', R.acc.value === null ? '—' : fmt(R.acc.value, 0) + '/100')}${tile('CDR', R.cdr.value === null ? '—' : fmt(R.cdr.value, 0) + '/100')}</div>`;
    const acrSub = R.acr ? r.acrText.replace('{p}', fmt(R.acr.ACR * 100, 0)).replace('{d}', fmt(R.acr.daysNow, 1)).replace('{n}', fmt(R.acr.daysNeeded, 1)) : r.acrNa;
    const s3 = `${B.complete ? `<table class="rep-table"><thead><tr><th>${esc(r.cols.mode)}</th><th>${esc(r.cols.ei)}</th><th>${esc(r.cols.lf)}</th><th>${esc(r.cols.ci)}</th><th>${esc(r.cols.g)}</th></tr></thead><tbody>
        ${rowsN.map(z => `<tr><td>${esc(t('options.modes')[z.id])}</td><td>${fmt(z.EI, 3)}</td><td>${fmt(z.LF * 100, 0)}%</td><td>${fmt(z.CI, 0)}</td><td>${fmt(z.G / 1e6, 1)}</td></tr>`).join('')}</tbody></table>` : ''}
      <div class="rep-tiles">${tile(x.kpi.ci[0], fmt(B.CI, 0), x.kpi.ci[1])}${tile(x.kpi.ei[0], fmt(B.EI, 3), x.kpi.ei[1])}${tile(x.kpi.acr[0], R.acr ? fmt(R.acr.ACR * 100, 0) + '%' : '—', acrSub)}</div>
      ${IV.list.filter(z => z.selected && z.estimate.estimable).length ? `<p class="rep-h">${esc(r.dg)}</p><table class="rep-table"><tbody>${IV.list.filter(z => z.selected && z.estimate.estimable).map(z => `<tr><td>${esc(t('interventions')[z.id])}</td><td>${fmt(z.estimate.dG / 1e6, 1)} t · ${fmt(z.dGpct, 1)}%</td></tr>`).join('')}</tbody></table>` : ''}`;
    let s4 = IV.dataFirst ? `<p class="rep-d0"><strong>#0 · ${esc(x.d0)}</strong> — ${esc(x.d0note)}</p>` : '';
    s4 += IV.ranked.length ? `<table class="rep-table"><thead><tr><th>#</th><th>${esc(x.monitorCols.intv)}</th><th>IPI</th><th></th><th>${esc(x.monitorCols.ind)}</th><th>${esc(x.monitorCols.freq)}</th><th>${esc(x.monitorCols.owner)}</th></tr></thead><tbody>
      ${IV.ranked.map((z, i) => { const m = S.monitoring[z.id] || { freq: 'semiannual', owner: 'mm' }; return `<tr><td>${i + 1}</td><td>${esc(t('interventions')[z.id])}</td><td>${fmt(z.ipi, 1)}</td><td><span class="prio ${z.cls}">${z.cls}</span></td><td>${esc(x.indicators[CCF.MONITORING[z.ineff]])}</td><td>${esc(x.freq[m.freq])}</td><td>${esc(x.owners[m.owner])}</td></tr>`; }).join('')}
      </tbody></table><p class="rep-note">${esc(x.systemInd)}</p>` : `<p>${esc(IV.observed.length ? x.planEmpty : x.noCandidates)}</p>`;
    return `<div class="rep"><div class="rep-head"><div class="rep-eyebrow">${esc(r.eyebrow)}</div><div class="rep-title">${esc(title)}</div><div class="rep-date">${esc(r.generated.replace('{date}', date).replace('{v}', CCF.VERSION))}</div></div>
      <section><h2>${esc(r.s1)}</h2>${s1}</section><section><h2>${esc(r.s2)}</h2>${s2}</section><section><h2>${esc(r.s3)}</h2>${s3}</section><section><h2>${esc(r.s4)}</h2>${s4}</section>
      <p class="rep-foot">${esc(r.foot)} · ${esc(CONTENT.authors.map(a => a.name).join(', '))}</p></div>`;
  }

  function fillPrint() { R = evaluate(); $('#print-root').innerHTML = reportHTML(); }
  function printReport() { fillPrint(); setTimeout(() => window.print(), 80); }

  // ---------- avvio ----------
  document.addEventListener('click', onClick);
  const app = $('#app');
  app.addEventListener('input', onInput);
  app.addEventListener('change', onChange);
  app.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('keydown', onKey);
  $$('.lang-switch button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  $('#help-fab').addEventListener('click', openHelp);
  $$('[data-close-help]').forEach(b => b.addEventListener('click', closeHelp));
  document.addEventListener('submit', e => { if (e.target.id === 'request-form') { e.preventDefault(); sendRequest(e.target); } });
  window.addEventListener('beforeprint', fillPrint);
  window.addEventListener('pagehide', () => {
    const sc = current();
    if (sc) S.timings[sc.ch] = Math.round((S.timings[sc.ch] || 0) + (Date.now() - enteredAt) / 1000);
    enteredAt = Date.now();
    store.save(S);
  });
  const topbar = $('.topbar');
  window.addEventListener('scroll', () => topbar.classList.toggle('scrolled', window.scrollY > 4), { passive: true });

  render();
  flush();
  if (new URLSearchParams(location.search).has('privacy')) openPrivacy();
})();
