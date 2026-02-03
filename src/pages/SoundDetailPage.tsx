import React, { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps';
import type { Sound } from '../types/Sound';
import { SoundMarker } from '../components/map/SoundMarker';
import { ImageGallery } from '../components/sound/ImageGallery';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const DECADE_COLORS = new Map([
  [1970, '#C422FF'],
  [1990, '#22ccff'],
  [2010, '#85D134'],
  [2020, '#F7314B']
]);

// Helper to get {lat, lng} from coordinates string
function getLatLng(coordsStr: string): { lat: number; lng: number } {
  const coords = JSON.parse(coordsStr) as [number, number];
  const [lng, lat] = coords;
  return { lat, lng };
}

// Helper to get first point from LineString
function getFirstPoint(coordsStr: string): { lat: number; lng: number } {
  const coords = JSON.parse(coordsStr) as [number, number][];
  const [lng, lat] = coords[0];
  return { lat, lng };
}

type SoundDetailPageProps = {
  sounds?: Sound[];
};

export const SoundDetailPage: React.FC<SoundDetailPageProps> = ({ sounds }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSoundKey, setSelectedSoundKey] = useState<string | null>(null);

  const sound = useMemo(() =>
    sounds?.find(s => s.key === id),
    [sounds, id]
  );

  const handleBackToMap = useCallback(() => {
    if (sound) {
      navigate(`/?soundId=${sound.key}`);
    } else {
      navigate('/');
    }
  }, [navigate, sound]);

  if (!sound) {
    return (
      <div className="sound-detail-error">
        <h2>Sound not found</h2>
        <button onClick={() => navigate('/sounds')}>Back to Sounds</button>
      </div>
    );
  }

  const position = sound.geometry.type === "Point"
    ? getLatLng(sound.geometry.coordinates)
    : getFirstPoint(sound.geometry.coordinates);

  const decadeColor = DECADE_COLORS.get(sound.properties.decade) || '#008cba';

  return (
    <div className="sound-detail-page">
      <div className="sound-detail-header">
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            className="back-button"
            onClick={() => navigate('/sounds')}
          >
            ← Back to List
          </button>
          <button
            className="back-button"
            onClick={handleBackToMap}
          >
            View on Overall Map
          </button>
        </div>
        <h1>{sound.properties.name}</h1>
        <div className="sound-metadata">
          <span
            className="metadata-badge decade-badge"
            style={{ background: decadeColor }}
          >
            {sound.properties.decade}s
          </span>
          {sound.properties.class.map(cls => (
            <span key={cls} className="metadata-badge class-badge">{cls}</span>
          ))}
        </div>
      </div>

      <div className="sound-detail-content">
        <div className="sound-detail-map-section">
          <APIProvider apiKey={API_KEY}>
            <GoogleMap
              mapId={'54137f32133013763f6a2d7f'}
              defaultZoom={15}
              defaultCenter={position}
              gestureHandling={'greedy'}
              style={{ width: '100%', height: '400px' }}
            >
              <SoundMarker
                sound={sound}
                onClick={() => setSelectedSoundKey(sound.key)}
                setMarkerRef={() => {}}
                isSelected={selectedSoundKey === sound.key}
                hoverId={null}
              />
            </GoogleMap>
          </APIProvider>
        </div>

        <div className="sound-detail-info-section">
          <div className="sound-audio-section">
            <h3>Listen</h3>
            <audio
              controls
              preload="metadata"
              src={`https://object-arbutus.cloud.computecanada.ca/soundscapes-public/${sound.properties.soundfile}`}
            />
          </div>

          <div className="sound-description-section">
            <h3>Description</h3>
            <p>{sound.properties.description}</p>
          </div>

          {sound.properties.images.length > 0 && (
            <div className="sound-gallery-section">
              <h3>Images</h3>
              <ImageGallery images={sound.properties.images} />
            </div>
          )}

          {sound.properties.notes && (
            <div className="sound-notes-section">
              <h3>Notes</h3>
              <div className="sound-notes">{sound.properties.notes}</div>
            </div>
          )}

          {sound.properties.theme.length > 0 && (
            <div className="sound-themes-section">
              <h3>Themes</h3>
              <div className="theme-badges">
                {sound.properties.theme.map(t => (
                  <span key={t} className="metadata-badge theme-badge">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
