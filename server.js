/**
 * Zero-dependency Static HTTP Server for UMF Expertenstandards
 * Runs with Node.js or agy-node
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const ROOT_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // Parse URL to strip query string
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  let filePath = path.join(ROOT_DIR, decodeURIComponent(reqUrl.pathname));

  // Security check: prevent directory traversal
  if (reqUrl.pathname === '/log') {
    const text = reqUrl.searchParams.get('text');
    console.log('CAPTURED_QR_CODE:', text);
    fs.writeFileSync(path.join(ROOT_DIR, 'decoded_qr.txt'), text || '');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Logged');
    return;
  }
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  // Check if target is a directory, serve index.html
  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    fs.readFile(filePath, (readErr, data) => {
      if (readErr) {
        // If file not found, fall back to index.html for SPA hash routing
        const fallbackPath = path.join(ROOT_DIR, 'index.html');
        fs.readFile(fallbackPath, (fallbackErr, fallbackData) => {
          if (fallbackErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallbackData);
          }
        });
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache',
        'Access-Control-Allow-Origin': '*'
      });
      res.end(data);
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  const localUrl = `http://localhost:${PORT}`;
  console.log('\n======================================================');
  console.log('   UMF Expertenstandards - Digitale Pocketcards       ');
  console.log('======================================================');
  console.log(`\n> Server is running at: ${localUrl}`);
  console.log(`> Serving files from:   ${ROOT_DIR}`);
  console.log('\n> Press Ctrl+C to stop the server\n');

  // Auto-launch browser on Windows if not running headless
  if (process.argv.includes('--open')) {
    exec(`start ${localUrl}`, (err) => {
      if (err) console.log('Could not automatically open browser:', err.message);
    });
  }
});
