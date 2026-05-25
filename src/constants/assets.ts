/**
 * Base URL for external assets (audio, images)
 */
export const ASSETS_BASE_URL = 'https://object-arbutus.cloud.computecanada.ca/soundscapes-public/';

/**
 * Construct full URL for an asset
 *
 * @param path - Relative path to the asset or full URL
 * @returns Full URL to the asset
 *
 * @example
 * getAssetUrl('sound1.mp3') // returns 'https://...soundscapes-public/sound1.mp3'
 * getAssetUrl('https://example.com/image.jpg') // returns 'https://example.com/image.jpg'
 */
export function getAssetUrl(path: string): string {
  // If path is already a full URL, return it as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  return `${ASSETS_BASE_URL}${path}`;
}
