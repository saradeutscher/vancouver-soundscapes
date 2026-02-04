import type {Marker} from '@googlemaps/markerclusterer';
import {useCallback} from 'react';
import {AdvancedMarker, Pin} from '@vis.gl/react-google-maps';

import type { Sound } from '../../types/Sound';
import { Polyline } from './Polyline';
import { getDecadeColors, DEFAULT_COLOR } from '../../constants/colors';

export type Coordinate = [number, number];

export type SoundMarkerProps = {
  sound: Sound;
  onClick: (sound: Sound) => void;
  onMouseEnter?: (sound: Sound) => void;
  onMouseLeave?: () => void;
  setMarkerRef: (marker: Marker | null, key: string) => void;
  isSelected: boolean;
  hoverId: string | null;
};

/**
 * Wrapper Component for an AdvancedMarker for a single sound marker.
 */
export const SoundMarker = (props: SoundMarkerProps) => {
  const {sound, onClick, onMouseEnter, onMouseLeave, setMarkerRef, isSelected, hoverId} = props;

  const handleClick = useCallback(() => onClick(sound), [onClick, sound]);
  const handleMouseEnter = useCallback(() => onMouseEnter?.(sound), [onMouseEnter, sound]);
  const handleMouseLeave = useCallback(() => onMouseLeave?.(), [onMouseLeave]);

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

  // Calculate z-index based on state: selected > hovered > normal
  const zIndex = isSelected ? 200 : (hoverId === sound.key ? 100 : 1);

  const colors = getDecadeColors(sound.properties.decade);
  const background = colors?.background || DEFAULT_COLOR;
  const borderColor = colors?.border || '#340047';
  const glyphColor = colors?.glyph || '#560075';

  return (
    <>
      <AdvancedMarker
        position={point}
        ref={ref}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        zIndex={zIndex}
        style={{
          transform: `scale(${(hoverId === sound.key || isSelected) ? 1.2 : 1})`,
          // Transform origin at bottom-center so marker scales from where it touches the map
          transformOrigin: '50% 100%'
        }}>
        <Pin
          background={background}
          borderColor={borderColor}
          glyphColor={glyphColor}/>
      </AdvancedMarker>

      {sound.geometry.type === "LineString" && linePath && isSelected && (
        <Polyline
          key={sound.key}
          path={linePath}
          animate={true}
          animationDuration={1500}
          options={{
            strokeColor: background,
            strokeOpacity: 0,
            strokeWeight: 4,
            icons: [{
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                strokeWeight: 4,
                scale: 2,
              },
              offset: '0',
              repeat: '15px'
            }]
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

