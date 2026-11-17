export type FeaturedSoundConfig = {
  name: string; // must match sound.properties.name
  decade?: number; // omit if the sound spans multiple decades
  displayTitle: string; // Title for the featured sound
  summary: string; // short description of the featured sound that is shown in the sidebar
};

// Add the current featured sounds here
export const FEATURED_SOUNDS: FeaturedSoundConfig[] = [
  {
    name: 'Sen̓áḵw through the decades',
    displayTitle: 'Sen̓áḵw/sən̓aʔqʷ through the decades',
    summary:
      'Journey through time around Sen̓áḵw, under the Burrard Bridge. This composition, moving through recordings from the 1970s, the 1990s, and ending in the present, highlight changes to the soundscape of Sen̓áḵw over time.',
  },
  {
    name: 'Vanier Park Composition',
    displayTitle: 'Vanier Park',
    summary:
      'Listen to soundscapes collected around the Museum of Vancouver in the summer of 2026.',
  },
  {
    name: "Carmen's Soundwalk",
    displayTitle: "Carmen's Soundwalk",
    summary:
      'Follow non-visual artist Carmen Papaglia as he navigates from his home in Hastings Sunrise to the working waterfront of the Port of Vancouver.',
  },
  {
    name: "Harmanie Rose's Soundwalk",
    displayTitle: "Harmanie Rose's Soundwalk",
    summary:
      'Follow dance artist Harmanie Rose as she navigates public parks and sidewalks in the Kitsilano neighbourhood in her motorized wheelchair.',
  },
];
