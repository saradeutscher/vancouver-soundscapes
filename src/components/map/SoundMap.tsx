import { APIProvider, Map } from '@vis.gl/react-google-maps';
import lunr from 'lunr';
import { useEffect, useState, useMemo } from 'react';

import { ClusteredSoundMarkers } from './ClusteredSoundMarkers';
import { ControlPanel } from './ControlPanel';
import { MapController } from './MapController';
import { useDebounce } from '../../hooks/useDebounce';
import { useFilteredSounds } from '../../hooks/useFilteredSounds';
import {
  getCategories,
  getThemes,
  getDecades,
  loadSoundDataset,
  getTypes,
} from '../../services/soundService';

import type { Sound } from '../../types/Sound';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type SoundMapProps = {
  searchIndex: lunr.Index | null;
};

export const SoundMap = ({ searchIndex }: SoundMapProps) => {
  const [sounds, setSounds] = useState<Sound[]>();
  const [selectCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectDecade, setSelectedDecade] = useState<number | null>(null);
  const [selectType, setSelectedType] = useState<string | null>(null);
  const [selectedSoundKey, setSelectedSoundKey] = useState<string | null>(null);
  const [clusteringEnabled, setClusteringEnabled] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Set<string> | null>(null);

  // load data asynchronously
  useEffect(() => {
    loadSoundDataset()
      .then(data => setSounds(data))
      .catch(error => console.log(error));
  }, []);

  // debounce search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // perform search when debounced query changes
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

  // combined filtered sounds
  const combinedFilteredSounds = useFilteredSounds(sounds, searchResults, {
    decade: selectDecade,
    category: selectCategory,
    theme: selectTheme,
    type: selectType,
  });

  // get category information for the filter-dropdown
  const categories = useMemo(() => getCategories(combinedFilteredSounds), [combinedFilteredSounds]);

  // get theme information for the filter-dropdown
  const themes = useMemo(() => getThemes(combinedFilteredSounds), [combinedFilteredSounds]);

  // get decade information for the filter-dropdown
  const decades = useMemo(() => getDecades(combinedFilteredSounds), [combinedFilteredSounds]);

  // get type information for the filter-dropdown
  const types = useMemo(() => getTypes(combinedFilteredSounds), [combinedFilteredSounds]);

  return (
    <APIProvider solutionChannel="GMP_devsite_samples_v3_rgmbasicmap" apiKey={API_KEY}>
      <Map
        mapId={'54137f32133013763f6a2d7f'}
        zoomControl={true}
        mapTypeControl={true}
        defaultZoom={12}
        defaultCenter={{ lat: 49.28, lng: -123.12 }}
        // mapTypeId={'satellite'}
        gestureHandling={'greedy'}
        disableDefaultUI
        onClick={() => setSelectedSoundKey(null)}
      >
        {combinedFilteredSounds && (
          <ClusteredSoundMarkers
            sounds={combinedFilteredSounds}
            selectedSoundKey={selectedSoundKey}
            onSoundSelect={setSelectedSoundKey}
            clusteringEnabled={clusteringEnabled}
          />
        )}

        <MapController
          sounds={sounds}
          selectedSoundKey={selectedSoundKey}
          onSoundSelect={setSelectedSoundKey}
        />
      </Map>

      <ControlPanel
        categories={categories}
        themes={themes}
        decades={decades}
        types={types}
        selectedCategory={selectCategory}
        selectedTheme={selectTheme}
        selectedDecade={selectDecade}
        selectedType={selectType}
        clusteringEnabled={clusteringEnabled}
        onCategoryChange={setSelectedCategory}
        onThemeChange={setSelectedTheme}
        onDecadeChange={setSelectedDecade}
        onTypeChange={setSelectedType}
        onClusteringToggle={setClusteringEnabled}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResultCount={combinedFilteredSounds?.length}
      />
    </APIProvider>
  );
};
