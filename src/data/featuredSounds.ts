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
      'This composition highlights the changing soundscapes around the Senakw area/Burrard Bridge from the 1970s to this year.',
  },
  {
    name: 'Vanier Park Through the Decades',
    displayTitle: 'Vanier Park',
    summary:
      'In this composition, sound recordings taken in 1993, 2024, and 2026 around Vanier Park next to the museum are blended together.',
  },
];
