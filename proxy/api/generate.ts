const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN!;

const SDXL_VERSION = '15a3689ee13b0d2616e98820eca31d4c3abcd36672df6afce5cb6feb1d66087d';

async function proxyToReplicate(path: string, body?: object) {
  const res = await fetch(`https://api.replicate.com/v1${path}`, {
    method: body ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${REPLICATE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Replicate: ${res.status} ${text}`);
  }

  return res.json();
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    // Poll existing prediction
    if (req.method === 'GET' && req.query.id) {
      const prediction = await proxyToReplicate(`/predictions/${req.query.id}`);
      return res.json(prediction);
    }

    // Create new prediction
    if (req.method === 'POST') {
      const { image, prompt } = req.body;

      if (!image || !prompt) {
        return res.status(400).json({ error: 'Missing image or prompt' });
      }

      const prediction = await proxyToReplicate('/predictions', {
        version: SDXL_VERSION,
        input: {
          image: `data:image/jpeg;base64,${image}`,
          prompt,
          prompt_strength: 0.7,
          guidance_scale: 7.5,
          num_inference_steps: 30,
        },
      });

      return res.json(prediction);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
