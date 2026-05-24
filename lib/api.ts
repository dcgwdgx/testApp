import { ARK_API_KEY } from './config';

const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';
const TIMEOUT_MS = 120_000;

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

export async function generatePortrait(
  { imageBase64, prompt, strength, signal }: GenerateParams,
  onProgress?: (status: string) => void,
): Promise<string> {
  onProgress?.('starting');

  const controller = new AbortController();
  const linkedSignal = signal;

  if (linkedSignal) {
    linkedSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    onProgress?.('processing');

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
        size: '1k',
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

    const data: ArkResponse = await res.json();

    if (data.error) {
      throw new Error(data.error.message || 'Generation failed');
    }

    const b64 = data.data?.[0]?.b64_json;
    if (!b64) {
      throw new Error('No image returned. Please try again.');
    }

    onProgress?.('succeeded');
    return `data:image/jpeg;base64,${b64}`;
  } finally {
    clearTimeout(timeoutId);
  }
}
