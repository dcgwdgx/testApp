interface CachedPhoto {
  uri: string;
  base64: string;
}

let cachedPhoto: CachedPhoto | null = null;

export function setCachedPhoto(photo: CachedPhoto) {
  cachedPhoto = photo;
}

export function getCachedPhoto(): CachedPhoto | null {
  return cachedPhoto;
}
