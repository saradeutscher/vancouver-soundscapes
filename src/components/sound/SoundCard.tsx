import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Sound } from '../../types/Sound';
import { StaticMapImage } from './StaticMapImage';
import { getDecadeColor } from '../../constants/colors';

type SoundCardProps = {
  sound: Sound;
};

export const SoundCard: React.FC<SoundCardProps> = ({ sound }) => {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    navigate(`/sounds/${sound.key}`);
  }, [navigate, sound.key]);

  const decadeColor = getDecadeColor(sound.properties.decade);

  return (
    <div className="sound-card-v2" onClick={handleClick}>
      <div className="sound-card-image-container">
        {sound.properties.images.length > 0 ? (
          <img
            src={`https://object-arbutus.cloud.computecanada.ca/soundscapes-public/${sound.properties.images[0]}`}
            alt={sound.properties.name}
            className="sound-card-image"
            loading="lazy"
          />
        ) : (
          <StaticMapImage sound={sound} width={300} height={200} zoom={14} />
        )}
      </div>

      <div className="sound-card-content">
        <h3 className="sound-card-title">{sound.properties.name}</h3>

        <div className="sound-card-metadata">
          <span
            className="metadata-badge decade-badge"
            style={{ background: decadeColor }}
          >
            {sound.properties.decade}s
          </span>
          <span className="metadata-badge type-badge">
            {sound.geometry.type === "LineString" ? "Soundwalk" : "Point"}
          </span>
        </div>

        <p className="sound-card-description">
          {sound.properties.description.length > 120
            ? sound.properties.description.substring(0, 120) + '...'
            : sound.properties.description
          }
        </p>
      </div>
    </div>
  );
};
