import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import React, { useState, useCallback } from 'react';

import { Polyline } from './Polyline';

type LatLngPoint = {
  lat: number;
  lng: number;
};

type MapLocationPickerProps = {
  mode?: 'single' | 'path';
  onLocationSelect?: (lat: number, lng: number) => void;
  onPathSelect?: (points: LatLngPoint[]) => void;
  initialLat?: number;
  initialLng?: number;
  initialPath?: LatLngPoint[];
};

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export const MapLocationPicker: React.FC<MapLocationPickerProps> = ({
  mode = 'single',
  onLocationSelect,
  onPathSelect,
  initialLat = 49.2827, // Vancouver default
  initialLng = -123.1207,
  initialPath = [],
}) => {
  const [markerPosition, setMarkerPosition] = useState<LatLngPoint>({
    lat: initialLat,
    lng: initialLng,
  });
  const [pathPoints, setPathPoints] = useState<LatLngPoint[]>(initialPath);

  const handleMapClick = useCallback(
    (e: any) => {
      if (e.detail && e.detail.latLng) {
        const lat = e.detail.latLng.lat;
        const lng = e.detail.latLng.lng;

        if (mode === 'path') {
          setPathPoints(prev => [...prev, { lat, lng }]);
        } else {
          setMarkerPosition({ lat, lng });
        }
      }
    },
    [mode]
  );

  const handleUndoLastPoint = useCallback(() => {
    setPathPoints(prev => prev.slice(0, -1));
  }, []);

  const handleClearPath = useCallback(() => {
    setPathPoints([]);
  }, []);

  const handleDeletePoint = useCallback((index: number) => {
    setPathPoints(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleConfirm = () => {
    if (mode === 'path' && onPathSelect) {
      onPathSelect(pathPoints);
    } else if (onLocationSelect) {
      onLocationSelect(markerPosition.lat, markerPosition.lng);
    }
  };

  const getMarkerColor = (index: number, total: number): string => {
    if (index === 0) return '#10b981'; // green for first
    if (index === total - 1) return '#ef4444'; // red for last
    return '#3b82f6'; // blue for middle
  };

  const isConfirmDisabled = mode === 'path' ? pathPoints.length < 2 : false;

  return (
    <div className="map-picker">
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        <Map
          mapId={'54137f32133013763f6a2d7f'}
          style={{ width: '100%', height: '400px' }}
          defaultCenter={mode === 'path' && pathPoints.length > 0 ? pathPoints[0] : markerPosition}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI={false}
          onClick={handleMapClick}
        >
          {mode === 'single' ? (
            <AdvancedMarker position={markerPosition} />
          ) : (
            <>
              {pathPoints.map((point, index) => (
                <AdvancedMarker key={index} position={point}>
                  <Pin
                    background={getMarkerColor(index, pathPoints.length)}
                    glyphColor="#ffffff"
                    borderColor="#ffffff"
                  >
                    <span style={{ fontSize: '12px', fontWeight: 'bold' }}>{index + 1}</span>
                  </Pin>
                </AdvancedMarker>
              ))}
              {pathPoints.length > 1 && <Polyline path={pathPoints} />}
            </>
          )}
        </Map>
      </APIProvider>

      <div className="map-picker-controls">
        {mode === 'single' ? (
          <p>
            Selected: {markerPosition.lat.toFixed(6)}, {markerPosition.lng.toFixed(6)}
          </p>
        ) : (
          <>
            <div className="path-controls">
              <div className="path-counter">
                <span className="point-count-badge">{pathPoints.length} points</span>
              </div>
              <button
                type="button"
                onClick={handleUndoLastPoint}
                disabled={pathPoints.length === 0}
                className="path-control-btn"
              >
                Undo Last Point
              </button>
              <button
                type="button"
                onClick={handleClearPath}
                disabled={pathPoints.length === 0}
                className="path-control-btn"
              >
                Clear Path
              </button>
            </div>

            {pathPoints.length > 0 && (
              <div className="path-info">
                <h4>Path Points:</h4>
                <ul className="path-points-list">
                  {pathPoints.map((point, index) => (
                    <li key={index}>
                      <span>
                        {index + 1}. {point.lat.toFixed(6)}, {point.lng.toFixed(6)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeletePoint(index)}
                        className="delete-point-btn"
                        aria-label={`Delete point ${index + 1}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {pathPoints.length < 2 && (
              <p className="path-hint">Click on the map to add points (minimum 2 required)</p>
            )}
          </>
        )}

        <button
          type="button"
          onClick={handleConfirm}
          disabled={isConfirmDisabled}
          className="confirm-location-btn"
        >
          {mode === 'path' ? 'Confirm Path' : 'Confirm Location'}
        </button>
      </div>
    </div>
  );
};
