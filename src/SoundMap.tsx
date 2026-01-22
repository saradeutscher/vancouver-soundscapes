import React, { useEffect, useState, useMemo } from 'react';
import { APIProvider, Map, MapControl, ControlPosition} from '@vis.gl/react-google-maps';
import {ControlPanel} from './control-panel';

import{getCategories, getThemes, getDecades, loadSoundDataset, Sound, getTypes} from './Sounds';
import {ClusteredSoundMarkers} from './clustered-sound-markers';
import {Polyline} from './polyline';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? ("");

export const SoundMap = () => {
  const [sounds, setSounds] = useState<Sound[]>();
  const [selectCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectDecade, setSelectedDecade] = useState<number | null>(null);
  const [selectType, setSelectedType] = useState<string | null>(null);

  // load data asynchronously
  useEffect(() => {
    loadSoundDataset().then(data => setSounds(data));
  }, []);

  // combined filtered sounds
  const combinedFilteredSounds = useMemo(() => {
    if (!sounds) return null;

    return sounds.filter(
      s => (!selectDecade || s.properties.decade == selectDecade) &&
           (!selectTheme || s.properties.theme.includes(selectTheme)) &&
           (!selectCategory || s.properties.class.includes(selectCategory)) &&
           (!selectType || s.geometry.type == (selectType))
     );
  }, [sounds, selectDecade, selectCategory, selectTheme, selectType])

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
      mapId={''}
      zoomControl={true}
      mapTypeControl={true}
      defaultZoom={12}
      defaultCenter={{ lat: 49.28, lng: -123.12 }}
      gestureHandling={'greedy'}
      disableDefaultUI>

      {combinedFilteredSounds && <ClusteredSoundMarkers sounds={combinedFilteredSounds}/>}

    </Map>

    <ControlPanel
      categories={categories}
      themes={themes}
      decades={decades}
      types={types}
      onCategoryChange={setSelectedCategory}
      onThemeChange={setSelectedTheme}
      onDecadeChange={setSelectedDecade}
      onTypeChange={setSelectedType}
    />

    </APIProvider>
  );
};