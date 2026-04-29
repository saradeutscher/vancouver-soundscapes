import React, { useState } from 'react';

import { DECADE_COLORS } from '../../constants/colors';

export const DecadeLegend: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const decades = Array.from(DECADE_COLORS.entries()).sort((a, b) => a[0] - b[0]);

  return (
    <>
      {/* Info Button */}
      <button
        className="decade-legend-button"
        onClick={() => setIsOpen(true)}
        aria-label="Show decade color legend"
        title="View decade color legend"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M12 16v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="8" r="0.5" fill="currentColor" />
        </svg>
        <span className="decade-legend-button-text">Legend</span>
      </button>

      {/* Legend Modal */}
      {isOpen && (
        <div
          className="decade-legend-overlay"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="legend-title"
        >
          <div className="decade-legend-modal" onClick={e => e.stopPropagation()}>
            <div className="decade-legend-header">
              <h3 id="legend-title">Decade Color Legend</h3>
              <button
                className="decade-legend-close"
                onClick={() => setIsOpen(false)}
                aria-label="Close legend"
              >
                ✕
              </button>
            </div>

            <div className="decade-legend-content">
              <p className="decade-legend-description">
                Sound recordings on the map are color-coded by the decade they were recorded:
              </p>

              <div className="decade-legend-items">
                {decades.map(([decade, colors]) => (
                  <div key={decade} className="decade-legend-item">
                    <div
                      className="decade-legend-marker"
                      style={{
                        background: colors.background,
                        borderColor: colors.border,
                      }}
                    />
                    <span className="decade-legend-label">{decade}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
