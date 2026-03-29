export type Sound = {
  key: string;
  type: string;
  geometry: {
    coordinates: string;
    type: string;
  };
  properties: {
    name: string;
    decade: number;
    year: number;
    description: string;
    soundfile: string;
    class: string[];
    theme: string[];
    images: string[];
    notes: string;
    source: string;
  };
};

export type CategoryData = {
  key: string;
  label: string;
  count: number;
};
