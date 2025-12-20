import type {Marker} from '@googlemaps/markerclusterer';
import React, {useCallback} from 'react';
import {AdvancedMarker, Pin} from '@vis.gl/react-google-maps';

import {Sound} from './Sounds';

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

  return (
    <AdvancedMarker position={sound.position} ref={ref} onClick={handleClick}>
      <Pin
        background={'#22ccff'}
        borderColor={'#1e89a1'}
        glyphColor={'#0f677a'}/>
    </AdvancedMarker>
  )
}
