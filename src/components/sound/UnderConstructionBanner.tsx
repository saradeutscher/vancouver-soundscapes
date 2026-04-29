import React from 'react';

export const UnderConstructionBanner: React.FC = () => {
  return (
    <div className="under-construction-banner" role="alert" aria-live="polite">
      <div className="under-construction-content">
        <svg
          className="under-construction-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 2L2 20h20L12 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 9v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="17" r="0.5" fill="currentColor" />
        </svg>
        <span className="under-construction-text">This page is currently under construction.</span>
      </div>
    </div>
  );
};
