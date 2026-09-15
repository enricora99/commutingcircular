/* Home: lingua, contenuti condivisi, pannello di aiuto. Il testo italiano è già nell'HTML (indicizzabile). */
(function () {
  'use strict';

  const T = {
    it: {
      heroEyebrow: 'Circular Commuting Framework',
      heroTitle: 'La mobilità casa-lavoro, dalla diagnosi alla decisione.',
      heroLede: 'Un framework che classifica le inefficienze degli spostamenti dei dipendenti, le misura in energia ed emissioni per passeggero-km e ordina gli interventi che le correggono.',
      liteEyebrow: 'Versione semplificata',
      liteTitle: 'Il Canvas, in autonomia',
      liteText: 'Lo strumento nato con la tesi: compili gli otto blocchi del Canvas quando vuoi e stampi la sintesi. Nessun dato lascia il tuo browser.',
      lite1: 'Nessuna raccolta dati', lite2: 'Uso libero, senza registrazione', lite3: 'Sintesi stampabile',
      liteCta: 'Apri la versione semplificata', liteNote: '',
      betaLive: 'Raccolta dati attiva',
      betaEyebrow: 'Beta 2.0 · in validazione',
      betaTitle: 'Aiutaci a validare il framework',
      betaText: "La versione allineata all'articolo di ricerca: domande brevi, una alla volta, e un report completo per la tua sede. Le risposte anonime alimentano la validazione scientifica.",
      beta1: 'Circa 12 minuti', beta2: 'Profilo di criticità e piano di interventi A, B, C', beta3: 'Risposte anonime, a fini di ricerca',
      betaCta: 'Prova la beta',
      layersEyebrow: 'Il framework',
      layersTitle: 'Cinque layer, dalla qualità del dato al monitoraggio.',
      layers: [
        ['database', 'Dati', 'Ho dati sufficienti per decidere?'],
        ['search', 'Inefficienze', 'Dove si genera lo spreco?'],
        ['bolt', 'Prestazioni energetiche', 'Quanto pesa, in kWh e CO₂ per passeggero-km?'],
        ['link', 'Abbinamento degli interventi', 'Quale intervento corregge quella causa?'],
        ['loop', 'Governance e monitoraggio', 'Chi misura, quando e con quali conseguenze?']
      ],
      factsEyebrow: 'Dalla letteratura',
      factsTitle: 'Perché misurare la mobilità casa-lavoro.',
      factLabel: 'Lo sapevi?',
      authorsEyebrow: 'Gli autori',
      authorsTitle: 'Chi firma la ricerca',
      paperLine: 'Il framework è descritto nell\'articolo di ricerca «{title}».',
      footPrivacy: 'Informativa privacy della beta',
      helpAria: "Cosa c'è in questa pagina?",
      helpEyebrow: "Cosa c'è a schermo",
      helpTitle: 'Due modi di usare il framework',
      helpBody: [
        'La <strong>versione semplificata</strong> è il Canvas originale della tesi: lo compili da solo, quando vuoi, e nessun dato viene inviato.',
        'La <strong>beta 2.0</strong> segue l\'articolo di ricerca: domande brevi, una alla volta, un report completo per la sede e, con il tuo consenso, risposte anonime che servono a validare il framework.'
      ],
      helpFw: 'Il Circular Commuting Framework collega cinque layer: dati, inefficienze, prestazioni energetiche, abbinamento degli interventi, governance e monitoraggio. Il Canvas li traduce in otto blocchi operativi.',
      helpFwLabel: 'Nel framework',
      close: 'Chiudi'
    },
    en: {
      heroEyebrow: 'Circular Commuting Framework',
      heroTitle: 'Employee commuting, from diagnosis to decision.',
      heroLede: 'A framework that classifies commuting inefficiencies, measures them in energy and emissions per passenger-km, and ranks the interventions that correct them.',
      liteEyebrow: 'Simplified version',
      liteTitle: 'The Canvas, on your own',
      liteText: 'The tool born with the thesis: fill in the eight Canvas blocks whenever you like and print the summary. No data leaves your browser.',
      lite1: 'No data collection', lite2: 'Free to use, no sign-up', lite3: 'Printable summary',
      liteCta: 'Open the simplified version', liteNote: 'Available in Italian',
      betaLive: 'Data collection open',
      betaEyebrow: 'Beta 2.0 · under validation',
      betaTitle: 'Help us validate the framework',
      betaText: 'The version aligned with the research article: short questions, one at a time, and a full report for your site. Anonymous answers feed the scientific validation.',
      beta1: 'About 12 minutes', beta2: 'Criticality profile and A, B, C intervention plan', beta3: 'Anonymous answers, for research',
      betaCta: 'Try the beta',
      layersEyebrow: 'The framework',
      layersTitle: 'Five layers, from data quality to monitoring.',
      layers: [
        ['database', 'Data', 'Do I have enough data to decide?'],
        ['search', 'Inefficiency', 'Where is waste generated?'],
        ['bolt', 'Energy performance', 'How much does it weigh, in kWh and CO₂ per passenger-km?'],
        ['link', 'Intervention matching', 'Which intervention corrects that cause?'],
        ['loop', 'Governance and feedback', 'Who measures, when and with what consequences?']
      ],
      factsEyebrow: 'From the literature',
      factsTitle: 'Why measure employee commuting.',
      factLabel: 'Did you know?',
      authorsEyebrow: 'The authors',
      authorsTitle: 'Who is behind the research',
      paperLine: 'The framework is described in the research article “{title}”.',
      footPrivacy: 'Beta privacy notice',
      helpAria: 'What is on this page?',
      helpEyebrow: 'What you are looking at',
      helpTitle: 'Two ways to use the framework',
      helpBody: [
        'The <strong>simplified version</strong> is the original Canvas from the thesis: you fill it in on your own, whenever you like, and no data is sent.',
        'The <strong>beta 2.0</strong> follows the research article: short questions, one at a time, a full report for your site and, with your consent, anonymous answers that help validate the framework.'
      ],
      helpFw: 'The Circular Commuting Framework links five layers: data, inefficiency, energy performance, intervention matching, governance and feedback. The Canvas turns them into eight operational blocks.',
      helpFwLabel: 'In the framework',
      close: 'Close'
    }
  };

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const C = window.CCF_CONTENT;

  function pickLang() {
    const q = new URLSearchParams(location.search).get('lang');
    if (q === 'en' || q === 'it') return q;
    try { return localStorage.getItem('ccf-lang') === 'en' ? 'en' : 'it'; } catch (e) { return 'it'; }
  }
  let lang = pickLang();

  function icons() {
    $$('[data-icon]').forEach(el => { if (!el.firstElementChild) el.outerHTML = window.CCF_ICON(el.dataset.icon); });
  }

  function render() {
    const t = T[lang];
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => {
      const v = t[el.dataset.i18n];
      if (typeof v === 'string') { el.textContent = v; el.hidden = el.dataset.i18n === 'liteNote' && !v; }
    });
    $$('.lang-switch button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.lang === lang)));
    $$('[data-href-lang]').forEach(a => {
      const base = a.dataset.hrefLang;
      a.setAttribute('href', lang === 'en' ? base + (base.includes('?') ? '&' : '?') + 'lang=en' : base);
    });

    $('#layers').innerHTML = t.layers.map(([ico, title, q], i) =>
      `<li class="rise"><span class="l-num">0${i + 1}</span>${window.CCF_ICON(ico)}<h3>${esc(title)}</h3><p>${esc(q)}</p></li>`).join('');

    $('#facts').innerHTML = ['reporting', 'occupancy', 'parking'].map(k => {
      const f = C.facts[k], x = f[lang];
      return `<article class="fact"><span class="eyebrow">${window.CCF_ICON('bulb')}${esc(t.factLabel)}</span>
        ${f.icon ? `<div class="fact-big fact-icon">${window.CCF_ICON(f.icon)}</div>` : `<div class="fact-big">${esc(f.big)}</div>`}<p class="fact-text">${esc(x.text)}</p><p class="fact-src">${esc(x.src)}</p></article>`;
    }).join('');

    $('#paper-line').textContent = t.paperLine.replace('{title}', C.paperTitle);
    $('#authors').innerHTML = C.authors.map(a => `<article class="card author">
      <span class="avatar" aria-hidden="true">${esc(a.initials)}</span>
      <div><h3>${esc(a.name)}</h3></div>
      <span class="role">${esc(a.role[lang])}</span>
      <p>${esc(a.bio[lang])}</p></article>`).join('');

    $('#help-body').innerHTML = `<h3 id="help-title">${esc(t.helpTitle)}</h3>${t.helpBody.map(p => `<p>${p}</p>`).join('')}
      <div class="help-fw"><strong>${esc(t.helpFwLabel)}</strong>${esc(t.helpFw)}</div>`;
    $$('[data-close-help]').forEach(b => { if (b.classList.contains('help-close')) b.setAttribute('aria-label', t.close); });
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem('ccf-lang', l); } catch (e) { /* preferenza non salvabile */ }
    render();
  }

  const drawer = $('#help-drawer');
  let lastFocus = null;
  function openHelp() {
    lastFocus = document.activeElement;
    drawer.classList.add('open');
    setTimeout(() => $('.help-close').focus(), 50);
  }
  function closeHelp() {
    drawer.classList.remove('open');
    if (lastFocus) lastFocus.focus();
  }

  icons();
  render();
  $$('.lang-switch button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));
  $('#help-fab').addEventListener('click', openHelp);
  $$('[data-close-help]').forEach(b => b.addEventListener('click', closeHelp));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && drawer.classList.contains('open')) closeHelp(); });
  const bar = $('#topbar');
  const onScroll = () => bar.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
