import React, { useEffect, useState, useMemo } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

import {ControlPanel} from './control-panel';
import {MarkerWithInfowindow} from './marker-with-infowindow';

import{getCategories, getThemes, getDecades, loadSoundDataset, Sound} from './Sounds';
import {ClusteredSoundMarkers} from './clustered-sound-markers';

import {
  AdvancedMarker,
  InfoWindow,
  Marker,
  Pin
} from '@vis.gl/react-google-maps';

const API_KEY =
  globalThis.GOOGLE_MAPS_API_KEY ?? ("");

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


  return (
    <APIProvider
      solutionChannel='GMP_devsite_samples_v3_rgmbasicmap'
      apiKey={API_KEY}>
    <Map
      mapId={''}
      defaultZoom={11}
      defaultCenter={{ lat: 49.28, lng: -123.12 }}
      gestureHandling={'greedy'}
      disableDefaultUI>

      {combinedFilteredSounds && <ClusteredSoundMarkers sounds={combinedFilteredSounds} />}

      {/* <AdvancedMarker
          position={{lat: 49.28, lng: -123.0}}
          clickable={true}
          onClick={() => alert('marker was clicked!')}
          title={'AdvancedMarker with customized pin.'}>
           <Pin
            background={'#22ccff'}
            borderColor={'#1e89a1'}
            glyphColor={'#0f677a'}></Pin>
      </AdvancedMarker>

      <MarkerWithInfowindow>
      </MarkerWithInfowindow> */}

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