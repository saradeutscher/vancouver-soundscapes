import React from 'react';

import { getDecadeColor, MULTI_DECADE_COLORS } from '../../constants/colors';

import type { Sound } from '../../types/Sound';

type MetadataBadgesProps = {
  sound: Sound;
  showDecade?: boolean;
  showClass?: boolean;
  showTheme?: boolean;
  showType?: boolean;
  showProvenance?: boolean;
};

/**
 * Reusable component for rendering metadata badges
 * Displays decade, class, theme, and/or type badges based on props
 */
export const MetadataBadges: React.FC<MetadataBadgesProps> = ({
  sound,
  showDecade = true,
  showClass = true,
  showTheme = false,
  showType = false,
  showProvenance = true,
}) => {
  const decadeColor = getDecadeColor(sound.properties.decade);

  return (
    <div className="sound-metadata">
      {showDecade && (
        <>
          {sound.properties.decades?.length ? (
            sound.properties.decades.map(d => (
              <span
                key={d}
                className="metadata-badge decade-badge"
                style={{
                  background: getDecadeColor(d),
                }}
              >
                {d}s
              </span>
            ))
          ) : (
            <span className="metadata-badge decade-badge" style={{ background: decadeColor }}>
              {sound.properties.decade}s
            </span>
          )}
          {sound.properties.isComposition && (
            <span
              className="metadata-badge composition-badge"
              style={{
                background: MULTI_DECADE_COLORS.background,
                color: MULTI_DECADE_COLORS.border,
              }}
            >
              Composition
            </span>
          )}
        </>
      )}

      {showType && (
        <span className="metadata-badge type-badge">
          {sound.geometry.type === 'LineString' ? 'Soundwalk' : 'Point'}
        </span>
      )}

      {showClass &&
        sound.properties.class.map(cls => (
          <span key={cls} className="metadata-badge class-badge">
            {cls}
          </span>
        ))}

      {showTheme &&
        sound.properties.theme.map(theme => (
          <span key={theme} className="metadata-badge theme-badge">
            {theme}
          </span>
        ))}

      {showProvenance && sound.properties.source && (
        <span className="metadata-badge provenance-badge">{sound.properties.source}</span>
      )}
    </div>
  );
};
