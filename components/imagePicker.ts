import { launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';

const MAX_SIZE = 1024;
const JPEG_QUALITY = 0.8;

export async function pickAndResizeImage(): Promise<{ uri: string; base64: string }> {
  const result = await launchImageLibraryAsync({
    mediaTypes: MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.9,
    base64: true,
  });

  if (result.canceled || !result.assets[0]) {
    throw new Error('User cancelled');
  }

  const asset = result.assets[0];

  const resized = await manipulateAsync(
    asset.uri,
    [{ resize: { width: MAX_SIZE, height: MAX_SIZE } }],
    { format: SaveFormat.JPEG, compress: JPEG_QUALITY, base64: true },
  );
  return { uri: resized.uri, base64: resized.base64 ?? '' };
}
