import { ARK_API_KEY } from './config';

const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const TIMEOUT_MS = 120_000;
const MAX_RETRIES = 2;

interface GenerateParams {
  imageBase64: string;
  prompt: string;
  strength: number;
  signal?: AbortSignal;
}

interface ArkResponse {
  data?: { url?: string; b64_json?: string }[];
  error?: { message: string; code: string };
}

async function fetchOnce(
  { imageBase64, prompt, strength, signal }: GenerateParams,
  attempt: number,
): Promise<ArkResponse> {
  const controller = new AbortController();
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${ARK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'doubao-seedream-5-0-lite-260128',
        prompt,
        image: [`data:image/jpeg;base64,${imageBase64}`],
        size: '2k',
        response_format: 'b64_json',
        watermark: false,
        sample_strength: strength,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      let detail = '';
      try { detail = ': ' + JSON.parse(body).error?.message; } catch {}
      throw new Error(`Server error (${res.status})${detail || '. Please try again.'}`);
    }

    return res.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function generatePortrait(
  params: GenerateParams,
  onProgress?: (status: string) => void,
): Promise<string> {
  onProgress?.('starting');

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        onProgress?.(`processing (retry ${attempt})`);
        await sleep(2000);
      } else {
        onProgress?.('processing');
      }

      const data = await fetchOnce(params, attempt);

      if (data.error) {
        throw new Error(data.error.message || 'Generation failed');
      }

      const b64 = data.data?.[0]?.b64_json;
      if (!b64) {
        throw new Error('No image returned. Please try again.');
      }

      onProgress?.('succeeded');
      return `data:image/jpeg;base64,${b64}`;
    } catch (err: any) {
      lastError = err;
      if (err.name === 'AbortError' && !params.signal?.aborted) continue;
      if (err.message.includes('Server error (4') || err.message.includes('Server error (5')) continue;
      throw err;
    }
  }

  throw lastError || new Error('Generation failed after retries. Please try again.');
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
