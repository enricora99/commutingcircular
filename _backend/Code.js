/**
 * @OnlyCurrentDoc
 *
 * Circular Commuting 2.0 beta — raccolta dei dati di validazione.
 *
 * Web app anonima collegata al foglio "CCF 2.0 beta — Dati validazione".
 * Il sito invia JSON in POST (Content-Type text/plain, così il browser non fa preflight CORS)
 * e ogni messaggio diventa una riga nella scheda del suo tipo. Il sito non legge la risposta:
 * gli basta il redirect, che Apps Script emette dopo aver eseguito doPost.
 *
 * Privacy by design: il nome dell'organizzazione e della sede restano nel browser;
 * l'email facoltativa finisce in "contacts" senza alcun collegamento alle risposte.
 */

var TABS = {
  assessments: [
    'received_at', 'sid', 'rev', 'version', 'lang', 'duration_sec',
    'org_type', 'sector', 'employees', 'region', 'shift_pct', 'pscl',
    'dms_declared', 'dms_effective', 'low_reliability',
    'mns', 'acc', 'acc_answered', 'cdr', 'cdr_answered',
    'employees_modal', 'pax_km', 'tco2e', 'ci_g_paxkm', 'ei_kwh_paxkm', 'acr',
    'i1', 'i2', 'i3', 'i4', 'i5', 'i1_overridden', 'i4_overridden', 'i5_overridden',
    'prevailing', 'observed', 'n_evaluated', 'top1', 'top1_ipi', 'top1_class', 'data_first',
    'inputs_json', 'results_json'
  ],
  feedback: [
    'received_at', 'sid', 'version', 'lang',
    'f1_understandable', 'f2_prevailing_matches', 'f3_plausible_link',
    'f4_priority_useful', 'f5_data_available', 'f6_would_use',
    'c1_uncovered', 'c1_text', 'c2_overlap', 'c2_text',
    'role', 'experience', 'channel', 'open_text'
  ],
  contacts: ['received_at', 'lang', 'email', 'interview_consent'],
  progress: ['received_at', 'sid', 'step', 'version', 'lang'],
  requests: ['received_at', 'code', 'kind', 'message', 'email']
};

var MAX_BODY = 100000;        // byte massimi per messaggio
var MAX_PER_WINDOW = 600;     // messaggi accettati ogni 10 minuti (freno contro gli abusi)
var TIME_ZONE = 'Europe/Rome';

/** Da eseguire una volta dall'editor: autorizza lo script e crea le schede con le intestazioni. */
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.setSpreadsheetTimeZone(TIME_ZONE);
  Object.keys(TABS).forEach(function (name) { sheet_(ss, name); });
  ['Foglio1', 'Sheet1'].forEach(function (name) {
    var sh = ss.getSheetByName(name);
    if (sh && ss.getSheets().length > 1 && sh.getLastRow() === 0) ss.deleteSheet(sh);
  });
}

/**
 * Da eseguire a mano dall'editor quando serve: elimina le righe di prova, cioè quelle con
 * sid o codice che inizia con "TEST-" (le sessioni aperte con circularcommuting.it/beta/?test=1).
 */
function cleanupTests() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TABS).forEach(function (name) {
    var sh = ss.getSheetByName(name);
    var col = TABS[name].indexOf('sid') + 1 || TABS[name].indexOf('code') + 1;
    if (!sh || !col || sh.getLastRow() < 2) return;
    var values = sh.getRange(2, col, sh.getLastRow() - 1, 1).getValues();
    for (var i = values.length - 1; i >= 0; i--) {
      if (String(values[i][0]).indexOf('TEST-') === 0) sh.deleteRow(i + 2);
    }
  });
}

function doGet() {
  return json_({ ok: true, service: 'ccf-beta' });
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents;
    if (!raw || raw.length > MAX_BODY) return json_({ ok: false, error: 'size' });
    var msg = JSON.parse(raw);
    if (msg.hp) return json_({ ok: true });                 // honeypot compilato: bot, fingiamo successo
    if (!TABS[msg.type] || typeof msg.row !== 'object') return json_({ ok: false, error: 'type' });
    if (msg.type === 'contacts' && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(msg.row.email || ''))) {
      return json_({ ok: false, error: 'email' });
    }

    var lock = LockService.getScriptLock();
    lock.waitLock(15000);
    try {
      // Il sito ritenta gli invii non confermati: lo stesso id messaggio viene scritto una volta sola.
      var cache = CacheService.getScriptCache();
      var seenKey = msg.id ? 'm' + String(msg.id).slice(0, 40) : null;
      if (seenKey && cache.get(seenKey)) return json_({ ok: true, duplicate: true });
      if (!withinQuota_()) return json_({ ok: false, error: 'busy' });
      var ss = SpreadsheetApp.getActiveSpreadsheet();
      if (!cache.get('tz')) {
        if (ss.getSpreadsheetTimeZone() !== TIME_ZONE) ss.setSpreadsheetTimeZone(TIME_ZONE);
        cache.put('tz', '1', 21600);
      }
      var headers = TABS[msg.type];
      var row = headers.map(function (h) { return h === 'received_at' ? new Date() : safe_(msg.row[h]); });
      sheet_(ss, msg.type).appendRow(row);
      if (seenKey) cache.put(seenKey, '1', 21600);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String((err && err.message) || err) });
  }
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
  var s = typeof v === 'object' ? JSON.stringify(v) : String(v);
  if (s.length > 45000) s = s.slice(0, 45000);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function sheet_(ss, name) {
  var sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.getRange(1, 1, 1, TABS[name].length).setValues([TABS[name]]).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
