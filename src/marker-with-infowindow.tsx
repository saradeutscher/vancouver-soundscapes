import React, {useState} from 'react';
import {
  AdvancedMarker,
  InfoWindow,
  Pin,
  useAdvancedMarkerRef
} from '@vis.gl/react-google-maps';

export const MarkerWithInfowindow = () => {
  const [infowindowOpen, setInfowindowOpen] = useState(false);
  const [markerRef, marker] = useAdvancedMarkerRef();

  const toggle = () => {
    setInfowindowOpen(prev => !prev);
  };

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        onClick={() => toggle()}
        position={{lat: 49.40, lng: -123.52}}
        title={'AdvancedMarker that opens an Infowindow when clicked.'}>
        <Pin
            background={'#22ccff'}
            borderColor={'#1e89a1'}
            glyphColor={'#0f677a'}/>
      {infowindowOpen && (
        <InfoWindow
          anchor={marker}
          maxWidth={200}
          onCloseClick={() => setInfowindowOpen(false)}>
          Add sound files here{' '}
          <code style={{whiteSpace: 'nowrap'}}>&#40;Soundfile&#41;</code>{' '}
        </InfoWindow>
      )}
      </AdvancedMarker>
    </>
  );
};