import sounds from '../data/sounds.json';

import type { Sound, CategoryData } from '../types/Sound';

for (let i = 0; i < sounds.length; i++) {
  (sounds[i] as Sound).key = `sound-${i}`;
}

/**
 * Simulates async loading of the dataset from an external source.
 */
export async function loadSoundDataset(): Promise<Sound[]> {
  // simulate loading the sounds from an external source
  return new Promise(resolve => {
    setTimeout(() => resolve(sounds as Sound[]), 500);
  });
}

/**
 * Generic function to aggregate sounds by a property and count occurrences
 * Handles both single values and arrays of values
 *
 * @param sounds - Array of sounds to aggregate
 * @param extractor - Function to extract the property to aggregate by
 * @param labelFormatter - Optional function to format the label for display
 * @returns Array of CategoryData with counts
 */
function aggregateByProperty<T extends string | number>(
  sounds: Sound[] | undefined,
  extractor: (sound: Sound) => T | T[],
  labelFormatter?: (key: string) => string
): CategoryData[] {
  if (!sounds) return [];

  const countByKey: { [key: string]: number } = {};

  for (const sound of sounds) {
    const extracted = extractor(sound);
    const values = Array.isArray(extracted) ? extracted : [extracted];

    for (const value of values) {
      const key = String(value);
      if (!countByKey[key]) countByKey[key] = 0;
      countByKey[key]++;
    }
  }

  return Object.entries(countByKey).map(([key, count]) => ({
    key,
    label: labelFormatter ? labelFormatter(key) : key,
    count,
  }));
}

/**
 * Capitalize label by replacing underscores with spaces and capitalizing words
 */
function capitalizeLabel(key: string): string {
  return key.replace(/ _/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function getTypes(sounds?: Sound[]): CategoryData[] {
  return aggregateByProperty(
    sounds,
    s => s.geometry.type,
    key => (key === 'LineString' ? 'Soundwalk' : key)
  );
}

export function getCategories(sounds?: Sound[]): CategoryData[] {
  return aggregateByProperty(sounds, s => s.properties.class, capitalizeLabel);
}

export function getThemes(sounds?: Sound[]): CategoryData[] {
  return aggregateByProperty(sounds, s => s.properties.theme, capitalizeLabel);
}

export function getDecades(sounds?: Sound[]): CategoryData[] {
  return aggregateByProperty(sounds, s => s.properties.decade);
}

export default sounds as Sound[];
