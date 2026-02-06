/**
 * Base URL for external assets (audio, images)
 */
export const ASSETS_BASE_URL = 'https://object-arbutus.cloud.computecanada.ca/soundscapes-public/';

/**
 * Construct full URL for an asset
 *
 * @param path - Relative path to the asset
 * @returns Full URL to the asset
 *
 * @example
 * getAssetUrl('sound1.mp3') // returns 'https://...soundscapes-public/sound1.mp3'
 */
export function getAssetUrl(path: string): string {
  return `${ASSETS_BASE_URL}${path}`;
}
