/* Testi dell'interfaccia della beta 2.0 — italiano (predefinito) e inglese.
   La terminologia inglese segue quella dell'articolo. */
// Autori dell'articolo: la riga compare nella pagina solo quando l'elenco non è vuoto.
window.CCF_AUTHORS = ["Enrico Emanuele Corazzini", "Linda Meleo", "Stefano Brinchi", "Cristiano Fragassa"];

window.CCF_I18N = {
  it: {
    meta: {
      title: "Circular Commuting Framework & Canvas 2.0 beta",
      description: "Diagnosi energy-aware della mobilità casa-lavoro e prioritizzazione degli interventi. Versione 2.0 in validazione con i mobility manager."
    },
    hero: {
      eyebrow: "nuova versione in validazione",
      sub: "Diagnosi energy-aware della mobilità casa-lavoro: dall'inefficienza all'intervento prioritario.",
      v1: "← Versione 1.0"
    },
    steps: ["Inizio", "Profilo", "Presenza", "Baseline", "Accessibilità", "Auto", "Diagnosi", "Interventi", "Risultati", "Valutazione"],
    nav: {
      back: "← Indietro",
      next: "Avanti →",
      stepOf: "Passaggio {n} di {t}",
      saved: "salvato nel browser",
      incomplete: "Alcuni dati mancano: puoi proseguire, il Canvas dichiarerà l'affidabilità del risultato."
    },
    common: {
      select: "— seleziona —",
      nd: "ND · dato non disponibile",
      notAvailable: "n.d.",
      bands: ["assente o marginale", "bassa", "media", "alta", "critica"],
      coverage: "Voci disponibili: {a} su {t}",
      lowRel: "Bassa affidabilità: meno del 70% delle voci è disponibile, il DMS effettivo scende a 2.",
      pending: "Mancano {n} voci: indica un valore oppure «dato non disponibile».",
      lowReliability: "bassa affidabilità",
      yes: "Sì",
      no: "No",
      optional: "facoltativo"
    },
    intro: {
      title: "Valuta la mobilità casa-lavoro della tua sede e aiutaci a validare il framework",
      lead: "Questa è la versione 2.0 del Circular Commuting Canvas, allineata all'articolo di ricerca che descrive il framework. In circa 20 minuti ottieni la diagnosi delle inefficienze della tua sede, gli indicatori energetici ed emissivi e un piano di interventi ordinato per priorità, utile anche per il PSCL.",
      cards: [
        { t: "Cosa ottieni", d: "Un report PDF con baseline energetico-emissiva, diagnosi delle inefficienze I1–I5, dashboard degli indicatori e piano di interventi in classi A, B e C." },
        { t: "Cosa ti chiediamo", d: "Dati aggregati della sede, nessun dato personale dei dipendenti. Alla fine, 2 minuti per valutare lo strumento." },
        { t: "Anonimato", d: "Il nome dell'organizzazione e della sede restano nel tuo browser: ai ricercatori arrivano solo dati aggregati e anonimi." }
      ],
      dataTip: "Tieni a portata di mano: dipendenti per modalità di spostamento, distanza media casa-lavoro, giorni di presenza, turni e dotazioni della sede. Se un dato manca puoi segnarlo come non disponibile: il Canvas prosegue e dichiara l'affidabilità del risultato.",
      resume: "Hai un'analisi in corso salvata in questo browser (ultimo passaggio: {step}).",
      resumeBtn: "Riprendi",
      restartBtn: "Ricomincia da capo",
      restartConfirm: "Vuoi cancellare l'analisi salvata in questo browser e ricominciare?"
    },
    research: {
      title: "Il progetto di ricerca",
      p1: "Il Circular Commuting Framework è descritto nell'articolo di ricerca «An Energy-Aware Circular Commuting Framework for Corporate Mobility Management».",
      p2: "Lo studio classifica le inefficienze del commuting aziendale in base al meccanismo che le genera, le traduce in indicatori fisici confrontabili tra modalità (kWh e gCO₂e per passeggero-km) e ordina gli interventi correttivi secondo beneficio atteso, dati disponibili e complessità attuativa.",
      p3: "Le analisi dei mobility manager servono a verificarne quattro proprietà: completezza della diagnosi, coerenza degli indicatori, applicabilità con diversi livelli di maturità del dato e utilità decisionale percepita.",
      authors: "Autori"
    },
    consent: {
      label: "Ho letto l'informativa privacy e acconsento al trattamento delle mie risposte, in forma anonima, a fini di ricerca scientifica.",
      link: "Leggi l'informativa privacy",
      need: "Per iniziare serve il consenso. Se preferisci non partecipare alla ricerca, puoi usare liberamente la versione 1.0.",
      start: "Inizia l'analisi →"
    },
    b1: {
      title: "Profilo organizzativo e maturità del dato",
      q: "Ho dati sufficienti?",
      orgName: "Organizzazione",
      siteName: "Sede analizzata",
      localHint: "Solo per il tuo report: non viene inviato.",
      orgType: "Tipo di organizzazione",
      orgTypes: { private: "Impresa privata", public: "Pubblica amministrazione", university: "Università o ente di ricerca", health: "Sanità", other: "Altro" },
      sector: "Settore",
      sectors: { manufacturing: "Manifattura", energy: "Energia e utilities", construction: "Costruzioni", retail: "Commercio e grande distribuzione", logistics: "Logistica e trasporti", finance: "Servizi finanziari e assicurativi", ict: "ICT e servizi professionali", education: "Istruzione e ricerca", health: "Sanità e assistenza", pa: "Pubblica amministrazione", other: "Altro" },
      employees: "Dipendenti della sede",
      region: "Regione",
      abroad: "Fuori Italia",
      shiftPct: "Dipendenti su turni (%)",
      pscl: "Piano spostamenti casa-lavoro (PSCL)",
      psclOpts: { adopted: "Adottato", preparing: "In preparazione", none: "Non previsto" },
      dmsTitle: "Data Maturity Score (DMS): quali dati hai sulla mobilità dei dipendenti?",
      dmsLevels: [
        { c: "Nessun dato strutturato", a: "nessuna diagnosi affidabile" },
        { c: "Questionario base o dati descrittivi generici", a: "analisi modale elementare" },
        { c: "Dati origine-destinazione (O/D) aggregati", a: "identificazione dei bacini principali" },
        { c: "O/D + turni + modalità", a: "diagnosi temporale e modale" },
        { c: "Dati integrati con TPL, GIS e accessibilità", a: "progettazione su corridoi e interventi mirati" },
        { c: "Monitoraggio periodico e dashboard", a: "feedback loop e gestione continua" }
      ],
      dmsAllows: "consente",
      dmsWarn: "Con DMS < 2 la raccolta dati precede ogni intervento: il piano metterà al primo posto la costruzione della baseline."
    },
    b2: {
      title: "Necessità reale di presenza",
      q: "Quanta mobilità è necessaria?",
      qe: "Presenza fisica essenziale (%)",
      qp: "Mansioni parzialmente remotizzabili (%)",
      qr: "Mansioni completamente remotizzabili (%)",
      formula: "MNS = [(Qe × 5 + Qp × 3 + Qr × 1) − 100] / 4 · le tre quote devono sommare 100",
      sum: "Somma attuale: {sum}%",
      sumWarn: "Le tre quote devono sommare 100%.",
      bands: [
        { name: "Presenza poco necessaria", reco: "leva principale: organizzazione del lavoro (smart working, coworking)" },
        { name: "Presenza parzialmente necessaria", reco: "mix tra riduzione della domanda e cambio modale" },
        { name: "Presenza strutturalmente necessaria", reco: "leva principale: modalità di trasporto" }
      ],
      note: "Classificazione da validare con HR e responsabili operativi."
    },
    b3: {
      title: "Baseline commuting",
      q: "Qual è il costo energetico attuale?",
      oneWay: "Distanza media casa-lavoro, sola andata (km)",
      days: "Giorni in sede all'anno per dipendente",
      daysHint: "Con lo smart working conta solo i giorni in sede.",
      lead: "Indica quanti dipendenti usano abitualmente ciascuna modalità. Distanza e giorni valgono per tutte le righe: cambiali riga per riga solo se sono diversi.",
      cols: { mode: "Modalità", n: "Dipendenti", km: "km andata", days: "giorni/anno" },
      sumCheck: "Dipendenti per modalità: {sum} su {tot} dichiarati",
      sumOk: "ok",
      sumDiff: "diverso dal totale della sede",
      params: "Parametri dei veicoli (e, o, k, φ)",
      paramsNote: "Valori di default ricavati dalle Tab. 2.1–2.2 della tesi (ISPRA 2024, EEA 2023, UITP 2022); moto ed e-bike sono indicativi. Modificali se hai dati reali, per esempio l'occupazione media della navetta.",
      paramCols: { e: "e · kWh/vkm", o: "o · occupanti", k: "k · posti", phi: "φ · gCO₂e/kWh", lf: "LF" },
      kpi: {
        A: "Attività di trasporto", Aunit: "milioni di pax-km/anno",
        EI: "Intensità energetica", EIunit: "kWh/pax-km",
        CI: "Intensità emissiva (CI)", CIunit: "gCO₂e/pax-km",
        G: "Emissioni annue", Gunit: "tCO₂e/anno"
      },
      formula: "(1) A = N·d·g · (2) EI = e/o · (3) LF = o/k · (4) G = A·EI·φ · (5) CI = ΣG/ΣA · con d = 2 × km andata",
      empty: "Inserisci distanza, giorni e almeno una modalità per calcolare la baseline."
    },
    b4: {
      title: "Accessibilità alternativa",
      q: "Ci sono alternative all'auto?",
      formula: "ACC = [(media delle voci disponibili − 1) / 4] × 100 · più alto = migliore accessibilità",
      items: [
        ["Distanza a piedi dalla fermata TPL", ["≤ 5 min", "5–10 min", "10–15 min", "15–25 min", "> 25 min o assente"]],
        ["Distanza dalla stazione ferroviaria", ["≤ 10 min, diretta e frequente", "10–15 min", "15–25 min o 1 cambio", "25–40 min o poco affidabile", "non utilizzabile"]],
        ["Frequenza del TPL nelle fasce di ingresso e uscita", ["≤ 15 min", "16–30 min", "31–60 min", "> 60 min o discontinua", "assente"]],
        ["Compatibilità del TPL con i turni", ["copertura completa", "buona (attesa < 15 min)", "parziale (15–30 min)", "solo alcune fasce", "assente"]],
        ["Sicurezza dell'ultimo miglio", ["sicuro, illuminato, continuo", "sicuro, criticità minori", "usabile, criticità rilevanti", "poco sicuro o scomodo", "non sicuro o non pedonale"]],
        ["Infrastruttura ciclabile e pedonale", ["continua e protetta", "quasi completa", "parziale ma usabile", "frammentata", "assente"]],
        ["Dotazioni interne per la mobilità attiva", ["rastrelliere, docce, spogliatoi e policy", "rastrelliere + 1 dotazione", "rastrelliere, dotazioni limitate", "minime o non sicure", "assenti"]]
      ],
      bands: [
        { name: "Accessibilità critica", reco: "alternative all'auto poco praticabili" },
        { name: "Accessibilità bassa", reco: "cambio modale faticoso senza interventi" },
        { name: "Accessibilità buona", reco: "margini concreti di cambio modale" },
        { name: "Accessibilità ottima", reco: "leve immediate di cambio modale" }
      ]
    },
    b5: {
      title: "Dipendenza dall'auto",
      q: "Quanto è strutturale l'uso dell'auto?",
      formula: "CDR = [(media delle voci disponibili − 1) / 4] × 100 · più alto = maggiore dipendenza",
      items: [
        ["Quota di auto con solo conducente", ["> 80%", "61–80%", "41–60%", "21–40%", "≤ 20%"]],
        ["Parcheggio aziendale gratuito", ["garantito e abbondante", "ampio ma non garantito", "parziale o in saturazione", "limitato o a pagamento", "assente o a pagamento"]],
        ["Facilità di accesso in auto", ["molto facile, competitivo", "generalmente facile", "congestione moderata", "spesso congestionato", "difficoltoso o disincentivato"]],
        ["Turni non coperti dal TPL", ["> 75% non coperti", "51–75%", "26–50%", "1–25%", "coperti o quasi"]],
        ["Alternative per l'ultimo miglio", ["nessuna alternativa", "molto scomode o non sicure", "parziali", "presenti ma migliorabili", "ultimo miglio efficace"]]
      ],
      bands: [
        { name: "Dipendenza bassa", reco: "struttura non auto-centrica" },
        { name: "Dipendenza media", reco: "spazio per ridurre il solo conducente" },
        { name: "Dipendenza alta", reco: "intervenire su struttura e incentivi" },
        { name: "Dipendenza critica", reco: "prima infrastrutture e governance, poi comportamenti" }
      ],
      joint: "Lettura congiunta: ACC alta e CDR bassa → leve immediate di cambio modale; ACC bassa e CDR alta → prima interventi infrastrutturali o di governance territoriale."
    },
    b6: {
      title: "Inefficienze circolari",
      q: "Dove si genera lo spreco?",
      lead: "Tre inefficienze derivano dagli indici già calcolati (CDR → I1, ACC → I4, MNS → I5); I2 e I3 richiedono la tua valutazione diretta. Se non sei d'accordo con un valore derivato, correggilo e indica il motivo: le correzioni sono un dato prezioso per la validazione.",
      names: { I1: "Capacità sottoutilizzata", I2: "Duplicazione modale", I3: "Mismatch temporale", I4: "Frizione di ultimo miglio", I5: "Domanda evitabile non intercettata" },
      desc: {
        I1: "Un vettore opera con basso tasso di occupazione, come un'auto con un solo occupante o un bus mezzo vuoto: consuma energia e spazio distribuendoli su pochi passeggeri.",
        I2: "Più vettori coprono corridoi, fasce orarie o bacini simili senza coordinamento.",
        I3: "L'offerta alternativa all'auto non è compatibile con gli orari reali di lavoro.",
        I4: "Il trasporto pubblico c'è, ma non consente un accesso comodo e sicuro alla sede.",
        I5: "L'organizzazione non distingue tra mobilità necessaria ed evitabile, e genera più domanda del necessario."
      },
      why: {
        I1: "Da CDR = {v}: più l'auto con solo conducente è strutturale, maggiore è la capacità privata latente.",
        I4: "Da ACC = {v}, invertito: più la sede è raggiungibile senz'auto, minore è la frizione.",
        I5: "Da MNS = {v}, invertito: più mansioni possono svolgersi da remoto, più alta è la domanda evitabile."
      },
      rule: "Regola di coerenza: MNS < 50 con {d} giorni di presenza a settimana → almeno «alta».",
      missing: { I1: "Compila il blocco 5 (CDR) per derivarla.", I4: "Compila il blocco 4 (ACC) per derivarla.", I5: "Compila il blocco 2 (MNS) per derivarla." },
      direct: "Valutazione diretta",
      rubric: {
        I2: ["assenza di servizi duplicati", "duplicazioni occasionali", "servizi parzialmente sovrapposti per corridoio o fascia oraria", "duplicazioni evidenti tra aziende, navette o servizi paralleli", "più servizi non coordinati servono gli stessi bacini con bassa saturazione"],
        I3: ["TPL e servizi compatibili con quasi tutti gli orari", "criticità limitate ad alcune fasce", "copertura parziale di turni o orari principali", "molti ingressi e uscite non serviti", "turni principali non coperti da alternative sostenibili"]
      },
      hints: {
        I2: "Confronta la navetta aziendale ({n} utenti) con le linee TPL sugli stessi corridoi e con i servizi di altre aziende vicine.",
        I2none: "Nella baseline non c'è una navetta aziendale: considera eventuali servizi paralleli di altre aziende o del TPL.",
        I3: "Indizi dai blocchi precedenti: compatibilità TPL-turni {a} · turni non coperti {b} · dipendenti su turni {c}."
      },
      correct: "Correggi",
      auto: "automatico",
      reason: "Motivo della correzione",
      notePh: "Nota (facoltativa)",
      corrected: "corretto a mano",
      source: "fonte",
      prevailing: "Inefficienza prevalente",
      none: "Compila i blocchi precedenti per generare la diagnosi.",
      observedNote: "Sono considerate osservate le inefficienze con punteggio ≥ 41, cioè da «media» in su: solo per queste il framework propone interventi."
    },
    b7: {
      title: "Interventi, governance e priorità",
      q: "Cosa fare per primo?",
      lead: "Il framework propone solo interventi collegati a un'inefficienza osservata, secondo la matrice inefficienza-intervento (Tab. 1). Per ognuno stimiamo la riduzione di emissioni (ΔG, eq. 6) e la traduciamo in un punteggio di impatto da 1 a 5, che puoi correggere. Rispondi alle altre domande: l'IPI si calcola da solo.",
      dataFirst: "DMS effettivo {d}: prima di tutto va costruita la baseline (indagine casa-lavoro con origini, turni e modalità). Gli interventi che richiedono matrici O/D, turni o accessibilità TPL non possono avere un punteggio dati superiore a 2.",
      noObserved: "Nessuna inefficienza raggiunge il livello «media»: il framework non propone interventi. Ripeti la diagnosi al prossimo aggiornamento del PSCL.",
      primary: "primario",
      complementary: "complementare",
      include: "Valuta questo intervento",
      lever: {
        shift: "Quota di pax-km in auto con solo conducente che passa a: {to}",
        cut: "Quota delle corse della navetta eliminate o ottimizzate",
        avoid_acr: "Quota della domanda evitabile (ACR {acr}%) effettivamente evitata",
        avoid_total: "Quota di pax-km evitati"
      },
      estimate: "Riduzione stimata (ΔG): {t} tCO₂e/anno, pari al {p}% della baseline → impatto proposto {i}/5",
      estimateNeg: "Con questi parametri l'intervento non riduce le emissioni (ΔG = {t} tCO₂e/anno): impatto proposto 1/5.",
      reasons: {
        not_modelled: "Effetto non stimabile dai dati di una singola sede: indica tu l'impatto.",
        no_baseline: "Completa la baseline (blocco 3) per stimare ΔG.",
        no_source: "Nella baseline non ci sono dipendenti in auto con solo conducente.",
        no_service: "Nella baseline non c'è una navetta aziendale: l'intervento non è applicabile così com'è.",
        no_acr: "Completa MNS e baseline per stimare la domanda evitabile."
      },
      qs: {
        impact: "Impatto energetico atteso",
        data: "Data readiness: quanto sono solidi i dati per progettarlo e misurarlo?",
        acc: "Accettabilità organizzativa: quanto è probabile che venga accettato?",
        cost: "Costo stimato",
        gcs: "Complessità di governance (GCS): chi deve essere coinvolto?"
      },
      answers: {
        impact: ["1 · impatto marginale o non stimabile", "2 · riduzione limitata", "3 · riduzione media", "4 · riduzione elevata", "5 · riduzione molto elevata"],
        data: ["1 · dati insufficienti", "2 · dati deboli, molte assunzioni", "3 · dati sufficienti ma incompleti", "4 · dati buoni, poche assunzioni", "5 · dati completi e aggiornati"],
        acc: ["1 · forte opposizione o rischio elevato", "2 · resistenze prevedibili", "3 · accettabilità incerta", "4 · accettabilità buona", "5 · forte consenso, basso rischio"],
        cost: ["1 · nullo o molto basso", "2 · basso", "3 · medio", "4 · elevato", "5 · molto elevato o investimento strutturale"],
        gcs: ["1 · interno semplice (comunicazione, piccoli incentivi)", "2 · interno multi-funzione (smart working, policy parcheggi)", "3 · con fornitori esterni (navetta, carpooling, bike service)", "4 · con attori pubblici o TPL (fermate, orari, accordi con il Comune)", "5 · coalizione multi-attore (più aziende, Comune, TPL, MM d'area)"]
      },
      proposed: "proposto",
      up: "alza la priorità",
      down: "abbassa la priorità",
      capped: "limitato a 2 dal DMS",
      govPlan: "GCS ≥ 4: serve un piano di governance esplicito.",
      cls: { A: "Candidabile all'attuazione immediata", B: "Da programmare, approfondire o testare", C: "Da rimandare o subordinare a precondizioni" },
      priority: "Priorità",
      formula: "IPI = (Impatto × Dati × Accettabilità) / (Costo × GCS) · A > 12 · B 6–12 · C < 6",
      bandsNote: "Impatto proposto da ΔG in % della baseline: < 1% → 1 · 1–3% → 2 · 3–7% → 3 · 7–15% → 4 · ≥ 15% → 5. Fasce di prima applicazione, da calibrare.",
      incomplete: "Rispondi alle domande per calcolare l'IPI."
    },
    interventions: {
      i1_lf: "Aumento del load factor dei servizi collettivi esistenti",
      i1_carpool: "Carpooling organizzato",
      i1_rightsize: "Accorpamento delle corse e right-sizing dei veicoli",
      i1_ptdeal: "Accordi di saturazione con l'operatore TPL",
      i2_coord: "Coordinamento tra servizio aziendale e TPL sui corridoi sovrapposti",
      i2_convert: "Conversione del servizio aziendale verso bacini non serviti",
      i2_coalition: "Adesione a coalizioni territoriali tra organizzazioni",
      i3_align: "Allineamento degli orari di ingresso e uscita alle finestre del TPL",
      i3_ondemand: "Servizi a chiamata per le fasce non coperte",
      i3_stagger: "Scaglionamento dei turni",
      i4_equip: "Dotazioni interne per la mobilità attiva",
      i4_route: "Messa in sicurezza del percorso di accesso alla sede",
      i4_feeder: "Navetta di adduzione dal nodo di interscambio",
      i4_micro: "Micromobilità condivisa",
      i5_remote: "Estensione del lavoro da remoto alle mansioni che non richiedono presenza",
      i5_cowork: "Coworking di prossimità",
      i5_redistribute: "Redistribuzione dei giorni di presenza per evitare concentrazioni di flussi"
    },
    modes: {
      car_solo: "Auto termica · solo conducente",
      car_pool: "Auto termica · carpooling",
      car_ev: "Auto elettrica",
      moto: "Moto o scooter",
      shuttle: "Navetta aziendale (diesel)",
      bus: "Autobus TPL (diesel)",
      bus_el: "Autobus elettrico",
      train: "Treno o metropolitana",
      ebike: "E-bike o monopattino elettrico",
      active: "Bici o a piedi"
    },
    results: {
      title: "Risultati",
      q: "I quattro output del Canvas",
      lead: "Controlla i risultati, poi valuta lo strumento per scaricare il report PDF.",
      eyebrow: "Circular Commuting Framework 2.0 · report diagnostico",
      untitled: "Organizzazione non indicata",
      generated: "Report generato il {date} · motore {v}",
      s1: "1 · Baseline report",
      s2: "2 · Quadro diagnostico",
      s3: "3 · Dashboard degli indicatori",
      s4: "4 · Piano di intervento",
      dmsDeclared: "DMS dichiarato",
      dmsEffective: "DMS effettivo",
      cols: { mode: "Modalità", n: "Dipendenti", share: "Quota", paxkm: "pax-km/anno", g: "tCO₂e/anno", ei: "EI kWh/pax-km", lf: "LF", ci: "CI gCO₂e/pax-km" },
      total: "Totale",
      causal: "Score causali",
      acr: "Domanda evitabile (ACR, eq. 7)",
      acrText: "{p}% dell'attività: {d} giorni di presenza a settimana contro {n} necessari",
      acrNa: "non calcolabile: servono MNS e baseline",
      ciSys: "Intensità emissiva del sistema (CI, eq. 5)",
      eiSys: "Intensità energetica del sistema",
      dg: "Riduzione attesa per intervento (ΔG, eq. 6)",
      planEmpty: "Nessun intervento valutato.",
      d0: "Costruire la baseline: indagine casa-lavoro con origini, turni e modalità",
      d0note: "Priorità imposta dal DMS < 2: precede ogni intervento.",
      monitor: "Monitoraggio e revisione",
      monitorCols: { intv: "Intervento", ind: "Indicatore", freq: "Frequenza", owner: "Responsabile" },
      freq: { quarterly: "Trimestrale", semiannual: "Semestrale", annual: "Annuale" },
      owners: { mm: "Mobility manager", hr: "HR", facility: "Facility / operations", management: "Direzione", supplier: "Fornitore esterno" },
      indicators: {
        load_factor: "Load factor dei servizi collettivi e quota di auto con solo conducente",
        service_overlap: "Sovrapposizione tra servizio aziendale e TPL",
        time_coverage: "Copertura temporale di ingressi e uscite",
        active_access_share: "Quota di accessi alla sede con mobilità attiva",
        avoided_commuting: "Commuting evitato (giorni e pax-km)"
      },
      systemInd: "Indicatori di sistema: CI (eq. 5) e ΔG (eq. 6), aggiornati in parallelo.",
      review: "Revisione del piano: al prossimo aggiornamento del PSCL.",
      toFeedback: "Continua: valuta lo strumento →",
      foot: "Circular Commuting Framework · circularcommuting.it"
    },
    feedback: {
      title: "Valuta lo strumento",
      q: "2 minuti",
      lead: "Le tue risposte misurano l'utilità decisionale del framework, uno dei criteri di validazione dello studio. Dopo l'invio scarichi il report PDF.",
      scale: ["Per nulla d'accordo", "In disaccordo", "Né d'accordo né in disaccordo", "D'accordo", "Del tutto d'accordo"],
      items: {
        f1: "La diagnosi delle inefficienze è comprensibile.",
        f2: "L'inefficienza prevalente corrisponde alla mia conoscenza della sede.",
        f3: "Il collegamento tra inefficienze e interventi proposti è plausibile.",
        f4: "L'ordine di priorità mi permette di capire quali azioni fare per prime.",
        f5: "I dati richiesti erano disponibili nella mia organizzazione.",
        f6: "Userei lo strumento per preparare o aggiornare il PSCL."
      },
      c1: "Nella tua sede ci sono inefficienze che le cinque categorie non descrivono?",
      c1text: "Quali?",
      c2: "Qualche problema ricadeva in più categorie contemporaneamente?",
      c2text: "Quale?",
      role: "Il tuo ruolo",
      roles: { mm_company: "Mobility manager aziendale", mm_area: "Mobility manager d'area", hr: "HR o welfare", esg: "Sostenibilità / ESG", facility: "Facility / operations", consultant: "Consulente", other: "Altro" },
      experience: "Esperienza nel mobility management",
      exp: { lt1: "Meno di 1 anno", y1_3: "1–3 anni", y3_5: "3–5 anni", gt5: "Oltre 5 anni" },
      channel: "Come hai conosciuto lo strumento? (facoltativo)",
      channels: { linkedin: "LinkedIn", newsletter: "Newsletter o evento", network: "Collega o rete professionale", search: "Ricerca online", other: "Altro" },
      open: "Cosa cambieresti o aggiungeresti? (facoltativo)",
      contact: "Sono disponibile a essere ricontattato per un breve colloquio sui risultati (facoltativo)",
      email: "Email",
      contactNote: "L'email viene salvata separatamente e non è collegata alle tue risposte.",
      required: "Per inviare rispondi alle sei affermazioni, alle due domande sulle categorie e indica ruolo ed esperienza.",
      submit: "Invia e scarica il report",
      invalidEmail: "Controlla l'indirizzo email."
    },
    thanks: {
      title: "Fatto!",
      body: "Grazie per il tuo contributo alla validazione del framework.",
      syncing: "Invio delle risposte in corso… Se chiudi la pagina l'invio viene completato alla prossima visita.",
      synced: "✓ Risposte salvate",
      code: "Codice risposta: {code}",
      codeNote: "Conservalo se vorrai chiedere l'accesso o la cancellazione dei tuoi dati.",
      download: "Scarica il report PDF",
      printHint: "Nella finestra di stampa scegli «Salva come PDF».",
      newRun: "Nuova analisi",
      newConfirm: "Vuoi iniziare una nuova analisi? Quella attuale verrà cancellata da questo browser."
    },
    privacy: {
      title: "Informativa privacy",
      sections: [
        ["Chi tratta i dati", "Enrico Emanuele Corazzini, che cura questo sito e la raccolta dei dati per conto degli autori dello studio indicati in questa pagina. Per qualunque richiesta usa il modulo in fondo a questa informativa."],
        ["Quali dati raccogliamo", "Le risposte ai blocchi del Canvas (dati aggregati della sede: tipo e settore dell'organizzazione, numero di dipendenti, regione, ripartizione modale, punteggi), i risultati calcolati, le eventuali correzioni con la loro motivazione, le risposte al questionario di valutazione e dati tecnici minimi (lingua, versione dello strumento, tempi di compilazione). Non raccogliamo il nome dell'organizzazione o della sede, che restano nel tuo browser, né dati sui singoli dipendenti, né il tuo indirizzo IP. Non usiamo cookie."],
        ["Email facoltativa", "Solo se scegli di essere ricontattato. È salvata separatamente, senza collegamento alle risposte, e cancellata al termine del progetto."],
        ["Perché", "Per la validazione scientifica del framework e per analisi statistiche. I risultati sono pubblicati solo in forma aggregata, senza possibilità di risalire alle singole organizzazioni."],
        ["Base giuridica", "Il tuo consenso (art. 6, par. 1, lett. a GDPR), che puoi revocare in ogni momento senza pregiudicare il trattamento già effettuato."],
        ["Dove e per quanto tempo", "In un foglio di calcolo Google con accesso riservato agli autori. Google può trattare dati anche fuori dall'Unione europea con le garanzie previste (EU-US Data Privacy Framework). Le risposte anonime sono conservate per la durata del progetto di ricerca e delle successive verifiche scientifiche."],
        ["I tuoi diritti", "Accesso, rettifica, cancellazione, limitazione, opposizione e revoca del consenso (artt. 15–22 GDPR), indicando il codice risposta che ricevi alla fine. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali."],
        ["Salvataggio nel browser", "Per non farti perdere il lavoro, le risposte sono salvate anche nel tuo browser (localStorage). Restano sul tuo dispositivo e puoi cancellarle con «Ricomincia da capo»."]
      ],
      close: "Chiudi",
      requestTitle: "Richiesta sui tuoi dati",
      requestCode: "Codice risposta (se lo hai)",
      requestKind: "Tipo di richiesta",
      requestKinds: { delete: "Cancellazione", access: "Accesso", other: "Altro" },
      requestMessage: "Messaggio",
      requestEmail: "Email per la risposta",
      requestSend: "Invia richiesta",
      requestSent: "Richiesta inviata. Ti risponderemo all'indirizzo indicato.",
      requestError: "Invio non riuscito: controlla l'email e riprova."
    },
    footer: {
      beta: "Framework & Canvas 2.0 beta · motore {v}",
      privacy: "Informativa privacy",
      v1: "Versione 1.0"
    }
  },

  en: {
    meta: {
      title: "Circular Commuting Framework & Canvas 2.0 beta",
      description: "Energy-aware diagnosis of home-to-work mobility and intervention prioritisation. Version 2.0 under validation with mobility managers."
    },
    hero: {
      eyebrow: "new version under validation",
      sub: "Energy-aware diagnosis of home-to-work mobility: from inefficiency to priority intervention.",
      v1: "← Version 1.0"
    },
    steps: ["Start", "Profile", "Presence", "Baseline", "Accessibility", "Car", "Diagnosis", "Interventions", "Results", "Evaluation"],
    nav: {
      back: "← Back",
      next: "Next →",
      stepOf: "Step {n} of {t}",
      saved: "saved in your browser",
      incomplete: "Some data are missing: you can continue, and the Canvas will state how reliable the result is."
    },
    common: {
      select: "— select —",
      nd: "N/A · data not available",
      notAvailable: "n/a",
      bands: ["absent or marginal", "low", "medium", "high", "critical"],
      coverage: "Available items: {a} of {t}",
      lowRel: "Low reliability: fewer than 70% of the items are available, so the effective DMS drops to 2.",
      pending: "{n} items left: choose a value or “data not available”.",
      lowReliability: "low reliability",
      yes: "Yes",
      no: "No",
      optional: "optional"
    },
    intro: {
      title: "Assess your site's home-to-work mobility and help us validate the framework",
      lead: "This is version 2.0 of the Circular Commuting Canvas, aligned with the research article that describes the framework. In about 20 minutes you get a diagnosis of your site's inefficiencies, energy and emission indicators, and a prioritised intervention plan, also useful for your commuting plan (PSCL).",
      cards: [
        { t: "What you get", d: "A PDF report with the energy and emission baseline, the I1–I5 inefficiency diagnosis, the indicator dashboard and an A/B/C intervention plan." },
        { t: "What we ask", d: "Aggregate data about your site, no personal employee data. At the end, 2 minutes to evaluate the tool." },
        { t: "Anonymity", d: "The names of your organisation and site stay in your browser: researchers only receive aggregate, anonymous data." }
      ],
      dataTip: "Have at hand: employees by travel mode, average commuting distance, attendance days, shifts and site facilities. If a figure is missing you can mark it as not available: the Canvas carries on and states how reliable the result is.",
      resume: "You have an assessment in progress saved in this browser (last step: {step}).",
      resumeBtn: "Resume",
      restartBtn: "Start over",
      restartConfirm: "Delete the assessment saved in this browser and start over?"
    },
    research: {
      title: "The research project",
      p1: "The Circular Commuting Framework is described in the research article “An Energy-Aware Circular Commuting Framework for Corporate Mobility Management”.",
      p2: "The study classifies employee-commuting inefficiencies by the mechanism that generates them, translates them into physical indicators comparable across modes (kWh and gCO₂e per passenger-km) and ranks corrective interventions by expected benefit, available data and implementation complexity.",
      p3: "Mobility managers' assessments are used to test four properties: diagnostic completeness, dimensional coherence, applicability to variable information maturity and perceived decision-making usefulness.",
      authors: "Authors"
    },
    consent: {
      label: "I have read the privacy notice and consent to the processing of my answers, in anonymous form, for scientific research.",
      link: "Read the privacy notice",
      need: "Consent is required to start. If you prefer not to take part in the research, you can freely use version 1.0.",
      start: "Start the assessment →"
    },
    b1: {
      title: "Organisational profile and data maturity",
      q: "Do I have sufficient data?",
      orgName: "Organisation",
      siteName: "Site analysed",
      localHint: "Only for your report: it is not sent.",
      orgType: "Type of organisation",
      orgTypes: { private: "Private company", public: "Public administration", university: "University or research body", health: "Healthcare", other: "Other" },
      sector: "Sector",
      sectors: { manufacturing: "Manufacturing", energy: "Energy and utilities", construction: "Construction", retail: "Retail and wholesale", logistics: "Logistics and transport", finance: "Finance and insurance", ict: "ICT and professional services", education: "Education and research", health: "Health and social care", pa: "Public administration", other: "Other" },
      employees: "Employees at the site",
      region: "Region",
      abroad: "Outside Italy",
      shiftPct: "Employees working shifts (%)",
      pscl: "Commuting plan (PSCL)",
      psclOpts: { adopted: "Adopted", preparing: "In preparation", none: "Not planned" },
      dmsTitle: "Data Maturity Score (DMS): what data do you have on employee commuting?",
      dmsLevels: [
        { c: "No structured data", a: "no reliable diagnosis" },
        { c: "Basic questionnaire or generic descriptive data", a: "elementary modal analysis" },
        { c: "Aggregate origin-destination (O/D) data", a: "identification of main catchment areas" },
        { c: "O/D + shifts + modes", a: "temporal and modal diagnosis" },
        { c: "Data integrated with public transport, GIS and accessibility", a: "corridor design and targeted interventions" },
        { c: "Periodic monitoring and dashboards", a: "feedback loop and continuous management" }
      ],
      dmsAllows: "enables",
      dmsWarn: "With DMS < 2, data collection precedes any intervention: the plan will put building the baseline first."
    },
    b2: {
      title: "Real need for presence",
      q: "How much mobility is necessary?",
      qe: "Physical presence essential (%)",
      qp: "Partially remote-capable tasks (%)",
      qr: "Fully remote-capable tasks (%)",
      formula: "MNS = [(Qe × 5 + Qp × 3 + Qr × 1) − 100] / 4 · the three shares must add up to 100",
      sum: "Current total: {sum}%",
      sumWarn: "The three shares must add up to 100%.",
      bands: [
        { name: "Presence rarely necessary", reco: "main lever: work organisation (remote working, coworking)" },
        { name: "Presence partly necessary", reco: "mix of demand reduction and modal shift" },
        { name: "Presence structurally necessary", reco: "main lever: transport modes" }
      ],
      note: "Validate the classification with HR and operations managers."
    },
    b3: {
      title: "Baseline commuting",
      q: "What is the current energy cost?",
      oneWay: "Average home-to-work distance, one way (km)",
      days: "On-site days per year per employee",
      daysHint: "With remote working, count only days on site.",
      lead: "Enter how many employees usually use each mode. Distance and days apply to every row: change them row by row only if they differ.",
      cols: { mode: "Mode", n: "Employees", km: "km one way", days: "days/year" },
      sumCheck: "Employees by mode: {sum} of {tot} declared",
      sumOk: "ok",
      sumDiff: "different from the site total",
      params: "Vehicle parameters (e, o, k, φ)",
      paramsNote: "Default values derived from Tables 2.1–2.2 of the thesis (ISPRA 2024, EEA 2023, UITP 2022); motorcycle and e-bike values are indicative. Change them if you have real data, for instance average shuttle occupancy.",
      paramCols: { e: "e · kWh/vkm", o: "o · occupants", k: "k · seats", phi: "φ · gCO₂e/kWh", lf: "LF" },
      kpi: {
        A: "Transport activity", Aunit: "million pax-km/year",
        EI: "Energy intensity", EIunit: "kWh/pax-km",
        CI: "Emission intensity (CI)", CIunit: "gCO₂e/pax-km",
        G: "Annual emissions", Gunit: "tCO₂e/year"
      },
      formula: "(1) A = N·d·g · (2) EI = e/o · (3) LF = o/k · (4) G = A·EI·φ · (5) CI = ΣG/ΣA · with d = 2 × one-way km",
      empty: "Enter distance, days and at least one mode to compute the baseline."
    },
    b4: {
      title: "Alternative accessibility",
      q: "Are alternatives to the car available?",
      formula: "ACC = [(mean of available items − 1) / 4] × 100 · higher = better accessibility",
      items: [
        ["Walking time to the public transport stop", ["≤ 5 min", "5–10 min", "10–15 min", "15–25 min", "> 25 min or none"]],
        ["Distance to the railway station", ["≤ 10 min, direct and frequent", "10–15 min", "15–25 min or 1 change", "25–40 min or unreliable", "not usable"]],
        ["Public transport frequency at start and end of work", ["≤ 15 min", "16–30 min", "31–60 min", "> 60 min or irregular", "none"]],
        ["Public transport compatibility with shifts", ["full coverage", "good (wait < 15 min)", "partial (15–30 min)", "only some time slots", "none"]],
        ["Last-mile safety", ["safe, lit, continuous", "safe, minor issues", "usable, significant issues", "unsafe or uncomfortable", "unsafe or not walkable"]],
        ["Cycling and walking infrastructure", ["continuous and protected", "almost complete", "partial but usable", "fragmented", "none"]],
        ["On-site facilities for active mobility", ["racks, showers, lockers and policy", "racks + 1 facility", "racks, limited facilities", "minimal or unsafe", "none"]]
      ],
      bands: [
        { name: "Critical accessibility", reco: "car alternatives hardly practicable" },
        { name: "Low accessibility", reco: "modal shift difficult without interventions" },
        { name: "Good accessibility", reco: "real room for modal shift" },
        { name: "Excellent accessibility", reco: "immediate modal-shift levers" }
      ]
    },
    b5: {
      title: "Car dependency",
      q: "How structural is car use?",
      formula: "CDR = [(mean of available items − 1) / 4] × 100 · higher = greater dependency",
      items: [
        ["Share of cars with driver alone", ["> 80%", "61–80%", "41–60%", "21–40%", "≤ 20%"]],
        ["Free company parking", ["guaranteed and plentiful", "ample but not guaranteed", "partial or near saturation", "limited or paid", "none or paid"]],
        ["Ease of access by car", ["very easy, competitive", "generally easy", "moderate congestion", "often congested", "difficult or discouraged"]],
        ["Shifts not covered by public transport", ["> 75% not covered", "51–75%", "26–50%", "1–25%", "covered or almost"]],
        ["Last-mile alternatives", ["no alternative", "very inconvenient or unsafe", "partial", "available but improvable", "effective last mile"]]
      ],
      bands: [
        { name: "Low dependency", reco: "not a car-centred structure" },
        { name: "Medium dependency", reco: "room to reduce driving alone" },
        { name: "High dependency", reco: "act on structure and incentives" },
        { name: "Critical dependency", reco: "infrastructure and governance first, then behaviour" }
      ],
      joint: "Joint reading: high ACC and low CDR → immediate modal-shift levers; low ACC and high CDR → infrastructure or territorial governance interventions first."
    },
    b6: {
      title: "Circular inefficiencies",
      q: "Where is waste generated?",
      lead: "Three inefficiencies are derived from the indices already computed (CDR → I1, ACC → I4, MNS → I5); I2 and I3 require your direct assessment. If you disagree with a derived value, correct it and state why: corrections are valuable validation data.",
      names: { I1: "Underutilised capacity", I2: "Modal duplication", I3: "Temporal mismatch", I4: "Last-mile friction", I5: "Avoidable demand not intercepted" },
      desc: {
        I1: "A vehicle operates with a low occupancy rate, such as a car with one occupant or a half-empty bus: it consumes energy and space but spreads them over few passengers.",
        I2: "Several services cover similar corridors, time slots or catchment areas without coordination.",
        I3: "The alternative to individual car use is not compatible with actual working hours.",
        I4: "Public transport exists but does not allow convenient and safe access to the site.",
        I5: "The organisation does not distinguish between necessary and avoidable travel, generating more demand than needed."
      },
      why: {
        I1: "From CDR = {v}: the more structural driving alone is, the greater the latent private capacity.",
        I4: "From ACC = {v}, inverted: the easier the site is to reach without a car, the lower the friction.",
        I5: "From MNS = {v}, inverted: the more tasks can be done remotely, the higher the avoidable demand."
      },
      rule: "Consistency rule: MNS < 50 with {d} attendance days a week → at least “high”.",
      missing: { I1: "Complete block 5 (CDR) to derive it.", I4: "Complete block 4 (ACC) to derive it.", I5: "Complete block 2 (MNS) to derive it." },
      direct: "Direct assessment",
      rubric: {
        I2: ["no duplicated services", "occasional duplication", "services partly overlapping by corridor or time slot", "evident duplication between companies, shuttles or parallel services", "several uncoordinated services serve the same areas with low occupancy"],
        I3: ["public transport and services compatible with almost all schedules", "issues limited to some time slots", "partial coverage of main shifts or schedules", "many start and end times not served", "main shifts not covered by sustainable alternatives"]
      },
      hints: {
        I2: "Compare the company shuttle ({n} users) with public transport lines on the same corridors and with services of nearby companies.",
        I2none: "There is no company shuttle in the baseline: consider any parallel services run by other companies or public transport.",
        I3: "Hints from previous blocks: public transport–shift compatibility {a} · shifts not covered {b} · shift workers {c}."
      },
      correct: "Correct",
      auto: "automatic",
      reason: "Reason for the correction",
      notePh: "Note (optional)",
      corrected: "corrected by hand",
      source: "source",
      prevailing: "Prevailing inefficiency",
      none: "Complete the previous blocks to generate the diagnosis.",
      observedNote: "Inefficiencies scoring ≥ 41, i.e. “medium” or above, count as observed: the framework proposes interventions only for these."
    },
    b7: {
      title: "Interventions, governance and priority",
      q: "What should be done first?",
      lead: "The framework only proposes interventions linked to an observed inefficiency, following the inefficiency-intervention matrix (Table 1). For each one we estimate the emission reduction (ΔG, eq. 6) and turn it into an impact score from 1 to 5, which you can correct. Answer the other questions: the IPI is computed automatically.",
      dataFirst: "Effective DMS {d}: the baseline must be built first (commuting survey with origins, shifts and modes). Interventions requiring O/D matrices, shift structures or public transport accessibility cannot score above 2 for data availability.",
      noObserved: "No inefficiency reaches the “medium” level: the framework proposes no interventions. Repeat the diagnosis at the next update of your commuting plan.",
      primary: "primary",
      complementary: "complementary",
      include: "Evaluate this intervention",
      lever: {
        shift: "Share of driver-alone pax-km moving to: {to}",
        cut: "Share of shuttle runs removed or optimised",
        avoid_acr: "Share of avoidable demand (ACR {acr}%) actually avoided",
        avoid_total: "Share of pax-km avoided"
      },
      estimate: "Estimated reduction (ΔG): {t} tCO₂e/year, {p}% of baseline → proposed impact {i}/5",
      estimateNeg: "With these parameters the intervention does not reduce emissions (ΔG = {t} tCO₂e/year): proposed impact 1/5.",
      reasons: {
        not_modelled: "Effect not estimable from single-site data: set the impact yourself.",
        no_baseline: "Complete the baseline (block 3) to estimate ΔG.",
        no_source: "There are no driver-alone commuters in the baseline.",
        no_service: "There is no company shuttle in the baseline: the intervention does not apply as it stands.",
        no_acr: "Complete MNS and baseline to estimate avoidable demand."
      },
      qs: {
        impact: "Expected energy impact",
        data: "Data readiness: how solid are the data to design and measure it?",
        acc: "Organisational acceptability: how likely is it to be accepted?",
        cost: "Estimated cost",
        gcs: "Governance complexity (GCS): who must be involved?"
      },
      answers: {
        impact: ["1 · marginal or not estimable impact", "2 · limited reduction", "3 · medium reduction", "4 · high reduction", "5 · very high reduction"],
        data: ["1 · insufficient data", "2 · weak data, many assumptions", "3 · sufficient but incomplete data", "4 · good data, few assumptions", "5 · complete, up-to-date data"],
        acc: ["1 · strong opposition or high risk", "2 · expected resistance", "3 · uncertain acceptability", "4 · good acceptability", "5 · strong support, low risk"],
        cost: ["1 · none or very low", "2 · low", "3 · medium", "4 · high", "5 · very high or structural investment"],
        gcs: ["1 · simple internal (communication, small incentives)", "2 · internal, several functions (remote working, parking policy)", "3 · with external suppliers (shuttle, carpooling, bike service)", "4 · with public actors or transport operators (stops, timetables, municipal agreements)", "5 · multi-actor coalition (several companies, municipality, public transport, area MM)"]
      },
      proposed: "proposed",
      up: "raises priority",
      down: "lowers priority",
      capped: "capped at 2 by DMS",
      govPlan: "GCS ≥ 4: an explicit governance plan is required.",
      cls: { A: "Ready for immediate implementation", B: "To be scheduled, investigated or piloted", C: "To be postponed or made conditional on prerequisites" },
      priority: "Priority",
      formula: "IPI = (Impact × Data × Acceptability) / (Cost × GCS) · A > 12 · B 6–12 · C < 6",
      bandsNote: "Impact proposed from ΔG as % of baseline: < 1% → 1 · 1–3% → 2 · 3–7% → 3 · 7–15% → 4 · ≥ 15% → 5. First-application bands, to be calibrated.",
      incomplete: "Answer the questions to compute the IPI."
    },
    interventions: {
      i1_lf: "Increase the load factor of existing collective services",
      i1_carpool: "Organised carpooling",
      i1_rightsize: "Trip merging and vehicle right-sizing",
      i1_ptdeal: "Load agreements with the public transport operator",
      i2_coord: "Coordinate the company service and public transport on overlapping corridors",
      i2_convert: "Redirect the company service to unserved catchment areas",
      i2_coalition: "Join territorial coalitions of organisations",
      i3_align: "Align start and end times with public transport service windows",
      i3_ondemand: "On-call services for uncovered time slots",
      i3_stagger: "Staggered shifts",
      i4_equip: "On-site equipment for active mobility",
      i4_route: "Make the access route to the site safe",
      i4_feeder: "Transfer shuttle to the interchange hub",
      i4_micro: "Shared micromobility",
      i5_remote: "Extend remote working to tasks that do not require physical presence",
      i5_cowork: "Proximity coworking",
      i5_redistribute: "Redistribute attendance days to avoid concentrated flows"
    },
    modes: {
      car_solo: "Petrol/diesel car · driver alone",
      car_pool: "Petrol/diesel car · carpool",
      car_ev: "Electric car",
      moto: "Motorcycle or scooter",
      shuttle: "Company shuttle (diesel)",
      bus: "Public bus (diesel)",
      bus_el: "Electric bus",
      train: "Train or metro",
      ebike: "E-bike or e-scooter",
      active: "Bicycle or walking"
    },
    results: {
      title: "Results",
      q: "The four Canvas outputs",
      lead: "Review the results, then evaluate the tool to download the PDF report.",
      eyebrow: "Circular Commuting Framework 2.0 · diagnostic report",
      untitled: "Organisation not specified",
      generated: "Report generated on {date} · engine {v}",
      s1: "1 · Baseline report",
      s2: "2 · Diagnostic framework",
      s3: "3 · Indicator dashboard",
      s4: "4 · Intervention plan",
      dmsDeclared: "Declared DMS",
      dmsEffective: "Effective DMS",
      cols: { mode: "Mode", n: "Employees", share: "Share", paxkm: "pax-km/year", g: "tCO₂e/year", ei: "EI kWh/pax-km", lf: "LF", ci: "CI gCO₂e/pax-km" },
      total: "Total",
      causal: "Causal scores",
      acr: "Avoidable demand (ACR, eq. 7)",
      acrText: "{p}% of activity: {d} attendance days a week against {n} necessary",
      acrNa: "not computable: MNS and baseline are needed",
      ciSys: "System emission intensity (CI, eq. 5)",
      eiSys: "System energy intensity",
      dg: "Expected reduction by intervention (ΔG, eq. 6)",
      planEmpty: "No intervention evaluated.",
      d0: "Build the baseline: commuting survey with origins, shifts and modes",
      d0note: "Priority set by DMS < 2: it precedes any intervention.",
      monitor: "Monitoring and review",
      monitorCols: { intv: "Intervention", ind: "Indicator", freq: "Frequency", owner: "Owner" },
      freq: { quarterly: "Quarterly", semiannual: "Every six months", annual: "Yearly" },
      owners: { mm: "Mobility manager", hr: "HR", facility: "Facility / operations", management: "Management", supplier: "External supplier" },
      indicators: {
        load_factor: "Load factor of collective services and share of driver-alone cars",
        service_overlap: "Overlap between company service and public transport",
        time_coverage: "Time coverage of start and end times",
        active_access_share: "Share of site access by active mobility",
        avoided_commuting: "Avoided commuting (days and pax-km)"
      },
      systemInd: "System indicators: CI (eq. 5) and ΔG (eq. 6), updated in parallel.",
      review: "Plan review: at the next update of the commuting plan.",
      toFeedback: "Next: evaluate the tool →",
      foot: "Circular Commuting Framework · circularcommuting.it"
    },
    feedback: {
      title: "Evaluate the tool",
      q: "2 minutes",
      lead: "Your answers measure the framework's decision-making usefulness, one of the study's validation criteria. After submitting you can download the PDF report.",
      scale: ["Strongly disagree", "Disagree", "Neither agree nor disagree", "Agree", "Strongly agree"],
      items: {
        f1: "The diagnosis of inefficiencies is understandable.",
        f2: "The prevailing inefficiency matches my knowledge of the site.",
        f3: "The link between inefficiencies and proposed interventions is plausible.",
        f4: "The priority order helps me identify which actions to take first.",
        f5: "The required data were available in my organisation.",
        f6: "I would use the tool to prepare or update the commuting plan (PSCL)."
      },
      c1: "Are there inefficiencies at your site that the five categories do not describe?",
      c1text: "Which ones?",
      c2: "Did any problem fall into more than one category at the same time?",
      c2text: "Which one?",
      role: "Your role",
      roles: { mm_company: "Company mobility manager", mm_area: "Area mobility manager", hr: "HR or welfare", esg: "Sustainability / ESG", facility: "Facility / operations", consultant: "Consultant", other: "Other" },
      experience: "Experience in mobility management",
      exp: { lt1: "Less than 1 year", y1_3: "1–3 years", y3_5: "3–5 years", gt5: "More than 5 years" },
      channel: "How did you hear about the tool? (optional)",
      channels: { linkedin: "LinkedIn", newsletter: "Newsletter or event", network: "Colleague or professional network", search: "Web search", other: "Other" },
      open: "What would you change or add? (optional)",
      contact: "I am available to be contacted for a short interview about the results (optional)",
      email: "Email",
      contactNote: "Your email is stored separately and is not linked to your answers.",
      required: "To submit, answer the six statements and the two category questions, and select your role and experience.",
      submit: "Submit and download the report",
      invalidEmail: "Please check the email address."
    },
    thanks: {
      title: "Done!",
      body: "Thank you for contributing to the validation of the framework.",
      syncing: "Sending your answers… If you close the page, sending completes on your next visit.",
      synced: "✓ Answers saved",
      code: "Response code: {code}",
      codeNote: "Keep it if you want to request access to or deletion of your data.",
      download: "Download the PDF report",
      printHint: "In the print dialog choose “Save as PDF”.",
      newRun: "New assessment",
      newConfirm: "Start a new assessment? The current one will be deleted from this browser."
    },
    privacy: {
      title: "Privacy notice",
      sections: [
        ["Who processes the data", "Enrico Emanuele Corazzini, who runs this website and the data collection on behalf of the authors of the study listed on this page. For any request, use the form at the end of this notice."],
        ["What data we collect", "Your answers to the Canvas blocks (aggregate site data: type and sector of the organisation, number of employees, region, modal split, scores), the computed results, any corrections with their reasons, your answers to the evaluation questionnaire and minimal technical data (language, tool version, completion times). We do not collect the name of the organisation or site, which stay in your browser, data on individual employees, or your IP address. We do not use cookies."],
        ["Optional email", "Only if you choose to be contacted. It is stored separately, with no link to your answers, and deleted at the end of the project."],
        ["Why", "For the scientific validation of the framework and statistical analysis. Results are published only in aggregate form, without any possibility of identifying individual organisations."],
        ["Legal basis", "Your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time without affecting processing already carried out."],
        ["Where and for how long", "In a Google spreadsheet accessible only to the authors. Google may process data outside the European Union with the required safeguards (EU-US Data Privacy Framework). Anonymous answers are kept for the duration of the research project and subsequent scientific verification."],
        ["Your rights", "Access, rectification, erasure, restriction, objection and withdrawal of consent (Arts. 15–22 GDPR), quoting the response code you receive at the end. You also have the right to lodge a complaint with the Italian Data Protection Authority (Garante)."],
        ["Saving in your browser", "So you do not lose your work, answers are also saved in your browser (localStorage). They stay on your device and you can delete them with “Start over”."]
      ],
      close: "Close",
      requestTitle: "Request about your data",
      requestCode: "Response code (if you have it)",
      requestKind: "Type of request",
      requestKinds: { delete: "Erasure", access: "Access", other: "Other" },
      requestMessage: "Message",
      requestEmail: "Email for our reply",
      requestSend: "Send request",
      requestSent: "Request sent. We will reply to the address provided.",
      requestError: "Sending failed: check the email and try again."
    },
    footer: {
      beta: "Framework & Canvas 2.0 beta · engine {v}",
      privacy: "Privacy notice",
      v1: "Version 1.0"
    }
  }
};
