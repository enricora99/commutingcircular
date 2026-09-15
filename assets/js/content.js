/*
 * Contenuti condivisi tra home e beta: autori e curiosità dalla letteratura citata nell'articolo.
 * Le curiosità sono parafrasi dei risultati, con la fonte: niente citazioni testuali.
 */
window.CCF_CONTENT = {
  paperTitle: 'An Energy-Aware Circular Commuting Framework for Corporate Mobility Management',

  authors: [
    {
      name: 'Enrico Emanuele Corazzini',
      initials: 'EC',
      role: { it: 'Primo autore', en: 'First author' },
      bio: {
        it: "Ha ideato il Circular Commuting Framework e sviluppato questo strumento. Si occupa di mobilità sostenibile ed economia circolare applicata ai servizi e presiede un'associazione di promozione sociale dedicata a questi temi.",
        en: 'Designed the Circular Commuting Framework and built this tool. Works on sustainable mobility and circular economy applied to services, and chairs a non-profit association devoted to these topics.'
      }
    },
    {
      name: 'Linda Meleo',
      initials: 'LM',
      role: { it: 'Autrice corrispondente', en: 'Corresponding author' },
      bio: {
        it: "Economista. Si occupa di analisi economica della regolazione nei trasporti, nei servizi pubblici, nell'energia e nell'ambiente; è stata assessora alla mobilità di Roma Capitale.",
        en: "Economist. Works on the economic analysis of regulation in transport, public utilities, energy and the environment; formerly Rome's city councillor for mobility."
      }
    },
    {
      name: 'Stefano Brinchi',
      initials: 'SB',
      role: { it: 'Coautore', en: 'Co-author' },
      bio: {
        it: 'Ingegnere dei trasporti. È stato presidente e amministratore delegato di Roma Servizi per la Mobilità e insegna strategie e strumenti per la mobilità sostenibile.',
        en: 'Transport engineer. Former president and CEO of Roma Servizi per la Mobilità; teaches strategies and tools for sustainable mobility.'
      }
    },
    {
      name: 'Cristiano Fragassa',
      initials: 'CF',
      role: { it: 'Coautore', en: 'Co-author' },
      bio: {
        it: 'Ingegnere industriale. La sua ricerca riguarda materiali innovativi e sostenibili, con oltre 150 pubblicazioni scientifiche.',
        en: 'Industrial engineer. His research focuses on innovative and sustainable materials, with more than 150 scientific publications.'
      }
    }
  ],

  facts: {
    reporting: {
      big: '19/29',
      it: { text: 'Dei 29 standard di rendicontazione di sostenibilità analizzati, 19 non considerano la mobilità dei dipendenti. Gli altri si fermano quasi sempre al calcolo delle emissioni.', src: 'Tsairi & Martens (2024), Transport Reviews' },
      en: { text: 'Of 29 sustainability reporting frameworks reviewed, 19 ignore employee mobility. Most of the others stop at calculating emissions.', src: 'Tsairi & Martens (2024), Transport Reviews' }
    },
    remote: {
      big: '−58%',
      it: { text: "Lavorare da casa può ridurre fino al 58% l'impronta di carbonio legata al lavoro. Il beneficio netto però dipende da uffici, abitazioni e spostamenti non lavorativi.", src: 'Tao et al. (2023), PNAS' },
      en: { text: 'Working from home can cut work-related carbon footprints by up to 58%. The net benefit depends on offices, homes and non-work travel.', src: 'Tao et al. (2023), PNAS' }
    },
    occupancy: {
      big: '×10',
      it: { text: "Un autobus pieno al 70% consuma per passeggero circa un decimo di un'auto con il solo conducente. Se viaggia al 10% consuma quanto l'auto.", src: 'Schäfer & Yeh (2020), Nature Sustainability; elaborazione su ISPRA e UITP' },
      en: { text: 'A bus at 70% occupancy uses about a tenth of the energy per passenger of a car driven alone. At 10% occupancy it uses as much as the car.', src: 'Schäfer & Yeh (2020), Nature Sustainability; based on ISPRA and UITP data' }
    },
    bike: {
      icon: 'bike',
      it: { text: 'Rastrelliere sicure, docce e spogliatoi in sede aumentano la probabilità di andare al lavoro in bicicletta.', src: 'Buehler (2012), Transportation Research Part D' },
      en: { text: 'Secure bike parking, showers and lockers at work increase the likelihood of cycling to work.', src: 'Buehler (2012), Transportation Research Part D' }
    },
    parking: {
      icon: 'parking',
      it: { text: "Il parcheggio gratuito al lavoro spinge a usare l'auto: è una delle leve più documentate nella letteratura sulla mobilità casa-lavoro.", src: 'Hess (2001), Transportation Research Record' },
      en: { text: 'Free workplace parking encourages driving to work: it is one of the best documented levers in commuting research.', src: 'Hess (2001), Transportation Research Record' }
    },
    wellbeing: {
      big: '7:30',
      it: { text: 'Il tragitto del mattino è tra i momenti meno piacevoli della giornata, e i tragitti più lunghi non vengono compensati da stipendi più alti o case più economiche.', src: 'Kahneman & Krueger (2006); Stutzer & Frey (2008)' },
      en: { text: 'The morning commute ranks among the least pleasant moments of the day, and longer commutes are not offset by higher pay or cheaper housing.', src: 'Kahneman & Krueger (2006); Stutzer & Frey (2008)' }
    },
    package: {
      big: '1 + 1 > 2',
      it: { text: "L'efficacia di un piano di mobilità aziendale dipende più dalla coerenza del pacchetto di misure che dalla singola misura.", src: 'Cairns et al. (2010); Petrunoff et al. (2016)' },
      en: { text: 'The effectiveness of a workplace travel plan depends more on how coherent the package is than on any single measure.', src: 'Cairns et al. (2010); Petrunoff et al. (2016)' }
    },
    optimal: {
      big: '≠',
      it: { text: "I dipendenti possono rifiutare il mezzo che il calcolo indica come ottimale: per questo il framework pesa anche accettabilità e complessità, non solo le emissioni.", src: 'Varga et al. (2025), Cities' },
      en: { text: 'Employees may reject the mode a calculation identifies as optimal: that is why the framework weighs acceptability and complexity, not just emissions.', src: 'Varga et al. (2025), Cities' }
    }
  }
};
