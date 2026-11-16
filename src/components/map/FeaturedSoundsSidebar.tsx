import React, { useCallback, useMemo, useState } from 'react';

import { FeaturedSoundCard } from './FeaturedSoundCard';
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
  // Returns nulll if the data isn't loaded yet, or unable to find name in sounds.json
  const resolvedSounds = useMemo(() => {
    return FEATURED_SOUNDS.map(featured => ({
      featured,
      sound: sounds?.find(s => s.properties.name === featured.name) ?? null,
    }));
  }, [sounds]);

  const [cardPlaying, setCardPlaying] = useState<string | null>(null);

  const handlePlayToggle = useCallback((key: string) => {
    setCardPlaying(prev => (prev === key ? null : key));
  }, []);

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

          return (
            <FeaturedSoundCard
              key={sound.key}
              featured={featured}
              sound={sound}
              isActive={sound.key === selectedSoundKey}
              onSelect={onSoundSelect}
              isPlaying={cardPlaying === sound.key}
              onPlayToggle={() => handlePlayToggle(sound.key)}
            />
          );
        })}
      </div>
    </div>
  );
};
