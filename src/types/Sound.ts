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
