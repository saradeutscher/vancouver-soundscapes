import React, { useEffect, useState, useMemo } from 'react';
import { APIProvider, Map} from '@vis.gl/react-google-maps';
import {ControlPanel} from './control-panel';

import{getCategories, getThemes, getDecades, loadSoundDataset, Sound} from './Sounds';
import {ClusteredSoundMarkers} from './clustered-sound-markers';
import {Polyline} from './polyline';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? ("AIzaSyAd7LcZOYNuhS91Yf4uKqjCkXTWG-ggU-A");

export const SoundMap = () => {
  const [sounds, setSounds] = useState<Sound[]>();
  const [selectCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectTheme, setSelectedTheme] = useState<string | null>(null);
  const [selectDecade, setSelectedDecade] = useState<number | null>(null);

  // load data asynchronously
  useEffect(() => {
    loadSoundDataset().then(data => setSounds(data));
  }, []);

  // combined filtered sounds
  const combinedFilteredSounds = useMemo(() => {
    if (!sounds) return null;

    return sounds.filter(
      s => (!selectDecade || s.properties.decade == selectDecade) &&
           (!selectTheme || s.properties.theme == selectTheme) &&
           (!selectCategory || s.properties.category == selectCategory)
     );
  }, [sounds, selectDecade, selectCategory, selectTheme])

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

  const flightPlanCoordinates = [
    { lat: 37.772, lng: -122.214 },
    { lat: 21.291, lng: -157.821 },
    { lat: -18.142, lng: 178.431 },
    { lat: -27.467, lng: 153.027 },
  ]

  return (
    <APIProvider
      solutionChannel='GMP_devsite_samples_v3_rgmbasicmap'
      apiKey={API_KEY}>
    <Map
      mapId={'54137f32133013761e8f2a9d'}
      defaultZoom={12}
      defaultCenter={{ lat: 49.28, lng: -123.12 }}
      gestureHandling={'greedy'}
      disableDefaultUI>

      {combinedFilteredSounds && <ClusteredSoundMarkers sounds={combinedFilteredSounds} />}
      <Polyline
          path={flightPlanCoordinates}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 1,
            strokeWeight: 3,
          }}
        />

    </Map>

    <ControlPanel
      categories={categories}
      themes={themes}
      decades={decades}
      onCategoryChange={setSelectedCategory}
      onThemeChange={setSelectedTheme}
      onDecadeChange={setSelectedDecade}
    />

    </APIProvider>
  );
};