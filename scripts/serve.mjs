import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png':'image/png' };
const server = http.createServer(async (req, res) => {
  // Static loopback preview only. No request body is read and no input is logged.
  if (!['GET', 'HEAD'].includes(req.method)) {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    return res.end('이 미리보기는 입력을 받지 않습니다.');
  }
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    let requested = decodeURIComponent(url.pathname);
    if (requested === '/') requested = '/index.html';
    const file = path.resolve(root, '.' + requested);
    if (!file.startsWith(root + path.sep) && file !== path.join(root, 'index.html')) {
      res.writeHead(403); return res.end('Forbidden');
    }
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('페이지를 찾을 수 없습니다. 홈(/)으로 돌아가 주세요.');
  }
});
server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
server.on('error', (error) => { console.error(error.code === 'EADDRINUSE' ? `${port} 포트를 사용 중입니다. 다른 PORT로 실행해 주세요.` : error.message); process.exitCode = 1; });
