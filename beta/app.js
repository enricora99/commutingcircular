/*
 * Circular Commuting 2.0 beta — interfaccia guidata del Canvas.
 *
 * Lo stato vive nel browser (localStorage). Dopo il consenso, i dati anonimi partono verso il
 * foglio di validazione tramite la web app Apps Script (_backend/Code.js). Nome dell'organizzazione
 * e della sede non escono mai dal browser.
 */
(function () {
  'use strict';

  const ENDPOINT = 'https://script.google.com/macros/s/AKfycbwko-WdJPu1TeI5oevLKS0PgMGf6oMQNX6nbP4Vu_gwgJ-8NFQiGi8eakfWbHAekQc/exec';
  const STORE_KEY = 'ccf-beta-2';
  const LAST_STEP = 9;
  const RESULTS_STEP = 8;
  const I18N = window.CCF_I18N;
  const REGIONS = ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche', 'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto'];
  const BAND_RANGES = ['0–20', '21–40', '41–60', '61–80', '81–100'];
  const CODES = ['I1', 'I2', 'I3', 'I4', 'I5'];
  const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  // ---------- stato ----------
  const store = {
    load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { return null; } },
    save(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) { /* storage non disponibile: si lavora in memoria */ } },
    clear() { try { localStorage.removeItem(STORE_KEY); } catch (e) { /* idem */ } }
  };

  function newSid() {
    const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const bytes = new Uint8Array(8);
    window.crypto.getRandomValues(bytes);
    return 'CC-' + Array.from(bytes, b => abc[b % abc.length]).join('');
  }

  function fresh() {
    return {
      schema: 1, sid: newSid(), step: 0, maxStep: 0, consent: false, hp: '',
      profile: { orgName: '', siteName: '', orgType: '', sector: '', employees: '', region: '', shiftPct: '', pscl: '', dms: '' },
      mns: { qe: '', qp: '', qr: '' },
      baseline: { oneWay: '', days: '220', modes: {} },
      acc: Array(7).fill(''), cdr: Array(5).fill(''),
      direct: { I2: '', I3: '' }, directNotes: { I2: '', I3: '' }, overrides: {},
      interventions: {}, monitoring: {},
      feedback: {}, contact: { ok: false, email: '' },
      timings: {}, reached: {}, rev: 0, sentHash: '', code: ''
    };
  }

  let S = store.load();
  if (!S || S.schema !== 1) S = fresh();
  let lang = pickLang();
  let R = evaluate();
  let enteredAt = Date.now();
  let saveTimer = null;

  function pickLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'it') return q;
    return S.lang === 'en' ? 'en' : 'it';
  }

  function persist() {
    S.lang = lang;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.save(S), 200);
  }

  function engineState() {
    const interventions = {};
    Object.keys(S.interventions).forEach(id => {
      const u = S.interventions[id];
      const pct = CCF.num(u.leverPct);
      interventions[id] = Object.assign({}, u, { lever: pct === null ? null : pct / 100 });
    });
    return { profile: S.profile, mns: S.mns, baseline: S.baseline, acc: S.acc, cdr: S.cdr, direct: S.direct, overrides: S.overrides, interventions };
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
  const fid = path => 'f-' + path.replace(/[^\w]/g, '-');
  const entries = obj => Object.keys(obj).map(k => [k, obj[k]]);

  const mnsBand = v => t('b2.bands')[v < 50 ? 0 : v < 80 ? 1 : 2];
  const fourBand = v => (v < 40 ? 0 : v < 60 ? 1 : v < 80 ? 2 : 3);

  // ---------- componenti ----------
  function field(label, control, hint, path) {
    return `<div class="field"><label${path ? ` for="${fid(path)}"` : ''}>${esc(label)}${hint ? ` <span class="hint">${esc(hint)}</span>` : ''}</label>${control}</div>`;
  }
  function numInput(path, attrs) {
    const v = getPath(path);
    return `<input type="number" inputmode="decimal" id="${fid(path)}" data-bind="${path}" value="${esc(v === undefined || v === null ? '' : v)}" ${attrs || ''}>`;
  }
  function textInput(path, attrs) {
    const v = getPath(path);
    return `<input type="text" id="${fid(path)}" data-bind="${path}" value="${esc(v === undefined || v === null ? '' : v)}" ${attrs || ''}>`;
  }
  function selectInput(path, options, attrs, placeholder) {
    const raw = getPath(path);
    const v = raw === undefined || raw === null ? '' : String(raw);
    const first = placeholder === false ? '' : `<option value="">${esc(t('common.select'))}</option>`;
    return `<select id="${fid(path)}" data-bind="${path}" ${attrs || ''}>${first}${options.map(([val, lab]) => `<option value="${esc(val)}"${String(val) === v ? ' selected' : ''}>${esc(lab)}</option>`).join('')}</select>`;
  }
  function block(n, key, body) {
    return `<section class="block"><div class="block-head"><span class="bn">${n}</span><div class="bt">${esc(t(key + '.title'))}<span class="bq">${esc(t(key + '.q'))}</span></div></div><div class="block-body">${body}</div></section>`;
  }
  function stepNav(label) {
    return `<div class="stepnav">
      ${S.step > 0 ? `<button type="button" class="btn ghost" data-action="back">${esc(t('nav.back'))}</button>` : '<span></span>'}
      <span class="stepnav-mid">${esc(t('nav.stepOf', { n: S.step, t: LAST_STEP }))} · ${esc(t('nav.saved'))}</span>
      <button type="button" class="btn primary" data-action="next">${esc(label || t('nav.next'))}</button>
    </div>`;
  }
  function scoreHTML(value, unit, name, cls, reco, bar, color) {
    return `<div class="val">${value}<span class="u">${unit}</span></div><div class="band"><div class="name ${cls}">${esc(name)}</div><div class="reco">${esc(reco)}</div></div>` +
      (bar === null ? '' : `<div class="bar"><i style="width:${Math.max(0, Math.min(100, bar))}%;background:${color}"></i></div>`);
  }
  function scoreOut(el, html) {
    if (!el) return;
    el.style.display = html ? 'flex' : 'none';
    el.innerHTML = html || '';
  }
  const toggleWarn = (sel, show) => { const el = $(sel); if (el) el.classList.toggle('show', !!show); };
  const authorsLine = () => (window.CCF_AUTHORS && window.CCF_AUTHORS.length
    ? `<p class="authors" style="margin-top:12px"><span class="mono">${esc(t('research.authors'))}:</span> ${esc(window.CCF_AUTHORS.join(', '))}</p>` : '');

  // ---------- passaggi ----------
  function stepIntro() {
    const cards = t('intro.cards').map(c => `<div class="icard"><div class="icard-t">${esc(c.t)}</div><p>${esc(c.d)}</p></div>`).join('');
    const resume = S.maxStep > 0 && S.consent ? `<div class="resume"><p>${esc(t('intro.resume', { step: t('steps')[S.maxStep] }))}</p><div class="actions">
        <button type="button" class="btn primary" data-action="go" data-step="${S.maxStep}">${esc(t('intro.resumeBtn'))}</button>
        <button type="button" class="btn ghost" data-action="restart">${esc(t('intro.restartBtn'))}</button></div></div>` : '';
    return `<section class="intro">
      <h2 class="sec">${esc(t('intro.title'))}</h2>
      <p class="lead">${esc(t('intro.lead'))}</p>
      ${resume}
      <div class="icards">${cards}</div>
      <p class="tip">${esc(t('intro.dataTip'))}</p>
      <div class="research">
        <div class="eyebrow">${esc(t('research.title'))}</div>
        <p>${esc(t('research.p1'))}</p><p>${esc(t('research.p2'))}</p><p>${esc(t('research.p3'))}</p>
        ${authorsLine()}
      </div>
      <div class="consent">
        <label class="check"><input type="checkbox" data-bind="consent"${S.consent ? ' checked' : ''}><span>${esc(t('consent.label'))}</span></label>
        <button type="button" class="linkbtn" data-action="privacy">${esc(t('consent.link'))}</button>
        <input type="text" class="hp" name="website" data-bind="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
      </div>
      <div class="stepnav">
        <a class="btn ghost" href="../">${esc(t('hero.v1'))}</a>
        <button type="button" class="btn primary" data-action="next" id="start-btn"${S.consent ? '' : ' disabled'}>${esc(t('consent.start'))}</button>
      </div>
      <p class="need" id="consent-need"${S.consent ? ' hidden' : ''}>${esc(t('consent.need'))}</p>
    </section>`;
  }

  function stepProfile() {
    const b = k => t('b1.' + k);
    const p = 'profile.';
    const regions = REGIONS.map(r => [r, r]).concat([['abroad', b('abroad')]]);
    const levels = b('dmsLevels').map((l, i) => {
      const on = String(S.profile.dms) === String(i);
      return `<label class="radiocard${on ? ' on' : ''}"><input type="radio" name="dms" value="${i}" data-bind="profile.dms"${on ? ' checked' : ''}>
        <span class="rc-n">${i}</span><span class="rc-b"><b>${esc(l.c)}</b><span>${esc(b('dmsAllows'))}: ${esc(l.a)}</span></span></label>`;
    }).join('');
    return block(1, 'b1', `
      <div class="grid2">
        ${field(b('orgName'), textInput(p + 'orgName', 'autocomplete="organization"'), b('localHint'), p + 'orgName')}
        ${field(b('siteName'), textInput(p + 'siteName'), b('localHint'), p + 'siteName')}
        ${field(b('orgType'), selectInput(p + 'orgType', entries(b('orgTypes'))), '', p + 'orgType')}
        ${field(b('sector'), selectInput(p + 'sector', entries(b('sectors'))), '', p + 'sector')}
        ${field(b('employees'), numInput(p + 'employees', 'min="1" step="1"'), '', p + 'employees')}
        ${field(b('region'), selectInput(p + 'region', regions), '', p + 'region')}
        ${field(b('shiftPct'), numInput(p + 'shiftPct', 'min="0" max="100" step="1"'), '', p + 'shiftPct')}
        ${field(b('pscl'), selectInput(p + 'pscl', entries(b('psclOpts'))), '', p + 'pscl')}
      </div>
      <fieldset class="radiocards"><legend>${esc(b('dmsTitle'))}</legend>${levels}</fieldset>
      <div class="warn" id="dms-warn">${esc(b('dmsWarn'))}</div>`) + stepNav();
  }

  function stepMNS() {
    const b = k => t('b2.' + k);
    return block(2, 'b2', `
      <div class="grid3">
        ${field(b('qe'), numInput('mns.qe', 'min="0" max="100" step="1"'), '', 'mns.qe')}
        ${field(b('qp'), numInput('mns.qp', 'min="0" max="100" step="1"'), '', 'mns.qp')}
        ${field(b('qr'), numInput('mns.qr', 'min="0" max="100" step="1"'), '', 'mns.qr')}
      </div>
      <div class="formula">${esc(b('formula'))}</div>
      <p class="sumline" id="mns-sum"></p>
      <div class="warn" id="mns-warn">${esc(b('sumWarn'))}</div>
      <div class="scoreout" id="mns-out"></div>
      <p class="note">${esc(b('note'))}</p>`) + stepNav();
  }

  function stepBaseline() {
    const b = k => t('b3.' + k);
    const c = b('cols'), pc = b('paramCols'), k = b('kpi');
    const rows = CCF.MODES.map(m => {
      const base = 'baseline.modes.' + m.id + '.';
      return `<tr><th scope="row">${esc(t('modes.' + m.id))}</th>
        <td>${numInput(base + 'n', `min="0" step="1" aria-label="${esc(c.n)}"`)}</td>
        <td>${numInput(base + 'oneWay', `min="0" step="0.1" data-ph="oneWay" aria-label="${esc(c.km)}"`)}</td>
        <td>${numInput(base + 'days', `min="0" max="366" step="1" data-ph="days" aria-label="${esc(c.days)}"`)}</td></tr>`;
    }).join('');
    const params = CCF.MODES.map(m => {
      const base = 'baseline.modes.' + m.id + '.';
      return `<tr><th scope="row">${esc(t('modes.' + m.id))}</th>
        <td>${numInput(base + 'e', `min="0" step="0.001" placeholder="${m.e}" aria-label="${esc(pc.e)}"`)}</td>
        <td>${numInput(base + 'o', `min="0" step="0.1" placeholder="${m.o}" aria-label="${esc(pc.o)}"`)}</td>
        <td>${numInput(base + 'k', `min="1" step="1" placeholder="${m.k}" aria-label="${esc(pc.k)}"`)}</td>
        <td>${numInput(base + 'phi', `min="0" step="1" placeholder="${CCF.PHI[m.carrier]}" aria-label="${esc(pc.phi)}"`)}</td>
        <td class="mono" id="lf-${m.id}"></td></tr>`;
    }).join('');
    return block(3, 'b3', `
      <div class="grid2">
        ${field(b('oneWay'), numInput('baseline.oneWay', 'min="0" step="0.1"'), '', 'baseline.oneWay')}
        ${field(b('days'), numInput('baseline.days', 'min="0" max="366" step="1"'), b('daysHint'), 'baseline.days')}
      </div>
      <p class="lead small">${esc(b('lead'))}</p>
      <div class="tablewrap"><table class="grid-table">
        <thead><tr><th>${esc(c.mode)}</th><th>${esc(c.n)}</th><th>${esc(c.km)}</th><th>${esc(c.days)}</th></tr></thead>
        <tbody>${rows}</tbody></table></div>
      <p class="sumline" id="bl-sum"></p>
      <details class="params"><summary>${esc(b('params'))}</summary>
        <p class="note">${esc(b('paramsNote'))}</p>
        <div class="tablewrap"><table class="grid-table">
          <thead><tr><th>${esc(c.mode)}</th><th>${esc(pc.e)}</th><th>${esc(pc.o)}</th><th>${esc(pc.k)}</th><th>${esc(pc.phi)}</th><th>${esc(pc.lf)}</th></tr></thead>
          <tbody>${params}</tbody></table></div>
      </details>
      <div class="kpibox">
        <div class="kpitile"><div class="k">${esc(k.A)}</div><div class="v" id="kpi-A">—</div><div class="u">${esc(k.Aunit)}</div></div>
        <div class="kpitile"><div class="k">${esc(k.EI)}</div><div class="v" id="kpi-EI">—</div><div class="u">${esc(k.EIunit)}</div></div>
        <div class="kpitile"><div class="k">${esc(k.CI)}</div><div class="v" id="kpi-CI">—</div><div class="u">${esc(k.CIunit)}</div></div>
        <div class="kpitile"><div class="k">${esc(k.G)}</div><div class="v" id="kpi-G">—</div><div class="u">${esc(k.Gunit)}</div></div>
      </div>
      <p class="empty" id="bl-empty">${esc(b('empty'))}</p>
      <div class="formula">${esc(b('formula'))}</div>`) + stepNav();
  }

  function stepComposite(n, key, arr) {
    const rows = t(key + '.items').map(([label, opts], i) => {
      const path = arr + '.' + i;
      const options = opts.map((o, j) => [String(5 - j), (5 - j) + ' · ' + o]).concat([['nd', t('common.nd')]]);
      return `<div class="scorerow"><label class="lbl" for="${fid(path)}">${i + 1}. ${esc(label)}</label>${selectInput(path, options)}</div>`;
    }).join('');
    return block(n, key, `
      <div class="formula">${esc(t(key + '.formula'))}</div>
      ${rows}
      <p class="sumline" id="${arr}-cov"></p>
      <div class="warn" id="${arr}-low">${esc(t('common.lowRel'))}</div>
      <div class="scoreout" id="${arr}-out"></div>
      ${key === 'b5' ? `<p class="note">${esc(t('b5.joint'))}</p>` : ''}`) + stepNav();
  }

  function stepDiagnosis() {
    const b = k => t('b6.' + k);
    const bandOpts = BAND_RANGES.map((r, i) => [String(CCF.BAND_VALUES[i]), r + ' · ' + t('common.bands')[i]]);
    const rows = CODES.map(code => {
      const head = `<div class="diag-head"><span class="diag-code">${code}</span><span class="diag-name">${esc(b('names')[code])}</span><span class="diag-badge na" id="badge-${code}"></span></div>
        <p class="diag-desc">${esc(b('desc')[code])}</p>`;
      if (code === 'I2' || code === 'I3') {
        const cur = String(S.direct[code] || '');
        const opts = b('rubric')[code].map((txt, i) => {
          const on = cur === String(i + 1);
          return `<label class="rubric-opt${on ? ' on' : ''}"><input type="radio" name="direct-${code}" value="${i + 1}" data-bind="direct.${code}"${on ? ' checked' : ''}><span class="mono">${BAND_RANGES[i]}</span><span>${esc(txt)}</span></label>`;
        }).join('');
        return `<div class="diag-row direct" id="diag-${code}">${head}<p class="diag-hint" id="hint-${code}"></p>
          <fieldset class="rubric"><legend>${esc(b('direct'))}</legend>${opts}</fieldset>
          <div class="diag-override">${textInput('directNotes.' + code, `placeholder="${esc(b('notePh'))}" aria-label="${esc(b('notePh'))}"`)}</div></div>`;
      }
      return `<div class="diag-row" id="diag-${code}">${head}<p class="diag-why" id="why-${code}"></p>
        <div class="diag-override"><label for="${fid('overrides.' + code + '.value')}">${esc(b('correct'))}</label>
        ${selectInput('overrides.' + code + '.value', [['', b('auto')]].concat(bandOpts), '', false)}
        ${textInput('overrides.' + code + '.note', `placeholder="${esc(b('reason'))}" aria-label="${esc(b('reason'))}"`)}</div></div>`;
    }).join('');
    return block(6, 'b6', `<p class="lead small">${esc(b('lead'))}</p>${rows}<div class="scoreout" id="prev-out"></div><p class="note">${esc(b('observedNote'))}</p>`) + stepNav();
  }

  function stepInterventions() {
    const b = k => t('b7.' + k);
    const iv = R.interventions;
    let body = `<p class="lead small">${esc(b('lead'))}</p>`;
    if (iv.dataFirst) body += `<div class="warn show">${esc(b('dataFirst').replace('{d}', R.dms.effective))}</div>`;
    if (!iv.observed.length) body += `<p class="empty">${esc(b('noObserved'))}</p>`;
    iv.observed.slice().sort((x, y) => R.diagnosis[y].value - R.diagnosis[x].value).forEach(code => {
      const dx = R.diagnosis[code];
      body += `<div class="family"><div class="family-head"><span class="diag-code">${code}</span><span class="diag-name">${esc(t('b6.names')[code])}</span>
        <span class="diag-badge b${dx.band}">${dx.value}/100 · ${esc(t('common.bands')[dx.band - 1])}</span></div>
        ${iv.list.filter(x => x.ineff === code).map(interventionCard).join('')}</div>`;
    });
    body += `<div class="formula">${esc(b('formula'))}</div><p class="note">${esc(b('bandsNote'))}</p>`;
    return block(7, 'b7', body) + stepNav();
  }

  function interventionCard(x) {
    const b = k => t('b7.' + k);
    const base = 'interventions.' + x.id + '.';
    const u = S.interventions[x.id] || {};
    const head = `<div class="ihead"><label class="check"><input type="checkbox" data-bind="${base}selected" data-rerender${x.selected ? ' checked' : ''}>
      <span class="iname">${esc(t('interventions.' + x.id))}</span></label><span class="role ${x.role}">${esc(b(x.role))}</span></div>`;
    if (!x.selected) return `<div class="intv off" id="intv-${x.id}">${head}</div>`;
    let lever = '';
    if (x.scenario) {
      const pct = CCF.num(u.leverPct) !== null ? u.leverPct : Math.round(x.scenario.lever * 100);
      lever = `<div class="lever"><label for="${fid(base + 'leverPct')}" id="lever-label-${x.id}"></label>
        <div class="lever-in"><input type="number" inputmode="decimal" id="${fid(base + 'leverPct')}" data-bind="${base}leverPct" min="0" max="100" step="1" value="${esc(pct)}"><span class="mono">%</span></div></div>`;
    }
    const q = (dim, dir) => `<div class="qcard"><label class="q-txt" for="${fid(base + dim)}">${esc(b('qs')[dim])} <span class="tagdir ${dir}">${esc(b(dir))}</span></label>
      <select id="${fid(base + dim)}" data-bind="${base}${dim}"><option value="">${esc(t('common.select'))}</option>${b('answers')[dim].map((a, i) => `<option value="${i + 1}">${esc(a)}</option>`).join('')}</select>
      <div class="q-sub" id="sub-${x.id}-${dim}"></div></div>`;
    return `<div class="intv" id="intv-${x.id}">${head}<div class="qbody">${lever}<p class="estimate" id="est-${x.id}"></p>
      ${q('impact', 'up')}${q('data', 'up')}${q('acc', 'up')}${q('cost', 'down')}${q('gcs', 'down')}</div><div class="ipiout pending" id="ipi-${x.id}"></div></div>`;
  }

  function stepResults() {
    R.interventions.ranked.forEach(x => { if (!S.monitoring[x.id]) S.monitoring[x.id] = { freq: 'semiannual', owner: 'mm' }; });
    return `<section class="results"><h2 class="sec">${esc(t('results.title'))}</h2><p class="lead">${esc(t('results.lead'))}</p>
      <div class="report">${reportHTML(false)}</div>${stepNav(t('results.toFeedback'))}</section>`;
  }

  function reportHTML(print) {
    const r = t('results');
    const B = R.baseline, D = R.diagnosis, IV = R.interventions;
    const title = [S.profile.orgName, S.profile.siteName].filter(Boolean).join(' — ') || r.untitled;
    const date = new Date().toLocaleDateString(lang === 'it' ? 'it-IT' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
    const tile = (lab, val, sub, cls) => `<div class="rep-score ${cls || ''}"><div class="rs-lab">${esc(lab)}</div><div class="rs-val">${val}</div><div class="rs-band">${esc(sub || '')}</div></div>`;
    const rowsN = B.rows.filter(x => x.n > 0);
    const low = t('common.lowReliability');

    // 1 · baseline report (blocchi 1 e 3)
    let s1 = `<div class="rep-scores">
      ${tile(r.dmsDeclared, R.dms.declared === null ? '—' : R.dms.declared + '/5', '')}
      ${tile(r.dmsEffective, R.dms.effective === null ? '—' : R.dms.effective + '/5', R.dms.lowReliability.length ? low + ': ' + R.dms.lowReliability.join(', ') : '', R.dms.dataFirst ? 'crit' : '')}
      ${tile(t('b3.kpi.G'), fmt(B.tCO2e, 1), t('b3.kpi.Gunit'))}</div>`;
    if (B.complete) {
      s1 += `<div class="tablewrap"><table class="rep-table"><thead><tr><th>${esc(r.cols.mode)}</th><th>${esc(r.cols.n)}</th><th>${esc(r.cols.share)}</th><th>${esc(r.cols.paxkm)}</th><th>${esc(r.cols.g)}</th></tr></thead><tbody>
        ${rowsN.map(x => `<tr><td>${esc(t('modes.' + x.id))}</td><td>${fmt(x.n)}</td><td>${fmt(x.n / B.N * 100, 1)}%</td><td>${fmt(x.A)}</td><td>${fmt(x.G / 1e6, 1)}</td></tr>`).join('')}
        </tbody><tfoot><tr><td>${esc(r.total)}</td><td>${fmt(B.N)}</td><td>100%</td><td>${fmt(B.A)}</td><td>${fmt(B.tCO2e, 1)}</td></tr></tfoot></table></div>`;
    } else s1 += `<p class="empty">${esc(t('b3.empty'))}</p>`;

    // 2 · quadro diagnostico (blocchi 2, 4, 5, 6)
    const bandCol = v => (v <= 40 ? 'var(--signal)' : v <= 60 ? 'var(--lime)' : 'var(--coral)');
    const items = CODES.map(c => D[c]).sort((a, b) => (b.value === null ? -1 : b.value) - (a.value === null ? -1 : a.value));
    let s2 = items.map(x => `<div class="rep-ineff-item"><span class="ri-code">${x.code}</span>
      <span class="ri-name">${esc(t('b6.names')[x.code])}${x.overridden ? ` <em class="tag">${esc(t('b6.corrected'))}</em>` : ''}</span>
      <span class="ri-bar"><i style="width:${x.value === null ? 0 : x.value}%;background:${bandCol(x.value || 0)}"></i></span>
      <span class="ri-val">${x.value === null ? esc(t('common.notAvailable')) : x.value + ' · ' + esc(t('common.bands')[x.band - 1])}</span></div>`).join('');
    const compSub = (c, key) => (c.value === null ? '' : t(key + '.bands')[fourBand(c.value)].name + (c.reliable ? '' : ' · ' + low));
    s2 += `<div class="rep-h sub">${esc(r.causal)}</div><div class="rep-scores">
      ${tile('MNS', R.mns.valid ? fmt(R.mns.value, 0) + '/100' : '—', R.mns.valid ? mnsBand(R.mns.value).name : '')}
      ${tile('ACC', R.acc.value === null ? '—' : fmt(R.acc.value, 0) + '/100', compSub(R.acc, 'b4'))}
      ${tile('CDR', R.cdr.value === null ? '—' : fmt(R.cdr.value, 0) + '/100', compSub(R.cdr, 'b5'))}</div>`;

    // 3 · dashboard, equazioni (2)–(7)
    let s3 = '';
    if (B.complete) {
      s3 += `<div class="tablewrap"><table class="rep-table"><thead><tr><th>${esc(r.cols.mode)}</th><th>${esc(r.cols.ei)}</th><th>${esc(r.cols.lf)}</th><th>${esc(r.cols.ci)}</th><th>${esc(r.cols.g)}</th></tr></thead><tbody>
        ${rowsN.map(x => `<tr><td>${esc(t('modes.' + x.id))}</td><td>${fmt(x.EI, 3)}</td><td>${fmt(x.LF * 100, 0)}%</td><td>${fmt(x.CI, 0)}</td><td>${fmt(x.G / 1e6, 1)}</td></tr>`).join('')}
        </tbody></table></div>`;
    }
    const acrSub = R.acr ? r.acrText.replace('{p}', fmt(R.acr.ACR * 100, 0)).replace('{d}', fmt(R.acr.daysNow, 1)).replace('{n}', fmt(R.acr.daysNeeded, 1)) : r.acrNa;
    s3 += `<div class="rep-scores">
      ${tile(r.ciSys, fmt(B.CI, 0), t('b3.kpi.CIunit'))}
      ${tile(r.eiSys, fmt(B.EI, 3), t('b3.kpi.EIunit'))}
      ${tile(r.acr, R.acr ? fmt(R.acr.ACR * 100, 0) + '%' : '—', acrSub)}</div>`;
    const estimated = IV.list.filter(x => x.selected && x.estimate.estimable).sort((a, b) => b.estimate.dG - a.estimate.dG);
    if (estimated.length) {
      s3 += `<div class="rep-h sub">${esc(r.dg)}</div>` + estimated.map(x => `<div class="rep-ipi-row"><span class="rname">${esc(t('interventions.' + x.id))}</span>
        <span class="rnum small">${fmt(x.estimate.dG / 1e6, 1)} tCO₂e · ${fmt(x.dGpct, 1)}%</span></div>`).join('');
    }

    // 4 · piano di intervento (blocchi 7 e 8) e monitoraggio
    let s4 = '';
    if (IV.dataFirst) s4 += `<div class="rep-ipi-row d0"><span class="rank">#0</span><span class="rname">${esc(r.d0)}<span class="rsub">${esc(r.d0note)}</span></span><span class="prio A">DMS</span></div>`;
    if (!IV.ranked.length) s4 += `<p class="empty">${esc(IV.observed.length ? r.planEmpty : t('b7.noObserved'))}</p>`;
    s4 += IV.ranked.map((x, i) => `<div class="rep-ipi-row"><span class="rank">#${i + 1}</span>
      <span class="rname">${esc(t('interventions.' + x.id))}<span class="rsub">${x.ineff} · ${esc(t('b6.names')[x.ineff])} · ${esc(t('b7.' + x.role))}${x.governancePlan ? ' · ' + esc(t('b7.govPlan')) : ''}</span></span>
      <span class="rnum">${fmt(x.ipi, 1)}</span><span class="prio ${x.cls}">${x.cls}</span></div>`).join('');
    if (IV.ranked.length) {
      const cells = IV.ranked.map(x => {
        const m = S.monitoring[x.id] || { freq: 'semiannual', owner: 'mm' };
        const freq = print ? esc(r.freq[m.freq]) : selectInput('monitoring.' + x.id + '.freq', entries(r.freq), `aria-label="${esc(r.monitorCols.freq)}"`, false);
        const owner = print ? esc(r.owners[m.owner]) : selectInput('monitoring.' + x.id + '.owner', entries(r.owners), `aria-label="${esc(r.monitorCols.owner)}"`, false);
        return `<tr><td>${esc(t('interventions.' + x.id))}</td><td>${esc(r.indicators[CCF.MONITORING[x.ineff]])}</td><td>${freq}</td><td>${owner}</td></tr>`;
      }).join('');
      s4 += `<div class="rep-h sub">${esc(r.monitor)}</div><div class="tablewrap"><table class="rep-table monitor"><thead><tr><th>${esc(r.monitorCols.intv)}</th><th>${esc(r.monitorCols.ind)}</th><th>${esc(r.monitorCols.freq)}</th><th>${esc(r.monitorCols.owner)}</th></tr></thead><tbody>${cells}</tbody></table></div>
        <p class="note">${esc(r.systemInd)} ${esc(r.review)}</p>`;
    }

    return `<div class="rep-head"><div class="rep-eyebrow">${esc(r.eyebrow)}</div><div class="rep-title">${esc(title)}</div>
        <div class="rep-date">${esc(r.generated.replace('{date}', date).replace('{v}', CCF.VERSION))}</div></div>
      <div class="rep-section"><div class="rep-h">${esc(r.s1)}</div>${s1}</div>
      <div class="rep-section"><div class="rep-h">${esc(r.s2)}</div>${s2}</div>
      <div class="rep-section"><div class="rep-h">${esc(r.s3)}</div>${s3}</div>
      <div class="rep-section"><div class="rep-h">${esc(r.s4)}</div>${s4}</div>
      <div class="rep-foot">${esc(r.foot)}</div>`;
  }

  function stepFeedback() {
    if (S.code) return thanksHTML();
    const f = k => t('feedback.' + k);
    const likert = entries(f('items')).map(([k, label]) => {
      const cur = String(S.feedback[k] || '');
      return `<fieldset class="likert"><legend>${esc(label)}</legend><div class="likert-opts">
        ${[1, 2, 3, 4, 5].map(v => `<label title="${esc(f('scale')[v - 1])}"><input type="radio" name="fb-${k}" value="${v}" data-bind="feedback.${k}"${cur === String(v) ? ' checked' : ''}><span>${v}</span></label>`).join('')}
        </div><div class="likert-ends"><span>1 · ${esc(f('scale')[0])}</span><span>5 · ${esc(f('scale')[4])}</span></div></fieldset>`;
    }).join('');
    const yesNo = (k, textKey) => {
      const cur = S.feedback[k] || '';
      const opts = [['yes', t('common.yes')], ['no', t('common.no')]].map(([v, l]) =>
        `<label><input type="radio" name="fb-${k}" value="${v}" data-bind="feedback.${k}" data-rerender${cur === v ? ' checked' : ''}><span>${esc(l)}</span></label>`).join('');
      const more = cur === 'yes' ? `<textarea data-bind="feedback.${k}text" rows="2" placeholder="${esc(f(textKey))}" aria-label="${esc(f(textKey))}">${esc(S.feedback[k + 'text'] || '')}</textarea>` : '';
      return `<fieldset class="yn"><legend>${esc(f(k))}</legend><div class="yn-opts">${opts}</div>${more}</fieldset>`;
    };
    const email = S.contact.ok ? field(f('email'), `<input type="email" id="${fid('contact.email')}" data-bind="contact.email" value="${esc(S.contact.email)}" autocomplete="email">`, '', 'contact.email') + `<p class="note">${esc(f('contactNote'))}</p>` : '';
    return `<section class="block"><div class="block-head"><span class="bn">✓</span><div class="bt">${esc(f('title'))}<span class="bq">${esc(f('q'))}</span></div></div><div class="block-body">
      <p class="lead small">${esc(f('lead'))}</p>
      ${likert}${yesNo('c1', 'c1text')}${yesNo('c2', 'c2text')}
      <div class="grid2" style="margin-top:14px">
        ${field(f('role'), selectInput('feedback.role', entries(f('roles'))), '', 'feedback.role')}
        ${field(f('experience'), selectInput('feedback.experience', entries(f('exp'))), '', 'feedback.experience')}
      </div>
      ${field(f('channel'), selectInput('feedback.channel', entries(f('channels'))), '', 'feedback.channel')}
      <div class="field"><label for="${fid('feedback.open')}">${esc(f('open'))}</label><textarea id="${fid('feedback.open')}" data-bind="feedback.open" rows="3">${esc(S.feedback.open || '')}</textarea></div>
      <div class="contact"><label class="check"><input type="checkbox" data-bind="contact.ok" data-rerender${S.contact.ok ? ' checked' : ''}><span>${esc(f('contact'))}</span></label>${email}</div>
      <div class="warn" id="fb-msg" role="alert"></div>
    </div></section>
    <div class="stepnav"><button type="button" class="btn ghost" data-action="back">${esc(t('nav.back'))}</button><span></span>
      <button type="button" class="btn primary" data-action="submit" id="submit-btn">${esc(f('submit'))}</button></div>`;
  }

  function thanksHTML() {
    const k = key => t('thanks.' + key);
    return `<section class="thanks"><h2 class="sec">${esc(k('title'))}</h2><p class="lead">${esc(k('body'))}</p>
      <p class="code mono">${esc(k('code').replace('{code}', S.code))}</p><p class="note">${esc(k('codeNote'))}</p>
      <div class="actions" style="margin-top:18px"><button type="button" class="btn primary" data-action="print">${esc(k('download'))}</button>
      <button type="button" class="btn ghost" data-action="newrun">${esc(k('newRun'))}</button></div>
      <p class="note">${esc(k('printHint'))}</p></section>`;
  }

  const STEPS = [stepIntro, stepProfile, stepMNS, stepBaseline,
    () => stepComposite(4, 'b4', 'acc'), () => stepComposite(5, 'b5', 'cdr'),
    stepDiagnosis, stepInterventions, stepResults, stepFeedback];

  // ---------- output live (senza ridisegnare i campi) ----------
  function updateOutputs() {
    switch (S.step) {
      case 0: {
        const btn = $('#start-btn'); if (btn) btn.disabled = !S.consent;
        const need = $('#consent-need'); if (need) need.hidden = !!S.consent;
        break;
      }
      case 1:
        $$('.radiocard').forEach(l => l.classList.toggle('on', l.querySelector('input').checked));
        toggleWarn('#dms-warn', S.profile.dms !== '' && Number(S.profile.dms) < 2);
        break;
      case 2: mnsOutputs(); break;
      case 3: baselineOutputs(); break;
      case 4: compositeOutputs('acc', 'b4'); break;
      case 5: compositeOutputs('cdr', 'b5'); break;
      case 6: diagnosisOutputs(); break;
      case 7: interventionOutputs(); break;
      default: break;
    }
  }

  function mnsOutputs() {
    const m = R.mns;
    const any = ['qe', 'qp', 'qr'].some(k => S.mns[k] !== '');
    const sum = $('#mns-sum'); if (sum) sum.textContent = any ? t('b2.sum', { sum: fmt(m.sum, 0) }) : '';
    toggleWarn('#mns-warn', any && !m.valid);
    if (!m.valid) return scoreOut($('#mns-out'), '');
    const band = mnsBand(m.value);
    scoreOut($('#mns-out'), scoreHTML(fmt(m.value, 0), '/100', band.name, m.value < 50 ? 'good' : m.value < 80 ? 'mid' : 'crit', band.reco, m.value, 'var(--signal)'));
  }

  function baselineOutputs() {
    const B = R.baseline;
    $$('[data-ph]').forEach(el => { el.placeholder = S.baseline[el.dataset.ph] || ''; });
    const tot = CCF.num(S.profile.employees);
    const sum = $('#bl-sum');
    if (sum) {
      const ok = tot ? Math.abs(B.N - tot) <= Math.max(1, tot * 0.05) : null;
      sum.innerHTML = esc(t('b3.sumCheck', { sum: fmt(B.N), tot: tot ? fmt(tot) : '—' })) +
        (tot && B.N ? ` · <span class="${ok ? 'ok' : 'bad'}">${esc(ok ? t('b3.sumOk') : t('b3.sumDiff'))}</span>` : '');
    }
    B.rows.forEach(row => { const c = $('#lf-' + row.id); if (c) c.textContent = row.LF === null ? '—' : fmt(row.LF * 100, 0) + '%'; });
    const set = (id, v) => { const el = $('#' + id); if (el) el.textContent = v; };
    set('kpi-A', B.complete ? fmt(B.A / 1e6, 2) : '—');
    set('kpi-EI', B.complete ? fmt(B.EI, 3) : '—');
    set('kpi-CI', B.complete ? fmt(B.CI, 0) : '—');
    set('kpi-G', B.complete ? fmt(B.tCO2e, 1) : '—');
    const empty = $('#bl-empty'); if (empty) empty.hidden = B.complete;
  }

  function compositeOutputs(arr, key) {
    const c = R[arr];
    const cov = $('#' + arr + '-cov');
    if (cov) cov.textContent = t('common.coverage', { a: c.answered, t: c.total }) + (c.pending ? ' · ' + t('common.pending', { n: c.pending }) : '');
    toggleWarn('#' + arr + '-low', c.value !== null && !c.reliable);
    if (c.value === null) return scoreOut($('#' + arr + '-out'), '');
    const idx = fourBand(c.value), band = t(key + '.bands')[idx];
    const cls = arr === 'acc' ? ['crit', 'mid', 'good', 'good'][idx] : ['good', 'mid', 'crit', 'crit'][idx];
    const color = arr === 'acc' ? (c.value >= 60 ? 'var(--signal)' : 'var(--coral)') : 'var(--coral)';
    scoreOut($('#' + arr + '-out'), scoreHTML(fmt(c.value, 0), '/100', band.name, cls, band.reco, c.value, color));
  }

  function diagnosisOutputs() {
    const D = R.diagnosis;
    CODES.forEach(code => {
      const x = D[code];
      const badge = $('#badge-' + code);
      if (badge) {
        badge.className = 'diag-badge ' + (x.value === null ? 'na' : 'b' + x.band);
        badge.textContent = x.value === null ? t('common.notAvailable') : `${x.value}/100 · ${t('common.bands')[x.band - 1]}${!x.direct && !x.reliable ? ' · ' + t('common.lowReliability') : ''}`;
      }
      const row = $('#diag-' + code); if (row) row.classList.toggle('edited', x.overridden);
      const why = $('#why-' + code);
      if (why) {
        if (x.derived === null) why.textContent = t('b6.missing.' + code);
        else {
          const src = { I1: R.cdr.value, I4: R.acc.value, I5: R.mns.value }[code];
          let txt = t('b6.why.' + code, { v: fmt(src, 0) });
          if (x.coherenceRule) txt += ' ' + t('b6.rule', { d: fmt(R.baseline.daysWeek, 1) });
          if (x.overridden) txt += ` · ${t('b6.corrected')}: ${x.derived} → ${x.value}`;
          why.textContent = txt;
        }
      }
    });
    const h2 = $('#hint-I2');
    if (h2) { const sh = R.baseline.rows.find(r => r.id === 'shuttle'); h2.textContent = sh && sh.n > 0 ? t('b6.hints.I2', { n: fmt(sh.n) }) : t('b6.hints.I2none'); }
    const h3 = $('#hint-I3');
    if (h3) {
      const label = (arr, key) => {
        const v = S[arr][3];
        if (v === '' || v === undefined) return '—';
        if (v === 'nd') return t('common.notAvailable');
        return t(key + '.items')[3][1][5 - Number(v)];
      };
      h3.textContent = t('b6.hints.I3', { a: label('acc', 'b4'), b: label('cdr', 'b5'), c: S.profile.shiftPct !== '' ? S.profile.shiftPct + '%' : '—' });
    }
    $$('.rubric-opt').forEach(l => l.classList.toggle('on', l.querySelector('input').checked));
    const p = R.prevailing;
    scoreOut($('#prev-out'), p.length ? `<div class="band"><div class="reco">${esc(t('b6.prevailing'))}</div><div class="name crit">${p.map(c => `${c} · ${esc(t('b6.names')[c])} (${D[c].value}/100)`).join(' · ')}</div></div>` : '');
  }

  function interventionOutputs() {
    const b = k => t('b7.' + k);
    R.interventions.list.forEach(x => {
      const card = $('#intv-' + x.id);
      if (!card || !x.selected) return;
      const e = x.estimate;
      const lab = $('#lever-label-' + x.id);
      if (lab && x.scenario) {
        const sc = x.scenario;
        lab.textContent = sc.type === 'shift' ? b('lever').shift.replace('{to}', t('modes.' + (e.target || sc.to[0])))
          : sc.type === 'cut' ? b('lever').cut
          : sc.base === 'acr' ? b('lever').avoid_acr.replace('{acr}', R.acr ? fmt(R.acr.ACR * 100, 0) : '—') : b('lever').avoid_total;
      }
      const est = $('#est-' + x.id);
      if (est) {
        if (!e.estimable) est.textContent = b('reasons')[e.reason] || '';
        else if (e.dG <= 0) est.textContent = b('estimateNeg').replace('{t}', fmt(e.dG / 1e6, 1));
        else est.textContent = b('estimate').replace('{t}', fmt(e.dG / 1e6, 1)).replace('{p}', fmt(x.dGpct, 1)).replace('{i}', x.impactProposed);
        est.classList.toggle('muted', !e.estimable);
      }
      const setSelect = (dim, value, marker, maxAllowed) => {
        const sel = $(`#${fid('interventions.' + x.id + '.' + dim)}`);
        if (!sel) return;
        sel.value = value === null || value === undefined ? '' : String(value);
        Array.from(sel.options).forEach(o => {
          if (!o.value) return;
          const i = Number(o.value);
          o.textContent = b('answers')[dim][i - 1] + (marker === i ? ' · ' + b('proposed') : '');
          o.disabled = !!(maxAllowed && i > maxAllowed);
        });
      };
      setSelect('impact', x.impact, x.impactProposed);
      setSelect('data', x.data, null, x.dataCap ? 2 : 0);
      setSelect('acc', x.acc);
      setSelect('cost', x.cost);
      setSelect('gcs', x.gcs, x.gcsDefault);
      const sub = (dim, text, alert) => { const el = $(`#sub-${x.id}-${dim}`); if (el) { el.textContent = text; el.classList.toggle('alert', !!alert); } };
      sub('impact', x.impactOverridden && x.impactProposed !== null ? `${b('proposed')}: ${x.impactProposed}/5` : '');
      sub('data', x.dataCap ? b('capped') : '');
      sub('gcs', x.governancePlan ? b('govPlan') : '', true);
      const out = $('#ipi-' + x.id);
      if (out) {
        if (x.ipi === null) { out.className = 'ipiout pending'; out.innerHTML = `<span class="verdict">${esc(b('incomplete'))}</span>`; }
        else { out.className = 'ipiout'; out.innerHTML = `<span class="num">${fmt(x.ipi, 1)}</span><span class="prio ${x.cls}">${esc(b('priority'))} ${x.cls}</span><span class="verdict">${esc(b('cls')[x.cls])}</span>`; }
      }
    });
  }

  // ---------- rendering e navigazione ----------
  function renderChrome() {
    document.documentElement.lang = lang;
    document.title = t('meta.title');
    const md = $('meta[name="description"]'); if (md) md.setAttribute('content', t('meta.description'));
    $$('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n, { v: CCF.VERSION }); });
    $$('.lang button').forEach(btn => btn.setAttribute('aria-pressed', String(btn.dataset.lang === lang)));
  }

  function renderStepper() {
    const names = t('steps');
    $('#stepper').innerHTML = '<ol>' + names.map((name, i) => {
      const cur = i === S.step;
      const enabled = i === 0 || (S.consent && i <= S.maxStep);
      return `<li><button type="button" data-action="go" data-step="${i}"${cur ? ' aria-current="step"' : ''} class="${!cur && enabled && i <= S.maxStep ? 'done' : ''}"${enabled ? '' : ' disabled'}><span class="n">${i}</span><span class="l">${esc(name)}</span></button></li>`;
    }).join('') + '</ol>';
    const cur = $('#stepper [aria-current="step"]');
    const list = $('#stepper ol');
    if (cur && list) list.scrollLeft = cur.parentElement.offsetLeft - list.clientWidth / 2 + cur.clientWidth / 2;
  }

  function render() {
    R = evaluate();
    renderChrome();
    renderStepper();
    $('#app').innerHTML = STEPS[S.step]();
    updateOutputs();
  }

  function goTo(step) {
    step = Math.max(0, Math.min(LAST_STEP, step));
    if (step > 0 && !S.consent) return;
    const now = Date.now();
    S.timings[S.step] = Math.round((S.timings[S.step] || 0) + (now - enteredAt) / 1000);
    enteredAt = now;
    S.step = step;
    S.maxStep = Math.max(S.maxStep, step);
    if (!S.reached[step]) { S.reached[step] = true; beacon(step); }
    persist();
    render();
    const top = $('#stepper').offsetTop;
    if (window.scrollY > top) window.scrollTo(0, top);
    if (step === RESULTS_STEP) sendAssessment(false);
  }

  function reset() {
    store.clear();
    S = fresh();
    enteredAt = Date.now();
    persist();
    render();
    window.scrollTo(0, 0);
  }

  // ---------- eventi ----------
  function onInput(e) {
    const el = e.target.closest('[data-bind]');
    if (!el || el.type === 'radio' || el.type === 'checkbox' || el.tagName === 'SELECT') return;
    setPath(el.dataset.bind, el.value);
    afterChange(false);
  }

  function onChange(e) {
    const el = e.target.closest('[data-bind]');
    if (!el) return;
    const path = el.dataset.bind;
    let value = el.type === 'checkbox' ? el.checked : el.value;
    // Scegliere il valore proposto dal framework non è una correzione: resta automatico.
    const m = path.match(/^interventions\.(\w+)\.(impact|gcs)$/);
    if (m) {
      const x = R.interventions.list.find(i => i.id === m[1]);
      const ref = x ? (m[2] === 'impact' ? x.impactProposed : x.gcsDefault) : null;
      if (ref !== null && String(ref) === String(value)) value = '';
    }
    setPath(path, value);
    afterChange(el.hasAttribute('data-rerender'));
  }

  function afterChange(rerender) {
    R = evaluate();
    persist();
    if (rerender) { const y = window.scrollY; render(); window.scrollTo(0, y); }
    else updateOutputs();
  }

  function onClick(e) {
    const el = e.target.closest('[data-action]');
    if (!el) return;
    const a = el.dataset.action;
    if (a === 'next') goTo(S.step + 1);
    else if (a === 'back') goTo(S.step - 1);
    else if (a === 'go') goTo(Number(el.dataset.step));
    else if (a === 'privacy') openPrivacy();
    else if (a === 'closePrivacy') $('#privacy').close();
    else if (a === 'restart') { if (window.confirm(t('intro.restartConfirm'))) reset(); }
    else if (a === 'newrun') { if (window.confirm(t('thanks.newConfirm'))) reset(); }
    else if (a === 'print') printReport();
    else if (a === 'submit') submitFeedback();
  }

  function setLang(l) {
    if (l === lang) return;
    lang = l;
    persist();
    render();
    if ($('#privacy').open) openPrivacy();
  }

  // ---------- informativa e richieste ----------
  function openPrivacy() {
    const p = k => t('privacy.' + k);
    const dlg = $('#privacy');
    dlg.innerHTML = `<div class="dlg"><div class="dlg-head"><h2 id="privacy-title">${esc(p('title'))}</h2><button type="button" class="dlg-x" data-action="closePrivacy" aria-label="${esc(p('close'))}">×</button></div>
      <div class="dlg-body">${p('sections').map(([h, txt]) => `<h3>${esc(h)}</h3><p>${esc(txt)}</p>`).join('')}
        ${authorsLine()}
        <form class="request" id="request-form" novalidate><h3>${esc(p('requestTitle'))}</h3>
          <div class="grid2">
            <div class="field"><label for="rq-code">${esc(p('requestCode'))}</label><input id="rq-code" name="code" type="text" value="${esc(S.code || '')}"></div>
            <div class="field"><label for="rq-kind">${esc(p('requestKind'))}</label><select id="rq-kind" name="kind">${entries(p('requestKinds')).map(([v, l]) => `<option value="${v}">${esc(l)}</option>`).join('')}</select></div>
          </div>
          <div class="field"><label for="rq-message">${esc(p('requestMessage'))}</label><textarea id="rq-message" name="message" rows="3"></textarea></div>
          <div class="field"><label for="rq-email">${esc(p('requestEmail'))}</label><input id="rq-email" name="email" type="email" autocomplete="email"></div>
          <input type="text" name="website" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="actions"><button type="submit" class="btn primary">${esc(p('requestSend'))}</button></div>
          <p class="note" id="rq-out" role="status"></p>
        </form></div>
      <div class="dlg-foot"><button type="button" class="btn ghost" data-action="closePrivacy">${esc(p('close'))}</button></div></div>`;
    if (!dlg.open) { if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', ''); }
  }

  async function sendRequest(form) {
    const out = $('#rq-out');
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    if (!EMAIL_RE.test(email)) { out.textContent = t('privacy.requestError'); return; }
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    const ok = await post('requests', { code: data.get('code'), kind: data.get('kind'), message: data.get('message'), email }, data.get('website')).catch(() => false);
    btn.disabled = false;
    out.textContent = ok ? t('privacy.requestSent') : t('privacy.requestError');
    if (ok) form.reset();
  }

  // ---------- invio dati ----------
  async function post(type, row, honeypot) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ type, row, hp: honeypot || S.hp || '' })
    });
    const data = await res.json();
    return !!(data && data.ok);
  }

  function beacon(step) {
    if (!S.consent || !navigator.sendBeacon) return;
    try {
      const body = JSON.stringify({ type: 'progress', row: { sid: S.sid, step, version: CCF.VERSION, lang }, hp: S.hp || '' });
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
      profile: { orgType: p.orgType, sector: p.sector, employees: p.employees, region: p.region, shiftPct: p.shiftPct, pscl: p.pscl, dms: p.dms },
      mns: S.mns, baseline: S.baseline, acc: S.acc, cdr: S.cdr, direct: S.direct, directNotes: S.directNotes,
      overrides: S.overrides, interventions: S.interventions, monitoring: S.monitoring
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

  // Invia la valutazione quando si arriva ai risultati; se nel frattempo è cambiata, ne invia una nuova revisione.
  async function sendAssessment(required) {
    if (!S.consent) return true;
    R = evaluate();
    if (!R.baseline.complete && !R.prevailing.length) return true;
    const row = assessmentRow();
    const h = hash(row.inputs_json + row.results_json);
    if (h === S.sentHash) return true;
    row.rev = S.rev + 1;
    const ok = await post('assessments', row).catch(() => false);
    if (ok) { S.rev = row.rev; S.sentHash = h; persist(); }
    if (!ok && required) throw new Error('assessment');
    return ok;
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

  async function submitFeedback() {
    const f = S.feedback, msg = $('#fb-msg'), btn = $('#submit-btn');
    const show = text => { msg.textContent = text; msg.classList.add('show'); };
    if (['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'c1', 'c2', 'role', 'experience'].some(k => !f[k])) return show(t('feedback.required'));
    if (S.contact.ok && !EMAIL_RE.test((S.contact.email || '').trim())) return show(t('feedback.invalidEmail'));
    msg.classList.remove('show');
    btn.disabled = true;
    btn.textContent = t('feedback.sending');
    try {
      await sendAssessment(true);
      if (!(await post('feedback', feedbackRow()))) throw new Error('feedback');
      if (S.contact.ok) await post('contacts', { lang, email: S.contact.email.trim(), interview_consent: true }).catch(() => false);
      S.code = S.sid;
      S.contact.email = '';   // dopo l'invio l'email non resta salvata nel browser
      persist();
      render();
      printReport();
    } catch (err) {
      btn.disabled = false;
      btn.textContent = t('feedback.submit');
      show(t('feedback.error'));
    }
  }

  function fillPrint() {
    R = evaluate();
    $('#print-root').innerHTML = `<div class="report">${reportHTML(true)}</div>`;
  }

  function printReport() {
    fillPrint();
    setTimeout(() => window.print(), 60);
  }

  // ---------- avvio ----------
  document.addEventListener('click', onClick);
  $('#app').addEventListener('input', onInput);
  $('#app').addEventListener('change', onChange);
  $$('.lang button').forEach(btn => btn.addEventListener('click', () => setLang(btn.dataset.lang)));
  document.addEventListener('submit', e => { if (e.target.id === 'request-form') { e.preventDefault(); sendRequest(e.target); } });
  window.addEventListener('beforeprint', fillPrint);
  window.addEventListener('pagehide', () => {
    S.timings[S.step] = Math.round((S.timings[S.step] || 0) + (Date.now() - enteredAt) / 1000);
    enteredAt = Date.now();
    store.save(S);
  });

  if (S.step > 0 && !S.consent) S.step = 0;
  render();
})();
