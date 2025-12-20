import React, { useEffect, useState, useMemo } from 'react';
import { APIProvider, Map } from '@vis.gl/react-google-maps';

import {ControlPanel} from './control-panel';
import {MovingMarker} from './moving-marker';
import {MarkerWithInfowindow} from './marker-with-infowindow';

import{getCategories, loadSoundDataset, Sound} from './Sounds';
//import {ClusteredSoundMarkers} from './clustered-sound-markers';

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

  // load data asynchronously
  useEffect(() => {
    loadSoundDataset().then(data => setSounds(data));
  }, []);

  // get category information for the filter-dropdown
  const categories = useMemo(() => getCategories(sounds), [sounds]);
  const filteredSounds = useMemo(() => {
    if(!sounds) return null;

    return sounds.filter(
      s => !selectCategory || s.category == selectCategory
    );
  }, [sounds, selectCategory])


  return (
    <APIProvider
      solutionChannel='GMP_devsite_samples_v3_rgmbasicmap'
      apiKey={API_KEY}>
    <Map
      mapId={''}
      defaultZoom={10}
      defaultCenter={{ lat: 49.28, lng: -123.12 }}
      gestureHandling={'greedy'}
      disableDefaultUI>
      {/* simple marker */}
      <AdvancedMarker
          position={{lat: 49.28, lng: -123.12}}
          clickable={true}
          onClick={() => alert('marker was clicked!')}
          title={'AdvancedMarker with customized pin.'}>
           <Pin
            background={'#22ccff'}
            borderColor={'#1e89a1'}
            glyphColor={'#0f677a'}></Pin>
      </AdvancedMarker>

      {/* simple stateful infowindow */}
      <MarkerWithInfowindow>
      </MarkerWithInfowindow>

    </Map>

    <ControlPanel
      categories={categories}
      onCategoryChange={setSelectedCategory}
    />

    </APIProvider>
  );
};