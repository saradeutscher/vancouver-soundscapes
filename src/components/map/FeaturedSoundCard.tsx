import React, { useEffect, useRef, useState } from 'react';

import { getDecadeColor, MULTI_DECADE_COLORS } from '../../constants/colors';

import type { FeaturedSoundConfig } from '../../data/featuredSounds';
import type { Sound } from '../../types/Sound';

type FeaturedSoundCardProps = {
  featured: FeaturedSoundConfig;
  sound: Sound;
  isActive: boolean;
  onSelect: (key: string) => void;
};

export const FeaturedSoundCard: React.FC<FeaturedSoundCardProps> = ({
  featured,
  sound,
  isActive,
  onSelect,
}) => {
  const summaryRef = useRef<HTMLParagraphElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const isSoundwalk = sound.geometry.type === 'LineString';
  const decadeColor = sound.properties.decades?.length
    ? MULTI_DECADE_COLORS
    : getDecadeColor(sound.properties.decade);

  useEffect(() => {
    const el = summaryRef.current;
    if (!el) return;

    const checkTruncation = () => setIsTruncated(el.scrollHeight > el.clientHeight);
    checkTruncation();

    const observer = new ResizeObserver(checkTruncation);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={`featured-sound-card ${isActive ? 'active' : ''}`}
      // CSS variable for left-border color and background tint
      style={{ '--decade-color': decadeColor } as React.CSSProperties}
    >
      <button
        className="featured-sound-select-btn"
        onClick={() => onSelect(sound.key)}
        aria-pressed={isActive}
        aria-label={`${featured.displayTitle}, ${sound.properties.decade}s ${isSoundwalk ? 'soundwalk' : 'recording'}`}
      >
        {/* Title and decade badge */}
        <div className="featured-sound-card-top">
          <span className="featured-sound-card-title">{featured.displayTitle}</span>
        </div>
      </button>

      {/* Short summary of the featured sound */}
      <p ref={summaryRef} className={`featured-sound-card-summary${isExpanded ? ' expanded' : ''}`}>
        {featured.summary}
      </p>
      {(isTruncated || isExpanded) && (
        <button className="featured-sound-show-more" onClick={() => setIsExpanded(prev => !prev)}>
          {isExpanded ? 'Show less' : 'Show more'}
        </button>
      )}
    </div>
  );
};
