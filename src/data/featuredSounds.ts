export type FeaturedSoundConfig = {
  name: string; // must match sound.properties.name
  decade?: number; // omit if the sound spans multiple decades
  displayTitle: string; // Title for the featured sound
  summary: string; // short description of the featured sound that is shown in the sidebar
};

// Add the current featured sounds here
export const FEATURED_SOUNDS: FeaturedSoundConfig[] = [
  {
    name: 'Senakw Through the Decades',
    displayTitle: 'Senakw Through the Decades',
    summary:
      'Journey through time around Senakw, under the Burrard Bridge. This composition, moving through from recordings in the 1970s, the 1990s, and ending  in the present, marks the changes to Senakw over time.',
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
    displayTitle: "Harmanie Roses's Soundwalk",
    summary:
      'Follow dance artist Harmanie Rose as she navigates public parks and sidewalks in the Kitsilano neighbourhood in her motorized wheelchair.',
  },
];
