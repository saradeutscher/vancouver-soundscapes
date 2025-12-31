import sounds from './Sounds.json';

export type Sound = {
  key: string;
  type: string;
  geometry: {
    coordinates: string;
    type: string
  };
  properties: {
    name: string;
    decade: number;
    description: string;
    soundfile: string;
    category: string;
    theme: string;
    images: string[];
    notes: string;
  };
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
    if (!countByCategory[s.properties.category]) countByCategory[s.properties.category] = 0;
    countByCategory[s.properties.category]++;
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

export function getThemes(sounds?: Sound[]): CategoryData[] {
  if (!sounds) return [];

  const countByTheme: {[t: string]: number} = {};
  for (const s of sounds) {
    if(!countByTheme[s.properties.theme]) countByTheme[s.properties.theme] = 0;
    countByTheme[s.properties.theme]++;
  }

  return Object.entries(countByTheme).map(([key, value]) => {
    const label = key.replace(/ _/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      key: key,
      label,
      count: value
    };
  });
}

export function getDecades(sounds?: Sound[]): CategoryData[] {
  if (!sounds) return [];

  const countByDecade: {[d: number]: number} = {};
  for (const s of sounds) {
    if(!countByDecade[s.properties.decade]) countByDecade[s.properties.decade] = 0;
    countByDecade[s.properties.decade]++;
  }

  return Object.entries(countByDecade).map(([key, value]) => {
    const label = key
    return {
      key: key,
      label,
      count: value
    };
  });
}


export default sounds as Sound[];