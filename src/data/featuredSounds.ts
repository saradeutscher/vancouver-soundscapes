export type FeaturedSoundConfig = {
  name: string; // must match sound.properties.name
  decade: number; // important if same location has multi-decade recordings
  displayTitle: string; // Title for the featured sound
  summary: string; // short description of the featured sound that is shown in the sidebar
};

// Add the current featured sounds here
export const FEATURED_SOUNDS: FeaturedSoundConfig[] = [
  {
    name: "Carmen's Sound Walk",
    decade: 2020,
    displayTitle: "Carmen's Sound Walk in East Vancouver",
    summary: 'add short summary here',
  },
  {
    name: "Harmonie's Sound Walk",
    decade: 2020,
    displayTitle: "Harmonie's Sound Walk",
    summary: 'add short summary here',
  },
  {
    name: 'Soundwalk: East Van rectangle (2nd, Victoria, 4th, Commercial)',
    decade: 1970,
    displayTitle: 'Around the Museum',
    summary: 'add short summary here',
  },
  {
    name: 'Totem Poles',
    decade: 2020,
    displayTitle: 'Under the Burrard Bridge Over the Years',
    summary: 'add short summary here',
  },
];
