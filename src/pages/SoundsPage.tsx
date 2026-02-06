import lunr from 'lunr';
import React, { useState, useEffect, useMemo } from 'react';

import { ControlPanel } from '../components/map/ControlPanel';
import { SoundCard } from '../components/sound/SoundCard';
import { useDebounce } from '../hooks/useDebounce';
import { useFilteredSounds } from '../hooks/useFilteredSounds';
import { getCategories, getThemes, getDecades, getTypes } from '../services/soundService';

import type { Sound } from '../types/Sound';

type SoundsPageProps = {
  sounds?: Sound[];
  searchIndex: lunr.Index | null;
};

export const SoundsPage: React.FC<SoundsPageProps> = ({ sounds, searchIndex }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Set<string> | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectedDecade, setSelectedDecade] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  // Debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Perform search when debounced query changes
  useEffect(() => {
    if (!searchIndex || !debouncedSearchQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchResults(null);
      return;
    }

    try {
      const results = searchIndex.search(debouncedSearchQuery);
      const resultKeys = new Set<string>(results.map(r => r.ref));
      setSearchResults(resultKeys);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults(new Set<string>());
    }
  }, [debouncedSearchQuery, searchIndex]);

  // Filter sounds based on search and all other filters
  const combinedFilteredSounds = useFilteredSounds(sounds, searchResults, {
    decade: selectedDecade,
    category: selectedCategory,
    theme: selectedTheme,
    type: selectedType,
  });

  // Get category options based on current filters
  const categories = useMemo(() => getCategories(combinedFilteredSounds), [combinedFilteredSounds]);

  // Get theme options based on current filters
  const themes = useMemo(() => getThemes(combinedFilteredSounds), [combinedFilteredSounds]);

  // Get decade options based on current filters
  const decades = useMemo(() => getDecades(combinedFilteredSounds), [combinedFilteredSounds]);

  // Get type options based on current filters
  const types = useMemo(() => getTypes(combinedFilteredSounds), [combinedFilteredSounds]);

  return (
    <div className="sounds-page">
      <div className="sounds-page-header">
        <h2 id="sounds-page-title">Sound List</h2>

        <ControlPanel
          categories={categories}
          themes={themes}
          decades={decades}
          types={types}
          selectedCategory={selectedCategory}
          selectedTheme={selectedTheme}
          selectedDecade={selectedDecade}
          selectedType={selectedType}
          clusteringEnabled={false}
          onCategoryChange={setSelectedCategory}
          onThemeChange={setSelectedTheme}
          onDecadeChange={setSelectedDecade}
          onTypeChange={setSelectedType}
          onClusteringToggle={() => {}}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchResultCount={combinedFilteredSounds.length}
          hideClusteringToggle={true}
          title="Filter Sounds"
          description=""
          hideMinimizeButton={true}
        />
      </div>

      <div className="sounds-grid">
        {combinedFilteredSounds.length === 0 ? (
          <p className="no-results">No sounds found matching your filters.</p>
        ) : (
          combinedFilteredSounds.map(sound => <SoundCard key={sound.key} sound={sound} />)
        )}
      </div>
    </div>
  );
};
