import http from 'http';

const PORT = 3456;

http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }

  // Proxy to Ark API
  const body = await new Promise((resolve) => {
    let data = '';
    req.on('data', (c) => data += c);
    req.on('end', () => resolve(data));
  });

  const arkRes = await fetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': req.headers.authorization || '' },
    body,
  });

  const arkData = await arkRes.arrayBuffer();
  res.writeHead(arkRes.status, { 'Content-Type': 'application/json' });
  res.end(Buffer.from(arkData));
}).listen(PORT);

console.log(`Proxy: http://localhost:${PORT}`);
