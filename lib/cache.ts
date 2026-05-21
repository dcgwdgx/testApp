let cachedImageUrl: string | null = null;
let cachedOriginalUri: string | null = null;

export function setCachedImage(url: string) {
  cachedImageUrl = url;
}

export function getCachedImage(): string | null {
  return cachedImageUrl;
}

export function setCachedOriginalUri(uri: string) {
  cachedOriginalUri = uri;
}

export function getCachedOriginalUri(): string | null {
  return cachedOriginalUri;
}
