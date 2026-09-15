/*
 * Genera _backend/labels.js dai testi italiani della beta (beta/i18n.js), così il dizionario del foglio
 * usa esattamente le stesse domande e le stesse etichette che vede chi compila.
 * Uso: node _dev/build-labels.js
 */
const fs = require('fs');
const path = require('path');

global.window = {};
require(path.join(__dirname, '..', 'beta', 'i18n.js'));
const it = window.CCF_I18N.it;

const pairs = obj => Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, Array.isArray(v) ? v[1] : v]));

const LABELS = {
  chapters: it.chapters,
  org_type: pairs(it.options.orgType),
  sector: pairs(it.options.sector),
  pscl: pairs(it.options.pscl),
  dms: it.options.dms.map(([, label, sub]) => `${label} (${sub})`),
  mode: it.options.modes,
  band: it.options.bands,
  role: it.q.role.options,
  experience: it.q.experience.options,
  channel: it.q.final.channels,
  employees: it.q.employees.title,
  region: it.q.region.title,
  shifts: it.q.shifts.title,
  pscl_q: it.q.pscl.title,
  dms_q: it.q.dms.title,
  mns: { title: it.q.mns.title, seg: it.q.mns.seg },
  days_week: it.q.daysWeek.title,
  distance: it.q.distance.title,
  acc: it.q.acc.map(x => ({ title: x.title, options: x.options })),
  cdr: it.q.cdr.map(x => ({ title: x.title, options: x.options })),
  ineff: Object.fromEntries(['I1', 'I2', 'I3', 'I4', 'I5'].map(c => [c, { name: it.q.ineff[c].name, title: it.q.ineff[c].title, options: it.q.ineff[c].options }])),
  truth: { items: it.q.truth.items, options: it.q.truth.options },
  c1: it.q.c1.title, c2: it.q.c2.title, share: it.q.share.title,
  intervention: it.interventions,
  intervention_plain: Object.fromEntries(Object.entries(it.ivPlain).map(([k, v]) => [k, v.name])),
  iv: { cost: it.q.iv.cost, acc: it.q.iv.acc, data: it.q.iv.data, impact: it.q.iv.impact, gcs: it.q.iv.gcs, q: it.q.iv.q },
  freq: it.q.results.freq,
  owner: it.q.results.owners,
  cls: it.q.iv.cls
};

const out = path.join(__dirname, '..', '_backend', 'labels.js');
fs.writeFileSync(out, `/** Etichette in italiano per il dizionario del foglio. Generato da _dev/build-labels.js: non modificare a mano. */\nvar LABELS = ${JSON.stringify(LABELS, null, 1)};\n`);
console.log('scritto', out, fs.statSync(out).size, 'byte');
