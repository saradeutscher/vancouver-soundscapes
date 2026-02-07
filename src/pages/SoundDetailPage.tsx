import { APIProvider, Map as GoogleMap } from '@vis.gl/react-google-maps';
import React, { useMemo, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { SoundMarker } from '../components/map/SoundMarker';
import { AudioPlayer } from '../components/sound/AudioPlayer';
import { ImageGallery } from '../components/sound/ImageGallery';
import { MetadataBadges } from '../components/sound/MetadataBadges';
import { getDecadeColor } from '../constants/colors';
import { getSoundPosition } from '../utils/coordinates';

import type { Sound } from '../types/Sound';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type SoundDetailPageProps = {
  sounds?: Sound[];
};

export const SoundDetailPage: React.FC<SoundDetailPageProps> = ({ sounds }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSoundKey, setSelectedSoundKey] = useState<string | null>(null);

  const sound = useMemo(() => sounds?.find(s => s.key === id), [sounds, id]);

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

  const position = getSoundPosition(sound);

  return (
    <div className="sound-detail-page">
      <div className="sound-detail-header">
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="back-button" onClick={() => navigate('/sounds')}>
            ← Back to List
          </button>
          <button className="back-button" onClick={handleBackToMap}>
            View on Main Map
          </button>
        </div>
        <h1>{sound.properties.name}</h1>
        <MetadataBadges
          sound={sound}
          showDecade={true}
          showClass={false}
          showTheme={false}
          showType={true}
        />
        <div className="sound-description-section">
          <p>{sound.properties.description}</p>
        </div>
      </div>

      <div className="sound-detail-content">
        <div className="sound-detail-col1">
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
          {sound.geometry.type === 'LineString' && (
            <p
              className="soundwalk-hint"
              style={
                {
                  '--decade-color': getDecadeColor(sound.properties.decade),
                } as React.CSSProperties
              }
            >
              Click the marker to view the soundwalk path
            </p>
          )}
          {sound.properties.theme.length > 0 && (
            <div className="sound-themes-section">
              <h3>Themes</h3>
              <MetadataBadges
                sound={sound}
                showDecade={false}
                showClass={false}
                showTheme={true}
                showType={false}
              />
            </div>
          )}
          {sound.properties.class.length > 0 && (
            <div className="sound-themes-section">
              <h3>Class</h3>
              <MetadataBadges
                sound={sound}
                showDecade={false}
                showClass={true}
                showTheme={false}
                showType={false}
              />
            </div>
          )}
        </div>

        <div className="sound-detail-info-section">
          <div className="sound-audio-section">
            <h3>Listen</h3>
            <AudioPlayer soundfile={sound.properties.soundfile} />
          </div>

          {sound.properties.images.length > 0 && (
            <div className="sound-gallery-section">
              <h3>Images</h3>
              <ImageGallery images={sound.properties.images} />
            </div>
          )}
          {/*
          {sound.properties.notes && (
            <div className="sound-notes-section">
              <h3>Notes</h3>
              <div className="sound-notes">{sound.properties.notes}</div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};
