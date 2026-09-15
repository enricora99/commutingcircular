// Test del backend Apps Script (_backend/Code.js) con un foglio simulato in memoria.
// Uso: node --test _dev/tests/backend.test.js
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function makeSheet(name) {
  const sh = {
    name, data: [], maxRows: 1000, maxCols: 26,
    getMaxColumns: () => sh.maxCols,
    insertColumnsAfter: (n, k) => { sh.maxCols += k; },
    getName: () => sh.name, setName: n => { sh.name = n; },
    getLastRow: () => { for (let i = sh.data.length - 1; i >= 0; i--) if (sh.data[i] && sh.data[i].some(v => v !== '' && v !== undefined && v !== null)) return i + 1; return 0; },
    getLastColumn: () => Math.max(0, ...sh.data.map(r => (r ? r.length : 0))),
    getMaxRows: () => sh.maxRows,
    insertRowAfter: () => { sh.maxRows += 1; },
    insertRowsAfter: (n, k) => { sh.maxRows += k; },
    deleteRow: r => sh.deleteRows(r, 1),
    deleteRows: (r, k) => {
      if (r === 2 && r + k - 1 >= sh.maxRows) throw new Error('Sorry, it is not possible to delete all non-frozen rows.');
      sh.data.splice(r - 1, k); sh.maxRows -= k;
    },
    appendRow: values => { const at = sh.getLastRow(); sh.data[at] = values.slice(); if (at + 1 > sh.maxRows) sh.maxRows = at + 1; },
    setFrozenRows() {}, setFrozenColumns() {}, setColumnWidths() {}, setColumnWidth() {},
    clear: () => { sh.data = []; },
    getRange(a, b, c, d) {
      let row, col, nr = 1, nc = 1;
      if (typeof a === 'string') { row = Number(a.replace(/[A-Z]+/, '')); col = a.charCodeAt(0) - 64; }
      else { row = a; col = b; nr = c || 1; nc = d || 1; }
      if (row + nr - 1 > sh.maxRows) throw new Error('The coordinates of the range are outside the dimensions of the sheet.');
      const rng = {
        getRow: () => row,
        getValue: () => ((sh.data[row - 1] || [])[col - 1] ?? ''),
        getDisplayValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => String((sh.data[row - 1 + i] || [])[col - 1 + j] ?? ''))),
        getValues: () => Array.from({ length: nr }, (_, i) => Array.from({ length: nc }, (_, j) => ((sh.data[row - 1 + i] || [])[col - 1 + j] ?? ''))),
        setFormulas: vals => { vals.forEach((r, i) => { const t = sh.data[row - 1 + i] || (sh.data[row - 1 + i] = []); r.forEach((v, j) => { if (v !== '') t[col - 1 + j] = v; }); }); return rng; },
        setValues: vals => { vals.forEach((r, i) => { const t = sh.data[row - 1 + i] || (sh.data[row - 1 + i] = []); r.forEach((v, j) => { t[col - 1 + j] = v; }); }); return rng; },
        createTextFinder: value => ({ matchEntireCell: function () { return this; }, findAll: () => {
          const out = [];
          for (let i = 0; i < nr; i++) if (String(((sh.data[row - 1 + i] || [])[col - 1]) ?? '') === String(value)) out.push({ getRow: () => row + i });
          return out;
        } })
      };
      ['setFontWeight', 'setBackground', 'setWrap', 'setVerticalAlignment', 'setNumberFormat', 'setNotes', 'setFontSize', 'setFontColor', 'setHorizontalAlignment']
        .forEach(m => { rng[m] = () => rng; });
      return rng;
    }
  };
  return sh;
}

function load(existing) {
  const sheets = (existing || []).map(makeSheet);
  const ss = {
    tz: 'America/Los_Angeles',
    getSheetByName: n => sheets.find(s => s.name === n) || null,
    insertSheet: n => { const s = makeSheet(n); sheets.push(s); return s; },
    getSheets: () => sheets.slice(),
    deleteSheet: s => sheets.splice(sheets.indexOf(s), 1),
    active: null, setActiveSheet: s => { ss.active = s; },
    moveActiveSheet: pos => { sheets.splice(sheets.indexOf(ss.active), 1); sheets.splice(pos - 1, 0, ss.active); },
    getSpreadsheetTimeZone: () => ss.tz, setSpreadsheetTimeZone: z => { ss.tz = z; }
  };
  const store = {};
  const ctx = {
    SpreadsheetApp: { getActiveSpreadsheet: () => ss, flush() {} },
    CacheService: { getScriptCache: () => ({ get: k => store[k] || null, put: (k, v) => { store[k] = v; } }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: s => ({ body: s, setMimeType() { return this; } }) },
    console
  };
  vm.createContext(ctx);
  const dir = path.join(__dirname, '..', '..', '_backend');
  vm.runInContext(fs.readFileSync(path.join(dir, 'labels.js'), 'utf8'), ctx);
  vm.runInContext(fs.readFileSync(path.join(dir, 'Code.js'), 'utf8'), ctx);
  const post = msg => JSON.parse(ctx.doPost({ postData: { contents: JSON.stringify(msg) } }).body);
  const rows = name => { const s = ss.getSheetByName(name); const head = s.data[0]; return s.data.slice(1, s.getLastRow()).map(r => Object.fromEntries(head.map((h, i) => [h, r[i]]))); };
  return { ctx, ss, post, rows };
}

let n = 0;
const response = (sid, rev, extra) => Object.assign({ id: 'msg' + (++n), type: 'response',
  row: { sid, rev, stage: 'results', lang: 'it', org_type: 'private', i1: 70, i1_source: 'override', i1_note: '=SOMMA(A1)', acc_reliable: false, inputs_json: '{"a":1}' },
  interventions: [{ intervention: 'i1_lf', selected: true, ipi: 8, class: 'B' }, { intervention: 'i1_carpool', selected: false }, { intervention: 'i4_equip', selected: true, ipi: 14, class: 'A' }],
  modes: [{ mode: 'car_solo', n: 120 }, { mode: 'bus', n: 40 }] }, extra || {});

test('lo schema si crea al primo invio e archivia le schede della prima versione', () => {
  const { ss, post } = load(['assessments', 'feedback', 'progress', 'contacts', 'requests', 'Foglio1']);
  ss.getSheetByName('assessments').data = [['received_at', 'sid'], ['x', 'TEST-OLD']];
  assert.deepStrictEqual(post({ id: 'p1', type: 'progress', row: { sid: 'CC-ABCDEFGH', step: 3, version: '2.0.0-beta.2', lang: 'it' } }), { ok: true });
  const names = ss.getSheets().map(s => s.name);
  assert.deepStrictEqual(names.slice(0, 8), ['riepilogo', 'risposte', 'interventi', 'mezzi', 'avanzamento', 'contatti', 'richieste', 'dizionario']);
  ['archivio_assessments', 'archivio_feedback', 'archivio_progress', 'archivio_contacts', 'archivio_requests'].forEach(a => assert.ok(names.includes(a), a));
  assert.ok(!names.includes('Foglio1'));
  assert.strictEqual(ss.getSheetByName('archivio_assessments').data[1][1], 'TEST-OLD');
  assert.strictEqual(ss.tz, 'Europe/Rome');
});

test('avanzamento: nome del capitolo e marcatura delle prove', () => {
  const { post, rows } = load();
  post({ id: 'p2', type: 'progress', row: { sid: 'TEST-ABCDEFGH', step: 7, version: 'v', lang: 'en' } });
  const r = rows('avanzamento')[0];
  assert.strictEqual(r.step_name, 'Cosa fare');
  assert.strictEqual(r.is_test, true);
});

test('risposte: una riga per analisi, aggiornata alla revisione più recente', () => {
  const { post, rows } = load();
  post(response('CC-AAAAAAAA', 1));
  const first = rows('risposte')[0].first_received_at;
  post(response('CC-BBBBBBBB', 1));
  post(response('CC-AAAAAAAA', 2, { row: { sid: 'CC-AAAAAAAA', rev: 2, stage: 'submitted', f1_understandable: 4, profile_shared: 'no' },
    interventions: [{ intervention: 'i1_lf', selected: true, ipi: 9, class: 'B' }], modes: [{ mode: 'car_solo', n: 100 }] }));
  const R = rows('risposte');
  assert.strictEqual(R.length, 2);
  const a = R.find(r => r.sid === 'CC-AAAAAAAA');
  assert.strictEqual(a.rev, 2);
  assert.strictEqual(a.stage, 'submitted');
  assert.strictEqual(a.f1_understandable, 4);
  assert.strictEqual(a.first_received_at, first);
  assert.strictEqual(a.is_test, false);
  const I = rows('interventi');
  assert.strictEqual(I.filter(r => r.sid === 'CC-AAAAAAAA').length, 1);
  assert.strictEqual(I.filter(r => r.sid === 'CC-BBBBBBBB').length, 3);
  assert.strictEqual(rows('mezzi').filter(r => r.sid === 'CC-AAAAAAAA').length, 1);
  assert.ok(I.every(r => r.intervention), 'nessuna riga vuota tra gli interventi');
});

test('una revisione vecchia arrivata in ritardo non sovrascrive quella nuova', () => {
  const { post, rows } = load();
  post(response('CC-CCCCCCCC', 3, { row: { sid: 'CC-CCCCCCCC', rev: 3, stage: 'submitted' } }));
  post(response('CC-CCCCCCCC', 2));
  assert.strictEqual(rows('risposte')[0].rev, 3);
  assert.strictEqual(rows('risposte')[0].stage, 'submitted');
});

test('sostituire tutte le righe di interventi e mezzi funziona anche a foglio pieno', () => {
  const { ss, post, rows } = load();
  post(response('CC-DDDDDDDD', 1));
  const iv = ss.getSheetByName('interventi');
  iv.maxRows = iv.getLastRow();                    // nessuna riga vuota in fondo
  post(response('CC-DDDDDDDD', 2));
  assert.strictEqual(rows('interventi').length, 3);
});

test('testi che sembrano formule vengono neutralizzati, i booleani restano booleani', () => {
  const { post, rows } = load();
  post(response('CC-EEEEEEEE', 1));
  const r = rows('risposte')[0];
  assert.strictEqual(r.i1_note, "'=SOMMA(A1)");
  assert.strictEqual(r.acc_reliable, false);
});

test('messaggi duplicati, sid non valido, contatti e formato della prima versione', () => {
  const { post, rows } = load();
  const m = response('CC-FFFFFFFF', 1);
  assert.deepStrictEqual(post(m), { ok: true });
  assert.deepStrictEqual(post(m), { ok: true, duplicate: true });
  assert.strictEqual(post(response('ciao', 1)).error, 'sid');
  assert.strictEqual(post({ id: 'c1', type: 'contacts', row: { email: 'non-valida' } }).error, 'email');
  post({ id: 'c2', type: 'contacts', row: { lang: 'it', email: 'a@b.it', interview_consent: true } });
  assert.strictEqual(rows('contatti')[0].email, 'a@b.it');
  post({ id: 'l1', type: 'assessments', row: { sid: 'CC-GGGGGGGG', rev: 1, i1: 50 } });
  assert.strictEqual(rows('archivio_assessments')[0].i1, 50);
});

test('i contatti registrano i motivi scelti e una colonna nuova allunga l\'intestazione esistente', () => {
  const { ss, post, rows } = load();
  post({ id: 'k1', type: 'contacts', row: { lang: 'it', email: 'a@b.it', interview_consent: true, updates: true, field_validation: false, collaboration: true } });
  const sh = ss.getSheetByName('contatti');
  sh.data[0] = sh.data[0].slice(0, 4);          // com'era la scheda prima delle nuove colonne
  post({ id: 'k2', type: 'contacts', row: { lang: 'it', email: 'c@d.it', updates: true, field_validation: true } });
  assert.deepStrictEqual(sh.data[0], ['received_at', 'lang', 'email', 'interview_consent', 'updates', 'field_validation', 'collaboration']);
  const r = rows('contatti');
  assert.strictEqual(r[0].collaboration, true);
  assert.strictEqual(r[0].field_validation, false);
  assert.strictEqual(r[1].field_validation, true);
  assert.strictEqual(r[1].interview_consent, '');
});

test('il dizionario descrive ogni colonna e il riepilogo usa solo colonne esistenti', () => {
  const { ctx, ss, post } = load();
  post({ id: 'p9', type: 'progress', row: { sid: 'CC-HHHHHHHH', step: 1, version: 'v', lang: 'it' } });
  const entries = vm.runInContext('dictionary_()', ctx);
  const cols = vm.runInContext('COLS', ctx);
  Object.keys(cols).forEach(tab => cols[tab].forEach(c => assert.ok(entries.some(e => e[0] === tab && e[1] === c), `${tab}.${c} senza descrizione`)));
  const formulas = ss.getSheetByName('riepilogo').data.map(r => r[1]).filter(v => typeof v === 'string' && v.startsWith('='));
  assert.ok(formulas.length > 30);
  formulas.forEach(f => assert.ok(!/undefined|NaN/.test(f), f));
});
