// Test del motore di calcolo: node --test _dev/tests
// Riferimento principale: l'organizzazione tipo dell'esempio §6.4 della tesi (300 dipendenti).
const test = require('node:test');
const assert = require('node:assert/strict');
const CCF = require('../../beta/engine.js');

const close = (actual, expected, tol = 1e-6) =>
  assert.ok(Math.abs(actual - expected) <= tol * Math.max(1, Math.abs(expected)), `${actual} ≉ ${expected}`);

// Tab. 6.4 della tesi: modal split dell'organizzazione tipo.
const thesisBaseline = {
  oneWay: 18.7,
  days: 220,
  modes: {
    car_solo: { n: 186 },
    car_pool: { n: 18 },
    shuttle: { n: 60, oneWay: 18 },
    train: { n: 24 },
    active: { n: 12, oneWay: 4 }
  }
};

test('eq. (1)–(4) per modalità sull\'esempio della tesi', () => {
  const b = CCF.computeBaseline(thesisBaseline);
  const solo = b.rows.find(r => r.id === 'car_solo');
  close(solo.A, 186 * 37.4 * 220);               // (1)
  close(solo.EI, 0.775);                         // (2) con o = 1
  close(solo.LF, 0.2);                           // (3) 1 / 5
  close(solo.G, 186 * 37.4 * 220 * 0.775 * 262); // (4)

  const shuttle = b.rows.find(r => r.id === 'shuttle');
  close(shuttle.A, 60 * 36 * 220);
  close(shuttle.EI, 2.875 / 22.5);
  close(shuttle.LF, 0.45);                       // occupancy 45% come nella tesi
  close(shuttle.G, 60 * 36 * 220 * (2.875 / 22.5) * 270);

  const pool = b.rows.find(r => r.id === 'car_pool');
  close(pool.EI, solo.EI / 2);                   // stessa energia divisa per 2 occupanti
});

test('eq. (5): CI è la media delle intensità pesata sull\'attività', () => {
  const b = CCF.computeBaseline(thesisBaseline);
  const sumG = b.rows.reduce((s, r) => s + r.G, 0);
  const sumA = b.rows.reduce((s, r) => s + r.A, 0);
  close(b.CI, sumG / sumA);
  close(b.tCO2e, sumG / 1e6);
  assert.equal(b.N, 300);
  close(b.daysWeek, 5);
});

test('intensità coerenti con i punti medi della Tab. 2.1 della tesi', () => {
  const b = CCF.computeBaseline({ oneWay: 10, days: 220, modes: Object.fromEntries(CCF.MODES.map(m => [m.id, { n: 1 }])) });
  const ci = id => b.rows.find(r => r.id === id).CI;
  const ei = id => b.rows.find(r => r.id === id).EI;
  assert.ok(ei('car_solo') >= 0.65 && ei('car_solo') <= 0.90);
  assert.ok(ci('car_solo') >= 175 && ci('car_solo') <= 230);
  assert.ok(ei('car_pool') >= 0.33 && ei('car_pool') <= 0.45);
  assert.ok(ci('car_ev') >= 35 && ci('car_ev') <= 45);
  assert.ok(ei('bus') >= 0.17 && ei('bus') <= 0.22);           // TPL diesel, occupazione 30%
  assert.ok(ci('bus') >= 45 && ci('bus') <= 60);
  assert.ok(ei('bus_el') >= 0.05 && ei('bus_el') <= 0.07);     // TPL elettrico, occupazione 30%
  assert.ok(ci('train') >= 17 && ci('train') <= 29);
  assert.equal(ci('active'), 0);
});

test('MNS: formula e controllo della somma', () => {
  close(CCF.computeMNS(60, 30, 10).value, 75);
  close(CCF.computeMNS(100, 0, 0).value, 100);
  close(CCF.computeMNS(0, 0, 100).value, 0);
  assert.equal(CCF.computeMNS(50, 30, 10).valid, false);
});

test('eq. (7): ACR confronta presenza effettiva e presenza necessaria', () => {
  const b = CCF.computeBaseline(thesisBaseline);       // 5 giorni a settimana
  const acr = CCF.computeACR(b, CCF.computeMNS(60, 30, 10));   // necessari 3,75 giorni
  close(acr.ACR, 0.25);
  close(acr.Aev, 0.25 * b.A);
  // Chi fa già smart working oltre il necessario non ha domanda evitabile.
  const b2 = CCF.computeBaseline(Object.assign({}, thesisBaseline, { days: 132 }));  // 3 giorni
  close(CCF.computeACR(b2, CCF.computeMNS(60, 30, 10)).ACR, 0);
});

test('score compositi con dati mancanti: il calcolo prosegue e dichiara l\'affidabilità', () => {
  const full = CCF.computeComposite([5, 5, 5, 5, 5, 5, 5], 'ACC');
  close(full.value, 100);
  assert.equal(full.reliable, true);
  const partial = CCF.computeComposite([5, 4, 'nd', 'nd', 'nd', 3, 2], 'ACC');  // 4 su 7 = 57%
  close(partial.value, (3.5 - 1) / 4 * 100);
  assert.equal(partial.reliable, false);
  assert.equal(CCF.computeComposite(['nd', 'nd'], 'CDR').value, null);
});

test('DMS effettivo: bassa affidabilità lo porta a 2, DMS < 2 attiva la priorità dati', () => {
  const low = CCF.computeComposite([5, 4, 'nd', 'nd', 'nd', 3, 2], 'ACC');
  const dms = CCF.effectiveDMS(4, [low]);
  assert.equal(dms.effective, 2);
  assert.equal(dms.capped, true);
  assert.equal(dms.dataFirst, false);
  assert.equal(CCF.effectiveDMS(1, []).dataFirst, true);
});

test('diagnosi: I1 da CDR, I4 e I5 invertiti, I2 e I3 diretti, correzioni registrate', () => {
  const acc = CCF.computeComposite([2, 2, 2, 2, 2, 2, 2], 'ACC');   // 25
  const cdr = CCF.computeComposite([4, 4, 4, 4, 4], 'CDR');         // 75
  const mns = CCF.computeMNS(60, 30, 10);                           // 75
  const d = CCF.diagnose({ acc, cdr, mns, baseline: null, direct: { I2: 3, I3: 5 }, overrides: { I4: { value: 50, note: 'fermata a 200 m' } } });
  assert.equal(d.I1.value, 75);
  assert.equal(d.I2.value, 50);
  assert.equal(d.I3.value, 90);
  assert.equal(d.I4.derived, 75);
  assert.equal(d.I4.value, 50);
  assert.equal(d.I4.overridden, true);
  assert.equal(d.I5.value, 25);
  assert.deepEqual(CCF.prevailing(d), ['I3']);
});

test('regola di coerenza su I5: MNS < 50 e presenza elevata → almeno 61', () => {
  const b = CCF.computeBaseline(thesisBaseline);                    // 5 giorni a settimana
  const d = CCF.diagnose({ mns: CCF.computeMNS(20, 40, 40), baseline: b });  // MNS 40 → I5 derivato 60
  assert.equal(d.I5.value, 61);
  assert.equal(d.I5.coherenceRule, true);
});

test('eq. (6): ΔG per trasferimento modale, taglio di servizio e domanda evitata', () => {
  const b = CCF.computeBaseline(thesisBaseline);
  const solo = b.rows.find(r => r.id === 'car_solo');
  const pool = b.rows.find(r => r.id === 'car_pool');
  const carpool = CCF.CATALOG.find(c => c.id === 'i1_carpool');
  const est = CCF.deltaG(carpool, 0.10, b, null);
  close(est.dG, 0.10 * solo.A * (solo.CI - pool.CI));

  const shuttle = b.rows.find(r => r.id === 'shuttle');
  close(CCF.deltaG(CCF.CATALOG.find(c => c.id === 'i2_coord'), 0.2, b, null).dG, 0.2 * shuttle.G);

  const acr = CCF.computeACR(b, CCF.computeMNS(60, 30, 10));
  close(CCF.deltaG(CCF.CATALOG.find(c => c.id === 'i5_remote'), 0.5, b, acr).dG, 0.5 * 0.25 * b.G);

  assert.equal(CCF.deltaG(CCF.CATALOG.find(c => c.id === 'i2_coalition'), null, b, null).estimable, false);
  const noShuttle = CCF.computeBaseline({ oneWay: 10, days: 220, modes: { car_solo: { n: 10 } } });
  assert.equal(CCF.deltaG(CCF.CATALOG.find(c => c.id === 'i2_coord'), 0.2, noShuttle, null).reason, 'no_service');
});

test('eq. (8): IPI e classi A/B/C', () => {
  assert.equal(CCF.computeIPI({ impact: 5, data: 4, acc: 4, cost: 2, gcs: 2 }).cls, 'A');   // 20
  const b = CCF.computeIPI({ impact: 4, data: 3, acc: 4, cost: 2, gcs: 4 });               // 6
  close(b.value, 6);
  assert.equal(b.cls, 'B');
  assert.equal(CCF.computeIPI({ impact: 2, data: 2, acc: 2, cost: 4, gcs: 4 }).cls, 'C');
  assert.equal(CCF.computeIPI({ impact: 2, data: 2, acc: 2, cost: 4 }), null);
  assert.deepEqual([0.5, 2, 5, 10, 20].map(CCF.impactFromPct), [1, 2, 3, 4, 5]);
});

test('matching: solo interventi di inefficienze osservate; con DMS < 2 dati limitati a 2', () => {
  const b = CCF.computeBaseline(thesisBaseline);
  const diagnosis = CCF.diagnose({ direct: { I2: 1, I3: 4 } });  // I3 = 70, I2 = 10
  const dms = CCF.effectiveDMS(1, []);
  const res = CCF.evaluateInterventions({ i3_align: { data: 5, acc: 4, cost: 2 } }, diagnosis, b, null, dms);
  assert.deepEqual(res.observed, ['I3']);
  assert.ok(res.list.every(x => x.ineff === 'I3'));
  const align = res.list.find(x => x.id === 'i3_align');
  assert.equal(align.selected, true);           // i primari sono preselezionati
  assert.equal(align.data, 2);
  assert.equal(align.dataCapped, true);
  assert.equal(res.dataFirst, true);
  assert.equal(res.list.find(x => x.id === 'i3_stagger').selected, false);
});

test('evaluate: flusso completo senza errori anche con stato vuoto', () => {
  const empty = CCF.evaluate({});
  assert.equal(empty.baseline.complete, false);
  assert.deepEqual(empty.interventions.list, []);
  const full = CCF.evaluate({
    profile: { dms: 3 },
    mns: { qe: 60, qp: 30, qr: 10 },
    baseline: thesisBaseline,
    acc: [3, 2, 3, 2, 3, 3, 2],
    cdr: [4, 5, 4, 3, 4],
    direct: { I2: 3, I3: 4 },
    interventions: { i1_carpool: { data: 3, acc: 3, cost: 2 } }
  });
  assert.equal(full.version, CCF.VERSION);
  assert.ok(full.interventions.observed.includes('I1'));
  assert.ok(full.interventions.list.find(x => x.id === 'i1_carpool').impactProposed >= 1);
});
