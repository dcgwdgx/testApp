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

async function fetchOnce({
  imageBase64,
  prompt,
  strength,
  signal,
}: GenerateParams): Promise<ArkResponse> {
  const controller = new AbortController();
  if (signal) {
    signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(API_URL, {
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

    if (!response.ok) {
      const body = await response.text();
      let detail = '';
      try {
        detail = `: ${JSON.parse(body).error?.message}`;
      } catch {}
      throw new Error(`Server error (${response.status})${detail || '. Please try again.'}`);
    }
    return response.json();
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
        await new Promise((resolve) => setTimeout(resolve, 2000));
      } else {
        onProgress?.('processing');
      }

      const data = await fetchOnce(params);
      if (data.error) throw new Error(data.error.message || 'Generation failed');

      const image = data.data?.[0]?.b64_json;
      if (!image) throw new Error('No image returned. Please try again.');
      onProgress?.('succeeded');
      return `data:image/jpeg;base64,${image}`;
    } catch (error: any) {
      lastError = error;
      if (error.name === 'AbortError' && params.signal?.aborted) throw error;
      if (attempt === MAX_RETRIES) throw error;
    }
  }

  throw lastError || new Error('Generation failed after retries. Please try again.');
}
