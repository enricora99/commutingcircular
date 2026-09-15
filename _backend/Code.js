/**
 * @OnlyCurrentDoc
 *
 * Circular Commuting 2.0 beta — raccolta dei dati di validazione (schema 3).
 *
 * Web app anonima collegata al foglio "CCF 2.0 beta — Dati validazione". Il sito invia JSON in POST
 * (Content-Type text/plain, così il browser non fa preflight CORS). Il sito non legge la risposta:
 * gli basta il redirect, che Apps Script emette dopo aver eseguito doPost.
 *
 * Struttura del foglio, pensata per l'analisi:
 *  - riepilogo    indicatori calcolati con formule, ordinati per criterio di validazione
 *  - risposte     una riga per analisi (sid), aggiornata all'ultima revisione: profilo, indici, diagnosi, valutazione
 *  - interventi   una riga per intervento candidato di ogni analisi
 *  - mezzi        una riga per mezzo usato in ogni analisi
 *  - avanzamento  un evento per capitolo raggiunto, per misurare gli abbandoni
 *  - contatti     email facoltative, senza alcun collegamento alle risposte
 *  - richieste    richieste di accesso o cancellazione
 *  - dizionario   significato di ogni colonna e dei codici
 * Le schede della prima versione restano come "archivio_…".
 *
 * Privacy by design: il nome dell'organizzazione e della sede restano nel browser.
 */

var SCHEMA = 3;
var SCHEMA_TAG = '3.5';      // cambia quando dizionario o riepilogo vanno rigenerati
var TIME_ZONE = 'Europe/Rome';
var MAX_BODY = 100000;        // byte massimi per messaggio
var MAX_PER_WINDOW = 600;     // messaggi accettati ogni 10 minuti (freno contro gli abusi)
var SID_RE = /^(CC|TEST)-[A-Z0-9]{8}$/;

function range_(prefix, from, to) { var out = []; for (var i = from; i <= to; i++) out.push(prefix + i); return out; }

var COLS = {
  risposte: [].concat(
    ['first_received_at', 'updated_at', 'sid', 'is_test', 'rev', 'stage', 'engine_version', 'ui_version', 'lang', 'device', 'duration_sec'],
    ['org_type', 'sector', 'employees', 'region', 'shift_pct', 'pscl', 'dms_declared', 'dms_effective', 'low_reliability', 'data_first'],
    ['mns_essential_pct', 'mns_partial_pct', 'mns_remote_pct', 'mns', 'days_week'],
    ['one_way_km', 'employees_modal', 'modes_used', 'share_car_solo_pct', 'params_custom', 'pax_km', 'tco2e', 'ci_g_paxkm', 'ei_kwh_paxkm', 'acr', 'days_now', 'days_needed'],
    range_('acc_', 1, 7), ['acc', 'acc_answered', 'acc_nd', 'acc_reliable'],
    range_('cdr_', 1, 5), ['cdr', 'cdr_answered', 'cdr_nd', 'cdr_reliable'],
    ['i1', 'i1_derived', 'i1_source', 'i1_note', 'i2', 'i2_derived', 'i2_source', 'i2_note', 'i3', 'i3_derived', 'i3_source', 'i3_note',
      'i4', 'i4_derived', 'i4_source', 'i4_note', 'i5', 'i5_derived', 'i5_source', 'i5_note'],
    ['prevailing', 'observed', 'coherence_rule', 'radar_ci', 'radar_data', 'radar_gov'],
    ['candidates_n', 'preselected_n', 'selected_n', 'evaluated_n', 'selection_changed_n', 'impact_overridden_n', 'gcs_overridden_n', 'lever_changed_n',
      'data_capped_n', 'class_a_n', 'class_b_n', 'class_c_n', 'top1', 'top1_ipi', 'top1_class'],
    ['f1_understandable', 'f2_prevailing_matches', 'f3_plausible_link', 'f4_priority_useful', 'f5_data_available', 'f6_would_use'],
    ['c1_uncovered', 'c1_text', 'c2_overlap', 'c2_text', 'profile_shared', 'role', 'experience', 'channel', 'open_text', 'report_printed'],
    range_('t_ch', 1, 9), ['inputs_json', 'results_json']
  ),
  interventi: ['updated_at', 'sid', 'is_test', 'rev', 'stage', 'intervention', 'name', 'inefficiency', 'role', 'candidate_order', 'preselected', 'selected',
    'estimable', 'not_estimable_reason', 'lever_default', 'lever', 'dg_tco2e', 'dg_pct', 'impact_proposed', 'impact', 'impact_overridden',
    'gcs_default', 'gcs', 'gcs_overridden', 'data_intensive', 'data_cap', 'data_declared', 'data', 'data_capped', 'acceptance', 'cost',
    'ipi', 'class', 'plan_rank', 'monitoring_freq', 'monitoring_owner'],
  mezzi: ['updated_at', 'sid', 'is_test', 'rev', 'stage', 'mode', 'n', 'share_pct', 'one_way_km', 'distance_custom', 'days_year',
    'e_kwh_km', 'occupancy', 'capacity', 'phi_g_kwh', 'params_custom', 'pax_km', 'ei_kwh_paxkm', 'load_factor', 'ci_g_paxkm', 'tco2e'],
  avanzamento: ['received_at', 'sid', 'is_test', 'step', 'step_name', 'version', 'lang'],
  contatti: ['received_at', 'lang', 'email', 'interview_consent', 'updates', 'field_validation', 'collaboration'],
  richieste: ['received_at', 'code', 'kind', 'message', 'email']
};

// Messaggi della prima versione del sito (per esempio da una coda rimasta in un browser): finiscono nell'archivio.
var LEGACY = {
  assessments: {
    tab: 'archivio_assessments', cols: ['received_at', 'sid', 'rev', 'version', 'lang', 'duration_sec', 'org_type', 'sector', 'employees', 'region', 'shift_pct', 'pscl',
      'dms_declared', 'dms_effective', 'low_reliability', 'mns', 'acc', 'acc_answered', 'cdr', 'cdr_answered', 'employees_modal', 'pax_km', 'tco2e',
      'ci_g_paxkm', 'ei_kwh_paxkm', 'acr', 'i1', 'i2', 'i3', 'i4', 'i5', 'i1_overridden', 'i4_overridden', 'i5_overridden', 'prevailing', 'observed',
      'n_evaluated', 'top1', 'top1_ipi', 'top1_class', 'data_first', 'inputs_json', 'results_json']
  },
  feedback: {
    tab: 'archivio_feedback', cols: ['received_at', 'sid', 'version', 'lang', 'f1_understandable', 'f2_prevailing_matches', 'f3_plausible_link',
      'f4_priority_useful', 'f5_data_available', 'f6_would_use', 'c1_uncovered', 'c1_text', 'c2_overlap', 'c2_text', 'role', 'experience', 'channel', 'open_text']
  }
};
var TYPE_TAB = { progress: 'avanzamento', contacts: 'contatti', requests: 'richieste' };
var TAB_ORDER = ['riepilogo', 'risposte', 'interventi', 'mezzi', 'avanzamento', 'contatti', 'richieste', 'dizionario'];
var HEADER_COLOR = { risposte: '#D3EADF', interventi: '#E1EDF6', mezzi: '#ECE8F6', avanzamento: '#FAE7DA', contatti: '#F8F0D2', richieste: '#F8F0D2' };

/** Da eseguire dall'editor se serve rigenerare dizionario e riepilogo (le risposte non vengono toccate). */
function setup() {
  ensureSchema_(SpreadsheetApp.getActiveSpreadsheet(), true);
}

/**
 * Da eseguire a mano dall'editor quando serve: elimina le righe di prova, cioè quelle con sid o codice
 * che inizia con "TEST-" (le sessioni aperte con circularcommuting.it/beta/?test=1), in tutte le schede.
 */
function cleanupTests() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.getSheets().forEach(function (sh) {
    if (sh.getLastRow() < 2 || sh.getLastColumn() < 1) return;
    var head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
    var col = head.indexOf('sid') + 1 || head.indexOf('code') + 1;
    if (!col) return;
    var values = sh.getRange(2, col, sh.getLastRow() - 1, 1).getValues();
    for (var i = values.length - 1; i >= 0; i--) {
      if (String(values[i][0]).indexOf('TEST-') === 0) sh.deleteRow(i + 2);
    }
  });
  // nei contatti non c'è il sid: le prove usano indirizzi @example.com
  var ct = ss.getSheetByName('contatti');
  if (ct && ct.getLastRow() > 1) {
    var mails = ct.getRange(2, COLS.contatti.indexOf('email') + 1, ct.getLastRow() - 1, 1).getValues();
    for (var j = mails.length - 1; j >= 0; j--) {
      if (/@example\.com$/i.test(String(mails[j][0]))) ct.deleteRow(j + 2);
    }
  }
}

function doGet() {
  return json_({ ok: true, service: 'ccf-beta', schema: SCHEMA });
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > MAX_BODY) return json_({ ok: false, error: 'size' });
    var msg = JSON.parse(raw);
    if (msg.hp) return json_({ ok: true });                 // honeypot compilato: bot, fingiamo successo
    var known = msg.type === 'response' || TYPE_TAB[msg.type] || LEGACY[msg.type];
    if (!known || !msg.row || typeof msg.row !== 'object') return json_({ ok: false, error: 'type' });
    if (msg.type === 'contacts' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(msg.row.email || ''))) return json_({ ok: false, error: 'email' });
    if (msg.type === 'response' && !SID_RE.test(String(msg.row.sid || ''))) return json_({ ok: false, error: 'sid' });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      // Il sito ritenta gli invii non confermati: lo stesso id messaggio viene scritto una volta sola.
      var cache = CacheService.getScriptCache();
      var seenKey = msg.id ? 'm' + String(msg.id).slice(0, 40) : null;
      if (seenKey && cache.get(seenKey)) return json_({ ok: true, duplicate: true });
      if (!withinQuota_()) return json_({ ok: false, error: 'busy' });
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      ensureSchema_(ss, false);
      if (msg.type === 'response') upsertResponse_(ss, msg);
      else if (LEGACY[msg.type]) appendLegacy_(ss, msg);
      else appendSimple_(ss, msg);
      if (seenKey) cache.put(seenKey, '1', 21600);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
}

// ---------- scrittura ----------
function upsertResponse_(ss, msg) {
  var row = msg.row;
  var sid = String(row.sid);
  var isTest = sid.indexOf('TEST-') === 0;
  var now = new Date();
  var sh = sheet_(ss, 'risposte');
  var cols = COLS.risposte;
  var found = findRows_(sh, cols.indexOf('sid') + 1, sid);
  var target = found.length ? found[0] : 0;
  if (target) {
    var prevRev = Number(sh.getRange(target, cols.indexOf('rev') + 1).getValue()) || 0;
    if (Number(row.rev) < prevRev) return;                 // revisione più vecchia arrivata in ritardo: la ignoriamo
  }
  var first = target ? sh.getRange(target, 1).getValue() : now;
  var values = cols.map(function (h) {
    if (h === 'first_received_at') return first;
    if (h === 'updated_at') return now;
    if (h === 'is_test') return isTest;
    return safe_(row[h]);
  });
  if (target) sh.getRange(target, 1, 1, cols.length).setValues([values]);
  else sh.appendRow(values);

  var base = { updated_at: now, sid: sid, is_test: isTest, rev: row.rev, stage: row.stage };
  replaceRows_(ss, 'interventi', sid, (msg.interventions || []).slice(0, 40), base);
  replaceRows_(ss, 'mezzi', sid, (msg.modes || []).slice(0, 20), base);
}

function replaceRows_(ss, name, sid, rows, base) {
  var sh = sheet_(ss, name);
  var cols = COLS[name];
  var found = findRows_(sh, cols.indexOf('sid') + 1, sid);
  // Sheets non permette di eliminare tutte le righe non bloccate: teniamo sempre una riga vuota in fondo
  if (found.length && sh.getMaxRows() <= found[found.length - 1]) sh.insertRowAfter(sh.getMaxRows());
  // le righe della stessa analisi sono contigue: si tolgono a blocchi, dal basso
  for (var i = found.length - 1; i >= 0;) {
    var end = found[i], start = end;
    while (i > 0 && found[i - 1] === start - 1) { i--; start--; }
    sh.deleteRows(start, end - start + 1);
    i--;
  }
  if (!rows.length) return;
  var values = rows.map(function (r) {
    return cols.map(function (h) { return base.hasOwnProperty(h) ? safe_(base[h]) : safe_(r[h]); });
  });
  var start = sh.getLastRow() + 1;
  var missing = start + values.length - 1 - sh.getMaxRows();
  if (missing > 0) sh.insertRowsAfter(sh.getMaxRows(), missing + 200);
  sh.getRange(start, 1, values.length, cols.length).setValues(values);
}

function appendSimple_(ss, msg) {
  var name = TYPE_TAB[msg.type];
  var cols = COLS[name];
  var r = msg.row;
  var sid = String(r.sid || '');
  var values = cols.map(function (h) {
    if (h === 'received_at') return new Date();
    if (h === 'is_test') return sid.indexOf('TEST-') === 0;
    if (h === 'step_name') return LABELS.chapters[Number(r.step)] || '';
    return safe_(r[h]);
  });
  sheet_(ss, name).appendRow(values);
}

function appendLegacy_(ss, msg) {
  var L = LEGACY[msg.type];
  var sh = ss.getSheetByName(L.tab);
  if (!sh) {
    sh = ss.insertSheet(L.tab);
    sh.getRange(1, 1, 1, L.cols.length).setValues([L.cols]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  sh.appendRow(L.cols.map(function (h) { return h === 'received_at' ? new Date() : safe_(msg.row[h]); }));
}

function findRows_(sh, col, value) {
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, col, sh.getLastRow() - 1, 1).createTextFinder(value).matchEntireCell(true).findAll()
    .map(function (r) { return r.getRow(); }).sort(function (a, b) { return a - b; });
}

function withinQuota_() {
  var cache = CacheService.getScriptCache();
  var key = 'w' + Math.floor(Date.now() / 600000);
  var n = Number(cache.get(key) || 0);
  if (n >= MAX_PER_WINDOW) return false;
  cache.put(key, String(n + 1), 700);
  return true;
}

// I testi che iniziano con = + - @ verrebbero interpretati come formule: li neutralizziamo.
function safe_(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'number') return isFinite(v) ? v : '';
  if (typeof v === 'boolean') return v;
  if (v instanceof Date) return v;
  var s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  if (s.length > 45000) s = s.slice(0, 45000);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ---------- struttura del foglio ----------
function ensureSchema_(ss, force) {
  var cache = CacheService.getScriptCache();
  if (!force && cache.get('schema' + SCHEMA_TAG)) return;
  var dict = ss.getSheetByName('dizionario');
  var current = dict && String(dict.getRange('A1').getValue()).indexOf('schema ' + SCHEMA_TAG) >= 0;
  if (force || !current) {
    if (ss.getSpreadsheetTimeZone() !== TIME_ZONE) ss.setSpreadsheetTimeZone(TIME_ZONE);
    ['assessments', 'feedback', 'contacts', 'progress', 'requests'].forEach(function (name) {
      var old = ss.getSheetByName(name);
      if (old && !ss.getSheetByName('archivio_' + name)) old.setName('archivio_' + name);
    });
    Object.keys(COLS).forEach(function (name) { sheet_(ss, name); });
    var entries = dictionary_();
    writeDictionary_(ss, entries);
    writeSummary_(ss);
    Object.keys(COLS).forEach(function (name) { headerNotes_(ss.getSheetByName(name), name, entries); });
    orderTabs_(ss);
    ['Foglio1', 'Sheet1'].forEach(function (n) {
      var sh = ss.getSheetByName(n);
      if (sh && ss.getSheets().length > 1 && sh.getLastRow() === 0) ss.deleteSheet(sh);
    });
  }
  cache.put('schema' + SCHEMA_TAG, '1', 21600);
}

function sheet_(ss, name) {
  var sh = ss.getSheetByName(name);
  if (sh) { syncHeader_(sh, name); return sh; }
  sh = ss.insertSheet(name);
  var cols = COLS[name];
  var head = sh.getRange(1, 1, 1, cols.length);
  head.setValues([cols]).setFontWeight('bold').setBackground(HEADER_COLOR[name] || '#ECF5F0').setWrap(true).setVerticalAlignment('middle');
  sh.setFrozenRows(1);
  if (name === 'risposte') sh.setFrozenColumns(3);
  sh.setColumnWidths(1, cols.length, 130);
  ['first_received_at', 'updated_at', 'received_at'].forEach(function (h) {
    var i = cols.indexOf(h);
    if (i >= 0) sh.getRange(2, i + 1, sh.getMaxRows() - 1, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  });
  return sh;
}

/**
 * Quando allo schema si aggiungono colonne in fondo, allunga l'intestazione della scheda che esiste già.
 * Se l'intestazione è diversa dall'inizio non la tocca: le schede vecchie restano come sono.
 */
function syncHeader_(sh, name) {
  var cols = COLS[name];
  var n = Math.max(sh.getLastColumn(), 1);
  var head = sh.getRange(1, 1, 1, n).getValues()[0].map(String);
  while (head.length && head[head.length - 1] === '') head.pop();
  if (head.length >= cols.length && cols.every(function (c, i) { return head[i] === c; })) return;
  if (!head.every(function (h, i) { return h === cols[i]; })) return;
  if (sh.getMaxColumns() < cols.length) sh.insertColumnsAfter(sh.getMaxColumns(), cols.length - sh.getMaxColumns());
  sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold').setBackground(HEADER_COLOR[name] || '#ECF5F0').setWrap(true).setVerticalAlignment('middle');
}

function headerNotes_(sh, name, entries) {
  if (!sh) return;
  var map = {};
  entries.forEach(function (e) { if (e[0] === name) map[e[1]] = e[2] + (e[3] ? '\n\nValori: ' + e[3] : ''); });
  var cols = COLS[name];
  sh.getRange(1, 1, 1, cols.length).setNotes([cols.map(function (c) { return map[c] || ''; })]);
}

function orderTabs_(ss) {
  var pos = 1;
  TAB_ORDER.forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (!sh) return;
    ss.setActiveSheet(sh);
    ss.moveActiveSheet(pos++);
  });
  ss.getSheets().forEach(function (sh) {
    if (sh.getName().indexOf('archivio_') === 0) { ss.setActiveSheet(sh); ss.moveActiveSheet(ss.getSheets().length); }
  });
  ss.setActiveSheet(ss.getSheetByName('riepilogo'));
}

// ---------- dizionario ----------
function scaleText_(options) {
  return options.map(function (o, i) { return (options.length - i) + ' = ' + o; }).join('; ');
}
function codes_(obj) {
  return Object.keys(obj).map(function (k) { return k + ' = ' + obj[k]; }).join('; ');
}

function dictionary_() {
  var L = LABELS;
  var E = [];
  var add = function (tab, col, desc, values) { E.push([tab, col, desc, values || '']); };
  var R = 'risposte';
  add(R, 'first_received_at', 'Data e ora del primo invio di questa analisi (Europe/Rome).');
  add(R, 'updated_at', 'Data e ora dell\'ultima revisione ricevuta.');
  add(R, 'sid', 'Identificativo anonimo dell\'analisi, uguale al codice risposta mostrato alla fine.', 'CC-xxxxxxxx; TEST-xxxxxxxx per le prove');
  add(R, 'is_test', 'Analisi di prova, aperta con ?test=1. Da escludere dalle analisi.', 'TRUE / FALSE');
  add(R, 'rev', 'Numero di revisione: ogni modifica successiva ai risultati ne crea una nuova. Il foglio tiene l\'ultima.');
  add(R, 'stage', 'Punto raggiunto: results = arrivata ai risultati; submitted = valutazione finale inviata.', 'results; submitted');
  add(R, 'engine_version', 'Versione del motore di calcolo (beta/engine.js).');
  add(R, 'ui_version', 'Versione dell\'interfaccia.');
  add(R, 'lang', 'Lingua usata.', 'it; en');
  add(R, 'device', 'Tipo di schermo, dalla larghezza della finestra.', 'mobile < 760 px; tablet < 1180 px; desktop');
  add(R, 'duration_sec', 'Tempo attivo di compilazione, in secondi.');
  add(R, 'org_type', 'Tipo di organizzazione.', codes_(L.org_type));
  add(R, 'sector', 'Settore.', codes_(L.sector));
  add(R, 'employees', L.employees + ' (numero di persone).');
  add(R, 'region', L.region, '20 regioni; abroad = fuori Italia');
  add(R, 'shift_pct', L.shifts + ' (percentuale).', '0–100');
  add(R, 'pscl', L.pscl_q, codes_(L.pscl));
  add(R, 'dms_declared', 'Data Maturity Score dichiarato. ' + L.dms_q, L.dms.map(function (d, i) { return i + ' = ' + d; }).join('; '));
  add(R, 'dms_effective', 'DMS effettivo: scende a 2 se un indice composito ha meno del 70% di risposte (regola di affidabilità).', '0–5');
  add(R, 'low_reliability', 'Indici compositi sotto la soglia di affidabilità.', 'ACC; CDR (separati da spazio)');
  add(R, 'data_first', 'DMS effettivo sotto 2: il piano parte dalla costruzione della baseline e il punteggio dati degli interventi data-intensive è limitato a 2.', 'TRUE / FALSE');
  add(R, 'mns_essential_pct', L.mns.title + ' Quota: ' + L.mns.seg[0] + '.', '0–100');
  add(R, 'mns_partial_pct', 'Quota: ' + L.mns.seg[1] + '.', '0–100');
  add(R, 'mns_remote_pct', 'Quota: ' + L.mns.seg[2] + '.', '0–100');
  add(R, 'mns', 'Mobility Necessity Score calcolato dalle tre quote.', '0–100');
  add(R, 'days_week', L.days_week, '1–5');
  add(R, 'one_way_km', L.distance + ' (media della sede, km).');
  add(R, 'employees_modal', 'Persone ripartite tra i mezzi (N).');
  add(R, 'modes_used', 'Numero di mezzi con almeno una persona.');
  add(R, 'share_car_solo_pct', 'Quota di persone in auto da sole, dalla ripartizione modale.', '0–100');
  add(R, 'params_custom', 'Chi compila ha modificato i parametri tecnici di almeno un mezzo (consumo, occupazione, capacità, fattore emissivo).', 'TRUE / FALSE');
  add(R, 'pax_km', 'Passeggeri-km annui della sede (eq. 1).');
  add(R, 'tco2e', 'Emissioni annue della mobilità casa-lavoro, t CO2e (eq. 4).');
  add(R, 'ci_g_paxkm', 'Intensità emissiva media, g CO2e per passeggero-km (eq. 5).');
  add(R, 'ei_kwh_paxkm', 'Intensità energetica media, kWh per passeggero-km (eq. 2).');
  add(R, 'acr', 'Avoidable Commuting Ratio: quota di passeggeri-km evitabile (eq. 7).', '0–1');
  add(R, 'days_now', 'Giorni medi a settimana in sede oggi.');
  add(R, 'days_needed', 'Giorni a settimana necessari secondo il MNS (5 × MNS / 100).');
  L.acc.forEach(function (q, k) { add(R, 'acc_' + (k + 1), 'Accessibilità, voce ' + (k + 1) + ': ' + q.title, scaleText_(q.options) + '; nd = Non lo so'); });
  add(R, 'acc', 'Indice di accessibilità delle alternative all\'auto (ACC), dalle voci risposte.', '0–100, più alto = più accessibile');
  add(R, 'acc_answered', 'Voci ACC con una risposta diversa da «Non lo so».', '0–7');
  add(R, 'acc_nd', 'Voci ACC con «Non lo so».', '0–7');
  add(R, 'acc_reliable', 'ACC affidabile: almeno il 70% delle voci risposte.', 'TRUE / FALSE');
  L.cdr.forEach(function (q, k) { add(R, 'cdr_' + (k + 1), 'Dipendenza dall\'auto, voce ' + (k + 1) + ': ' + q.title, scaleText_(q.options) + '; nd = Non lo so' + (k === 3 ? '; na = senza turni, non chiesta' : '')); });
  add(R, 'cdr', 'Indice di dipendenza strutturale dall\'auto (CDR).', '0–100, più alto = più dipendente');
  add(R, 'cdr_answered', 'Voci CDR con una risposta.', '0–5');
  add(R, 'cdr_nd', 'Voci CDR con «Non lo so».', '0–5');
  add(R, 'cdr_reliable', 'CDR affidabile: almeno il 70% delle voci risposte.', 'TRUE / FALSE');
  ['I1', 'I2', 'I3', 'I4', 'I5'].forEach(function (c) {
    var k = c.toLowerCase(), q = L.ineff[c];
    var direct = c === 'I2' || c === 'I3';
    add(R, k, 'Punteggio finale dell\'inefficienza ' + c + ' · ' + q.name + '. Domanda: ' + q.title, '0–100, più alto = più critica; vuoto = non valutata');
    add(R, k + '_derived', direct ? 'Non previsto: ' + c + ' si valuta direttamente.' : 'Stima derivata dagli indici (' + (c === 'I1' ? 'CDR' : c === 'I4' ? '100 − ACC' : '100 − MNS') + '), prima di eventuali correzioni.', direct ? '' : '0–100');
    add(R, k + '_source', 'Origine del punteggio finale.', 'derived = stima accettata; override = stima corretta da chi compila; direct = valutazione diretta; skipped = «Non so valutarlo»; missing = mancante');
    add(R, k + '_note', direct ? 'Nota facoltativa sulla valutazione diretta.' : 'Motivazione della correzione, se indicata.');
  });
  add(R, 'prevailing', 'Inefficienza o inefficienze prevalenti (punteggio più alto).', 'codici I1–I5');
  add(R, 'observed', 'Inefficienze osservate: punteggio ≥ 41, generano gli interventi candidati.', 'codici I1–I5');
  add(R, 'coherence_rule', 'Inefficienze per cui è scattata la regola di coerenza del motore.', 'codici I1–I5');
  add(R, 'radar_ci', 'Asse dell\'ottagono: intensità emissiva rispetto a un\'auto termica con una persona (203 g CO2e/pax-km).', '0–100');
  add(R, 'radar_data', 'Asse dell\'ottagono: dati mancanti = (5 − DMS effettivo) × 20.', '0–100');
  add(R, 'radar_gov', 'Asse dell\'ottagono: complessità attuativa = GCS medio degli interventi valutati, su 0–100.', '0–100');
  add(R, 'candidates_n', 'Interventi candidati (matrice inefficienza-intervento, Tab. 1).');
  add(R, 'preselected_n', 'Candidati preselezionati dall\'interfaccia (fino a 3 principali, dalle inefficienze più gravi).');
  add(R, 'selected_n', 'Candidati tenuti da valutare.');
  add(R, 'evaluated_n', 'Interventi con indice di priorità calcolato.');
  add(R, 'selection_changed_n', 'Candidati aggiunti o tolti rispetto alla preselezione.');
  add(R, 'impact_overridden_n', 'Interventi con impatto stimato corretto da chi compila.');
  add(R, 'gcs_overridden_n', 'Interventi con complessità di governance (GCS) corretta.');
  add(R, 'lever_changed_n', 'Interventi con ipotesi di riduzione modificata.');
  add(R, 'data_capped_n', 'Interventi con punteggio dati limitato a 2 dal DMS.');
  add(R, 'class_a_n', 'Interventi in classe A (IPI > 12).');
  add(R, 'class_b_n', 'Interventi in classe B (IPI 6–12).');
  add(R, 'class_c_n', 'Interventi in classe C (IPI < 6).');
  add(R, 'top1', 'Intervento al primo posto del piano.', 'codice intervento, vedi codici');
  add(R, 'top1_ipi', 'Intervention Priority Index del primo intervento (eq. 8).');
  add(R, 'top1_class', 'Classe del primo intervento.', 'A; B; C');
  var fnames = { f1: 'f1_understandable', f2: 'f2_prevailing_matches', f3: 'f3_plausible_link', f4: 'f4_priority_useful', f5: 'f5_data_available', f6: 'f6_would_use' };
  Object.keys(fnames).forEach(function (f) {
    add(R, fnames[f], 'Valutazione «Quanto è vera questa frase?»: ' + L.truth.items[f], L.truth.options.map(function (o, i) { return (i + 1) + ' = ' + o; }).join('; '));
  });
  add(R, 'c1_uncovered', 'Completezza: ' + L.c1, 'yes; no');
  add(R, 'c1_text', 'Quali inefficienze non descritte (testo libero).');
  add(R, 'c2_overlap', 'Sovrapposizioni: ' + L.c2, 'yes; no');
  add(R, 'c2_text', 'Quali problemi ricadevano in più categorie (testo libero).');
  add(R, 'profile_shared', L.share, 'yes = indica ruolo ed esperienza; no = resta anonimo');
  add(R, 'role', 'Ruolo professionale, solo se profile_shared = yes.', codes_(L.role));
  add(R, 'experience', 'Esperienza nel mobility management, solo se profile_shared = yes.', codes_(L.experience));
  add(R, 'channel', 'Come ha conosciuto lo strumento (facoltativo).', codes_(L.channel));
  add(R, 'open_text', 'Cosa cambierebbe o aggiungerebbe (testo libero, facoltativo).');
  add(R, 'report_printed', "Volte in cui chi compila ha riaperto il report con il pulsante «Scarica il report PDF» dopo l'invio. L'apertura automatica all'invio non conta.");
  for (var c = 1; c <= 9; c++) add(R, 't_ch' + c, 'Secondi passati nel capitolo ' + c + ' · ' + L.chapters[c] + '.');
  add(R, 'inputs_json', 'Tutte le risposte grezze, in JSON: garantisce che nessun dato vada perso.');
  add(R, 'results_json', 'Tutti i risultati calcolati dal motore, in JSON.');

  var I = 'interventi';
  add(I, 'updated_at', 'Data e ora della revisione.');
  add(I, 'sid', 'Analisi a cui appartiene la riga (collega a risposte).');
  add(I, 'is_test', 'Riga di prova.', 'TRUE / FALSE');
  add(I, 'rev', 'Revisione dell\'analisi.');
  add(I, 'stage', 'Punto raggiunto dall\'analisi.', 'results; submitted');
  add(I, 'intervention', 'Codice dell\'intervento.', codes_(L.intervention));
  add(I, 'name', 'Nome dell\'intervento come nella Tab. 1 dell\'articolo.');
  add(I, 'inefficiency', 'Inefficienza che l\'intervento corregge.', 'I1–I5');
  add(I, 'role', 'Ruolo nella matrice.', 'primary = agisce sulla causa; complementary = rafforza l\'effetto');
  add(I, 'candidate_order', 'Posizione nell\'elenco proposto (inefficienze più gravi prima, principali prima).');
  add(I, 'preselected', 'Preselezionato dall\'interfaccia.', 'TRUE / FALSE');
  add(I, 'selected', 'Tenuto da valutare da chi compila.', 'TRUE / FALSE');
  add(I, 'estimable', 'Riduzione di emissioni stimabile dai dati della sede.', 'TRUE / FALSE');
  add(I, 'not_estimable_reason', 'Motivo della mancata stima.', 'not_modelled; no_baseline; no_source; no_service; no_acr');
  add(I, 'lever_default', 'Ipotesi di partenza dello scenario (quota trasferita, tagliata o evitata).', '0–1');
  add(I, 'lever', 'Ipotesi usata, dopo eventuali modifiche.', '0–1');
  add(I, 'dg_tco2e', 'Riduzione stimata ΔG, t CO2e l\'anno (eq. 6).');
  add(I, 'dg_pct', 'Riduzione stimata in % delle emissioni della sede.');
  add(I, 'impact_proposed', 'Impatto proposto dal framework dalle fasce di ΔG.', '1 < 1%; 2 = 1–3%; 3 = 3–7%; 4 = 7–15%; 5 ≥ 15%');
  add(I, 'impact', 'Impatto usato nell\'IPI (proposto o corretto; se non stimabile, indicato da chi compila).', scaleText_(L.iv.impact.slice().reverse()));
  add(I, 'impact_overridden', 'Impatto corretto rispetto alla proposta.', 'TRUE / FALSE');
  add(I, 'gcs_default', 'Governance Complexity Score proposto per il tipo di intervento.', L.iv.gcs.map(function (g, i) { return (i + 1) + ' = ' + g; }).join('; '));
  add(I, 'gcs', 'GCS usato nell\'IPI.', '1–5');
  add(I, 'gcs_overridden', 'GCS corretto rispetto alla proposta.', 'TRUE / FALSE');
  add(I, 'data_intensive', 'Intervento che richiede dati dettagliati (origini e destinazioni, turni, accessibilità).', 'TRUE / FALSE');
  add(I, 'data_cap', 'Punteggio dati limitato a 2 perché il DMS effettivo è sotto 2.', 'TRUE / FALSE');
  add(I, 'data_declared', 'Punteggio dati scelto. ' + L.iv.q.data, L.iv.data.map(function (d, i) { return (i + 1) + ' = ' + d; }).join('; '));
  add(I, 'data', 'Punteggio dati usato nell\'IPI, dopo l\'eventuale limite.', '1–5');
  add(I, 'data_capped', 'Il limite ha ridotto il punteggio dichiarato.', 'TRUE / FALSE');
  add(I, 'acceptance', 'Accettabilità. ' + L.iv.q.acc, L.iv.acc.map(function (d, i) { return (i + 1) + ' = ' + d; }).join('; '));
  add(I, 'cost', 'Costo. ' + L.iv.q.cost, L.iv.cost.map(function (d, i) { return (i + 1) + ' = ' + d; }).join('; '));
  add(I, 'ipi', 'Intervention Priority Index = (Impatto × Dati × Accettabilità) / (Costo × GCS) (eq. 8).');
  add(I, 'class', 'Classe di priorità.', 'A > 12 · ' + L.cls.A + '; B 6–12 · ' + L.cls.B + '; C < 6 · ' + L.cls.C);
  add(I, 'plan_rank', 'Posizione nel piano di intervento, se valutato.');
  add(I, 'monitoring_freq', 'Frequenza di monitoraggio scelta nei risultati.', codes_(L.freq));
  add(I, 'monitoring_owner', 'Responsabile del monitoraggio scelto nei risultati.', codes_(L.owner));

  var M = 'mezzi';
  add(M, 'updated_at', 'Data e ora della revisione.');
  add(M, 'sid', 'Analisi a cui appartiene la riga (collega a risposte).');
  add(M, 'is_test', 'Riga di prova.', 'TRUE / FALSE');
  add(M, 'rev', 'Revisione dell\'analisi.');
  add(M, 'stage', 'Punto raggiunto dall\'analisi.', 'results; submitted');
  add(M, 'mode', 'Mezzo.', codes_(L.mode));
  add(M, 'n', 'Persone che usano abitualmente il mezzo.');
  add(M, 'share_pct', 'Quota sul totale ripartito.', '0–100');
  add(M, 'one_way_km', 'Distanza media di sola andata per il mezzo, km.');
  add(M, 'distance_custom', 'Distanza indicata per il mezzo invece della media della sede.', 'TRUE / FALSE');
  add(M, 'days_year', 'Giorni di spostamento all\'anno (giorni a settimana × 44).');
  add(M, 'e_kwh_km', 'Consumo energetico del veicolo, kWh/km.');
  add(M, 'occupancy', 'Occupazione media, passeggeri per veicolo.');
  add(M, 'capacity', 'Capacità, posti per veicolo.');
  add(M, 'phi_g_kwh', 'Fattore emissivo del vettore energetico, g CO2e/kWh.');
  add(M, 'params_custom', 'Parametri tecnici modificati da chi compila.', 'TRUE / FALSE');
  add(M, 'pax_km', 'Passeggeri-km annui del mezzo (eq. 1).');
  add(M, 'ei_kwh_paxkm', 'Intensità energetica, kWh per passeggero-km (eq. 2).');
  add(M, 'load_factor', 'Load factor = occupazione / capacità (eq. 3).', '0–1');
  add(M, 'ci_g_paxkm', 'Intensità emissiva, g CO2e per passeggero-km.');
  add(M, 'tco2e', 'Emissioni annue del mezzo, t CO2e.');

  var A = 'avanzamento';
  add(A, 'received_at', 'Data e ora in cui chi compila ha raggiunto il capitolo.');
  add(A, 'sid', 'Analisi (collega a risposte).');
  add(A, 'is_test', 'Sessione di prova.', 'TRUE / FALSE');
  add(A, 'step', 'Capitolo raggiunto.', L.chapters.map(function (n, i) { return i + ' = ' + n; }).slice(1).join('; '));
  add(A, 'step_name', 'Nome del capitolo.');
  add(A, 'version', 'Versione del motore.');
  add(A, 'lang', 'Lingua.', 'it; en');
  add('contatti', 'received_at', 'Data e ora dell\'invio.');
  add('contatti', 'lang', 'Lingua.');
  add('contatti', 'email', 'Email lasciata per i contatti scelti in fondo al questionario. Nessun collegamento con le risposte.');
  add('contatti', 'interview_consent', 'Disponibile a un breve colloquio sui risultati.', 'TRUE / FALSE');
  add('contatti', 'updates', 'Vuole essere avvisato quando l\'articolo viene pubblicato.', 'TRUE / FALSE');
  add('contatti', 'field_validation', 'Disponibile a una validazione sul campo, con i dati della sua sede.', 'TRUE / FALSE');
  add('contatti', 'collaboration', 'Interessato a una collaborazione con l\'università: tesi, ricerca o dottorato.', 'TRUE / FALSE');
  add('richieste', 'received_at', 'Data e ora della richiesta.');
  add('richieste', 'code', 'Codice risposta indicato (coincide con sid).');
  add('richieste', 'kind', 'Tipo di richiesta.', 'delete; access; other');
  add('richieste', 'message', 'Messaggio.');
  add('richieste', 'email', 'Email per la risposta.');
  return E;
}

function writeDictionary_(ss, entries) {
  var sh = ss.getSheetByName('dizionario') || ss.insertSheet('dizionario');
  sh.clear();
  var rows = [['Dizionario dei dati · schema ' + SCHEMA_TAG, '', '', ''], ['Scheda', 'Colonna', 'Descrizione', 'Valori e unità']].concat(entries);
  sh.getRange(1, 1, rows.length, 4).setValues(rows).setVerticalAlignment('top').setWrap(true);
  sh.getRange(1, 1).setFontSize(14).setFontWeight('bold');
  sh.getRange(2, 1, 1, 4).setFontWeight('bold').setBackground('#D3EADF');
  sh.setFrozenRows(2);
  sh.setColumnWidth(1, 110); sh.setColumnWidth(2, 190); sh.setColumnWidth(3, 520); sh.setColumnWidth(4, 520);
}

// ---------- riepilogo ----------
function col_(tab, name) {
  var i = COLS[tab].indexOf(name);
  if (i < 0) throw new Error('colonna sconosciuta ' + tab + '.' + name);
  var letter = '';
  for (var n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) letter = String.fromCharCode(65 + (n - 1) % 26) + letter;
  return tab + '!$' + letter + '$2:$' + letter;
}

function writeSummary_(ss) {
  var sh = ss.getSheetByName('riepilogo') || ss.insertSheet('riepilogo');
  sh.clear();
  var r = function (n) { return col_('risposte', n); };
  var iv = function (n) { return col_('interventi', n); };
  var real = r('is_test') + ',FALSE';
  var sub = real + ',' + r('stage') + ',"submitted"';
  var pct = function (num, den) { return '=IFERROR(' + num + '/' + den + ',"—")'; };
  var rows = [];
  var section = function (title) { rows.push(['§' + title, '', '']); };
  var add = function (label, formula, note, format) { rows.push([label, formula, note || '', format || '']); };

  section('Partecipazione');
  // nelle condizioni di FILTER una cella vuota vale FALSE: per questo serve anche sid non vuoto
  var realSessions = col_('avanzamento', 'sid') + '<>"",' + col_('avanzamento', 'is_test') + '=FALSE';
  add('Sessioni con consenso (almeno un capitolo)', '=IFERROR(ROWS(UNIQUE(FILTER(' + col_('avanzamento', 'sid') + ',' + realSessions + '))),0)', 'Dalla scheda avanzamento, prove escluse.');
  for (var c = 1; c <= 9; c++) {
    add('Hanno raggiunto il capitolo ' + c + ' · ' + LABELS.chapters[c], '=IFERROR(ROWS(UNIQUE(FILTER(' + col_('avanzamento', 'sid') + ',' + realSessions + ',' + col_('avanzamento', 'step') + '=' + c + '))),0)', c === 1 ? 'Curva di abbandono per capitolo.' : '');
  }
  add('Analisi arrivate ai risultati', '=COUNTIFS(' + real + ')', 'Una riga per analisi nella scheda risposte.');
  add('Analisi con valutazione inviata', '=COUNTIFS(' + sub + ')', 'Base per i criteri di validazione qui sotto.');
  add('Durata mediana delle analisi inviate (minuti)', '=IFERROR(MEDIAN(FILTER(' + r('duration_sec') + ',' + r('sid') + '<>"",' + r('is_test') + '=FALSE,' + r('stage') + '="submitted"))/60,"—")', '', '0.0');
  add('Quota compilata da smartphone', pct('COUNTIFS(' + sub + ',' + r('device') + ',"mobile")', 'COUNTIFS(' + sub + ')'), '', '0%');

  section('Completezza diagnostica');
  add('Segnalano inefficienze non descritte dalle cinque categorie', pct('COUNTIFS(' + sub + ',' + r('c1_uncovered') + ',"yes")', 'COUNTIFS(' + sub + ')'), 'Leggere i testi in c1_text.', '0%');
  add('Segnalano problemi che ricadono in più categorie', pct('COUNTIFS(' + sub + ',' + r('c2_overlap') + ',"yes")', 'COUNTIFS(' + sub + ')'), 'Leggere i testi in c2_text.', '0%');
  ['i1', 'i2', 'i3', 'i4', 'i5'].forEach(function (k) {
    add('«Non so valutarlo» su ' + k.toUpperCase() + ' · ' + LABELS.ineff[k.toUpperCase()].name, pct('COUNTIFS(' + real + ',' + r(k + '_source') + ',"skipped")', 'COUNTIFS(' + real + ')'), '', '0%');
  });

  section('Coerenza degli indicatori');
  ['i1', 'i4', 'i5'].forEach(function (k) {
    add('Stima di ' + k.toUpperCase() + ' corretta da chi compila', pct('COUNTIFS(' + real + ',' + r(k + '_source') + ',"override")', '(COUNTIFS(' + real + ',' + r(k + '_source') + ',"override")+COUNTIFS(' + real + ',' + r(k + '_source') + ',"derived"))'), 'Sulle analisi in cui la stima era disponibile.', '0%');
  });
  add('Media di f1 · ' + LABELS.truth.items.f1, '=IFERROR(AVERAGEIFS(' + r('f1_understandable') + ',' + sub + '),"—")', '', '0.00');
  add('Media di f2 · ' + LABELS.truth.items.f2, '=IFERROR(AVERAGEIFS(' + r('f2_prevailing_matches') + ',' + sub + '),"—")', '', '0.00');

  section('Applicabilità con dati diversi');
  for (var d = 0; d <= 5; d++) add('DMS dichiarato = ' + d, '=COUNTIFS(' + real + ',' + r('dms_declared') + ',' + d + ')', d === 0 ? 'Distribuzione del livello dei dati.' : '');
  add('Livello dei dati effettivo sotto 2', pct('COUNTIFS(' + real + ',' + r('dms_effective') + ',"<2")', 'COUNTIFS(' + real + ')'), '', '0%');
  add('ACC poco affidabile (meno del 70% di risposte)', pct('COUNTIFS(' + real + ',' + r('acc_reliable') + ',FALSE)', 'COUNTIFS(' + real + ')'), '', '0%');
  add('CDR poco affidabile (meno del 70% di risposte)', pct('COUNTIFS(' + real + ',' + r('cdr_reliable') + ',FALSE)', 'COUNTIFS(' + real + ')'), '', '0%');
  add('Media di f5 · ' + LABELS.truth.items.f5, '=IFERROR(AVERAGEIFS(' + r('f5_data_available') + ',' + sub + '),"—")', '', '0.00');

  section('Utilità decisionale percepita');
  add('Media di f3 · ' + LABELS.truth.items.f3, '=IFERROR(AVERAGEIFS(' + r('f3_plausible_link') + ',' + sub + '),"—")', '', '0.00');
  add('Media di f4 · ' + LABELS.truth.items.f4, '=IFERROR(AVERAGEIFS(' + r('f4_priority_useful') + ',' + sub + '),"—")', '', '0.00');
  add('Media di f6 · ' + LABELS.truth.items.f6, '=IFERROR(AVERAGEIFS(' + r('f6_would_use') + ',' + sub + '),"—")', '', '0.00');
  add('Hanno scaricato di nuovo il report dal pulsante', pct('COUNTIFS(' + sub + ',' + r('report_printed') + ',">0")', 'COUNTIFS(' + sub + ')'), '', '0%');
  add('Hanno indicato il proprio ruolo', pct('COUNTIFS(' + sub + ',' + r('profile_shared') + ',"yes")', 'COUNTIFS(' + sub + ')'), 'Gli altri hanno scelto di restare anonimi.', '0%');

  section('Abbinamento e priorità degli interventi');
  var ivReal = iv('is_test') + ',FALSE';
  add('Interventi valutati (con indice di priorità)', '=COUNTIFS(' + ivReal + ',' + iv('class') + ',"?*")', 'Dalla scheda interventi.');
  ['A', 'B', 'C'].forEach(function (k) { add('Interventi in classe ' + k, '=COUNTIFS(' + ivReal + ',' + iv('class') + ',"' + k + '")', LABELS.cls[k]); });
  add('Impatto stimato corretto da chi compila', pct('COUNTIFS(' + ivReal + ',' + iv('selected') + ',TRUE,' + iv('impact_overridden') + ',TRUE)', 'COUNTIFS(' + ivReal + ',' + iv('selected') + ',TRUE,' + iv('estimable') + ',TRUE)'), 'Sugli interventi valutati con stima disponibile.', '0%');
  add('Complessità di governance corretta', pct('COUNTIFS(' + ivReal + ',' + iv('selected') + ',TRUE,' + iv('gcs_overridden') + ',TRUE)', 'COUNTIFS(' + ivReal + ',' + iv('selected') + ',TRUE)'), '', '0%');
  add('Candidati aggiunti o tolti rispetto alla preselezione', '=IFERROR(SUMIFS(' + r('selection_changed_n') + ',' + real + '),0)', 'Somma su tutte le analisi.');
  add('Punteggio dati limitato dal DMS', pct('COUNTIFS(' + ivReal + ',' + iv('data_capped') + ',TRUE)', 'COUNTIFS(' + ivReal + ',' + iv('selected') + ',TRUE)'), '', '0%');

  section('Contatti e prossimi passi');
  var ct = function (n) { return col_('contatti', n); };
  add('Email lasciate', '=COUNTIF(' + ct('email') + ',"?*")', 'Nella scheda contatti, senza collegamento alle risposte.');
  add('Vogliono essere avvisati della pubblicazione', '=COUNTIF(' + ct('updates') + ',TRUE)');
  add('Disponibili a una validazione sul campo', '=COUNTIF(' + ct('field_validation') + ',TRUE)', 'Con i dati della loro sede: la base per uno studio più solido.');
  add("Interessati a una collaborazione con l'università", '=COUNTIF(' + ct('collaboration') + ',TRUE)', 'Tesi, ricerca o dottorato.');
  add('Disponibili a un colloquio sui risultati', '=COUNTIF(' + ct('interview_consent') + ',TRUE)');

  var out = [['Riepilogo della validazione · schema ' + SCHEMA_TAG, '', ''], ['Le righe di prova (TEST-) sono sempre escluse. Il significato di ogni colonna è nella scheda dizionario.', '', ''], ['Indicatore', 'Valore', 'Nota']];
  var formats = [];
  rows.forEach(function (x) { out.push([x[0].replace(/^§/, ''), '', x[2]]); formats.push(x[3] || ''); });
  sh.getRange(1, 1, out.length, 3).setValues(out).setVerticalAlignment('middle');
  // Le formule sono scritte con la virgola; se la lingua del foglio usa il punto e virgola (per esempio in italiano)
  // compaiono come #ERROR! e le riscriviamo con il separatore locale. Nelle formule non ci sono numeri decimali.
  var target = sh.getRange(4, 2, rows.length, 1);
  target.setFormulas(rows.map(function (x) { return [x[1]]; }));
  SpreadsheetApp.flush();
  var broken = target.getDisplayValues().some(function (v) { return v[0] === '#ERROR!'; });
  if (broken) target.setFormulas(rows.map(function (x) { return [x[1].replace(/,/g, ';')]; }));
  sh.getRange(1, 1).setFontSize(14).setFontWeight('bold');
  sh.getRange(2, 1).setFontColor('#6E7C78');
  sh.getRange(3, 1, 1, 3).setFontWeight('bold').setBackground('#D3EADF');
  rows.forEach(function (x, i) {
    var line = i + 4;
    if (x[0].charAt(0) === '§') sh.getRange(line, 1, 1, 3).setFontWeight('bold').setBackground('#ECF5F0');
    if (formats[i]) sh.getRange(line, 2).setNumberFormat(formats[i]);
  });
  sh.setFrozenRows(3);
  sh.setColumnWidth(1, 460); sh.setColumnWidth(2, 110); sh.setColumnWidth(3, 360);
  sh.getRange(4, 2, rows.length, 1).setHorizontalAlignment('right');
}
