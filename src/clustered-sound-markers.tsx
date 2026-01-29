import {InfoWindow, useMap} from '@vis.gl/react-google-maps';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {type Marker, MarkerClusterer} from '@googlemaps/markerclusterer';

import {Sound} from './Sounds';
import {SoundMarker} from './sound-marker';
import { ImageGallery } from './image-gallery';

export type ClusteredSoundMarkersProps = {
  sounds: Sound[];
  selectedSoundKey: string | null;
  onSoundSelect: (key: string | null) => void;
  clusteringEnabled: boolean;
};

/**
 * The ClusteredSoundMarkers component is responsible for integrating the markers
 * with the markerclusterer.
 */
export const ClusteredSoundMarkers = ({sounds, selectedSoundKey, onSoundSelect, clusteringEnabled}: ClusteredSoundMarkersProps) => {
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const clustererRef = React.useRef<MarkerClusterer | null>(null);

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

  // Effect to manage clusterer lifecycle
  useEffect(() => {
    if (!map) return;

    const markerArray = Object.values(markers);

    // Clean up old clusterer if it exists
    if (clustererRef.current) {
      clustererRef.current.clearMarkers();
      clustererRef.current.setMap(null);
      clustererRef.current = null;
    }

    // Create new clusterer if clustering is enabled
    if (clusteringEnabled) {
      clustererRef.current = new MarkerClusterer({map});

      // Add existing markers to the new clusterer
      if (markerArray.length > 0) {
        clustererRef.current.addMarkers(markerArray);
      }
    } else {
      // When clustering is disabled, ensure all markers are visible on the map
      markerArray.forEach(marker => {
        if (marker) {
          (marker as any).setMap(map);
        }
      });
    }

    // Cleanup on unmount or when dependencies change
    return () => {
      if (clustererRef.current) {
        clustererRef.current.clearMarkers();
        clustererRef.current.setMap(null);
      }
    };
  }, [map, clusteringEnabled, markers]);

  // Effect to update clusterer when markers change (only when clustering is enabled)
  useEffect(() => {
    if (!clustererRef.current) return;

    clustererRef.current.clearMarkers();
    clustererRef.current.addMarkers(Object.values(markers));
  }, [markers]);

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
    onSoundSelect(null);
  }, [onSoundSelect]);

  const handleMarkerClick = useCallback((sound: Sound) => {
    setInfowindowOpen(prev => !prev);
    infowindowOpen ? onSoundSelect(null) : onSoundSelect(sound.key)
  }, [infowindowOpen, onSoundSelect]);

  // Preload images and audio when hovering over a marker
  useEffect(() => {
    if (!hoverId) return;

    const sound = sounds.find(s => s.key === hoverId);
    if (!sound) return;

    // Preload images
    sound.properties.images.forEach(imageUrl => {
      const img = new Image();
      img.src = `https://object-arbutus.cloud.computecanada.ca/soundscapes-public/${imageUrl}`;
    });

    // Preload audio
    if (sound.properties.soundfile) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = `https://object-arbutus.cloud.computecanada.ca/soundscapes-public/${sound.properties.soundfile}`;
    }
  }, [hoverId, sounds]);

  const handleMarkerMouseEnter = useCallback((sound: Sound) => {
    setHoverId(sound.key);
  }, []);

  const handleMarkerMouseLeave = useCallback(() => {
    setHoverId(null);
  }, []);

  return (
    <>
      {sounds.map(sound => (
        <SoundMarker
          key={sound.key}
          sound={sound}
          onClick={handleMarkerClick}
          onMouseEnter={handleMarkerMouseEnter}
          onMouseLeave={handleMarkerMouseLeave}
          setMarkerRef={setMarkerRef}
          isSelected={sound.key === selectedSoundKey}
          hoverId={hoverId}
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

          {selectedSound && selectedSound.properties.images.length > 0 && <ImageGallery images={selectedSound.properties.images}/>}

        </InfoWindow>
      )}
    </>
  )

}