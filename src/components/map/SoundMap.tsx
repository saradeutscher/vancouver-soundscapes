import { useEffect, useState, useMemo } from 'react';
import { APIProvider, Map} from '@vis.gl/react-google-maps';
import { ControlPanel } from './ControlPanel';
import lunr from 'lunr';

import { getCategories, getThemes, getDecades, loadSoundDataset, getTypes } from '../../services/soundService';
import type { Sound } from '../../types/Sound';
import { ClusteredSoundMarkers } from './ClusteredSoundMarkers';

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
    loadSoundDataset().then(data => setSounds(data));
  }, []);

  // debounced search effect
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

  // combined filtered sounds
  const combinedFilteredSounds = useMemo(() => {
    if (!sounds) return null;

    return sounds.filter(
      s => (!searchResults || searchResults.has(s.key)) &&
           (!selectDecade || s.properties.decade == selectDecade) &&
           (!selectTheme || s.properties.theme.includes(selectTheme)) &&
           (!selectCategory || s.properties.class.includes(selectCategory)) &&
           (!selectType || s.geometry.type == (selectType))
     );
  }, [sounds, searchResults, selectDecade, selectCategory, selectTheme, selectType])

  // get category information for the filter-dropdown
  const categories = useMemo(() => {
    if (!combinedFilteredSounds) return [];
    return getCategories(combinedFilteredSounds);
  }, [combinedFilteredSounds]);

  // get theme information for the filter-dropdown
  const themes = useMemo(() => {
    if (!combinedFilteredSounds) return [];
    return getThemes(combinedFilteredSounds);
  }, [combinedFilteredSounds]);

  // get decade information for the filter-dropdown
  const decades = useMemo(() => {
    if (!combinedFilteredSounds) return [];
    return getDecades(combinedFilteredSounds);
  }, [combinedFilteredSounds]);

  // get type information for the filter-dropdown
  const types = useMemo(() => {
    if (!combinedFilteredSounds) return [];
    return getTypes(combinedFilteredSounds);
  }, [combinedFilteredSounds]);

  return (
    <APIProvider
      solutionChannel='GMP_devsite_samples_v3_rgmbasicmap'
      apiKey={API_KEY}>
    <Map
      mapId={'54137f32133013763f6a2d7f'}
      zoomControl={true}
      mapTypeControl={true}
      defaultZoom={12}
      defaultCenter={{ lat: 49.28, lng: -123.12 }}
      // mapTypeId={'satellite'}
      gestureHandling={'greedy'}
      disableDefaultUI
      onClick={() => setSelectedSoundKey(null)}>

      {combinedFilteredSounds &&
        <ClusteredSoundMarkers sounds={combinedFilteredSounds}
                               selectedSoundKey={selectedSoundKey}
                               onSoundSelect={setSelectedSoundKey}
                               clusteringEnabled={clusteringEnabled}/>}

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