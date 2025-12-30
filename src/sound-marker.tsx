import type {Marker} from '@googlemaps/markerclusterer';
import React, {useCallback} from 'react';
import {AdvancedMarker, Pin} from '@vis.gl/react-google-maps';

import {Sound} from './Sounds';

export type Geometry = {
  coordinates: string;
  type: string;
};

export type SoundMarkerProps = {
  sound: Sound;
  onClick: (sound: Sound) => void;
  setMarkerRef: (marker: Marker | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single sound.
 */
export const SoundMarker = (props: SoundMarkerProps) => {
  const {sound, onClick, setMarkerRef} = props;

  const handleClick = useCallback(() => onClick(sound), [onClick, sound]);
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, sound.key),
    [setMarkerRef, sound.key]
  );

  // clunky filtering for now since I haven't dealt with soundwalks
  const point = (sound.geometry.type == "Point") ? getLatLng(sound.geometry) : null;

  // blue marker for points, purple markers for soundwalks
  const markerColor: string[] = (sound.geometry.type == "Point") ? ['#22ccff', '#1e89a1', '#0f677a'] : ['#C422FF', '#340047', '#560075'];

  return (
    <>
    {(sound.geometry.type == "Point") &&
    (<AdvancedMarker position={point} ref={ref} onClick={handleClick}>
    <Pin
      background={markerColor[0]}
      borderColor={markerColor[1]}
      glyphColor={markerColor[2]}/>
    </AdvancedMarker>)}
    </>
  )
}

function getLatLng(geometry: Geometry): {
  lat: number;
  lng: number;
} {
  const coords = JSON.parse(geometry.coordinates) as [number, number];

  const [lng, lat] = coords;

  return { lat, lng };
}

