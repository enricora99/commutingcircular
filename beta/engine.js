/*
 * Circular Commuting Framework 2.0 — motore di calcolo.
 *
 * Implementa le equazioni (1)–(8) dell'articolo "A new energy-aware circular commuting
 * framework for corporate mobility management". Solo funzioni pure, senza DOM: lo stesso
 * file gira nel browser (window.CCF) e in Node per i test (_dev/tests).
 *
 * La versione viene salvata con ogni risposta, così i risultati restano riproducibili.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CCF = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const VERSION = '2.0.0-beta.1';

  const WORK_DAYS_YEAR = 220;         // giorni lavorativi di riferimento (tesi, esempio §6.4)
  const OBSERVED_THRESHOLD = 41;      // da fascia "media" in su un'inefficienza è osservata
  const RELIABILITY_SHARE = 0.7;      // tesi §6.3: sotto il 70% di voci disponibili, bassa affidabilità
  const HIGH_PRESENCE_DAYS_WEEK = 4;  // "presenza effettiva elevata" nella regola di coerenza su I5

  // Fattori well-to-wheel per vettore energetico (φ, gCO2e/kWh).
  // Elettricità: EEA (2023), mix italiano. Fossili: rapporto tra i punti medi della Tab. 2.1 della tesi.
  const PHI = { fossil: 262, diesel: 270, electricity: 233, none: 0 };

  // Parametri di veicolo di default: e = energia WTW per veicolo-km (kWh/vkm), o = occupanti medi,
  // k = capacità nominale. Scomposizione delle intensità per pax-km delle Tab. 2.1–2.2 della tesi
  // (ISPRA 2024, EEA 2023, UITP 2022). Moto ed e-bike non sono in tabella: valori indicativi.
  const MODES = [
    { id: 'car_solo', carrier: 'fossil',      e: 0.775, o: 1,    k: 5 },
    { id: 'car_pool', carrier: 'fossil',      e: 0.775, o: 2,    k: 5 },
    { id: 'car_ev',   carrier: 'electricity', e: 0.165, o: 1,    k: 5 },
    { id: 'moto',     carrier: 'fossil',      e: 0.30,  o: 1,    k: 2 },
    { id: 'shuttle',  carrier: 'diesel',      e: 2.875, o: 22.5, k: 50 },
    { id: 'bus',      carrier: 'diesel',      e: 4.6,   o: 24,   k: 80 },
    { id: 'bus_el',   carrier: 'electricity', e: 1.42,  o: 24,   k: 80 },
    { id: 'train',    carrier: 'electricity', e: 11.4,  o: 120,  k: 400 },
    { id: 'ebike',    carrier: 'electricity', e: 0.015, o: 1,    k: 1 },
    { id: 'active',   carrier: 'none',        e: 0,     o: 1,    k: 1 }
  ];

  // Matrice inefficienza-intervento (Tab. 1 del paper). Ogni cella è scomposta nelle singole misure,
  // perché l'IPI ordina i candidati dentro ciascuna famiglia.
  // gcs: GCS tipico (1–5). dataIntensive: richiede matrici O/D, turni o accessibilità TPL,
  // quindi con DMS < 2 il punteggio dati non può superare 2.
  // scenario: come stimare ΔG (eq. 6); null = non stimabile dai dati di una singola sede.
  const CATALOG = [
    { id: 'i1_lf',           ineff: 'I1', role: 'primary',       gcs: 3, dataIntensive: false, scenario: { type: 'shift', from: ['car_solo'], to: ['shuttle', 'bus'], lever: 0.05 } },
    { id: 'i1_carpool',      ineff: 'I1', role: 'primary',       gcs: 3, dataIntensive: true,  scenario: { type: 'shift', from: ['car_solo'], to: ['car_pool'], lever: 0.10 } },
    { id: 'i1_rightsize',    ineff: 'I1', role: 'complementary', gcs: 3, dataIntensive: false, scenario: { type: 'cut', mode: 'shuttle', lever: 0.20 } },
    { id: 'i1_ptdeal',       ineff: 'I1', role: 'complementary', gcs: 4, dataIntensive: true,  scenario: { type: 'shift', from: ['car_solo'], to: ['bus', 'train'], lever: 0.05 } },
    { id: 'i2_coord',        ineff: 'I2', role: 'primary',       gcs: 4, dataIntensive: true,  scenario: { type: 'cut', mode: 'shuttle', lever: 0.20 } },
    { id: 'i2_convert',      ineff: 'I2', role: 'complementary', gcs: 3, dataIntensive: true,  scenario: { type: 'shift', from: ['car_solo'], to: ['shuttle'], lever: 0.05 } },
    { id: 'i2_coalition',    ineff: 'I2', role: 'complementary', gcs: 5, dataIntensive: false, scenario: null },
    { id: 'i3_align',        ineff: 'I3', role: 'primary',       gcs: 2, dataIntensive: true,  scenario: { type: 'shift', from: ['car_solo'], to: ['bus', 'train'], lever: 0.05 } },
    { id: 'i3_ondemand',     ineff: 'I3', role: 'complementary', gcs: 3, dataIntensive: true,  scenario: { type: 'shift', from: ['car_solo'], to: ['shuttle'], lever: 0.05 } },
    { id: 'i3_stagger',      ineff: 'I3', role: 'complementary', gcs: 2, dataIntensive: true,  scenario: null },
    { id: 'i4_equip',        ineff: 'I4', role: 'primary',       gcs: 2, dataIntensive: false, scenario: { type: 'shift', from: ['car_solo'], to: ['active'], lever: 0.02 } },
    { id: 'i4_route',        ineff: 'I4', role: 'primary',       gcs: 4, dataIntensive: true,  scenario: { type: 'shift', from: ['car_solo'], to: ['active'], lever: 0.02 } },
    { id: 'i4_feeder',       ineff: 'I4', role: 'complementary', gcs: 3, dataIntensive: true,  scenario: { type: 'shift', from: ['car_solo'], to: ['train', 'bus'], lever: 0.05 } },
    { id: 'i4_micro',        ineff: 'I4', role: 'complementary', gcs: 3, dataIntensive: false, scenario: { type: 'shift', from: ['car_solo'], to: ['ebike'], lever: 0.03 } },
    { id: 'i5_remote',       ineff: 'I5', role: 'primary',       gcs: 2, dataIntensive: false, scenario: { type: 'avoid', base: 'acr', lever: 0.50 } },
    { id: 'i5_cowork',       ineff: 'I5', role: 'complementary', gcs: 3, dataIntensive: true,  scenario: { type: 'avoid', base: 'total', lever: 0.03 } },
    { id: 'i5_redistribute', ineff: 'I5', role: 'complementary', gcs: 2, dataIntensive: false, scenario: null }
  ];

  // Indicatore di monitoraggio per inefficienza (Governance & Feedback Layer).
  const MONITORING = { I1: 'load_factor', I2: 'service_overlap', I3: 'time_coverage', I4: 'active_access_share', I5: 'avoided_commuting' };

  const BAND_VALUES = [10, 30, 50, 70, 90];

  function num(v) {
    if (v === null || v === undefined || v === '') return null;
    const x = typeof v === 'string' ? parseFloat(v.replace(',', '.')) : Number(v);
    return Number.isFinite(x) ? x : null;
  }

  function band(v) {
    if (v === null || v === undefined) return null;
    return v <= 20 ? 1 : v <= 40 ? 2 : v <= 60 ? 3 : v <= 80 ? 4 : 5;
  }

  // Blocco 2 — Mobility Necessity Score.
  function computeMNS(qe, qp, qr) {
    const e = num(qe), p = num(qp), r = num(qr);
    const sum = (e || 0) + (p || 0) + (r || 0);
    if (e === null || p === null || r === null || Math.abs(sum - 100) > 0.5) return { value: null, valid: false, sum };
    return { value: ((e * 5 + p * 3 + r * 1) - 100) / 4, valid: true, sum };
  }

  // Blocco 3 — baseline energetico-emissiva, equazioni (1)–(5).
  function computeBaseline(input) {
    input = input || {};
    const defOneWay = num(input.oneWay);
    const defDays = num(input.days);
    const rows = [];
    let N = 0, A = 0, E = 0, G = 0, daysWeighted = 0;
    for (const m of MODES) {
      const src = (input.modes && input.modes[m.id]) || {};
      const n = Math.max(0, num(src.n) || 0);
      const oneWay = num(src.oneWay) ?? defOneWay;
      const g = num(src.days) ?? defDays;
      const e = num(src.e) ?? m.e;
      const o = num(src.o) ?? m.o;
      const k = num(src.k) ?? m.k;
      const phi = num(src.phi) ?? PHI[m.carrier];
      const d = oneWay !== null ? 2 * oneWay : null;              // d_m: distanza giornaliera andata e ritorno
      const a = n > 0 && d !== null && g !== null ? n * d * g : 0; // (1) A_m = N_m · d_m · g_m
      const ei = o > 0 ? e / o : null;                            // (2) EI_m = e_m / o_m
      const lf = k > 0 ? o / k : null;                            // (3) LF_m = o_m / k_m
      const ci = ei !== null ? ei * phi : null;                   // intensità emissiva di modo, gCO2e/pax-km
      const gm = ei !== null ? a * ei * phi : 0;                  // (4) G_m = A_m · EI_m · φ_m   [gCO2e]
      rows.push({ id: m.id, n, oneWay, d, g, e, o, k, phi, A: a, EI: ei, LF: lf, CI: ci, G: gm });
      N += n; A += a; E += a * (ei || 0); G += gm;
      if (n > 0 && g !== null) daysWeighted += n * g;
    }
    const gAvg = N > 0 && daysWeighted > 0 ? daysWeighted / N : null;
    return {
      rows, N, A, E, G,
      tCO2e: G / 1e6,
      CI: A > 0 ? G / A : null,     // (5) CI = Σ G_m / Σ A_m
      EI: A > 0 ? E / A : null,     // intensità energetica del sistema, kWh/pax-km
      gAvg,
      daysWeek: gAvg !== null ? gAvg * 5 / WORK_DAYS_YEAR : null,
      complete: A > 0
    };
  }

  // Blocchi 4 e 5 — score composito 0–100 da voci 1–5. "nd" = dato non disponibile:
  // il calcolo prosegue sulle voci presenti e sotto il 70% è dichiarato a bassa affidabilità.
  function computeComposite(items, key) {
    items = items || [];
    const answered = items.filter(v => v !== 'nd' && num(v) !== null).map(num);
    const nd = items.filter(v => v === 'nd').length;
    const total = items.length;
    const pending = total - answered.length - nd;
    const base = { key, answered: answered.length, nd, total, pending, complete: pending === 0 };
    if (!answered.length) return Object.assign(base, { value: null, share: 0, reliable: false });
    const avg = answered.reduce((s, v) => s + v, 0) / answered.length;
    const share = answered.length / total;
    return Object.assign(base, { value: (avg - 1) / 4 * 100, share, reliable: share >= RELIABILITY_SHARE });
  }

  // (7) ACR = A_ev / A. La domanda evitabile nasce dal confronto tra i giorni di presenza effettivi
  // (baseline) e quelli necessari secondo l'MNS (5 giorni × MNS/100): l'eccedenza è evitabile.
  function computeACR(baseline, mns) {
    if (!baseline || !baseline.complete || !mns || !mns.valid || !(baseline.daysWeek > 0)) return null;
    const needed = 5 * mns.value / 100;
    const now = baseline.daysWeek;
    const acr = Math.max(0, now - needed) / now;
    return { ACR: acr, Aev: acr * baseline.A, daysNow: now, daysNeeded: needed };
  }

  // Data Layer — il DMS dichiarato scende a 2 se uno score composito è a bassa affidabilità.
  function effectiveDMS(declared, composites) {
    const d = num(declared);
    const low = composites.filter(c => c && c.value !== null && !c.reliable).map(c => c.key);
    if (d === null) return { declared: null, effective: null, lowReliability: low, capped: false, dataFirst: false };
    const eff = low.length ? Math.min(d, 2) : d;
    return { declared: d, effective: eff, lowReliability: low, capped: eff < d, dataFirst: eff < 2 };
  }

  // Blocco 6 — Inefficiency Layer (Figura 2 del paper): MNS → I5, ACC → I4, CDR → I1;
  // I2 e I3 a valutazione diretta. Ogni valore derivato può essere corretto con motivazione.
  function diagnose(ctx) {
    const out = {};
    const overrides = ctx.overrides || {};
    const direct = ctx.direct || {};
    const put = (code, derived, meta) => {
      const ov = overrides[code];
      const ovValue = ov ? num(ov.value) : null;
      const value = ovValue !== null ? ovValue : derived;
      out[code] = Object.assign({ code, derived, value, band: band(value), overridden: ovValue !== null, note: ovValue !== null ? (ov.note || '') : '' }, meta);
    };

    const cdr = ctx.cdr, acc = ctx.acc, mns = ctx.mns;
    put('I1', cdr && cdr.value !== null ? Math.round(cdr.value) : null, { source: 'CDR', direct: false, reliable: !!(cdr && cdr.reliable) });

    ['I2', 'I3'].forEach(code => {
      const b = num(direct[code]);
      const value = b !== null && b >= 1 && b <= 5 ? BAND_VALUES[b - 1] : null;
      out[code] = { code, derived: null, value, band: band(value), overridden: false, note: '', source: 'direct', direct: true, reliable: value !== null };
    });

    put('I4', acc && acc.value !== null ? Math.round(100 - acc.value) : null, { source: 'ACC', direct: false, reliable: !!(acc && acc.reliable) });

    let i5 = null, rule = false;
    if (mns && mns.valid) {
      i5 = Math.round(100 - mns.value);
      const days = ctx.baseline ? ctx.baseline.daysWeek : null;
      // Regola di coerenza (tesi §6.3): MNS < 50 con presenza effettiva elevata → I5 almeno "alta".
      if (mns.value < 50 && days !== null && days >= HIGH_PRESENCE_DAYS_WEEK && i5 < 61) { i5 = 61; rule = true; }
    }
    put('I5', i5, { source: 'MNS', direct: false, reliable: !!(mns && mns.valid), coherenceRule: rule });

    return out;
  }

  function prevailing(diagnosis) {
    const vals = Object.values(diagnosis).filter(d => d.value !== null);
    if (!vals.length) return [];
    const max = Math.max(...vals.map(d => d.value));
    return vals.filter(d => d.value === max).map(d => d.code);
  }

  // (6) ΔG = G_0 − G_1, stimato come pax-km trasferiti o evitati × differenziale emissivo unitario.
  function deltaG(item, lever, baseline, acr) {
    const sc = item.scenario;
    if (!sc) return { estimable: false, reason: 'not_modelled' };
    if (!baseline || !baseline.complete || !(baseline.G > 0)) return { estimable: false, reason: 'no_baseline' };
    const lv = num(lever);
    const L = Math.max(0, Math.min(1, lv !== null ? lv : sc.lever));
    const row = id => baseline.rows.find(r => r.id === id);

    if (sc.type === 'shift') {
      const from = sc.from.map(row).filter(r => r && r.A > 0);
      const Afrom = from.reduce((s, r) => s + r.A, 0);
      if (!(Afrom > 0)) return { estimable: false, reason: 'no_source', lever: L };
      const Gfrom = from.reduce((s, r) => s + r.G, 0);
      const target = sc.to.map(row).find(r => r && r.n > 0) || row(sc.to[0]);
      const shifted = L * Afrom;
      return { estimable: true, dG: shifted * (Gfrom / Afrom - target.CI), lever: L, target: target.id, shifted };
    }
    if (sc.type === 'cut') {
      // Corse della navetta eliminate o ottimizzate: i passeggeri sono assorbiti dalla capacità
      // residua del TPL, con emissioni marginali trascurabili.
      const r = row(sc.mode);
      if (!r || !(r.G > 0)) return { estimable: false, reason: 'no_service', lever: L };
      return { estimable: true, dG: L * r.G, lever: L };
    }
    if (sc.type === 'avoid') {
      if (sc.base === 'acr') {
        if (!acr) return { estimable: false, reason: 'no_acr', lever: L };
        return { estimable: true, dG: L * acr.ACR * baseline.G, lever: L, acr: acr.ACR };
      }
      return { estimable: true, dG: L * baseline.G, lever: L };
    }
    return { estimable: false, reason: 'not_modelled' };
  }

  // Riduzione percentuale della baseline → punteggio di impatto 1–5 (fasce di prima applicazione).
  function impactFromPct(p) {
    if (p === null || p === undefined) return null;
    return p < 1 ? 1 : p < 3 ? 2 : p < 7 ? 3 : p < 15 ? 4 : 5;
  }

  // (8) IPI = (impatto × dati × accettabilità) / (costo × GCS), tutte le variabili su scala 1–5.
  function computeIPI(v) {
    const xs = [v.impact, v.data, v.acc, v.cost, v.gcs].map(num);
    if (xs.some(x => x === null || x < 1 || x > 5)) return null;
    const value = (xs[0] * xs[1] * xs[2]) / (xs[3] * xs[4]);
    return { value, cls: value > 12 ? 'A' : value >= 6 ? 'B' : 'C' };
  }

  // Blocchi 7–8 — Intervention Matching Layer. Un intervento entra tra i candidati solo se
  // corrisponde ad almeno un'inefficienza osservata.
  function evaluateInterventions(answers, diagnosis, baseline, acr, dms) {
    answers = answers || {};
    const observed = Object.values(diagnosis).filter(d => d.value !== null && d.value >= OBSERVED_THRESHOLD).map(d => d.code);
    const dataFirst = !!(dms && dms.dataFirst);
    const list = [];
    for (const item of CATALOG) {
      if (observed.indexOf(item.ineff) === -1) continue;
      const u = answers[item.id] || {};
      const selected = u.selected !== undefined ? !!u.selected : item.role === 'primary';
      const sc = deltaG(item, u.lever, baseline, acr);
      const dGpct = sc.estimable && baseline && baseline.G > 0 ? sc.dG / baseline.G * 100 : null;
      const impactProposed = sc.estimable ? impactFromPct(dGpct) : null;
      const impactOverride = num(u.impact);
      const impact = impactOverride !== null ? impactOverride : impactProposed;
      const dataCap = dataFirst && item.dataIntensive;
      let data = num(u.data);
      const dataCapped = dataCap && data !== null && data > 2;
      if (dataCapped) data = 2;
      const gcs = num(u.gcs) ?? item.gcs;
      const r = computeIPI({ impact, data, acc: u.acc, cost: u.cost, gcs });
      list.push({
        id: item.id, ineff: item.ineff, role: item.role, dataIntensive: item.dataIntensive,
        scenario: item.scenario, selected, estimate: sc, dGpct,
        impactProposed, impact, impactOverridden: impactOverride !== null && impactOverride !== impactProposed,
        data, dataCap, dataCapped, acc: num(u.acc), cost: num(u.cost),
        gcs, gcsDefault: item.gcs, governancePlan: gcs >= 4,
        ipi: r ? r.value : null, cls: r ? r.cls : null
      });
    }
    const ranked = list.filter(x => x.selected && x.ipi !== null).sort((a, b) => b.ipi - a.ipi);
    return { observed, list, ranked, dataFirst };
  }

  // Valutazione completa dello stato del Canvas.
  function evaluate(state) {
    state = state || {};
    const mns = computeMNS(state.mns && state.mns.qe, state.mns && state.mns.qp, state.mns && state.mns.qr);
    const baseline = computeBaseline(state.baseline);
    const acc = computeComposite(state.acc, 'ACC');
    const cdr = computeComposite(state.cdr, 'CDR');
    const acr = computeACR(baseline, mns);
    const dms = effectiveDMS(state.profile && state.profile.dms, [acc, cdr]);
    const diagnosis = diagnose({ mns, acc, cdr, baseline, direct: state.direct, overrides: state.overrides });
    const interventions = evaluateInterventions(state.interventions, diagnosis, baseline, acr, dms);
    return { version: VERSION, mns, baseline, acc, cdr, acr, dms, diagnosis, prevailing: prevailing(diagnosis), interventions };
  }

  return {
    VERSION, WORK_DAYS_YEAR, OBSERVED_THRESHOLD, RELIABILITY_SHARE, HIGH_PRESENCE_DAYS_WEEK,
    PHI, MODES, CATALOG, MONITORING, BAND_VALUES,
    num, band, computeMNS, computeBaseline, computeComposite, computeACR, effectiveDMS,
    diagnose, prevailing, deltaG, impactFromPct, computeIPI, evaluateInterventions, evaluate
  };
});
