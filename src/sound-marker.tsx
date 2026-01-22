import type {Marker} from '@googlemaps/markerclusterer';
import React, {useCallback} from 'react';
import {AdvancedMarker, Pin} from '@vis.gl/react-google-maps';

import {Sound} from './Sounds';
import { Polyline } from './polyline';

// export type Geometry = {
//   coordinates: string;
//   type: string;
// };

export type Coordinate = [number, number];

export type SoundMarkerProps = {
  sound: Sound;
  onClick: (sound: Sound) => void;
  setMarkerRef: (marker: Marker | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single sound marker.
 */
export const SoundMarker = (props: SoundMarkerProps) => {
  const {sound, onClick, setMarkerRef} = props;

  const handleClick = useCallback(() => onClick(sound), [onClick, sound]);
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, sound.key),
    [setMarkerRef, sound.key]
  );

  // Handle both Point and LineString geometries
  let point: { lat: number; lng: number };
  let linePath: { lat: number; lng: number }[] | null = null;

  if (sound.geometry.type === "LineString") {
    const parsed = parseLineString(sound.geometry.coordinates);
    linePath = parsed.line.map(([lat, lng]) => ({ lat, lng }));
    point = linePath[0];
  } else {
    point = getLatLng(sound.geometry.coordinates);
  }

  // blue marker for points, purple markers for soundwalks
  const markerColor: string[] = (sound.geometry.type === "Point") ? ['#22ccff', '#1e89a1', '#0f677a'] : ['#C422FF', '#340047', '#560075'];

  return (
    <>
      <AdvancedMarker
        position={point}
        ref={ref}
        onClick={handleClick}>
        <Pin
          background={markerColor[0]}
          borderColor={markerColor[1]}
          glyphColor={markerColor[2]}/>
      </AdvancedMarker>

      {sound.geometry.type === "LineString" && linePath && (
        <Polyline
          path={linePath}
          options={{
            strokeColor: "#C422FF",
            strokeOpacity: 1,
            strokeWeight: 3,
          }}
        />
      )}
    </>
  );
}

function parseLineString(coordinates:string): {
  line: Coordinate[]
} {
  const cleaned = coordinates.trim();

  const coords = JSON.parse(cleaned) as [number, number][];
  const flipped = coords.map(
    ([a, b]) => [b, a] as Coordinate
  );

  return { line: flipped };
}

function getLatLng(coordinates: string): {
  lat: number;
  lng: number;
} {
  const cleaned = coordinates.trim();

  const coords = JSON.parse(cleaned) as [number, number];

  const [lng, lat] = coords;

  return { lat, lng };
}

