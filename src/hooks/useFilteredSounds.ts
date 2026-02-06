import { useMemo } from 'react';

import type { Sound } from '../types/Sound';

type FilterOptions = {
  decade: number | null;
  category: string | null;
  theme: string | null;
  type: string | null;
};

/**
 * Custom hook to filter sounds based on search results and filter criteria
 * Consolidates the filtering logic used in both SoundMap and SoundsPage
 *
 * @param sounds - Array of sounds to filter
 * @param searchResults - Set of sound keys that match the search query (null if no search)
 * @param filters - Object containing filter criteria (decade, category, theme, type)
 * @returns Filtered array of sounds
 */
export function useFilteredSounds(
  sounds: Sound[] | undefined,
  searchResults: Set<string> | null,
  filters: FilterOptions
): Sound[] {
  return useMemo(() => {
    if (!sounds) return [];

    return sounds.filter(
      s =>
        (!searchResults || searchResults.has(s.key)) &&
        (!filters.decade || s.properties.decade == filters.decade) &&
        (!filters.theme || s.properties.theme.includes(filters.theme)) &&
        (!filters.category || s.properties.class.includes(filters.category)) &&
        (!filters.type || s.geometry.type == filters.type)
    );
  }, [sounds, searchResults, filters.decade, filters.category, filters.theme, filters.type]);
}
