/*
 * Genera assets/js/italy-regions.js: i confini delle 20 regioni come tracciati SVG leggeri.
 * Fonte: confini amministrativi ISTAT, file TopoJSON di openpolis/geojson-italy (licenza CC BY 4.0).
 * Uso: node _dev/build-italy-map.js <limits_IT_regions.topo.json> [tolleranza] [larghezza]
 * La semplificazione lavora sugli archi condivisi, così i confini tra regioni restano combacianti.
 */
const fs = require('fs');
const path = require('path');

const src = process.argv[2];
const TOL = Number(process.argv[3] || 0.9);   // tolleranza di semplificazione, in unità del viewBox
const W = Number(process.argv[4] || 600);
const MIN_ISLAND = 6;                          // isole e buchi più piccoli (unità²) vengono tolti

const NAMES = {
  '01': 'Piemonte', '02': "Valle d'Aosta", '03': 'Lombardia', '04': 'Trentino-Alto Adige', '05': 'Veneto',
  '06': 'Friuli-Venezia Giulia', '07': 'Liguria', '08': 'Emilia-Romagna', '09': 'Toscana', '10': 'Umbria',
  '11': 'Marche', '12': 'Lazio', '13': 'Abruzzo', '14': 'Molise', '15': 'Campania', '16': 'Puglia',
  '17': 'Basilicata', '18': 'Calabria', '19': 'Sicilia', '20': 'Sardegna'
};

const topo = JSON.parse(fs.readFileSync(src, 'utf8'));
const [sx, sy] = topo.transform.scale;
const [tx, ty] = topo.transform.translate;

// archi quantizzati e codificati a differenze -> longitudine e latitudine
const arcsLL = topo.arcs.map(arc => {
  let x = 0, y = 0;
  return arc.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; });
});

// proiezione equirettangolare con fattore cos(42°), adatta all'estensione dell'Italia
const K = Math.cos(42 * Math.PI / 180);
let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
arcsLL.forEach(a => a.forEach(([lon, lat]) => {
  const x = lon * K, y = -lat;
  minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
}));
const PAD = 6;
const scale = (W - 2 * PAD) / (maxX - minX);
const H = Math.ceil((maxY - minY) * scale + 2 * PAD);
const proj = ([lon, lat]) => [(lon * K - minX) * scale + PAD, (-lat - minY) * scale + PAD];

// Douglas-Peucker sugli archi, estremi sempre conservati
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop();
    const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy);
    let maxD = -1, idx = -1;
    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      const d = len === 0 ? Math.hypot(px - ax, py - ay) : Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
      if (d > maxD) { maxD = d; idx = i; }
    }
    if (maxD > tol) { keep[idx] = 1; stack.push([a, idx], [idx, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const arcs = arcsLL.map(a => simplify(a.map(proj), TOL));

function ring(indices) {
  const out = [];
  indices.forEach((i, k) => {
    const a = i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
    a.forEach((p, j) => { if (k === 0 || j > 0) out.push(p); });
  });
  return out;
}
const area = pts => pts.reduce((s, [x, y], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; return s + x * y2 - x2 * y; }, 0) / 2;
function centroid(pts) {
  let cx = 0, cy = 0, a = 0;
  pts.forEach(([x, y], i) => { const [x2, y2] = pts[(i + 1) % pts.length]; const f = x * y2 - x2 * y; a += f; cx += (x + x2) * f; cy += (y + y2) * f; });
  return a === 0 ? pts[0] : [cx / (3 * a), cy / (3 * a)];
}

function pathD(rings) {
  return rings.map(pts => {
    const r = pts.map(([x, y]) => [Math.round(x), Math.round(y)]).filter((p, i, arr) => i === 0 || p[0] !== arr[i - 1][0] || p[1] !== arr[i - 1][1]);
    let d = `M${r[0][0]} ${r[0][1]}`;
    for (let i = 1; i < r.length; i++) {
      const dx = r[i][0] - r[i - 1][0], dy = r[i][1] - r[i - 1][1];
      d += `l${dx}${dy < 0 ? dy : ' ' + dy}`;
    }
    return d + 'z';
  }).join('');
}

const regions = topo.objects.regions.geometries.map(g => {
  const polys = g.type === 'Polygon' ? [g.arcs] : g.arcs;
  const rings = [];
  let biggest = null;
  polys.forEach(poly => poly.forEach(idx => {
    const pts = ring(idx);
    const A = Math.abs(area(pts));
    if (!biggest || A > biggest.A) biggest = { pts, A };
    rings.push({ pts, A });
  }));
  const kept = rings.filter(r => r === biggest || r.A >= MIN_ISLAND).map(r => r.pts).filter(p => p.length >= 3);
  const [cx, cy] = centroid(biggest.pts);
  const code = g.properties.reg_istat_code;
  return { code, name: NAMES[code], x: Math.round(cx), y: Math.round(cy), d: pathD(kept) };
}).sort((a, b) => a.code.localeCompare(b.code));

const header = `/* Confini delle regioni italiane per la scelta della sede su mappa.
 * Fonte: ISTAT, elaborazione openpolis/geojson-italy (CC BY 4.0). Generato da _dev/build-italy-map.js. */\n`;
const body = `window.CCF_ITALY = ${JSON.stringify({ w: W, h: H, regions })};\n`;
const out = path.join(__dirname, '..', 'assets', 'js', 'italy-regions.js');
fs.writeFileSync(out, header + body);
console.log(`scritto ${out}: ${(header.length + body.length) / 1000} kB, viewBox 0 0 ${W} ${H}, punti ${arcs.reduce((s, a) => s + a.length, 0)}`);
