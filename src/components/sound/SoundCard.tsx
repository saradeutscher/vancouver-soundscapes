import React from 'react';
import { Link } from 'react-router-dom';

import { MetadataBadges } from './MetadataBadges';
import { StaticMapImage } from './StaticMapImage';
import { getAssetUrl } from '../../constants/assets';

import type { Sound } from '../../types/Sound';

type SoundCardProps = {
  sound: Sound;
};

export const SoundCard: React.FC<SoundCardProps> = ({ sound }) => {
  return (
    <Link
      to={`/sounds/${sound.key}`}
      className="sound-card-v2"
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="sound-card-image-container">
        {sound.properties.images.length > 0 ? (
          <img
            src={getAssetUrl(sound.properties.images[0])}
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

        <MetadataBadges
          sound={sound}
          showDecade={true}
          showClass={false}
          showTheme={false}
          showType={true}
        />

        <p className="sound-card-description">
          {sound.properties.description.length > 120
            ? sound.properties.description.substring(0, 120) + '...'
            : sound.properties.description}
        </p>
      </div>
    </Link>
  );
};
