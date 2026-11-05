import type { Sound } from '../types/Sound';

/**
 * Group sounds by exact location name
 * Returns map of location name to sorted array of sounds (by decade)
 *
 * @param sounds - Array of all sounds
 * @returns Map of location name to array of sounds at that location
 */
export function groupSoundsByLocation(sounds: Sound[]): Map<string, Sound[]> {
  const groups = new Map<string, Sound[]>();

  for (const sound of sounds) {
    const locationName = sound.properties.name;
    if (!groups.has(locationName)) {
      groups.set(locationName, []);
    }
    groups.get(locationName)!.push(sound);
  }

  // Sort each group by decade ascending
  for (const [, soundsAtLocation] of groups) {
    soundsAtLocation.sort((a, b) => a.properties.decade - b.properties.decade);
  }

  return groups;
}

/**
 * Get all sounds for a specific location
 * Sorted by decade ascending
 *
 * @param locationName - Name of the location
 * @param sounds - Array of all sounds
 * @returns Sorted array of sounds at this location
 */
export function getSoundsForLocation(locationName: string, sounds: Sound[]): Sound[] {
  const soundsAtLocation = sounds.filter(s => s.properties.name === locationName);
  return soundsAtLocation.sort((a, b) => a.properties.decade - b.properties.decade);
}

/**
 * Get available decades for a location
 * Returns sorted array [1970, 1990, 2010, 2020]
 *
 * @param locationName - Name of the location
 * @param sounds - Array of all sounds
 * @returns Sorted array of decades available at this location
 */
export function getAvailableDecades(locationName: string, sounds: Sound[]): number[] {
  const soundsAtLocation = getSoundsForLocation(locationName, sounds);
  const decades = soundsAtLocation.map(s => s.properties.decade);
  // Remove duplicates and sort
  return [...new Set(decades)].sort((a, b) => a - b);
}

/**
 * Find nearest decade available for a location
 * Used for fallback when requested decade doesn't exist
 *
 * @param targetDecade - The requested decade
 * @param availableDecades - Array of available decades
 * @returns Nearest available decade, or first decade if none found
 */
export function findNearestDecade(targetDecade: number, availableDecades: number[]): number {
  if (availableDecades.length === 0) {
    return targetDecade; // Fallback
  }

  if (availableDecades.includes(targetDecade)) {
    return targetDecade;
  }

  // Find closest decade
  let nearest = availableDecades[0];
  let minDiff = Math.abs(targetDecade - nearest);

  for (const decade of availableDecades) {
    const diff = Math.abs(targetDecade - decade);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = decade;
    }
  }

  return nearest;
}

/**
 * Get adjacent decades for prev/next navigation
 *
 * @param currentDecade - The current decade
 * @param availableDecades - Array of available decades (sorted)
 * @returns Object with prev and next decades (null if not available)
 */
export function getAdjacentDecades(
  currentDecade: number,
  availableDecades: number[]
): {
  prev: number | null;
  next: number | null;
} {
  const currentIndex = availableDecades.indexOf(currentDecade);

  if (currentIndex === -1) {
    return { prev: null, next: null };
  }

  return {
    prev: currentIndex > 0 ? availableDecades[currentIndex - 1] : null,
    next: currentIndex < availableDecades.length - 1 ? availableDecades[currentIndex + 1] : null,
  };
}
