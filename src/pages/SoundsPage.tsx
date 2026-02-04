import React, { useState, useEffect, useMemo } from 'react';
import type { Sound } from '../types/Sound';
import { SoundCard } from '../components/sound/SoundCard';
import { ControlPanel } from '../components/map/ControlPanel';
import { getCategories, getThemes, getDecades, getTypes } from '../services/soundService';
import lunr from 'lunr';

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

  // Debounced search effect
  useEffect(() => {
    if (!searchIndex || !searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const timeoutId = setTimeout(() => {
      try {
        const results = searchIndex.search(searchQuery);
        const resultKeys = new Set<string>(results.map((r: any) => r.ref as string));
        setSearchResults(resultKeys);
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults(new Set<string>());
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchIndex]);

  // Filter sounds based on search and all other filters
  const combinedFilteredSounds = useMemo(() => {
    if (!sounds) return [];

    return sounds.filter(
      s => (!searchResults || searchResults.has(s.key)) &&
           (!selectedDecade || s.properties.decade == selectedDecade) &&
           (!selectedTheme || s.properties.theme.includes(selectedTheme)) &&
           (!selectedCategory || s.properties.class.includes(selectedCategory)) &&
           (!selectedType || s.geometry.type == selectedType)
    );
  }, [sounds, searchResults, selectedDecade, selectedCategory, selectedTheme, selectedType]);

  // Get category options based on current filters
  const categories = useMemo(() => {
    return getCategories(combinedFilteredSounds);
  }, [combinedFilteredSounds]);

  // Get theme options based on current filters
  const themes = useMemo(() => {
    return getThemes(combinedFilteredSounds);
  }, [combinedFilteredSounds]);

  // Get decade options based on current filters
  const decades = useMemo(() => {
    return getDecades(combinedFilteredSounds);
  }, [combinedFilteredSounds]);

  // Get type options based on current filters
  const types = useMemo(() => {
    return getTypes(combinedFilteredSounds);
  }, [combinedFilteredSounds]);

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
          combinedFilteredSounds.map(sound => (
            <SoundCard key={sound.key} sound={sound} />
          ))
        )}
      </div>
    </div>
  );
};
