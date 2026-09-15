/*
 * Circular Commuting — libreria di icone del design system.
 * Regole: griglia 24×24, tratto 1.5, estremità e giunzioni arrotondate, colore del testo (currentColor),
 * nessun riempimento. Unica eccezione: piccoli punti pieni (classe "fill") per indicare persone o posti occupati.
 * Documentazione: _dev/DESIGN-SYSTEM.md
 */
(function (root) {
  'use strict';

  const P = {
    // interfaccia
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    help: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.4c-.6.3-1 .9-1 1.6v.5"/><path d="M12 16.8h.01"/>',
    bulb: '<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    download: '<path d="M12 4v11M7 10l5 5 5-5"/><path d="M4.5 19.5h15"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    report: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/><path d="M9 12h6M9 15.5h6"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/>',
    route: '<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h7.5a3 3 0 0 0 0-6h-7a3 3 0 0 1 0-6H16"/>',
    radar: '<path d="M12 3l8.5 6.2-3.2 10.3H6.7L3.5 9.2z"/><path d="M12 7.5l4 3-1.5 5h-5L8 10.5z"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5.5 5.5"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    loop: '<path d="M20 11a8 8 0 0 0-14.5-4.5"/><path d="M4 4.5v3.9h3.9"/><path d="M4 13a8 8 0 0 0 14.5 4.5"/><path d="M20 19.5v-3.9h-3.9"/>',
    leaf: '<path d="M5 19c0-8 5-13.5 14.5-14.5C19 14 13.5 19 5 19z"/><path d="M5 19l8-8"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" class="fill"/>',
    euro: '<circle cx="12" cy="12" r="8.5"/><path d="M15.2 8.6a4.2 4.2 0 1 0 0 6.8"/><path d="M7.5 11h6M7.5 13.2h6"/>',
    smile: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 14c1 1.3 2.2 2 3.5 2s2.5-.7 3.5-2"/><path d="M9 9.5h.01M15 9.5h.01"/>',
    database: '<ellipse cx="12" cy="6" rx="7" ry="2.5"/><path d="M5 6v12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6"/><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5"/>',
    bolt: '<path d="M13 2.5 5.5 13.5H11l-1 8 7.5-11H12z"/>',
    home: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5v10h13v-10"/><path d="M10 19.5v-5h4v5"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.4 2.5 2.4 14.5 0 17M12 3.5c-2.4 2.5-2.4 14.5 0 17"/>',

    // persone e organizzazioni
    person: '<circle cx="12" cy="7.5" r="3.5"/><path d="M5 20c0-3.9 3.1-6.5 7-6.5s7 2.6 7 6.5"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19.5c0-3.3 2.5-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><circle cx="17" cy="9" r="2.3"/><path d="M15.5 14.3c.5-.2 1-.3 1.5-.3 2.3 0 4 1.8 4 4.5"/>',
    building: '<path d="M4 20.5V6l7-3v17.5"/><path d="M11 9.5h9v11"/><path d="M3 20.5h18"/><path d="M7 8h1M7 11.5h1M7 15h1M14.5 13h1.5M14.5 16.5h1.5"/>',
    columns: '<path d="M3.5 9 12 4l8.5 5"/><path d="M4.5 9h15"/><path d="M6.5 9v8.5M10 9v8.5M14 9v8.5M17.5 9v8.5"/><path d="M4 17.5h16M3 20.5h18"/>',
    cap: '<path d="M2.5 9.5 12 5l9.5 4.5L12 14z"/><path d="M6.5 11.5v4c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-4"/><path d="M21.5 9.5v5"/>',
    health: '<rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M12 8v8M8 12h8"/>',
    dots: '<circle cx="6" cy="12" r="1.3" class="fill"/><circle cx="12" cy="12" r="1.3" class="fill"/><circle cx="18" cy="12" r="1.3" class="fill"/>',
    factory: '<path d="M3 20.5V11l5 3v-3l5 3v-3l5 3V4.5h3v16"/><path d="M2.5 20.5h19"/><path d="M7 17.5h2M12 17.5h2"/>',
    helmet: '<path d="M4 16.5a8 8 0 0 1 16 0"/><path d="M2.5 16.5h19V19h-19z"/><path d="M10 8.8V6.5h4v2.3"/>',
    cart: '<path d="M3 4.5h2.2l2 11h11l2-7.5H6.5"/><circle cx="9" cy="19" r="1.4"/><circle cx="17" cy="19" r="1.4"/>',
    truck: '<path d="M2.5 6.5h11v10h-11z"/><path d="M13.5 10h4l3 3.5v3h-7"/><circle cx="6.5" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/>',
    coins: '<ellipse cx="12" cy="6.5" rx="7" ry="2.5"/><path d="M5 6.5v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4"/><path d="M5 10.5v4c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-4"/><path d="M5 14.5v3c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-3"/>',
    laptop: '<rect x="4.5" y="5" width="15" height="10" rx="1.5"/><path d="M2.5 18.5h19L20 15H4z"/>',
    book: '<path d="M12 6.5c-2-1.5-5-2-8.5-1.5v13c3.5-.5 6.5 0 8.5 1.5 2-1.5 5-2 8.5-1.5V5c-3.5-.5-6.5 0-8.5 1.5z"/><path d="M12 6.5v13"/>',
    care: '<path d="M12 20s-7.5-4.6-7.5-10.3A4.2 4.2 0 0 1 12 7.2a4.2 4.2 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/><path d="M6.8 12.5h2.7l1.5-2.5 2 4 1.5-1.5h2.7"/>',
    pin: '<path d="M12 21s-6.5-5.8-6.5-11a6.5 6.5 0 0 1 13 0c0 5.2-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    map: '<path d="M3.5 6.5 9 4l6 2.5L20.5 4v13.5L15 20l-6-2.5-5.5 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    wrench: '<path d="M14.5 6.5a4 4 0 0 0-5 5L4 17a1.8 1.8 0 0 0 2.5 2.5l5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2.5-.5-.5-2.5z"/>',
    chat: '<path d="M4 5.5h16v10H9l-5 4z"/><path d="M8 9.5h8M8 12h5"/>',
    network: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><circle cx="12" cy="13" r="1.6"/><path d="M12 7v4.4M6.6 15.8l4-2M17.4 15.8l-4-2"/>',

    // documenti e dati (maturità del dato, PSCL)
    docCheck: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/><path d="M9 14l2 2 4-4"/>',
    docEdit: '<path d="M14 3.5H6v17h6"/><path d="M14 3.5l4 4v5"/><path d="M14 3.5v4h4"/><path d="M14.5 20.5l.5-2.5 4.5-4.5 2 2-4.5 4.5z"/>',
    docNone: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4"/><path d="M9.5 12l5 5M14.5 12l-5 5"/>',
    dataNone: '<rect x="4.5" y="4.5" width="15" height="15" rx="2" stroke-dasharray="2.5 2.5"/>',
    clipboard: '<rect x="5" y="4.5" width="14" height="16.5" rx="2"/><path d="M9 4.5v-1h6v1"/><path d="M8.5 10h7M8.5 13.5h7M8.5 17h4"/>',
    od: '<circle cx="5.5" cy="17.5" r="2"/><circle cx="18.5" cy="6.5" r="2"/><path d="M7.3 16.5C11 15 12 10 16.7 7.5" stroke-dasharray="1.5 2.2"/>',
    odClock: '<circle cx="5.5" cy="6.5" r="2"/><circle cx="12.5" cy="11.5" r="1.6"/><path d="M7.1 7.8l4 2.6" stroke-dasharray="1.5 2"/><circle cx="17" cy="17" r="4"/><path d="M17 14.8V17l1.4 1"/>',
    layers: '<path d="M12 4 3 8.5l9 4.5 9-4.5z"/><path d="M3 12.5l9 4.5 9-4.5"/><path d="M3 16.5l9 4.5 9-4.5"/>',
    dashboard: '<rect x="3.5" y="4.5" width="17" height="15" rx="2"/><path d="M7 15.5v-3M10.5 15.5V9M14 15.5v-5M17.5 15.5v-2"/>',

    // mezzi di trasporto
    car: '<path d="M4 15.5V12l1.8-4.2a2 2 0 0 1 1.8-1.3h8.8a2 2 0 0 1 1.8 1.3L20 12v3.5"/><path d="M3.5 15.5h17"/><path d="M5.5 11.5h13"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/>',
    carSolo: '<path d="M4 15.5V12l1.8-4.2a2 2 0 0 1 1.8-1.3h8.8a2 2 0 0 1 1.8 1.3L20 12v3.5"/><path d="M3.5 15.5h17"/><path d="M5.5 11.5h13"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/><circle cx="9.2" cy="9.3" r="1.1" class="fill"/>',
    carPool: '<path d="M4 15.5V12l1.8-4.2a2 2 0 0 1 1.8-1.3h8.8a2 2 0 0 1 1.8 1.3L20 12v3.5"/><path d="M3.5 15.5h17"/><path d="M5.5 11.5h13"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/><circle cx="9.2" cy="9.3" r="1.1" class="fill"/><circle cx="14.8" cy="9.3" r="1.1" class="fill"/>',
    carEv: '<path d="M4 15.5V12l1.8-4.2a2 2 0 0 1 1.8-1.3h8.8a2 2 0 0 1 1.8 1.3L20 12v3.5"/><path d="M3.5 15.5h17"/><path d="M5.5 11.5h13"/><circle cx="7.5" cy="17" r="1.8"/><circle cx="16.5" cy="17" r="1.8"/><path d="M12.8 7.6 11.3 9.6h1.9l-1.2 1.6"/>',
    moto: '<circle cx="6" cy="17" r="2.5"/><circle cx="18" cy="17" r="2.5"/><path d="M8.5 17h5l3-6h2"/><path d="M14.5 7h2.5l-1 4"/><path d="M6 14.5l2-3.5h5"/>',
    shuttle: '<path d="M3 16V8a1.5 1.5 0 0 1 1.5-1.5H15l4.5 4.5V16"/><path d="M3 16h18"/><path d="M3 11h16.5"/><path d="M8.5 6.5V11M13.5 6.5V11"/><circle cx="7" cy="17" r="1.7"/><circle cx="16.5" cy="17" r="1.7"/>',
    bus: '<rect x="3" y="5.5" width="18" height="11" rx="2"/><path d="M3 11h18"/><path d="M8 5.5V11M13 5.5V11"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/>',
    busEv: '<rect x="3" y="5.5" width="18" height="11" rx="2"/><path d="M3 11h18"/><path d="M8 5.5V11M13 5.5V11"/><circle cx="7" cy="17.5" r="1.6"/><circle cx="17" cy="17.5" r="1.6"/><path d="M17.8 6.9 16.6 8.6h1.6l-1.1 1.6"/>',
    train: '<rect x="6" y="3.5" width="12" height="14" rx="3"/><path d="M6 11h12M9 6.5h6"/><circle cx="9" cy="14.3" r=".9" class="fill"/><circle cx="15" cy="14.3" r=".9" class="fill"/><path d="M8.5 17.5l-2 3M15.5 17.5l2 3"/>',
    bike: '<circle cx="6" cy="16" r="3.2"/><circle cx="18" cy="16" r="3.2"/><path d="M6 16l4-7h5.5L18 16"/><path d="M10 9l2.5 7H6"/><path d="M14 6.5h2.5"/>',
    ebike: '<circle cx="6" cy="16" r="3.2"/><circle cx="18" cy="16" r="3.2"/><path d="M6 16l4-7h5.5L18 16"/><path d="M10 9l2.5 7H6"/><path d="M14 6.5h2.5"/><path d="M11.6 2.8 10.4 4.6H12l-1.2 1.8"/>',
    walk: '<circle cx="13" cy="4.5" r="1.8"/><path d="M11 21l2-6-2.5-2.5 1-4.5 3 2.5 3 1"/><path d="M10.5 8.5 7.5 11l-.5 3"/><path d="M13 15l2.5 6"/>',

    // accessibilità e dipendenza dall'auto
    busStop: '<path d="M6.5 21V3.5"/><rect x="6.5" y="3.5" width="8" height="5.5" rx="1"/><rect x="11" y="12" width="9.5" height="6.5" rx="1.5"/><path d="M11 15.5h9.5"/>',
    frequency: '<path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4.5v3.9h-3.9"/><path d="M12 8v4l2.5 1.5"/>',
    shield: '<path d="M12 3 5 6v5.5c0 4.5 3 8 7 9.5 4-1.5 7-5 7-9.5V6z"/><path d="M9 12l2 2 4-4"/>',
    lane: '<path d="M5 21 9 3M19 21 15 3"/><path d="M12 5v2M12 11v2M12 17v2"/>',
    lockers: '<rect x="4.5" y="3.5" width="6.5" height="17" rx="1"/><rect x="13" y="3.5" width="6.5" height="17" rx="1"/><path d="M9 11v2M15 11v2"/>',
    parking: '<rect x="4" y="3.5" width="16" height="17" rx="3"/><path d="M9.5 16.5v-9h3.2a2.8 2.8 0 0 1 0 5.6H9.5"/>',
    gauge: '<path d="M4 17a8 8 0 1 1 16 0"/><path d="M12 17l4-5"/><path d="M4 17h2M18 17h2M12 9V7"/>',
    lastMile: '<circle cx="6" cy="17.5" r="2"/><path d="M8 17.5h5a3.5 3.5 0 0 0 0-7H9a2.5 2.5 0 0 1 0-5h6"/><path d="M18 11s-3-2.7-3-5a3 3 0 0 1 6 0c0 2.3-3 5-3 5z"/>',

    // inefficienze circolari
    i1: '<rect x="3.5" y="6.5" width="17" height="11" rx="2"/><circle cx="8" cy="12" r="1.6" class="fill"/><circle cx="12" cy="12" r="1.6"/><circle cx="16" cy="12" r="1.6"/>',
    i2: '<path d="M3.5 8.5H18M15 5.5l3 3-3 3"/><path d="M3.5 15.5H18M15 12.5l3 3-3 3"/>',
    i3: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/><path d="M5 19 19 5"/>',
    i4: '<circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M7 18h4"/><path d="M13 12h-1.5a3 3 0 0 1 0-6H17"/><path d="M14.5 15.5l2.5 2.5m0-2.5-2.5 2.5"/>',
    i5: '<path d="M3.5 11 12 4l8.5 7"/><path d="M5.5 9.5v10h13v-10"/><path d="M9 14.5l2 2 4-4"/>'
  };

  // Glifo di scala: cinque punti, pieni fino al livello scelto (usato per tutte le risposte ordinali 1–5).
  function scale(level, total) {
    const n = total || 5;
    let s = '';
    for (let i = 1; i <= n; i++) s += `<i class="${i <= level ? 'on' : ''}"></i>`;
    return `<span class="scale" aria-hidden="true">${s}</span>`;
  }

  function icon(name, cls) {
    const body = P[name] || P.dots;
    return `<svg class="ico${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${body}</svg>`;
  }

  root.CCF_ICON = icon;
  root.CCF_SCALE = scale;
  root.CCF_ICON_NAMES = Object.keys(P);
})(typeof self !== 'undefined' ? self : this);
