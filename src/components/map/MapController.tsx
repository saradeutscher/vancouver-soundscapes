import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { useSearchParams } from 'react-router-dom';
import type { Sound } from '../../types/Sound';

type MapControllerProps = {
  sounds: Sound[] | undefined;
  selectedSoundKey: string | null;
  onSoundSelect: (key: string | null) => void;
};

export const MapController = ({ sounds, selectedSoundKey, onSoundSelect }: MapControllerProps) => {
  const map = useMap();
  const [searchParams, setSearchParams] = useSearchParams();

  // Track whether we should center the map on this URL change
  const shouldCenterRef = useRef(false);

  // Detect when URL changes from external navigation (detail page)
  useEffect(() => {
    const soundIdFromUrl = searchParams.get('soundId');

    // If URL has soundId but it's different from current selection,
    // this is likely external navigation (from detail page)
    if (soundIdFromUrl && soundIdFromUrl !== selectedSoundKey) {
      shouldCenterRef.current = true;
    }
  }, [searchParams, selectedSoundKey]);

  // Handle sound selection from URL parameter
  useEffect(() => {
    const soundIdFromUrl = searchParams.get('soundId');

    if (!soundIdFromUrl || !sounds || sounds.length === 0 || !map) {
      return;
    }

    // Find the sound
    const sound = sounds.find(s => s.key === soundIdFromUrl);

    if (!sound) {
      // Invalid sound ID - clear the param
      setSearchParams({});
      return;
    }

    // Always set selection (opens InfoWindow)
    onSoundSelect(soundIdFromUrl);

    // Only center/zoom if this is external navigation (from detail page)
    // NOT when Effect 2 updates the URL after a marker click
    if (shouldCenterRef.current) {
      // Center and zoom the map based on geometry type
      if (sound.geometry.type === 'LineString') {
        // For soundwalks, fit bounds to entire path
        const coordinates = JSON.parse(sound.geometry.coordinates) as [number, number][];
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(([lng, lat]) => {
          bounds.extend({ lat, lng });
        });
        map.fitBounds(bounds, {
          top: 100,
          bottom: 50,
          left: 50,
          right: 50
        });
      } else {
        // For Point markers, center and zoom
        const coords = JSON.parse(sound.geometry.coordinates) as [number, number];
        const [lng, lat] = coords;
        map.panTo({ lat, lng });
        map.setZoom(17); // Close-up zoom for individual markers
      }

      // Reset flag after centering
      shouldCenterRef.current = false;
    }
  }, [searchParams, sounds, map, setSearchParams, onSoundSelect]);

  // Update URL when sound is selected/deselected via map clicks
  useEffect(() => {
    const currentSoundId = searchParams.get('soundId');

    // Only sync URL if sounds are loaded (prevents clearing URL on initial mount)
    if (!sounds || sounds.length === 0) {
      return;
    }

    if (selectedSoundKey && currentSoundId !== selectedSoundKey) {
      // User selected a sound on the map - update URL
      // Set flag to FALSE to prevent centering when URL updates
      shouldCenterRef.current = false;
      setSearchParams({ soundId: selectedSoundKey });
    } else if (!selectedSoundKey && currentSoundId) {
      // User closed InfoWindow - clear URL
      // Only clear if the soundId in URL is actually valid (exists in sounds)
      const urlSoundExists = sounds.some(s => s.key === currentSoundId);
      if (urlSoundExists) {
        setSearchParams({});
      }
    }
  }, [selectedSoundKey, searchParams, setSearchParams, sounds]);

  return null; // This component doesn't render anything
};
