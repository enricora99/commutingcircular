# Circular Commuting — design system

Vale per la home, la beta 2.0 e la versione semplificata. Il codice di riferimento è `assets/css/ccf.css` (token e componenti) con `assets/js/icons.js` (icone). Il sistema visivo si ispira a quello di Wiseair: neutri freddi, Inter con titoli leggeri, bordi sottili, ombre quasi impercettibili. Il marchio e i contenuti restano quelli di Circular Commuting.

## Principi

1. **Una cosa alla volta.** Nella beta ogni schermata pone una sola domanda, con tanto spazio intorno. L'attenzione di chi compila è bassa: domande brevi, in linguaggio reale, senza sigle.
2. **Le sigle stanno dietro al "?".** DMS, MNS, ACC, CDR, I1–I5, GCS, IPI e le equazioni compaiono solo nei risultati e nel pannello di aiuto.
3. **Il "?" è sempre presente.** Il pulsante in basso a destra spiega cosa c'è a schermo in quel momento. Il pannello ha sempre due livelli: la spiegazione semplice e il riquadro "Nel framework" con il riferimento tecnico.
4. **Il movimento è lento e morbido.** Le animazioni accompagnano, non distraggono, e rispettano sempre `prefers-reduced-motion`.

## Colore

| Token | Valore | Uso |
|---|---|---|
| `--ink` | `#1D2130` | testo principale, pulsanti primari, selezione |
| `--slate` | `#383F5D` | testo secondario |
| `--muted` | `#6B7280` | note, fonti, suggerimenti |
| `--line` / `--line-2` | `#ECEFF2` / `#DDE2EA` | bordi leggeri / bordi dei controlli |
| `--bg` / `--surface` | `#FAFAFA` / `#FFFFFF` | fondo pagina / carte |
| `--blue` / `--blue-deep` | `#586CC9` / `#3F51A8` | accento, icone, link |
| `--azure` / `--azure-2` | `#D6E6FF` / `#EEF4FF` | accento tenue, riquadri informativi |
| `--teal` / `--teal-deep` | `#14B8A6` / `#0F766E` | mobilità attiva, esiti positivi, valori proposti |
| `--sev1`…`--sev5` | verde → lime → ambra → arancio → rosso | fasce di gravità 0–20 … 81–100 |

Il colore di gravità si usa solo per le inefficienze e i vertici dell'ottagono, mai per decorare.

## Tipografia

- **Inter** variabile, in `assets/fonts/inter-var-*.woff2` (licenza OFL), servito dal sito e non da CDN esterne.
- Titoli con peso **300**, interlinea stretta (1.08) e spaziatura −0.022em.
- Eyebrow: 12px, maiuscolo, spaziatura 0.14em, colore `--blue`.
- Numeri grandi (KPI, curiosità, capitoli) in peso 200–300 con cifre tabulari (`.num`).
- JetBrains Mono resta solo nella versione semplificata.

## Forme e ombre

- Raggi: 8px per i controlli, 12px per le opzioni, 16px per le carte, 24px per le fasce "mare".
- Ombra delle carte: `0 1px 3px rgba(0,0,0,.05), 0 10px 40px rgba(0,0,0,.02)`.
- Ombra degli elementi galleggianti ("?", maniglie): `0 12px 32px rgba(29,33,48,.14)`.

## Illustrazione: lo stile unico

**Icone a tratto.** Griglia 24×24, tratto 1.5, estremità e giunzioni arrotondate, colore `currentColor`, nessun riempimento. L'unica eccezione sono piccoli punti pieni (`class="fill"`) per le persone o i posti occupati, per esempio le teste nell'auto condivisa. Le nuove icone vanno aggiunte in `assets/js/icons.js` seguendo le stesse regole.

**Glifo di scala.** Ogni risposta ordinale da 1 a 5 (accessibilità, dipendenza dall'auto, gravità, costo, accettazione, dati, frasi da valutare) mostra cinque punti pieni fino al livello. I punti indicano l'intensità di ciò che chiede la domanda, non se è un bene o un male.

**Il mare.** Gradiente azzurro → blu → ardesia con tre macchie di luce che si spostano in 28–34 secondi e due onde che scorrono in 30 e 46 secondi (`.sea`). Si usa per la home a tutto schermo e, nella variante chiara `.sea-soft`, per l'intro, le copertine dei capitoli e il ringraziamento.

**La griglia di punti.** Puntini da 1.2px ogni 22px, per texture di fondo e angoli delle schede "Lo sapevi?".

## Componenti

| Componente | Classe | Regole |
|---|---|---|
| Scelta con icona | `.opt` dentro `.opts` | orizzontale su desktop, a colonna su mobile; tasti 1–9; avanzamento automatico dopo la scelta |
| Chip | `.chip` | scelte rapide e "Non lo so" (tasto 0) |
| Curiosità | `.fact` | eyebrow "Lo sapevi?", numero grande o icona grande, parafrasi, fonte in piccolo |
| Aiuto | `.help-fab` e `.help-drawer` | pannello a destra su desktop, dal basso su mobile |
| Avanzamento | `.rail` | nove segmenti, uno per capitolo, con nome del capitolo; mai tagliato |
| Navigazione | `.q-nav` | "Indietro" a sinistra, azione primaria a destra; barra fissa sotto i 1180px |
| Ottagono | `.radar` | otto assi 0–100, anelli ogni 20, vertici colorati per gravità; su mobile sigle con legenda |
| Priorità | `.prio.A/.B/.C` | A pieno scuro, B azzurro, C grigio |

## Testi

- Si dà del tu, in modo professionale: il pubblico sono i mobility manager.
- Le curiosità sono parafrasi dei risultati degli articoli citati nel paper, con autore, anno e rivista. Mai citazioni testuali lunghe.
- Italiano e inglese hanno sempre le stesse chiavi: `beta/i18n.js` per la beta, `assets/js/landing.js` per la home, `assets/js/content.js` per autori e curiosità.
