/* Testi della beta 2.0 — italiano (predefinito) e inglese. La terminologia inglese segue l'articolo.
   Le sigle (DMS, MNS, ACC, CDR, I1–I5, GCS, IPI) compaiono solo nei risultati e nel pannello "?". */
window.CCF_I18N = {
  it: {
    meta: {
      title: 'Circular Commuting · Beta 2.0',
      description: 'Scopri dove si spreca energia negli spostamenti casa-lavoro della tua sede e quali interventi fare per primi. Versione in validazione scientifica.'
    },
    ui: {
      back: 'Indietro', next: 'Avanti', start: "Inizia l'analisi", startChapter: 'Inizia', skip: 'Salta',
      dontKnow: 'Non lo so', saved: 'Salvato nel browser', chapterOf: 'Capitolo {n} di {t}',
      helpAria: "Cosa c'è in questa schermata?", helpEyebrow: "Cosa c'è a schermo", helpFw: 'Nel framework', close: 'Chiudi',
      factLabel: 'Lo sapevi?', chapterMeta: '{n} domande · circa {m} min', keysHint: 'Puoi rispondere con i tasti numerici e andare avanti con Invio.',
      estimateTag: 'Stima dai tuoi dati', presetTag: 'Proposto', optional: 'facoltativo',
      restart: 'Ricomincia da capo', restartConfirm: "Vuoi cancellare l'analisi salvata in questo browser e ricominciare?",
      resumeTitle: 'Bentornato', resumeText: 'Hai un\'analisi in corso in questo browser, al capitolo «{chapter}».', resumeBtn: 'Riprendi',
      home: 'Home', langAria: 'Lingua / Language', people: 'persone', km: 'km', percent: '%', edit: 'Modifica'
    },
    chapters: ['Benvenuto', 'La sede', 'Presenza', 'Spostamenti', "Alternative all'auto", "Il ruolo dell'auto", 'Dove si spreca', 'Cosa fare', 'Risultati', 'Valutazione'],
    chapterIntro: {
      1: { title: 'La sede', desc: 'Chi siete e quali dati avete già sugli spostamenti.' },
      2: { title: 'Chi deve davvero essere in sede', desc: 'Quanta presenza serve, e quanta si potrebbe evitare.' },
      3: { title: 'Come arrivate oggi', desc: 'Distanze e mezzi: da qui calcoliamo energia ed emissioni.' },
      4: { title: "Le alternative all'auto", desc: 'Sette domande su fermate, orari e percorsi intorno alla sede.' },
      5: { title: "Il ruolo dell'auto", desc: "Cinque domande su quanto l'auto è strutturale." },
      6: { title: 'Dove si spreca', desc: 'Cinque possibili inefficienze. Per tre ti proponiamo una stima dai tuoi dati: correggila se non ti convince.' },
      7: { title: 'Cosa fare, in che ordine', desc: 'Il framework propone solo interventi che correggono le inefficienze emerse. Per ciascuno, tre valutazioni rapide.' },
      9: { title: 'La tua valutazione', desc: 'Sei frasi, una alla volta: ci dici quanto sono vere. È la parte che valida il framework.' }
    },

    intro: {
      eyebrow: 'Beta 2.0 · validazione scientifica',
      title: 'Scopri dove si spreca energia negli spostamenti casa-lavoro della tua sede.',
      lede: 'Domande brevi, una alla volta. Alla fine ottieni il profilo di criticità della sede, le emissioni della mobilità casa-lavoro e un piano di interventi in ordine di priorità, utile anche per il PSCL.',
      meta: [['12 min', 'durata stimata'], ['8', 'capitoli'], ['PDF', 'report finale']],
      cards: [
        { icon: 'radar', t: 'Cosa ottieni', d: 'Il profilo di criticità della sede, le emissioni per passeggero-km e un piano di interventi in classi A, B e C.' },
        { icon: 'clock', t: 'Cosa ti chiediamo', d: 'Dati aggregati della sede, nessun dato personale dei dipendenti. Alla fine, sei frasi da valutare.' },
        { icon: 'lock', t: 'Anonimato', d: "Il nome dell'organizzazione resta nel tuo browser. Ai ricercatori arrivano solo risposte anonime." }
      ],
      researchTitle: 'Il progetto di ricerca',
      research: [
        'Il Circular Commuting Framework è descritto nell\'articolo di ricerca «{title}».',
        "Lo studio classifica le inefficienze del commuting aziendale in base al meccanismo che le genera, le traduce in indicatori fisici confrontabili tra modalità (kWh e CO₂e per passeggero-km) e ordina gli interventi secondo beneficio atteso, dati disponibili e complessità attuativa.",
        'Le analisi dei mobility manager servono a verificarne quattro proprietà: completezza della diagnosi, coerenza degli indicatori, applicabilità con diversi livelli di maturità del dato e utilità decisionale percepita.'
      ],
      authorsTitle: 'Gli autori',
      consent: "Ho letto l'informativa privacy e acconsento al trattamento delle mie risposte, in forma anonima, a fini di ricerca scientifica.",
      consentLink: "Leggi l'informativa",
      consentNeed: 'Per iniziare serve il consenso. Se preferisci non partecipare alla ricerca, puoi usare liberamente la versione semplificata.',
      liteLink: 'Vai alla versione semplificata'
    },

    q: {
      orgType: { title: 'Che tipo di organizzazione è la tua?' },
      sector: { title: 'In quale settore opera?' },
      employees: { title: 'Quante persone lavorano nella sede?', sub: "Se l'organizzazione ha più sedi, scegline una: il framework lavora sede per sede." },
      region: { title: 'In quale regione si trova la sede?', groups: ['Nord', 'Centro', 'Sud e isole'], abroad: 'Fuori Italia' },
      shifts: { title: 'Quante persone lavorano su turni?', sub: 'Una stima va benissimo.' },
      pscl: { title: 'Avete un Piano degli spostamenti casa-lavoro?', sub: 'Il PSCL.' },
      dms: { title: 'Quali dati avete oggi sugli spostamenti dei dipendenti?', sub: 'Scegli il livello più alto che vi descrive davvero.' },
      mns: { title: 'Pensa alle mansioni della sede: quanta presenza richiedono?', sub: 'Trascina i due cursori per dividere il 100% delle persone.', seg: ['Presenza sempre necessaria', 'In parte da remoto', 'Del tutto da remoto'], aria: ['Confine tra presenza necessaria e lavoro in parte da remoto', 'Confine tra lavoro in parte e del tutto da remoto'] },
      daysWeek: { title: 'In media, quanti giorni a settimana si viene in sede?', sub: 'Conta solo i giorni in presenza, per tutte le persone della sede.', unit: ['giorno', 'giorni'] },
      distance: { title: 'Quanti chilometri si percorrono in media, solo andata?', sub: 'Una stima va bene: nel passaggio successivo puoi affinarla per mezzo.' },
      modes: {
        title: 'Come arrivano in sede?', sub: 'Indica quante persone usano abitualmente ciascun mezzo. Totale della sede: {tot}.',
        assigned: '{sum} su {tot} assegnate', remaining: 'ne restano {n}', over: '{n} oltre il totale', fill: 'Assegna i restanti',
        teaser: '≈ {t} t CO₂e all\'anno', teaserNone: 'Aggiungi almeno un mezzo per stimare le emissioni',
        advanced: 'Parametri dei veicoli, per esperti',
        advancedNote: "Valori di partenza ricavati dalle Tab. 2.1–2.2 della tesi (ISPRA 2024, EEA 2023, UITP 2022); moto ed e-bike sono indicativi. Cambiali se hai dati reali, per esempio l'occupazione media della navetta.",
        paramCols: { mode: 'Mezzo', e: 'e · kWh/vkm', o: 'o · occupanti', k: 'k · posti', phi: 'φ · gCO₂e/kWh', lf: 'LF' }
      },
      modeDistances: { title: 'Qualche mezzo fa tragitti diversi dalla media?', sub: 'Per bici e mobilità elettrica leggera proponiamo distanze più brevi. Se ti sembrano giuste, vai avanti.' },
      acc: [
        { icon: 'busStop', title: 'Quanto dista a piedi la fermata del trasporto pubblico più vicina?', options: ['Meno di 5 minuti', '5–10 minuti', '10–15 minuti', '15–25 minuti', 'Oltre 25 minuti, o nessuna fermata'] },
        { icon: 'train', title: 'E la stazione ferroviaria?', options: ['Entro 10 minuti, con treni diretti e frequenti', '10–15 minuti', '15–25 minuti, o con un cambio', '25–40 minuti, o poco affidabile', 'Non utilizzabile'] },
        { icon: 'frequency', title: 'Ogni quanto passano bus o tram negli orari di entrata e uscita?', options: ['Ogni 15 minuti o meno', 'Ogni 16–30 minuti', 'Ogni 31–60 minuti', 'Oltre un\'ora, o in modo irregolare', 'Non passano'] },
        { icon: 'clock', title: 'Il trasporto pubblico copre gli orari di lavoro, turni compresi?', options: ['Sì, completamente', 'Bene, con attese sotto i 15 minuti', 'In parte, con attese di 15–30 minuti', 'Solo alcune fasce', 'No'] },
        { icon: 'shield', title: 'Il tragitto a piedi dalla fermata alla sede è sicuro?', options: ['Sicuro, illuminato e continuo', 'Sicuro, con piccole criticità', 'Percorribile, ma con criticità rilevanti', 'Poco sicuro o scomodo', 'Non sicuro o non pedonale'] },
        { icon: 'lane', title: 'Com\'è la rete ciclabile e pedonale intorno alla sede?', options: ['Continua e protetta', 'Quasi completa', 'Parziale ma usabile', 'Frammentata', 'Assente'] },
        { icon: 'lockers', title: 'Cosa trova in sede chi arriva in bici?', options: ['Rastrelliere, docce, spogliatoi e una policy', 'Rastrelliere e un\'altra dotazione', 'Solo rastrelliere', 'Poco o nulla, e non sicuro', 'Niente'] }
      ],
      cdr: [
        { icon: 'carSolo', title: 'Quante auto arrivano con una sola persona a bordo?', options: ["Oltre l'80%", '61–80%', '41–60%', '21–40%', '20% o meno'] },
        { icon: 'parking', title: 'Il parcheggio aziendale è gratuito?', options: ['Sì, garantito e abbondante', 'Sì, ampio ma non garantito', 'Sì, ma spesso saturo', 'Limitato o a pagamento', 'Assente o a pagamento'] },
        { icon: 'gauge', title: 'Quanto è facile arrivare in sede in auto?', options: ['Molto facile, più di ogni alternativa', 'Generalmente facile', 'Con traffico moderato', 'Spesso nel traffico', 'Difficile o scoraggiato'] },
        { icon: 'clock', title: 'Quanti turni restano scoperti dal trasporto pubblico?', options: ['Oltre il 75%', '51–75%', '26–50%', '1–25%', 'Nessuno o quasi'] },
        { icon: 'lastMile', title: "Chi scende dal mezzo pubblico ha alternative per l'ultimo tratto?", options: ['Nessuna', 'Molto scomode o poco sicure', 'Parziali', 'Presenti ma migliorabili', 'Sì, efficaci'] }
      ],
      ineff: {
        I1: { name: 'Capacità sottoutilizzata', title: 'Quanto viaggiano vuoti i mezzi che portano le persone in sede?', options: ['Quasi pieni: pochi posti liberi, poche auto con una sola persona', 'Qualche posto libero, ma poco', 'Occupazione media, o parecchie auto con una sola persona', 'Mezzi collettivi poco pieni, o molte auto con una sola persona', "Mezzi molto vuoti, o domina l'auto con una sola persona"] },
        I2: { name: 'Duplicazione modale', title: 'Navette, autobus e servizi di altre aziende si sovrappongono su percorsi e orari?', options: ['No, nessun servizio duplicato', 'Solo ogni tanto', 'In parte, su alcuni percorsi o fasce orarie', 'Sì, sovrapposizioni evidenti', 'Sì: più servizi non coordinati e poco pieni sugli stessi percorsi'] },
        I3: { name: 'Mismatch temporale', title: 'Gli orari dei mezzi alternativi all\'auto sono compatibili con quelli di lavoro?', options: ['Sì, con quasi tutti gli orari', 'Sì, salvo alcune fasce', 'Solo in parte: turni o orari principali coperti a metà', 'Poco: molti ingressi e uscite restano scoperti', "No: i turni principali non hanno alternative all'auto"] },
        I4: { name: "Frizione dell'ultimo miglio", title: "Dalla fermata alla sede, l'ultimo tratto è comodo e sicuro?", options: ['Sì: breve, sicuro e continuo', 'Quasi sempre, con piccole criticità', 'Si fa, ma è scomodo', 'È lungo, poco sicuro o interrotto', "Di fatto impedisce di arrivare senza auto"] },
        I5: { name: 'Domanda evitabile', title: 'Le persone vengono in sede più di quanto il lavoro richieda?', options: ['No, la presenza è quasi sempre necessaria', 'Poco: poche mansioni si possono fare da remoto', 'In parte: diverse mansioni si possono fare da remoto', 'Sì: si potrebbe ridurre una quota ampia di presenza', 'Molto: la presenza effettiva supera di molto quella necessaria'] },
        estimate: 'Dai tuoi dati stimiamo una criticità {band}. Se la vedi diversamente, scegli un\'altra risposta.',
        estimateNone: 'Con i dati inseriti non possiamo stimarla: scegli la risposta che descrive meglio la sede.',
        reason: 'Cosa te la fa vedere diversamente? Facoltativo, ma ci aiuta molto.',
        dontKnow: 'Non so valutarlo',
        hintI2: 'Nella tua sede {n} persone usano la navetta aziendale: pensa a percorsi e orari che condivide con i bus.',
        hintI2none: 'Non ci hai indicato navette aziendali: pensa a servizi paralleli di altre aziende o del trasporto pubblico.',
        hintI3: 'Ci hai detto che il trasporto pubblico copre gli orari così: «{a}». Lavora su turni il {c}% delle persone.'
      },
      ivSelect: {
        title: 'Il framework ha selezionato {n} interventi per la tua sede.', titleOne: 'Il framework ha selezionato un intervento per la tua sede.',
        sub: 'Correggono le inefficienze emerse. I principali sono già selezionati: aggiungi i complementari che vuoi valutare.',
        none: 'Nessuna inefficienza raggiunge un livello medio: il framework non propone interventi. Puoi andare ai risultati.',
        dataFirst: 'Prima di tutto va rafforzata la base dati: con i dati di oggi, gli interventi che richiedono origini e destinazioni, turni o accessibilità dei mezzi pubblici partono con un punteggio dati basso.',
        primary: 'principale', complementary: 'complementare', treats: 'Corregge: {name}'
      },
      iv: {
        eyebrow: 'Intervento {k} di {n} · corregge: {name}',
        reduction: 'Riduzione stimata', unit: "t CO₂e all'anno", pct: '{p}% delle emissioni attuali',
        negative: 'Con queste ipotesi non riduce le emissioni',
        reasons: {
          not_modelled: 'Effetto non stimabile dai dati di una singola sede: indica tu l\'impatto qui sotto.',
          no_baseline: 'Completa distanze e mezzi per stimare la riduzione.',
          no_source: 'Non ci sono persone che arrivano in auto da sole.',
          no_service: 'Non hai indicato una navetta aziendale: così com\'è, questo intervento non si applica.',
          no_acr: 'Completa presenza e giorni in sede per stimare la domanda evitabile.'
        },
        lever: {
          shift: 'Ipotesi: passa a «{to}» il {pct}% dei km fatti in auto da soli',
          cut: 'Ipotesi: si eliminano o accorpano il {pct}% delle corse della navetta',
          avoid_acr: 'Ipotesi: si evita il {pct}% della domanda evitabile ({acr}% del totale)',
          avoid_total: 'Ipotesi: si evita il {pct}% dei km percorsi'
        },
        qCost: 'Quanto costa realizzarlo?', cost: ['Quasi nulla', 'Poco', 'Abbastanza', 'Molto', 'Moltissimo'],
        qAcc: 'Quanto sarebbe accettato in azienda?', acc: ['Forte opposizione', 'Resistenze prevedibili', 'Incerto', 'Buona accoglienza', 'Forte consenso'],
        qData: 'Quanto sono solidi i dati per progettarlo e misurarlo?', data: ['Insufficienti', 'Deboli', 'Sufficienti ma incompleti', 'Buoni', 'Completi e aggiornati'],
        qGcs: 'Chi va coinvolto?', gcs: ['Solo il mio ufficio', 'Più funzioni interne', 'Fornitori esterni', 'Comune o trasporto pubblico', 'Più aziende ed enti insieme'],
        qImpact: 'Impatto sulle emissioni', impact: ['Marginale', 'Limitato', 'Medio', 'Elevato', 'Molto elevato'],
        capped: 'Con i dati di oggi questo punteggio può arrivare al massimo a 2.',
        govPlan: 'Serve un piano di governance esplicito.',
        pending: 'Rispondi alle tre domande per vedere la priorità.',
        priority: 'Priorità {c}', ipi: 'indice {v}',
        cls: { A: "Candidabile all'attuazione immediata", B: 'Da programmare, approfondire o testare', C: 'Da rimandare o subordinare a precondizioni' },
        presetGcs: 'proposto per questo tipo di intervento', presetImpact: 'stimato dalla riduzione di emissioni'
      },
      results: {
        eyebrow: 'Risultati', title: 'Il profilo di criticità della tua sede',
        sub: "Più l'ottagono è ampio, più la sede è esposta a sprechi e ostacoli. Ogni vertice è una dimensione del framework, su una scala da 0 a 100.",
        axes: { I1: 'Capacità sottoutilizzata', I2: 'Duplicazione modale', I3: 'Mismatch temporale', I4: 'Ultimo miglio', I5: 'Domanda evitabile', CI: 'Intensità emissiva', DATA: 'Dati mancanti', GOV: 'Complessità attuativa' },
        prevailing: 'Inefficienza prevalente', noPrevailing: 'Nessuna inefficienza valutata',
        kpi: { g: ['Emissioni annue', 't CO₂e'], ci: ['Intensità emissiva', 'g CO₂e per passeggero-km'], ei: ['Intensità energetica', 'kWh per passeggero-km'], acr: ['Domanda evitabile', 'dei passeggeri-km'] },
        dataFirst: 'Con un livello dei dati sotto 2, il primo passo del piano è costruire la baseline.',
        lowRel: 'Alcune risposte mancano: il livello effettivo dei dati scende a 2 e il risultato va letto con cautela.',
        ineffTitle: 'Le cinque inefficienze', planTitle: 'Piano di intervento', monitorTitle: 'Monitoraggio',
        nameTitle: 'Dai un nome al report', nameNote: 'Resta nel tuo browser: non viene inviato.', orgName: 'Organizzazione', siteName: 'Sede',
        toEval: 'Valuta lo strumento e scarica il report',
        d0: 'Costruire la baseline: indagine casa-lavoro con origini, turni e mezzi', d0note: 'Priorità imposta dal livello dei dati: precede ogni intervento.',
        planEmpty: 'Nessun intervento valutato.', noCandidates: 'Nessuna inefficienza raggiunge un livello medio: il framework non propone interventi.',
        monitorCols: { intv: 'Intervento', ind: 'Indicatore', freq: 'Frequenza', owner: 'Responsabile' },
        freq: { quarterly: 'Trimestrale', semiannual: 'Semestrale', annual: 'Annuale' },
        owners: { mm: 'Mobility manager', hr: 'HR', facility: 'Facility / operations', management: 'Direzione', supplier: 'Fornitore esterno' },
        indicators: {
          load_factor: 'Load factor dei servizi collettivi e quota di auto con una sola persona',
          service_overlap: 'Sovrapposizione tra servizio aziendale e trasporto pubblico',
          time_coverage: 'Copertura temporale di ingressi e uscite',
          active_access_share: 'Quota di accessi alla sede con mobilità attiva',
          avoided_commuting: 'Commuting evitato, in giorni e passeggeri-km'
        },
        systemInd: 'Indicatori di sistema: intensità emissiva (eq. 5) e riduzione delle emissioni (eq. 6), aggiornati in parallelo. Revisione del piano al prossimo aggiornamento del PSCL.',
        report: {
          eyebrow: 'Circular Commuting Framework 2.0 · report diagnostico', untitled: 'Organizzazione non indicata',
          generated: 'Report generato il {date} · motore {v}',
          s1: '1 · Baseline', s2: '2 · Quadro diagnostico', s3: '3 · Indicatori', s4: '4 · Piano di intervento',
          dmsDeclared: 'Livello dei dati dichiarato', dmsEffective: 'Livello dei dati effettivo',
          cols: { mode: 'Mezzo', n: 'Persone', share: 'Quota', paxkm: 'pax-km/anno', g: 't CO₂e/anno', ei: 'kWh/pax-km', lf: 'Load factor', ci: 'g CO₂e/pax-km' },
          total: 'Totale', causal: 'Indici di contesto', dg: 'Riduzione attesa per intervento (eq. 6)',
          acrText: '{p}% dei passeggeri-km: {d} giorni a settimana in sede contro {n} necessari', acrNa: 'non calcolabile',
          foot: 'Circular Commuting Framework · circularcommuting.it'
        }
      },
      truth: {
        eyebrow: 'Quanto è vera questa frase?', options: ['Per niente vera', 'Poco vera', 'In parte vera', 'Molto vera', 'Del tutto vera'],
        items: {
          f1: 'La diagnosi delle inefficienze è chiara.',
          f2: "L'inefficienza prevalente descrive davvero la mia sede.",
          f3: 'Gli interventi proposti sono coerenti con le inefficienze emerse.',
          f4: "L'ordine di priorità mi aiuta a decidere da dove partire.",
          f5: 'I dati richiesti erano disponibili nella mia organizzazione.',
          f6: 'Userei questo strumento per preparare o aggiornare il PSCL.'
        }
      },
      c1: { title: 'Nella tua sede ci sono inefficienze che queste cinque categorie non descrivono?', text: 'Quali?' },
      c2: { title: 'Hai notato problemi che ricadevano in più categorie insieme?', text: 'Quali?' },
      yes: 'Sì', no: 'No',
      role: { title: 'Qual è il tuo ruolo?', options: { mm_company: 'Mobility manager aziendale', mm_area: "Mobility manager d'area", hr: 'HR o welfare', esg: 'Sostenibilità / ESG', facility: 'Facility / operations', consultant: 'Consulente', other: 'Altro' } },
      experience: { title: 'Da quanto ti occupi di mobility management?', options: { lt1: 'Meno di 1 anno', y1_3: '1–3 anni', y3_5: '3–5 anni', gt5: 'Oltre 5 anni' } },
      final: {
        title: "Un'ultima cosa, se ti va",
        channel: 'Come hai conosciuto lo strumento?', channels: { linkedin: 'LinkedIn', newsletter: 'Newsletter o evento', network: 'Collega o rete professionale', search: 'Ricerca online', other: 'Altro' },
        open: 'Cosa cambieresti o aggiungeresti?',
        contact: 'Sono disponibile a essere ricontattato per un breve colloquio sui risultati', email: 'Email',
        contactNote: "L'email viene salvata separatamente e non è collegata alle tue risposte.",
        submit: 'Invia e scarica il report', invalidEmail: "Controlla l'indirizzo email."
      },
      thanks: {
        title: 'Fatto!', body: 'Grazie per il tuo contributo alla validazione del framework.',
        syncing: 'Invio delle risposte in corso… Se chiudi la pagina, l\'invio si completa alla prossima visita.', synced: '✓ Risposte salvate',
        code: 'Codice risposta: {code}', codeNote: "Conservalo se vorrai chiedere l'accesso o la cancellazione dei tuoi dati.",
        download: 'Scarica il report PDF', printHint: 'Nella finestra di stampa scegli «Salva come PDF».', newRun: 'Nuova analisi',
        newConfirm: 'Vuoi iniziare una nuova analisi? Quella attuale verrà cancellata da questo browser.', home: 'Torna alla home'
      }
    },

    options: {
      orgType: { private: ['building', 'Impresa privata'], public: ['columns', 'Pubblica amministrazione'], university: ['cap', 'Università o ricerca'], health: ['health', 'Sanità'], other: ['dots', 'Altro'] },
      sector: { manufacturing: ['factory', 'Manifattura'], energy: ['bolt', 'Energia e utilities'], construction: ['helmet', 'Costruzioni'], retail: ['cart', 'Commercio e distribuzione'], logistics: ['truck', 'Logistica e trasporti'], finance: ['coins', 'Finanza e assicurazioni'], ict: ['laptop', 'ICT e servizi professionali'], education: ['book', 'Istruzione e ricerca'], health: ['care', 'Sanità e assistenza'], pa: ['columns', 'Pubblica amministrazione'], other: ['dots', 'Altro'] },
      pscl: { adopted: ['docCheck', 'Sì, adottato'], preparing: ['docEdit', 'In preparazione'], none: ['docNone', 'No, non previsto'] },
      dms: [
        ['dataNone', 'Nessun dato strutturato', 'nessuna diagnosi affidabile'],
        ['clipboard', 'Un questionario di base', 'analisi dei mezzi usati'],
        ['od', 'Origini e destinazioni aggregate', 'individua i bacini principali'],
        ['odClock', 'Origini, turni e mezzi', 'diagnosi di orari e mezzi'],
        ['layers', 'Dati integrati con trasporto pubblico e mappe', 'progettazione sui corridoi'],
        ['dashboard', 'Monitoraggio periodico con dashboard', 'gestione continua']
      ],
      modes: { car_solo: 'Auto, da soli', car_pool: 'Auto condivisa', car_ev: 'Auto elettrica', moto: 'Moto o scooter', shuttle: 'Navetta aziendale', bus: 'Autobus', bus_el: 'Autobus elettrico', train: 'Treno o metro', ebike: 'E-bike o monopattino', active: 'Bici o a piedi' },
      roleIcons: { mm_company: 'building', mm_area: 'map', hr: 'users', esg: 'leaf', facility: 'wrench', consultant: 'chat', other: 'dots' },
      bands: ['assente', 'bassa', 'media', 'alta', 'critica']
    },

    interventions: {
      i1_lf: 'Aumento del load factor dei servizi collettivi esistenti',
      i1_carpool: 'Carpooling organizzato',
      i1_rightsize: 'Accorpamento delle corse e right-sizing dei veicoli',
      i1_ptdeal: "Accordi di saturazione con l'operatore del trasporto pubblico",
      i2_coord: 'Coordinamento tra servizio aziendale e trasporto pubblico sui corridoi sovrapposti',
      i2_convert: 'Conversione del servizio aziendale verso zone non servite',
      i2_coalition: 'Adesione a coalizioni territoriali tra organizzazioni',
      i3_align: 'Allineamento degli orari di ingresso e uscita alle finestre del trasporto pubblico',
      i3_ondemand: 'Servizi a chiamata per le fasce non coperte',
      i3_stagger: 'Scaglionamento dei turni',
      i4_equip: 'Dotazioni interne per la mobilità attiva',
      i4_route: 'Messa in sicurezza del percorso di accesso alla sede',
      i4_feeder: 'Navetta di adduzione dal nodo di interscambio',
      i4_micro: 'Micromobilità condivisa',
      i5_remote: 'Estensione del lavoro da remoto alle mansioni che non richiedono presenza',
      i5_cowork: 'Coworking di prossimità',
      i5_redistribute: 'Redistribuzione dei giorni di presenza per evitare concentrazioni'
    },

    help: {
      intro: { title: 'Come funziona', body: ['Domande brevi, una alla volta. Puoi tornare indietro quando vuoi e le risposte restano salvate in questo browser.', 'Nessun dato parte prima del tuo consenso. Il nome dell\'organizzazione non viene mai inviato.'], fw: "La beta segue l'articolo di ricerca: otto blocchi del Canvas, dalla maturità dei dati al piano di interventi, con indicatori espressi in kWh e CO₂e per passeggero-km." },
      chapter: { body: ['Ogni capitolo corrisponde a un blocco del Circular Commuting Canvas. Le curiosità vengono dalla letteratura citata nell\'articolo.'] },
      chapterFw: {
        1: 'Blocco 1 del Canvas · Data Layer. Il Data Maturity Score (DMS, da 0 a 5) è il vincolo abilitante: con DMS sotto 2 la raccolta dati viene prima di ogni intervento.',
        2: "Blocco 2 · Mobility Necessity Score (MNS, 0–100): misura quanta presenza è davvero necessaria e alimenta l'inefficienza I5, la domanda evitabile.",
        3: 'Blocco 3 · Energy Performance Layer. Attività A = N·d·g (eq. 1), intensità energetica EI = e/o (eq. 2), load factor LF = o/k (eq. 3), emissioni G = A·EI·φ (eq. 4), intensità del sistema CI = ΣG/ΣA (eq. 5).',
        4: "Blocco 4 · Accessibility Score (ACC, 0–100): media delle sette voci riportata su 0–100. Un'accessibilità bassa alimenta l'inefficienza I4, la frizione dell'ultimo miglio.",
        5: "Blocco 5 · Car Dependency Ratio (CDR, 0–100): media delle cinque voci riportata su 0–100. Una dipendenza alta indica capacità privata latente, cioè l'inefficienza I1.",
        6: 'Blocco 6 · Inefficiency Layer. I1 deriva dal CDR, I4 dall\'ACC, I5 dall\'MNS; I2 e I3 richiedono una valutazione diretta. Le tue correzioni sono dati preziosi per la validazione.',
        7: 'Blocchi 7 e 8 · Intervention Matching Layer. Diventano candidati solo gli interventi collegati a inefficienze osservate (punteggio ≥ 41). IPI = (Impatto × Dati × Accettabilità) / (Costo × GCS); classi A oltre 12, B da 6 a 12, C sotto 6.',
        9: "Criterio di validazione «utilità decisionale percepita»: si verifica se la diagnosi è comprensibile, se il legame tra inefficienze e interventi è plausibile e se l'ordine aiuta a scegliere le priorità."
      },
      sample: { title: 'Perché te lo chiediamo', body: ['Serve a descrivere il campione dello studio. I risultati vengono analizzati solo in forma aggregata, mai per singola organizzazione.'] },
      employees: { title: 'Perché una sola sede', body: ['Il framework lavora sede per sede: il numero di persone serve a controllare la ripartizione per mezzo e a descrivere il campione.'] },
      shifts: { title: 'Perché i turni contano', body: ['Un servizio pubblico ottimo alle 9 può non esistere alle 6. I turni cambiano la compatibilità degli orari.'], fw: "Alimenta la lettura del mismatch temporale (I3). Se nessuno lavora su turni, la domanda sui turni scoperti viene saltata e conteggiata come non applicabile." },
      pscl: { title: 'Il PSCL', body: ['Il Piano degli spostamenti casa-lavoro è previsto dal D.I. 179/2021 per le organizzazioni con più di 100 dipendenti in una sede situata in un capoluogo o in un comune con più di 50.000 abitanti.', 'Il report finale è pensato anche per alimentarlo.'] },
      dms: { title: 'Il livello dei dati', body: ['Scegli il livello più alto che descrive i dati che avete davvero, non quelli che vorreste avere.'], fw: "Data Maturity Score, 0–5. Con DMS < 2 il piano mette al primo posto la costruzione della baseline, e gli interventi che richiedono matrici origine-destinazione, turni o accessibilità del trasporto pubblico non possono superare 2 nel punteggio dati. Se più del 30% delle voci di accessibilità o dipendenza dall'auto resta senza risposta, il DMS effettivo scende a 2." },
      mns: { title: 'Presenza necessaria', body: ['Pensa alle mansioni, non alle abitudini di oggi: quanta parte del lavoro richiede davvero di essere in sede?', 'Sposta i due cursori sulla barra, anche con le frecce della tastiera.'], fw: 'MNS = [(Qe × 5 + Qp × 3 + Qr × 1) − 100] / 4. Con i giorni in sede stimiamo la domanda evitabile: ACR = A_ev / A (eq. 7).' },
      daysWeek: { title: 'Giorni in sede', body: ['La media su tutte le persone della sede, smart working compreso.'], fw: 'g = giorni a settimana × 44 settimane lavorative (220 giorni con 5 giorni a settimana).' },
      distance: { title: 'Distanza media', body: ['La distanza casa-lavoro di sola andata. Nei calcoli contiamo andata e ritorno.'], fw: 'd = 2 × km di andata (eq. 1).' },
      modes: { title: 'Ripartizione per mezzo', body: ['Conta chi usa abitualmente ciascun mezzo per la maggior parte dei giorni. Una stima dal questionario o dall\'esperienza va bene.', 'La stima delle emissioni si aggiorna mentre compili.'], fw: 'Per ogni mezzo: A = N·d·g (eq. 1), EI = e/o (eq. 2), LF = o/k (eq. 3), G = A·EI·φ (eq. 4). I parametri e, o, k e φ derivano dalle Tab. 2.1–2.2 della tesi (ISPRA 2024, EEA 2023, UITP 2022) e si possono cambiare nei parametri per esperti.' },
      modeDistances: { title: 'Distanze per mezzo', body: ['Chi va in bici o a piedi di solito abita più vicino: se la media è più alta, proponiamo 3 km per bici e piedi e 7 km per e-bike e monopattini.'], fw: "Le distanze per mezzo entrano nell'eq. 1. La mobilità attiva non emette, ma i suoi passeggeri-km contano nell'intensità del sistema (eq. 5)." },
      acc: { title: 'Accessibilità', body: ['Rispondi pensando a una persona tipo che arriva negli orari di punta.', 'Se non lo sai, «Non lo so» va benissimo: il risultato dichiarerà una affidabilità più bassa.'], fw: "Voce {k} di 7 dell'Accessibility Score: ACC = [(media delle voci disponibili − 1) / 4] × 100. Più alto significa migliore accessibilità. Frizione dell'ultimo miglio I4 = 100 − ACC." },
      cdr: { title: "Dipendenza dall'auto", body: ["Rispondi pensando alla situazione tipica della sede.", 'Se non lo sai, «Non lo so» va benissimo.'], fw: 'Voce {k} di 5 del Car Dependency Ratio: CDR = [(media delle voci disponibili − 1) / 4] × 100. Più alto significa maggiore dipendenza. Il CDR alimenta I1, la capacità sottoutilizzata.' },
      I1: { title: 'Capacità sottoutilizzata', body: ['Pensa ai posti vuoti: auto con una sola persona, navette e bus poco pieni. Più posti vuoti, più energia per ogni persona trasportata.'], fw: 'I1. Stima = CDR. Indicatore di monitoraggio: load factor (eq. 3). Interventi coerenti: aumento del load factor dei servizi collettivi, carpooling organizzato (Tab. 1).' },
      I2: { title: 'Duplicazione modale', body: ['Succede quando servizi diversi coprono lo stesso percorso alla stessa ora, mentre altre zone restano senza servizio.'], fw: 'I2, a valutazione diretta. Fasce da 0–20 (assente) a 81–100 (critica), dalla rubrica della tesi (§6.3). Intervento coerente: coordinamento tra servizio aziendale e trasporto pubblico (Tab. 1).' },
      I3: { title: 'Mismatch temporale', body: ["Una linea eccellente alle 9 non serve a chi entra alle 6. Pensa ai turni principali e agli orari d'uscita."], fw: 'I3, a valutazione diretta. Indicatore di monitoraggio: copertura temporale. Interventi coerenti: allineare gli orari alle finestre del trasporto pubblico, servizi a chiamata (Tab. 1).' },
      I4: { title: "Frizione dell'ultimo miglio", body: ["Una fermata vicina non basta se il percorso fino all'ingresso è lungo, buio o interrotto."], fw: 'I4. Stima = 100 − ACC. Interventi coerenti: dotazioni per la mobilità attiva e messa in sicurezza del percorso (Tab. 1).' },
      I5: { title: 'Domanda evitabile', body: ['Non è una domanda sullo smart working in generale: conta quanta presenza supera quella che il lavoro richiede.'], fw: 'I5. Stima = 100 − MNS; se l\'MNS è sotto 50 e si viene in sede 4 o più giorni a settimana, almeno «alta». Indicatore: commuting evitato (eq. 7).' },
      ivSelect: { title: 'Perché questi interventi', body: ['Il framework non suggerisce misure generiche: propone solo quelle che agiscono sulla causa delle inefficienze emerse.'], fw: 'Candidati = interventi della matrice inefficienza-intervento (Tab. 1) collegati a inefficienze con punteggio ≥ 41. I principali agiscono sulla causa, i complementari rafforzano l\'effetto.' },
      iv: { title: 'Valutare un intervento', body: ['Tre valutazioni rapide: costo, accettazione e dati. Riduzione di emissioni e complessità di governance sono già stimate, ma puoi correggerle.'], fw: "ΔG = passeggeri-km trasferiti o evitati × differenziale emissivo (eq. 6), tradotto in impatto da 1 a 5 per fasce di riduzione: < 1%, 1–3%, 3–7%, 7–15%, ≥ 15%. IPI = (Impatto × Dati × Accettabilità) / (Costo × GCS) (eq. 8)." },
      results: { title: "Leggere l'ottagono", body: ['Otto dimensioni su una scala da 0 a 100, dove un valore più alto indica più criticità. Sotto trovi le inefficienze una per una e il piano di intervento.'], fw: 'Assi: I1–I5 (Inefficiency Layer); intensità emissiva = CI rispetto a un\'auto termica con una sola persona (203 g CO₂e/pax-km); dati mancanti = (5 − DMS effettivo) × 20; complessità attuativa = GCS medio degli interventi valutati, riportato su 0–100.' },
      truth: { title: 'Perché queste frasi', body: ["Rispondi d'istinto: non ci sono risposte giuste. Ci interessa quanto lo strumento ti è servito davvero."], fw: "Criterio di validazione «utilità decisionale percepita»: comprensibilità della diagnosi, plausibilità del legame inefficienze–interventi, utilità dell'ordine di priorità." },
      c1: { title: 'Completezza', body: ['Ci aiuta a capire se le cinque categorie bastano a descrivere i problemi reali.'], fw: 'Criterio «completezza diagnostica»: la tassonomia deve classificare le inefficienze osservate senza lasciare residui non attribuibili.' },
      c2: { title: 'Sovrapposizioni', body: ['Se uno stesso problema sembrava appartenere a due categorie, raccontacelo.'], fw: 'Criterio «completezza diagnostica»: senza sovrapposizioni tra categorie.' },
      profile: { title: 'Il tuo profilo', body: ['Serve a leggere le valutazioni per profilo professionale.'] },
      final: { title: 'Ultimo passo', body: ["Tutto facoltativo. L'email resta separata dalle risposte e serve solo per un eventuale colloquio."] },
      thanks: { title: 'Il report', body: ['Il report si genera nel tuo browser: nella finestra di stampa scegli «Salva come PDF».', 'Il codice risposta ti serve solo per chiedere accesso o cancellazione dei dati.'] }
    },

    privacy: {
      title: 'Informativa privacy',
      sections: [
        ['Chi tratta i dati', 'Enrico Emanuele Corazzini, che cura questo sito e la raccolta dei dati per conto degli autori dello studio indicati in questa pagina. Per qualunque richiesta usa il modulo in fondo a questa informativa.'],
        ['Quali dati raccogliamo', "Le risposte al Canvas (dati aggregati della sede: tipo e settore dell'organizzazione, numero di dipendenti, regione, ripartizione per mezzo, punteggi), i risultati calcolati, le eventuali correzioni con la loro motivazione, le risposte alla valutazione finale e dati tecnici minimi (lingua, versione dello strumento, tempi di compilazione). Non raccogliamo il nome dell'organizzazione o della sede, che restano nel tuo browser, né dati sui singoli dipendenti, né il tuo indirizzo IP. Non usiamo cookie."],
        ['Email facoltativa', 'Solo se scegli di essere ricontattato. È salvata separatamente, senza collegamento alle risposte, e cancellata al termine del progetto.'],
        ['Perché', 'Per la validazione scientifica del framework e per analisi statistiche. I risultati sono pubblicati solo in forma aggregata, senza possibilità di risalire alle singole organizzazioni.'],
        ['Base giuridica', 'Il tuo consenso (art. 6, par. 1, lett. a GDPR), che puoi revocare in ogni momento senza pregiudicare il trattamento già effettuato.'],
        ['Dove e per quanto tempo', "In un foglio di calcolo Google con accesso riservato agli autori. Google può trattare dati anche fuori dall'Unione europea con le garanzie previste (EU-US Data Privacy Framework). Le risposte anonime sono conservate per la durata del progetto di ricerca e delle successive verifiche scientifiche."],
        ['I tuoi diritti', 'Accesso, rettifica, cancellazione, limitazione, opposizione e revoca del consenso (artt. 15–22 GDPR), indicando il codice risposta che ricevi alla fine. Hai inoltre diritto di proporre reclamo al Garante per la protezione dei dati personali.'],
        ['Salvataggio nel browser', 'Per non farti perdere il lavoro, le risposte sono salvate anche nel tuo browser (localStorage). Restano sul tuo dispositivo e puoi cancellarle con «Ricomincia da capo».']
      ],
      close: 'Chiudi', authors: 'Autori',
      requestTitle: 'Richiesta sui tuoi dati', requestCode: 'Codice risposta (se lo hai)', requestKind: 'Tipo di richiesta',
      requestKinds: { delete: 'Cancellazione', access: 'Accesso', other: 'Altro' }, requestMessage: 'Messaggio', requestEmail: 'Email per la risposta',
      requestSend: 'Invia richiesta', requestSent: 'Richiesta inviata. Ti risponderemo all\'indirizzo indicato.', requestError: "Invio non riuscito: controlla l'email e riprova."
    },
    footer: { privacy: 'Informativa privacy', version: 'Beta 2.0 · motore {v}', lite: 'Versione semplificata' }
  },

  en: {
    meta: {
      title: 'Circular Commuting · Beta 2.0',
      description: "Find out where energy is wasted in your site's employee commuting and which interventions to start with. Version under scientific validation."
    },
    ui: {
      back: 'Back', next: 'Next', start: 'Start the assessment', startChapter: 'Start', skip: 'Skip',
      dontKnow: "I don't know", saved: 'Saved in your browser', chapterOf: 'Chapter {n} of {t}',
      helpAria: 'What is on this screen?', helpEyebrow: 'What you are looking at', helpFw: 'In the framework', close: 'Close',
      factLabel: 'Did you know?', chapterMeta: '{n} questions · about {m} min', keysHint: 'You can answer with the number keys and continue with Enter.',
      estimateTag: 'Estimated from your data', presetTag: 'Suggested', optional: 'optional',
      restart: 'Start over', restartConfirm: 'Delete the assessment saved in this browser and start over?',
      resumeTitle: 'Welcome back', resumeText: 'You have an assessment in progress in this browser, at the “{chapter}” chapter.', resumeBtn: 'Resume',
      home: 'Home', langAria: 'Lingua / Language', people: 'people', km: 'km', percent: '%', edit: 'Edit'
    },
    chapters: ['Welcome', 'Your site', 'Presence', 'Commuting', 'Alternatives to the car', 'The role of the car', 'Where waste arises', 'What to do', 'Results', 'Evaluation'],
    chapterIntro: {
      1: { title: 'Your site', desc: 'Who you are and what commuting data you already have.' },
      2: { title: 'Who really needs to be on site', desc: 'How much presence is needed, and how much could be avoided.' },
      3: { title: 'How people commute today', desc: 'Distances and modes: from here we compute energy and emissions.' },
      4: { title: 'Alternatives to the car', desc: 'Seven questions on stops, timetables and routes around the site.' },
      5: { title: 'The role of the car', desc: 'Five questions on how structural car use is.' },
      6: { title: 'Where waste arises', desc: 'Five possible inefficiencies. For three of them we suggest an estimate from your data: correct it if you disagree.' },
      7: { title: 'What to do, in what order', desc: 'The framework only proposes interventions that correct the inefficiencies found. For each one, three quick ratings.' },
      9: { title: 'Your evaluation', desc: 'Six statements, one at a time: tell us how true they are. This is the part that validates the framework.' }
    },

    intro: {
      eyebrow: 'Beta 2.0 · scientific validation',
      title: "Find out where energy is wasted in your site's employee commuting.",
      lede: 'Short questions, one at a time. At the end you get the criticality profile of your site, the emissions of employee commuting and a prioritised intervention plan, also useful for your commuting plan (PSCL).',
      meta: [['12 min', 'estimated time'], ['8', 'chapters'], ['PDF', 'final report']],
      cards: [
        { icon: 'radar', t: 'What you get', d: 'The criticality profile of your site, emissions per passenger-km and an A, B, C intervention plan.' },
        { icon: 'clock', t: 'What we ask', d: 'Aggregate site data, no personal employee data. At the end, six statements to rate.' },
        { icon: 'lock', t: 'Anonymity', d: "Your organisation's name stays in your browser. Researchers only receive anonymous answers." }
      ],
      researchTitle: 'The research project',
      research: [
        'The Circular Commuting Framework is described in the research article “{title}”.',
        'The study classifies employee-commuting inefficiencies by their generating mechanism, translates them into physical indicators comparable across modes (kWh and CO₂e per passenger-km) and ranks interventions by expected benefit, available data and implementation complexity.',
        "Mobility managers' assessments are used to test four properties: diagnostic completeness, dimensional coherence, applicability to variable information maturity and perceived decision-making usefulness."
      ],
      authorsTitle: 'The authors',
      consent: 'I have read the privacy notice and consent to the processing of my answers, in anonymous form, for scientific research.',
      consentLink: 'Read the privacy notice',
      consentNeed: 'Consent is required to start. If you prefer not to take part in the research, you can freely use the simplified version.',
      liteLink: 'Go to the simplified version'
    },

    q: {
      orgType: { title: 'What type of organisation is yours?' },
      sector: { title: 'Which sector does it work in?' },
      employees: { title: 'How many people work at the site?', sub: 'If your organisation has several sites, pick one: the framework works site by site.' },
      region: { title: 'Which Italian region is the site in?', groups: ['North', 'Centre', 'South and islands'], abroad: 'Outside Italy' },
      shifts: { title: 'How many people work shifts?', sub: 'An estimate is fine.' },
      pscl: { title: 'Do you have a commuting plan?', sub: 'The Italian PSCL.' },
      dms: { title: 'What data do you have today on employee commuting?', sub: 'Pick the highest level that truly describes you.' },
      mns: { title: 'Think about the jobs at the site: how much presence do they require?', sub: 'Drag the two handles to split 100% of the people.', seg: ['Presence always needed', 'Partly remote', 'Fully remote'], aria: ['Boundary between needed presence and partly remote work', 'Boundary between partly and fully remote work'] },
      daysWeek: { title: 'On average, how many days a week do people come to the site?', sub: 'Count only days on site, across everyone at the site.', unit: ['day', 'days'] },
      distance: { title: 'On average, how many kilometres do people travel, one way?', sub: 'An estimate is fine: you can refine it by mode in the next step.' },
      modes: {
        title: 'How do people get to the site?', sub: 'Enter how many people usually use each mode. Site total: {tot}.',
        assigned: '{sum} of {tot} assigned', remaining: '{n} left', over: '{n} above the total', fill: 'Assign the rest',
        teaser: '≈ {t} t CO₂e a year', teaserNone: 'Add at least one mode to estimate emissions',
        advanced: 'Vehicle parameters, for experts',
        advancedNote: 'Starting values derived from Tables 2.1–2.2 of the thesis (ISPRA 2024, EEA 2023, UITP 2022); motorcycle and e-bike values are indicative. Change them if you have real data, for instance average shuttle occupancy.',
        paramCols: { mode: 'Mode', e: 'e · kWh/vkm', o: 'o · occupants', k: 'k · seats', phi: 'φ · gCO₂e/kWh', lf: 'LF' }
      },
      modeDistances: { title: 'Do any modes cover different distances from the average?', sub: 'For cycling and light electric mobility we suggest shorter distances. If they look right, just continue.' },
      acc: [
        { icon: 'busStop', title: 'How far is the nearest public transport stop on foot?', options: ['Under 5 minutes', '5–10 minutes', '10–15 minutes', '15–25 minutes', 'Over 25 minutes, or no stop'] },
        { icon: 'train', title: 'And the railway station?', options: ['Within 10 minutes, with direct and frequent trains', '10–15 minutes', '15–25 minutes, or one change', '25–40 minutes, or unreliable', 'Not usable'] },
        { icon: 'frequency', title: 'How often do buses or trams run at start and end of work?', options: ['Every 15 minutes or less', 'Every 16–30 minutes', 'Every 31–60 minutes', 'Over an hour, or irregular', 'They do not run'] },
        { icon: 'clock', title: 'Does public transport cover working hours, shifts included?', options: ['Yes, fully', 'Well, waits under 15 minutes', 'Partly, waits of 15–30 minutes', 'Only some time slots', 'No'] },
        { icon: 'shield', title: 'Is the walk from the stop to the site safe?', options: ['Safe, lit and continuous', 'Safe, with minor issues', 'Walkable, with significant issues', 'Unsafe or uncomfortable', 'Unsafe or not walkable'] },
        { icon: 'lane', title: 'What is the cycling and walking network around the site like?', options: ['Continuous and protected', 'Almost complete', 'Partial but usable', 'Fragmented', 'None'] },
        { icon: 'lockers', title: 'What do people arriving by bike find at the site?', options: ['Racks, showers, lockers and a policy', 'Racks and one more facility', 'Racks only', 'Little or nothing, and not secure', 'Nothing'] }
      ],
      cdr: [
        { icon: 'carSolo', title: 'How many cars arrive with only the driver on board?', options: ['Over 80%', '61–80%', '41–60%', '21–40%', '20% or less'] },
        { icon: 'parking', title: 'Is company parking free?', options: ['Yes, guaranteed and plentiful', 'Yes, ample but not guaranteed', 'Yes, but often full', 'Limited or paid', 'None or paid'] },
        { icon: 'gauge', title: 'How easy is it to reach the site by car?', options: ['Very easy, easier than any alternative', 'Generally easy', 'Moderate traffic', 'Often congested', 'Difficult or discouraged'] },
        { icon: 'clock', title: 'How many shifts are not covered by public transport?', options: ['Over 75%', '51–75%', '26–50%', '1–25%', 'None or almost none'] },
        { icon: 'lastMile', title: 'Do people leaving public transport have options for the last stretch?', options: ['None', 'Very inconvenient or unsafe', 'Partial', 'Available but improvable', 'Yes, effective'] }
      ],
      ineff: {
        I1: { name: 'Underutilised capacity', title: 'How empty are the vehicles bringing people to the site?', options: ['Nearly full: few free seats, few cars with one person', 'Some free seats, but not many', 'Average occupancy, or quite a few cars with one person', 'Collective services under-used, or many cars with one person', 'Very empty vehicles, or driving alone dominates'] },
        I2: { name: 'Modal duplication', title: 'Do shuttles, buses and other companies\' services overlap on routes and times?', options: ['No, no duplicated services', 'Only occasionally', 'Partly, on some routes or time slots', 'Yes, clear overlaps', 'Yes: several uncoordinated, half-empty services on the same routes'] },
        I3: { name: 'Temporal mismatch', title: 'Are the timetables of alternatives to the car compatible with working hours?', options: ['Yes, with almost all schedules', 'Yes, except some time slots', 'Only partly: main shifts or schedules half covered', 'Poorly: many start and end times uncovered', 'No: main shifts have no alternative to the car'] },
        I4: { name: 'Last-mile friction', title: 'From the stop to the site, is the last stretch convenient and safe?', options: ['Yes: short, safe and continuous', 'Almost always, with minor issues', 'Doable, but inconvenient', 'Long, unsafe or interrupted', 'It effectively prevents arriving without a car'] },
        I5: { name: 'Avoidable demand', title: 'Do people come to the site more than their work requires?', options: ['No, presence is almost always needed', 'A little: few tasks can be done remotely', 'Partly: several tasks can be done remotely', 'Yes: a large share of presence could be reduced', 'Very much: actual presence far exceeds what is needed'] },
        estimate: 'From your data we estimate {band} criticality. If you see it differently, pick another answer.',
        estimateNone: 'We cannot estimate it from the data entered: pick the answer that best describes the site.',
        reason: 'What makes you see it differently? Optional, but very helpful.',
        dontKnow: 'I cannot assess this',
        hintI2: 'At your site {n} people use the company shuttle: think about routes and times it shares with buses.',
        hintI2none: 'You did not mention company shuttles: think about parallel services by other companies or public transport.',
        hintI3: 'You told us public transport covers working hours like this: “{a}”. {c}% of people work shifts.'
      },
      ivSelect: {
        title: 'The framework selected {n} interventions for your site.', titleOne: 'The framework selected one intervention for your site.',
        sub: 'They correct the inefficiencies found. The primary ones are already selected: add the complementary ones you want to evaluate.',
        none: 'No inefficiency reaches a medium level: the framework proposes no interventions. You can go to the results.',
        dataFirst: 'First, the evidence base needs strengthening: with today\'s data, interventions requiring origins and destinations, shift structures or public transport accessibility start with a low data score.',
        primary: 'primary', complementary: 'complementary', treats: 'Corrects: {name}'
      },
      iv: {
        eyebrow: 'Intervention {k} of {n} · corrects: {name}',
        reduction: 'Estimated reduction', unit: 't CO₂e a year', pct: '{p}% of current emissions',
        negative: 'With these assumptions it does not reduce emissions',
        reasons: {
          not_modelled: 'Effect not estimable from single-site data: set the impact below.',
          no_baseline: 'Complete distances and modes to estimate the reduction.',
          no_source: 'Nobody drives alone to the site.',
          no_service: 'You did not mention a company shuttle: as it stands, this intervention does not apply.',
          no_acr: 'Complete presence and days on site to estimate avoidable demand.'
        },
        lever: {
          shift: 'Assumption: {pct}% of driver-alone kilometres move to “{to}”',
          cut: 'Assumption: {pct}% of shuttle runs are removed or merged',
          avoid_acr: 'Assumption: {pct}% of avoidable demand is avoided ({acr}% of the total)',
          avoid_total: 'Assumption: {pct}% of kilometres travelled are avoided'
        },
        qCost: 'How much does it cost?', cost: ['Next to nothing', 'Little', 'Some', 'A lot', 'Very much'],
        qAcc: 'How well would it be accepted internally?', acc: ['Strong opposition', 'Expected resistance', 'Uncertain', 'Well received', 'Strong support'],
        qData: 'How solid are the data to design and measure it?', data: ['Insufficient', 'Weak', 'Sufficient but incomplete', 'Good', 'Complete and up to date'],
        qGcs: 'Who needs to be involved?', gcs: ['Just my office', 'Several internal functions', 'External suppliers', 'Municipality or public transport', 'Several companies and bodies together'],
        qImpact: 'Emission impact', impact: ['Marginal', 'Limited', 'Medium', 'High', 'Very high'],
        capped: 'With today\'s data this score can be 2 at most.',
        govPlan: 'An explicit governance plan is required.',
        pending: 'Answer the three questions to see the priority.',
        priority: 'Priority {c}', ipi: 'index {v}',
        cls: { A: 'Ready for immediate implementation', B: 'To be scheduled, investigated or piloted', C: 'To be postponed or made conditional on prerequisites' },
        presetGcs: 'suggested for this type of intervention', presetImpact: 'estimated from the emission reduction'
      },
      results: {
        eyebrow: 'Results', title: 'The criticality profile of your site',
        sub: 'The wider the octagon, the more your site is exposed to waste and obstacles. Each vertex is a dimension of the framework, on a 0 to 100 scale.',
        axes: { I1: 'Underutilised capacity', I2: 'Modal duplication', I3: 'Temporal mismatch', I4: 'Last mile', I5: 'Avoidable demand', CI: 'Emission intensity', DATA: 'Missing data', GOV: 'Implementation complexity' },
        prevailing: 'Prevailing inefficiency', noPrevailing: 'No inefficiency assessed',
        kpi: { g: ['Annual emissions', 't CO₂e'], ci: ['Emission intensity', 'g CO₂e per passenger-km'], ei: ['Energy intensity', 'kWh per passenger-km'], acr: ['Avoidable demand', 'of passenger-km'] },
        dataFirst: 'With a data level below 2, the first step of the plan is building the baseline.',
        lowRel: 'Some answers are missing: the effective data level drops to 2 and results should be read with caution.',
        ineffTitle: 'The five inefficiencies', planTitle: 'Intervention plan', monitorTitle: 'Monitoring',
        nameTitle: 'Name your report', nameNote: 'It stays in your browser: it is not sent.', orgName: 'Organisation', siteName: 'Site',
        toEval: 'Evaluate the tool and download the report',
        d0: 'Build the baseline: commuting survey with origins, shifts and modes', d0note: 'Priority set by the data level: it precedes any intervention.',
        planEmpty: 'No intervention evaluated.', noCandidates: 'No inefficiency reaches a medium level: the framework proposes no interventions.',
        monitorCols: { intv: 'Intervention', ind: 'Indicator', freq: 'Frequency', owner: 'Owner' },
        freq: { quarterly: 'Quarterly', semiannual: 'Every six months', annual: 'Yearly' },
        owners: { mm: 'Mobility manager', hr: 'HR', facility: 'Facility / operations', management: 'Management', supplier: 'External supplier' },
        indicators: {
          load_factor: 'Load factor of collective services and share of cars with one person',
          service_overlap: 'Overlap between company service and public transport',
          time_coverage: 'Time coverage of start and end times',
          active_access_share: 'Share of site access by active mobility',
          avoided_commuting: 'Avoided commuting, in days and passenger-km'
        },
        systemInd: 'System indicators: emission intensity (eq. 5) and emission reduction (eq. 6), updated in parallel. Plan review at the next update of the commuting plan.',
        report: {
          eyebrow: 'Circular Commuting Framework 2.0 · diagnostic report', untitled: 'Organisation not specified',
          generated: 'Report generated on {date} · engine {v}',
          s1: '1 · Baseline', s2: '2 · Diagnostic framework', s3: '3 · Indicators', s4: '4 · Intervention plan',
          dmsDeclared: 'Declared data level', dmsEffective: 'Effective data level',
          cols: { mode: 'Mode', n: 'People', share: 'Share', paxkm: 'pax-km/year', g: 't CO₂e/year', ei: 'kWh/pax-km', lf: 'Load factor', ci: 'g CO₂e/pax-km' },
          total: 'Total', causal: 'Context indices', dg: 'Expected reduction by intervention (eq. 6)',
          acrText: '{p}% of passenger-km: {d} days a week on site against {n} needed', acrNa: 'not computable',
          foot: 'Circular Commuting Framework · circularcommuting.it'
        }
      },
      truth: {
        eyebrow: 'How true is this statement?', options: ['Not true at all', 'Slightly true', 'Partly true', 'Very true', 'Completely true'],
        items: {
          f1: 'The diagnosis of inefficiencies is clear.',
          f2: 'The prevailing inefficiency truly describes my site.',
          f3: 'The proposed interventions are consistent with the inefficiencies found.',
          f4: 'The priority order helps me decide where to start.',
          f5: 'The required data were available in my organisation.',
          f6: 'I would use this tool to prepare or update our commuting plan.'
        }
      },
      c1: { title: 'Are there inefficiencies at your site that these five categories do not describe?', text: 'Which ones?' },
      c2: { title: 'Did you notice problems that fell into more than one category at once?', text: 'Which ones?' },
      yes: 'Yes', no: 'No',
      role: { title: 'What is your role?', options: { mm_company: 'Company mobility manager', mm_area: 'Area mobility manager', hr: 'HR or welfare', esg: 'Sustainability / ESG', facility: 'Facility / operations', consultant: 'Consultant', other: 'Other' } },
      experience: { title: 'How long have you worked in mobility management?', options: { lt1: 'Less than 1 year', y1_3: '1–3 years', y3_5: '3–5 years', gt5: 'More than 5 years' } },
      final: {
        title: 'One last thing, if you like',
        channel: 'How did you hear about the tool?', channels: { linkedin: 'LinkedIn', newsletter: 'Newsletter or event', network: 'Colleague or professional network', search: 'Web search', other: 'Other' },
        open: 'What would you change or add?',
        contact: 'I am available to be contacted for a short interview about the results', email: 'Email',
        contactNote: 'Your email is stored separately and is not linked to your answers.',
        submit: 'Submit and download the report', invalidEmail: 'Please check the email address.'
      },
      thanks: {
        title: 'Done!', body: 'Thank you for contributing to the validation of the framework.',
        syncing: 'Sending your answers… If you close the page, sending completes on your next visit.', synced: '✓ Answers saved',
        code: 'Response code: {code}', codeNote: 'Keep it if you want to request access to or deletion of your data.',
        download: 'Download the PDF report', printHint: 'In the print dialog choose “Save as PDF”.', newRun: 'New assessment',
        newConfirm: 'Start a new assessment? The current one will be deleted from this browser.', home: 'Back to home'
      }
    },

    options: {
      orgType: { private: ['building', 'Private company'], public: ['columns', 'Public administration'], university: ['cap', 'University or research'], health: ['health', 'Healthcare'], other: ['dots', 'Other'] },
      sector: { manufacturing: ['factory', 'Manufacturing'], energy: ['bolt', 'Energy and utilities'], construction: ['helmet', 'Construction'], retail: ['cart', 'Retail and wholesale'], logistics: ['truck', 'Logistics and transport'], finance: ['coins', 'Finance and insurance'], ict: ['laptop', 'ICT and professional services'], education: ['book', 'Education and research'], health: ['care', 'Health and social care'], pa: ['columns', 'Public administration'], other: ['dots', 'Other'] },
      pscl: { adopted: ['docCheck', 'Yes, adopted'], preparing: ['docEdit', 'In preparation'], none: ['docNone', 'No, not planned'] },
      dms: [
        ['dataNone', 'No structured data', 'no reliable diagnosis'],
        ['clipboard', 'A basic questionnaire', 'analysis of modes used'],
        ['od', 'Aggregate origins and destinations', 'identifies main catchment areas'],
        ['odClock', 'Origins, shifts and modes', 'diagnosis of timetables and modes'],
        ['layers', 'Data integrated with public transport and maps', 'corridor design'],
        ['dashboard', 'Periodic monitoring with dashboards', 'continuous management']
      ],
      modes: { car_solo: 'Car, driving alone', car_pool: 'Shared car', car_ev: 'Electric car', moto: 'Motorcycle or scooter', shuttle: 'Company shuttle', bus: 'Bus', bus_el: 'Electric bus', train: 'Train or metro', ebike: 'E-bike or e-scooter', active: 'Bicycle or walking' },
      roleIcons: { mm_company: 'building', mm_area: 'map', hr: 'users', esg: 'leaf', facility: 'wrench', consultant: 'chat', other: 'dots' },
      bands: ['absent', 'low', 'medium', 'high', 'critical']
    },

    interventions: {
      i1_lf: 'Increase the load factor of existing collective services',
      i1_carpool: 'Organised carpooling',
      i1_rightsize: 'Trip merging and vehicle right-sizing',
      i1_ptdeal: 'Load agreements with the public transport operator',
      i2_coord: 'Coordinate the company service and public transport on overlapping corridors',
      i2_convert: 'Redirect the company service to unserved areas',
      i2_coalition: 'Join territorial coalitions of organisations',
      i3_align: 'Align start and end times with public transport service windows',
      i3_ondemand: 'On-call services for uncovered time slots',
      i3_stagger: 'Staggered shifts',
      i4_equip: 'On-site equipment for active mobility',
      i4_route: 'Make the access route to the site safe',
      i4_feeder: 'Transfer shuttle to the interchange hub',
      i4_micro: 'Shared micromobility',
      i5_remote: 'Extend remote working to tasks that do not require physical presence',
      i5_cowork: 'Proximity coworking',
      i5_redistribute: 'Redistribute attendance days to avoid concentrated flows'
    },

    help: {
      intro: { title: 'How it works', body: ['Short questions, one at a time. You can go back whenever you want and your answers stay saved in this browser.', "No data is sent before you consent. Your organisation's name is never sent."], fw: 'The beta follows the research article: eight Canvas blocks, from data maturity to the intervention plan, with indicators expressed in kWh and CO₂e per passenger-km.' },
      chapter: { body: ['Each chapter matches a block of the Circular Commuting Canvas. The facts come from the literature cited in the article.'] },
      chapterFw: {
        1: 'Canvas block 1 · Data Layer. The Data Maturity Score (DMS, 0 to 5) is the enabling constraint: with DMS below 2, data collection precedes any intervention.',
        2: 'Block 2 · Mobility Necessity Score (MNS, 0–100): measures how much presence is really needed and feeds inefficiency I5, avoidable demand.',
        3: 'Block 3 · Energy Performance Layer. Activity A = N·d·g (eq. 1), energy intensity EI = e/o (eq. 2), load factor LF = o/k (eq. 3), emissions G = A·EI·φ (eq. 4), system intensity CI = ΣG/ΣA (eq. 5).',
        4: 'Block 4 · Accessibility Score (ACC, 0–100): mean of the seven items rescaled to 0–100. Low accessibility feeds inefficiency I4, last-mile friction.',
        5: 'Block 5 · Car Dependency Ratio (CDR, 0–100): mean of the five items rescaled to 0–100. High dependency signals latent private capacity, i.e. inefficiency I1.',
        6: 'Block 6 · Inefficiency Layer. I1 is derived from CDR, I4 from ACC, I5 from MNS; I2 and I3 require direct assessment. Your corrections are valuable validation data.',
        7: 'Blocks 7 and 8 · Intervention Matching Layer. Only interventions linked to observed inefficiencies (score ≥ 41) become candidates. IPI = (Impact × Data × Acceptability) / (Cost × GCS); classes A above 12, B 6 to 12, C below 6.',
        9: 'Validation criterion “perceived decision-making usefulness”: whether the diagnosis is understandable, the inefficiency–intervention link plausible and the ranking helpful for choosing priorities.'
      },
      sample: { title: 'Why we ask', body: ['It describes the study sample. Results are analysed only in aggregate form, never by individual organisation.'] },
      employees: { title: 'Why one site', body: ['The framework works site by site: headcount is used to check the split by mode and to describe the sample.'] },
      shifts: { title: 'Why shifts matter', body: ['A great public service at 9 am may not exist at 6 am. Shifts change timetable compatibility.'], fw: 'Feeds the reading of temporal mismatch (I3). If nobody works shifts, the question on uncovered shifts is skipped and counted as not applicable.' },
      pscl: { title: 'The commuting plan', body: ['In Italy the commuting plan (PSCL) is required by Decree 179/2021 for organisations with more than 100 employees at a site in a provincial capital or a municipality with over 50,000 inhabitants.', 'The final report is designed to feed into it.'] },
      dms: { title: 'Data level', body: ['Pick the highest level that describes the data you actually have, not the data you would like to have.'], fw: 'Data Maturity Score, 0–5. With DMS < 2 the plan puts building the baseline first, and interventions requiring origin-destination matrices, shift structures or public transport accessibility cannot score above 2 for data. If more than 30% of accessibility or car-dependency items stay unanswered, the effective DMS drops to 2.' },
      mns: { title: 'Needed presence', body: ['Think about the jobs, not today\'s habits: how much of the work really requires being on site?', 'Move the two handles on the bar, also with the arrow keys.'], fw: 'MNS = [(Qe × 5 + Qp × 3 + Qr × 1) − 100] / 4. With days on site we estimate avoidable demand: ACR = A_ev / A (eq. 7).' },
      daysWeek: { title: 'Days on site', body: ['The average across everyone at the site, remote working included.'], fw: 'g = days a week × 44 working weeks (220 days with 5 days a week).' },
      distance: { title: 'Average distance', body: ['The one-way home-to-work distance. Calculations count both ways.'], fw: 'd = 2 × one-way km (eq. 1).' },
      modes: { title: 'Split by mode', body: ['Count who usually uses each mode on most days. An estimate from a survey or experience is fine.', 'The emission estimate updates as you fill in.'], fw: 'For each mode: A = N·d·g (eq. 1), EI = e/o (eq. 2), LF = o/k (eq. 3), G = A·EI·φ (eq. 4). Parameters e, o, k and φ come from Tables 2.1–2.2 of the thesis (ISPRA 2024, EEA 2023, UITP 2022) and can be changed in the expert parameters.' },
      modeDistances: { title: 'Distances by mode', body: ['People who cycle or walk usually live closer: if the average is higher, we suggest 3 km for cycling and walking and 7 km for e-bikes and e-scooters.'], fw: 'Distances by mode enter eq. 1. Active mobility has no emissions, but its passenger-km count in system intensity (eq. 5).' },
      acc: { title: 'Accessibility', body: ['Answer with a typical person arriving at peak times in mind.', '“I don\'t know” is perfectly fine: the result will state lower reliability.'], fw: 'Item {k} of 7 of the Accessibility Score: ACC = [(mean of available items − 1) / 4] × 100. Higher means better accessibility. Last-mile friction I4 = 100 − ACC.' },
      cdr: { title: 'Car dependency', body: ['Answer with the typical situation at the site in mind.', '“I don\'t know” is perfectly fine.'], fw: 'Item {k} of 5 of the Car Dependency Ratio: CDR = [(mean of available items − 1) / 4] × 100. Higher means greater dependency. CDR feeds I1, underutilised capacity.' },
      I1: { title: 'Underutilised capacity', body: ['Think about empty seats: cars with one person, half-empty shuttles and buses. More empty seats means more energy per person carried.'], fw: 'I1. Estimate = CDR. Monitoring indicator: load factor (eq. 3). Consistent interventions: higher load factor of collective services, organised carpooling (Table 1).' },
      I2: { title: 'Modal duplication', body: ['It happens when different services cover the same route at the same time, while other areas go unserved.'], fw: 'I2, direct assessment. Bands from 0–20 (absent) to 81–100 (critical), from the thesis rubric (§6.3). Consistent intervention: coordination between company service and public transport (Table 1).' },
      I3: { title: 'Temporal mismatch', body: ['A great line at 9 am is no use to someone starting at 6 am. Think about the main shifts and end times.'], fw: 'I3, direct assessment. Monitoring indicator: time coverage. Consistent interventions: align schedules with public transport windows, on-call services (Table 1).' },
      I4: { title: 'Last-mile friction', body: ['A nearby stop is not enough if the way to the entrance is long, dark or interrupted.'], fw: 'I4. Estimate = 100 − ACC. Consistent interventions: active mobility facilities and a safe access route (Table 1).' },
      I5: { title: 'Avoidable demand', body: ['This is not about remote working in general: what counts is how much presence exceeds what the work requires.'], fw: 'I5. Estimate = 100 − MNS; if MNS is below 50 and people come in 4 or more days a week, at least “high”. Indicator: avoided commuting (eq. 7).' },
      ivSelect: { title: 'Why these interventions', body: ['The framework does not suggest generic measures: it only proposes those acting on the cause of the inefficiencies found.'], fw: 'Candidates = interventions in the inefficiency-intervention matrix (Table 1) linked to inefficiencies scoring ≥ 41. Primary ones act on the cause, complementary ones reinforce the effect.' },
      iv: { title: 'Rating an intervention', body: ['Three quick ratings: cost, acceptance and data. Emission reduction and governance complexity are already estimated, but you can correct them.'], fw: 'ΔG = passenger-km shifted or avoided × emission differential (eq. 6), turned into impact 1–5 by reduction bands: < 1%, 1–3%, 3–7%, 7–15%, ≥ 15%. IPI = (Impact × Data × Acceptability) / (Cost × GCS) (eq. 8).' },
      results: { title: 'Reading the octagon', body: ['Eight dimensions on a 0 to 100 scale, where a higher value means more criticality. Below you find the inefficiencies one by one and the intervention plan.'], fw: 'Axes: I1–I5 (Inefficiency Layer); emission intensity = CI relative to a petrol/diesel car with one person (203 g CO₂e/pax-km); missing data = (5 − effective DMS) × 20; implementation complexity = mean GCS of the interventions rated, rescaled to 0–100.' },
      truth: { title: 'Why these statements', body: ['Answer on instinct: there are no right answers. We want to know how useful the tool really was.'], fw: 'Validation criterion “perceived decision-making usefulness”: understandability of the diagnosis, plausibility of the inefficiency–intervention link, usefulness of the priority order.' },
      c1: { title: 'Completeness', body: ['It helps us understand whether five categories are enough to describe real problems.'], fw: 'Criterion “diagnostic completeness”: the taxonomy must classify observed inefficiencies without unattributable residues.' },
      c2: { title: 'Overlaps', body: ['If the same problem seemed to belong to two categories, tell us.'], fw: 'Criterion “diagnostic completeness”: without overlaps between categories.' },
      profile: { title: 'Your profile', body: ['It lets us read the evaluations by professional profile.'] },
      final: { title: 'Last step', body: ['Everything is optional. Your email stays separate from your answers and is only used for a possible interview.'] },
      thanks: { title: 'The report', body: ['The report is generated in your browser: in the print dialog choose “Save as PDF”.', 'You only need the response code to request access to or deletion of your data.'] }
    },

    privacy: {
      title: 'Privacy notice',
      sections: [
        ['Who processes the data', 'Enrico Emanuele Corazzini, who runs this website and the data collection on behalf of the authors of the study listed on this page. For any request, use the form at the end of this notice.'],
        ['What data we collect', 'Your answers to the Canvas (aggregate site data: type and sector of the organisation, number of employees, region, split by mode, scores), the computed results, any corrections with their reasons, your answers to the final evaluation and minimal technical data (language, tool version, completion times). We do not collect the name of the organisation or site, which stay in your browser, data on individual employees, or your IP address. We do not use cookies.'],
        ['Optional email', 'Only if you choose to be contacted. It is stored separately, with no link to your answers, and deleted at the end of the project.'],
        ['Why', 'For the scientific validation of the framework and statistical analysis. Results are published only in aggregate form, without any possibility of identifying individual organisations.'],
        ['Legal basis', 'Your consent (Art. 6(1)(a) GDPR), which you can withdraw at any time without affecting processing already carried out.'],
        ['Where and for how long', 'In a Google spreadsheet accessible only to the authors. Google may process data outside the European Union with the required safeguards (EU-US Data Privacy Framework). Anonymous answers are kept for the duration of the research project and subsequent scientific verification.'],
        ['Your rights', 'Access, rectification, erasure, restriction, objection and withdrawal of consent (Arts. 15–22 GDPR), quoting the response code you receive at the end. You also have the right to lodge a complaint with the Italian Data Protection Authority (Garante).'],
        ['Saving in your browser', 'So you do not lose your work, answers are also saved in your browser (localStorage). They stay on your device and you can delete them with “Start over”.']
      ],
      close: 'Close', authors: 'Authors',
      requestTitle: 'Request about your data', requestCode: 'Response code (if you have it)', requestKind: 'Type of request',
      requestKinds: { delete: 'Erasure', access: 'Access', other: 'Other' }, requestMessage: 'Message', requestEmail: 'Email for our reply',
      requestSend: 'Send request', requestSent: 'Request sent. We will reply to the address provided.', requestError: 'Sending failed: check the email and try again.'
    },
    footer: { privacy: 'Privacy notice', version: 'Beta 2.0 · engine {v}', lite: 'Simplified version' }
  }
};
