import { type Marker, MarkerClusterer } from '@googlemaps/markerclusterer';
import { InfoWindow, useMap } from '@vis.gl/react-google-maps';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { SoundMarker } from './SoundMarker';
import { getAssetUrl } from '../../constants/assets';
import { getDecadeColor } from '../../constants/colors';
import { AudioPlayer } from '../sound/AudioPlayer';
import { ImageGallery } from '../sound/ImageGallery';
import { MetadataBadges } from '../sound/MetadataBadges';

import type { Sound } from '../../types/Sound';

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
export const ClusteredSoundMarkers = ({
  sounds,
  selectedSoundKey,
  onSoundSelect,
  clusteringEnabled,
}: ClusteredSoundMarkersProps) => {
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const [hoverId, setHoverId] = useState<string | null>(null);
  const clustererRef = React.useRef<MarkerClusterer | null>(null);
  const navigate = useNavigate();

  const selectedSound = useMemo(
    () => (sounds && selectedSoundKey ? sounds.find(s => s.key === selectedSoundKey)! : null),
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
      clustererRef.current = new MarkerClusterer({ map });

      // Add existing markers to the new clusterer
      if (markerArray.length > 0) {
        clustererRef.current.addMarkers(markerArray);
      }
    } else {
      // When clustering is disabled, ensure all markers are visible on the map
      markerArray.forEach(marker => {
        if (marker) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      if ((marker && markers[key]) || (!marker && !markers[key])) return markers;

      if (marker) {
        return { ...markers, [key]: marker };
      } else {
        const { [key]: _, ...newMarkers } = markers;

        return newMarkers;
      }
    });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    onSoundSelect(null);
  }, [onSoundSelect]);

  const handleMarkerClick = useCallback(
    (sound: Sound) => {
      // If clicking the same marker, close it. Otherwise, open the new marker's InfoWindow
      if (selectedSoundKey === sound.key) {
        onSoundSelect(null);
      } else {
        onSoundSelect(sound.key);
      }
    },
    [selectedSoundKey, onSoundSelect]
  );

  // Preload images and audio when hovering over a marker
  useEffect(() => {
    if (!hoverId) return;

    const sound = sounds.find(s => s.key === hoverId);
    if (!sound) return;

    // Preload images
    sound.properties.images.forEach(imageUrl => {
      const img = new Image();
      img.src = getAssetUrl(imageUrl);
    });

    // Preload audio
    if (sound.properties.soundfile) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = getAssetUrl(sound.properties.soundfile);
    }
  }, [hoverId, sounds]);

  // Auto-adjust map bounds when a soundwalk is selected
  useEffect(() => {
    if (!map || !selectedSound || selectedSound.geometry.type !== 'LineString') return;

    // Parse the LineString coordinates
    const coordinates = JSON.parse(selectedSound.geometry.coordinates) as [number, number][];

    // Create bounds that include all points in the polyline
    const bounds = new google.maps.LatLngBounds();
    coordinates.forEach(([lng, lat]) => {
      bounds.extend({ lat, lng });
    });

    // Fit the map to show the entire polyline with padding
    map.fitBounds(bounds, {
      top: 100, // Extra padding at top for InfoWindow
      bottom: 50,
      left: 50,
      right: 50,
    });
  }, [map, selectedSound]);

  const handleMarkerMouseEnter = useCallback((sound: Sound) => {
    setHoverId(sound.key);
  }, []);

  const handleMarkerMouseLeave = useCallback(() => {
    setHoverId(null);
  }, []);

  const handleViewDetails = useCallback(() => {
    if (selectedSound) {
      navigate(`/sounds/${selectedSound.key}`);
    }
  }, [navigate, selectedSound]);

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

      {selectedSoundKey && selectedSound && (
        <InfoWindow anchor={markers[selectedSoundKey]} onCloseClick={handleInfoWindowClose}>
          <div
            className="sound-info"
            data-decade-color={getDecadeColor(selectedSound.properties.decade)}
            style={
              {
                '--decade-color': getDecadeColor(selectedSound.properties.decade),
              } as React.CSSProperties
            }
          >
            <div className="sound-info-header">
              <h2>{selectedSound.properties.name}</h2>
              <MetadataBadges
                sound={selectedSound}
                showDecade={true}
                showClass={true}
                showTheme={true}
                showType={true}
              />
            </div>

            <div className="sound-info-body">
              <p className="sound-description">{selectedSound.properties.description}</p>

              <AudioPlayer soundfile={selectedSound.properties.soundfile} />

              {selectedSound.properties.images.length > 0 && (
                <ImageGallery images={selectedSound.properties.images} />
              )}

              {selectedSound.properties.notes && (
                <div className="sound-notes">{selectedSound.properties.notes}</div>
              )}

              <button
                className="back-button"
                onClick={handleViewDetails}
                aria-label={`View full details for ${selectedSound.properties.name}`}
              >
                View Sound Page →
              </button>
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  );
};
