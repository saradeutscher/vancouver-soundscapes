import {InfoWindow, useMap} from '@vis.gl/react-google-maps';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {type Marker, MarkerClusterer} from '@googlemaps/markerclusterer';

import {Sound} from './Sounds';
import {SoundMarker} from './sound-marker';
import { ImageGallery } from './image-gallery';

export type ClusteredSoundMarkersProps = {
  sounds: Sound[];
};

/**
 * The ClusteredSoundMarkers component is responsible for integrating the markers
 * with the markerclusterer.
 */
export const ClusteredSoundMarkers = ({sounds}: ClusteredSoundMarkersProps) => {
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const [selectedSoundKey, setSelectedSoundKey] = useState<string | null>(null);
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const selectedSound = useMemo(
    () =>
      sounds && selectedSoundKey
        ? sounds.find(s => s.key === selectedSoundKey)!
        : null,
    [sounds, selectedSoundKey]
  );

  // create the markerClusterer once the map is available and update it
  // when the markers are changed
  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({map});
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  // callback that gets passed as ref to the markers to keep track of
  // markers currently on the map
  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers(markers => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return {...markers, [key]: marker};
      } else {
        const {[key]: _, ...newMarkers} = markers;

        return newMarkers;
      }
    });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedSoundKey(null);
  }, []);

  const handleMarkerClick = useCallback((sound: Sound) => {
    setInfowindowOpen(prev => !prev);
    infowindowOpen ? setSelectedSoundKey(null) : setSelectedSoundKey(sound.key)
  }, [infowindowOpen]);

  return (
    <>
      {sounds.map(sound => (
        <SoundMarker
          key={sound.key}
          sound={sound}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      ))}

      {selectedSoundKey && (
        <InfoWindow className="sound-info"
          anchor={markers[selectedSoundKey]}
          onCloseClick={handleInfoWindowClose}>
          <h2>
            {selectedSound?.properties.name}
          </h2>

          <hr className="divider" />

          {selectedSound?.properties.description}

          <audio controls preload="metadata" src={"https://object-arbutus.cloud.computecanada.ca/soundscapes-public/" + selectedSound?.properties.soundfile}> </audio>

          {/* <ImageGallery images={selectedSound ? selectedSound.properties.images : []}/> */}

          {selectedSound?.properties.images.map((url, index) => (
            <img key={index} src={"https://object-arbutus.cloud.computecanada.ca/soundscapes-public/" + url}></img>
          ))}
        </InfoWindow>
      )}
    </>
  )

}