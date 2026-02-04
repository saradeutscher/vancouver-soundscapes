import React, { useState, useCallback } from 'react';
import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';

type MapLocationPickerProps = {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  onLocationSelect,
  initialLat = 49.2827, // Vancouver default
  initialLng = -123.1207
}) => {
  const [markerPosition, setMarkerPosition] = useState<{lat: number, lng: number}>({
    lat: initialLat,
    lng: initialLng
  });

  const handleMapClick = useCallback((e: any) => {
    if (e.detail && e.detail.latLng) {
      const lat = e.detail.latLng.lat;
      const lng = e.detail.latLng.lng;
      setMarkerPosition({ lat, lng });
    }
  }, []);

  const handleConfirm = () => {
    onLocationSelect(markerPosition.lat, markerPosition.lng);
  };

  return (
    <div className="map-picker">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          mapId={'54137f32133013763f6a2d7f'}
          style={{ width: '100%', height: '400px' }}
          defaultCenter={markerPosition}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
        >
          <AdvancedMarker position={markerPosition} />
        </Map>
      </APIProvider>

      <div className="map-picker-controls">
        <p>
          Selected: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
        </p>
        <button type="button" onClick={handleConfirm} className="confirm-location-btn">
          Confirm Location
        </button>
      </div>
    </div>
  );
};
