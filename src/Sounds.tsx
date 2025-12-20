import sounds from './Sounds.json';

export type Sound = {
  key: string;
  fileno: number;
  decade: number;
  description: string;
  position: google.maps.LatLngLiteral;
  category: string;
  theme: string;
};

export type CategoryData = {
  key: string;
  label: string;
  count: number;
};

for (let i = 0; i < sounds.length; i++) {
  (sounds[i] as Sound).key = `sound-${i}`;
}

/**
 * Simulates async loading of the dataset from an external source.
 */
export async function loadSoundDataset() : Promise<Sound[]> {
  // simulate loading the sounds from an external source
  return new Promise(resolve => {
    setTimeout(() => resolve(sounds as Sound[]), 500);
  });
}

export function getCategories(sounds?: Sound[]): CategoryData[] {
  if (!sounds) return [];

  const countByCategory: {[c: string]: number} = {};
  for (const s of sounds) {
    if (!countByCategory[s.category]) countByCategory[s.category] = 0;
    countByCategory[s.category]++;
  }

  return Object.entries(countByCategory).map(([key, value]) => {
    const label = key.replace(/ _/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      key: key,
      label,
      count: value
    };
  });
}

export default sounds as Sound[];