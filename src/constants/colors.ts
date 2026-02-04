/**
 * Maps each decade to a set of colors used across the application
 */

export type DecadeColors = {
  background: string;
  border: string;
  glyph: string;
};

export const DECADE_COLORS = new Map<number, DecadeColors>([
  [1970, { background: '#C422FF', border: '#340047', glyph: '#560075' }], // Purple
  [1990, { background: '#22ccff', border: '#1e89a1', glyph: '#0f677a' }], // Cyan
  [2010, { background: '#85D134', border: '#243A0D', glyph: '#3C6016' }], // Green
  [2020, { background: '#F7314B', border: '#45020B', glyph: '#710413' }], // Red
]);

/**
 * Default fallback color when decade is not found
 */
export const DEFAULT_COLOR = '#008cba';

/**
 * Helper function to get the background color for a decade
 * Used by components that only need the main color (badges, simple markers)
 *
 * @param decade - The decade (1970, 1990, 2010, 2020)
 * @returns The hex color string for the decade's background
 */
export function getDecadeColor(decade: number): string {
  return DECADE_COLORS.get(decade)?.background || DEFAULT_COLOR;
}

/**
 * Helper function to get all colors for a decade
 * Used by components that need border/glyph colors (map markers)
 *
 * @param decade - The decade (1970, 1990, 2010, 2020)
 * @returns The full color object or undefined
 */
export function getDecadeColors(decade: number): DecadeColors | undefined {
  return DECADE_COLORS.get(decade);
}
