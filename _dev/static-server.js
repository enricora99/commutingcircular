// Server statico minimo per l'anteprima locale di circularcommuting.it (niente dipendenze).
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = process.argv[2];
const port = Number(process.argv[3] || 8765);
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.ico': 'image/x-icon'
};

http.createServer((req, res) => {
  let rel = decodeURIComponent(req.url.split('?')[0]);
  if (rel.endsWith('/')) rel += 'index.html';
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(path.normalize(root))) { res.writeHead(403); return res.end(); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); return res.end('404'); }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'Content-Length': data.length });
    res.end(data);
  });
}).listen(port, '127.0.0.1', () => console.log(`serving ${root} on http://127.0.0.1:${port}`));
