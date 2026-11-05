import React, { useMemo } from 'react';

import { getDecadeColor } from '../../constants/colors';
import { FEATURED_SOUNDS } from '../../data/featuredSounds';

import type { Sound } from '../../types/Sound';

type FeaturedSoundsSidebarProps = {
  sounds: Sound[] | undefined; // full unfiltered dataset
  selectedSoundKey: string | null;
  onSoundSelect: (key: string) => void; // triggers selection + map centering
};

export const FeaturedSoundsSidebar: React.FC<FeaturedSoundsSidebarProps> = ({
  sounds,
  selectedSoundKey,
  onSoundSelect,
}) => {
  // Makes sure each featured sound actually exists in sounds.json
  // Returns nulll if the data isn't loaded yet, or unable to find name/decade
  // combination in sounds.json
  const resolvedSounds = useMemo(() => {
    return FEATURED_SOUNDS.map(featured => ({
      featured,
      sound:
        sounds?.find(
          s => s.properties.name === featured.name && s.properties.decade === featured.decade
        ) ?? null,
    }));
  }, [sounds]);

  return (
    <div className="featured-sounds-sidebar">
      <div className="featured-sounds-header">
        <h3>Featured Sounds</h3>
      </div>

      <div className="featured-sounds-list">
        {resolvedSounds.map(({ featured, sound }) => {
          // If sound isn't fully loaded yet, show loading card
          if (!sound) {
            return <div key={featured.name} className="featured-sound-card-skeleton" />;
          }

          const isActive = sound.key === selectedSoundKey;
          const isSoundwalk = sound.geometry.type === 'LineString';
          const decadeColor = getDecadeColor(sound.properties.decade);

          return (
            <button
              key={sound.key}
              className={`featured-sound-card ${isActive ? 'active' : ''}`}
              // CSS variable for left-border color and background tint
              style={{ '--decade-color': decadeColor } as React.CSSProperties}
              onClick={() => onSoundSelect(sound.key)}
              aria-pressed={isActive}
              aria-label={`${featured.displayTitle}, ${sound.properties.decade}s ${isSoundwalk ? 'soundwalk' : 'recording'}`}
            >
              {/* Title and decade badge */}
              <div className="featured-sound-card-top">
                <span className="featured-sound-card-title">{featured.displayTitle}</span>
              </div>

              {/* Short summary of the featured sound */}
              <p className="featured-sound-card-summary">{featured.summary}</p>

              {/* Displays to user whether cicking will animate a path */}
              <div className="featured-sound-card-meta">
                <span className={`featured-sound-type-pill ${isSoundwalk ? 'soundwalk' : ''}`}>
                  {isSoundwalk ? 'Soundwalk' : 'Recording'}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
