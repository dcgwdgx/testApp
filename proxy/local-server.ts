import 'dotenv/config';
import express from 'express';
import { writeFileSync, readFileSync } from 'fs';

const app = express();
app.use(express.json({ limit: '1mb' }));

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
});

app.post('/api/generate', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

    const safePrompt = encodeURIComponent(`pet portrait, ${prompt}`);
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${safePrompt}?width=768&height=768&model=flux&nologo=true`;

    console.log(`Fetching from Pollinations...`);
    const imageResp = await fetch(pollinationsUrl);

    if (!imageResp.ok) {
      return res.status(500).json({ error: `Pollinations failed: ${imageResp.status}` });
    }

    const buffer = Buffer.from(await imageResp.arrayBuffer());
    const base64 = buffer.toString('base64');
    const dataUri = `data:image/jpeg;base64,${base64}`;

    console.log(`Image downloaded: ${buffer.length} bytes`);
    res.json({ imageUrl: dataUri });
  } catch (err: any) {
    console.error('Generate error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3456, () => {
  console.log('Local proxy running on http://localhost:3456');
});
