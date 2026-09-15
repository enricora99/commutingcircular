# Circular Commuting — design system

Vale per la home, la beta 2.0 e la versione semplificata. Il codice di riferimento è `assets/css/ccf.css` (token e componenti) con `assets/js/icons.js` (icone). L'identità riprende il verde del Canvas originale e lo porta su pastelli opachi: neutri caldi, verde foresta profondo, Manrope con titoli leggeri, bordi sottili, ombre quasi impercettibili.

## Principi

1. **Una cosa alla volta.** Nella beta ogni schermata pone una sola domanda, con tanto spazio intorno. L'attenzione di chi compila è bassa: domande brevi, in linguaggio reale, senza sigle.
2. **Le sigle stanno dietro al "?".** DMS, MNS, ACC, CDR, I1–I5, GCS, IPI, le equazioni e i nomi degli interventi della Tab. 1 compaiono solo nei risultati, nel report e nel pannello di aiuto.
3. **Il "?" è sempre presente.** Il pulsante in basso a destra spiega cosa c'è a schermo. Il pannello ha la spiegazione semplice, il riquadro "Nel framework" con il riferimento tecnico e, sempre in fondo, i contatti ("Altri dubbi?"). Nella beta, sotto i contatti, si apre "Chi firma la ricerca".
4. **Il movimento è lento e morbido.** Le animazioni accompagnano, non distraggono, e rispettano sempre `prefers-reduced-motion`.
5. **Gli autori stanno nella beta.** Compaiono alla fine (schermata di ringraziamento), nel pannello "?" e nel report. Non nella home.

## Colore

| Token | Valore | Uso |
|---|---|---|
| `--ink` | `#1B2E2A` | testo principale, pulsanti primari, selezione, pannello scuro |
| `--slate` | `#41534E` | testo secondario |
| `--muted` | `#6E7C78` | note, fonti, suggerimenti |
| `--line` / `--line-2` | `#E7EBE6` / `#D3DCD6` | bordi leggeri / bordi dei controlli |
| `--bg` / `--surface` | `#F7F6F1` / `#FFFFFF` | fondo carta calda / carte |
| `--accent` / `--accent-deep` | `#3C8A78` / `#2A6A5B` | eucalipto: icone e accenti / testo in accento, link, eyebrow |
| `--tint` / `--tint-2` | `#D3EADF` / `#ECF5F0` | menta: riquadri, selezioni tenui |
| `--sky`, `--lilac`, `--apricot`, `--butter` | `#8DB8D6`, `#B3A7D9`, `#EDB08A`, `#EBD58A` | pastelli del gradiente e delle serie di dati; ognuno ha la variante `-tint` e, dove serve per il testo, `-deep` |
| `--sev1`…`--sev5` | `#6DB38F` → `#B5CB6E` → `#E6C15C` → `#E8945F` → `#D0625A` | fasce di gravità 0–20 … 81–100 |

Il colore di gravità si usa solo per le inefficienze e i vertici dell'ottagono, mai per decorare. L'albicocca segnala ciò che è "consigliato" o "proposto dal framework".

## Tipografia

- **Manrope** variabile, in `assets/fonts/manrope-var-*.woff2` (licenza OFL), servito dal sito e non da CDN esterne. Ha le cifre tabulari, necessarie per KPI e tabelle.
- Titoli con peso **300**, interlinea stretta (1.08) e spaziatura −0.022em.
- Eyebrow: 12px, maiuscolo, spaziatura 0.14em, peso 600, colore `--accent-deep`.
- Numeri grandi (KPI, curiosità, capitoli) in peso 200–300 con cifre tabulari (`.num`).
- JetBrains Mono resta solo nella versione semplificata.

## Forme e ombre

- Raggi: 8px per i controlli, 12px per le opzioni, 16px per le carte, 24px per le fasce "mare".
- Ombra delle carte: `0 1px 3px rgba(27,46,42,.06), 0 10px 40px rgba(27,46,42,.03)`.
- Ombra degli elementi galleggianti ("?", maniglie): `0 12px 32px rgba(27,46,42,.16)`.

## Illustrazione: lo stile unico

**Icone a tratto.** Griglia 24×24, tratto 1.5, estremità e giunzioni arrotondate, colore `currentColor`, nessun riempimento. L'unica eccezione sono piccoli punti pieni (`class="fill"`) per le persone o i posti occupati. Le nuove icone vanno aggiunte in `assets/js/icons.js` seguendo le stesse regole.

**Glifo di scala.** Ogni risposta ordinale da 1 a 5 mostra cinque punti pieni fino al livello. I punti indicano l'intensità di ciò che chiede la domanda, non se è un bene o un male. È un glifo funzionale, non decorativo.

**Il mare.** Gradiente pastello menta → cielo → lilla → albicocca (`--grad`) che scorre lentamente (36 s), con tre luci che si spostano e due onde (`.sea`). Si usa a tutto schermo nella home e, nella variante chiara `.sea-soft` (`--grad-soft`), per l'intro, le copertine dei capitoli e il ringraziamento.

**Le formine trasparenti.** Crocette, cerchi, rombi e triangoli a tratto sottile, in una tessera da 132px (`--marks`, e `--marks-light` sui fondi scuri). Sostituiscono i puntini: texture del mare, angoli delle schede "Lo sapevi?", pannello della beta in home, intestazione della versione semplificata, angoli delle sezioni. Scorrono molto lentamente.

**La mappa.** Le regioni d'Italia (`assets/js/italy-regions.js`, generate da `_dev/build-italy-map.js` dai confini ISTAT elaborati da openpolis, CC BY 4.0) usano i quattro pastelli `-tint` a rotazione; la regione scelta è in `--accent`. La fonte è citata sotto la mappa e nel "?".

**La favicon.** Riquadro con il gradiente del mare e il segno del marchio (freccia circolare con il punto) in `--ink`: `favicon.svg`, `favicon.ico` (16, 32, 48 px), `apple-touch-icon.png` (180 px, a tutto campo).

## Componenti

| Componente | Classe | Regole |
|---|---|---|
| Invito principale | `.btn-cta` | bianco con bordo pastello che ruota e alone che respira; uno per pagina, sull'azione più importante |
| Scelta con icona | `.opt` dentro `.opts` | orizzontale su desktop, a colonna su mobile; tasti 1–9; avanzamento automatico dopo la scelta |
| Chip | `.chip` | scelte rapide e "Non lo so" (tasto 0) |
| Curiosità | `.fact` | eyebrow "Lo sapevi?", numero grande, icona grande o titolo breve (`.fact-title`), parafrasi, fonte in piccolo |
| Aiuto | `.help-fab` e `.help-drawer` | pannello a destra su desktop, dal basso su mobile; in fondo sempre `.help-contact` |
| Avanzamento | `.rail` | nove segmenti, uno per capitolo, con nome del capitolo; mai tagliato |
| Navigazione | `.q-nav` | "Indietro" a sinistra, azione primaria a destra, al centro "Salvato nel browser · Altri dubbi?" (apre il "?"); barra fissa sotto i 1180px |
| Proposte | `.iv-card` in `.iv-group` | raggruppate per problema, nome semplice, cosa significa, beneficio stimato; le complementari restano in "Altre idee" |
| Domanda su una proposta | `.iv-head` + `.ivq-steps` | scheda compatta della proposta, poi una sola domanda con 5 risposte ancorate; le stime del framework in "Controlla le stime" |
| Ottagono | `.radar` | otto assi 0–100, anelli ogni 20, vertici colorati per gravità; su mobile sigle con legenda |
| Priorità | `.prio.A/.B/.C` | A pieno scuro, B menta, C grigio |

## Testi

- Si dà del tu, in modo professionale: il pubblico sono i mobility manager.
- Le curiosità sono parafrasi dei risultati degli articoli citati nel paper, con autore, anno e rivista. Mai citazioni testuali lunghe.
- Italiano e inglese hanno sempre le stesse chiavi: `beta/i18n.js` per la beta, `assets/js/landing.js` per la home, `assets/js/content.js` per contatti, autori e curiosità.
- Dopo aver cambiato le etichette italiane della beta, rigenerare `_backend/labels.js` con `node _dev/build-labels.js`, così il dizionario del foglio resta allineato.

## Anteprima e controlli

- `node _dev/static-server.js . 8765` (oppure la configurazione "sito-statico" in `.claude/launch.json`).
- `/_dev/seed.html?pos=<schermata>` apre la beta su una schermata con uno stato di prova (`_dev/fixtures/state-demo.json`), solo in locale.
- Test: `node --test _dev/tests/engine.test.js` (motore) e `node --test _dev/tests/backend.test.js` (backend con foglio simulato).
