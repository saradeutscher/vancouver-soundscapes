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
    class: string[];
    theme: string[];
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

export function getTypes(sounds?: Sound[]) : CategoryData[] {
  if (!sounds) return [];

  const countByType: {[t: string]: number} = {};
  for (const s of sounds) {
    if(!countByType[s.geometry.type]) countByType[s.geometry.type] = 0;
    countByType[s.geometry.type]++;
  }

  return Object.entries(countByType).map(([key, value]) => {
    const label = (key == "LineString") ? "Soundwalk" : key;
    return {
      key: key,
      label,
      count: value
    };
  });
}

export function getCategories(sounds?: Sound[]): CategoryData[] {
  if (!sounds) return [];

  const countByCategory: {[c: string]: number} = {};
  for (const s of sounds) {
    for (const c of s.properties.class) {
      if (!countByCategory[c]) countByCategory[c] = 0;
      countByCategory[c]++;
    }
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
    for (const t of s.properties.theme) {
      if(!countByTheme[t]) countByTheme[t] = 0;
      countByTheme[t]++;
    }
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