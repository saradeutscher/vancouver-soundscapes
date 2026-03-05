import React, { useState, useEffect, useCallback, useRef } from 'react';

import { getAssetUrl } from '../../constants/assets';

type ImageLightboxProps = {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  images,
  initialIndex,
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const touchStartRef = useRef<number | null>(null);

  // Navigation functions
  const navigateToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setIsLoading(true);
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);

  const navigateToNext = useCallback(() => {
    if (currentIndex < images.length - 1) {
      setIsLoading(true);
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, images.length]);

  // Update index when initialIndex changes (e.g., opening lightbox with different image)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentIndex(initialIndex);
    setIsLoading(true);
  }, [initialIndex]);

  // Keyboard event handling (ESC, arrows)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') navigateToPrevious();
      if (e.key === 'ArrowRight') navigateToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, navigateToPrevious, navigateToNext]);

  // Body scroll lock and lightbox class
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.body.classList.add('lightbox-open');

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.classList.remove('lightbox-open');
      };
    }
  }, [isOpen]);

  // Click outside to close
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Touch/swipe handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartRef.current === null) return;

      const touchEnd = e.changedTouches[0].clientX;
      const distance = touchStartRef.current - touchEnd;

      // Swipe left (next image)
      if (distance > 50) navigateToNext();
      // Swipe right (previous image)
      if (distance < -50) navigateToPrevious();

      touchStartRef.current = null;
    },
    [navigateToNext, navigateToPrevious]
  );

  if (!isOpen) return null;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <div
      className="lightbox-overlay"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image gallery lightbox"
    >
      <div
        className="lightbox-container"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={getAssetUrl(images[currentIndex])}
          alt={`${currentIndex + 1} of ${images.length}`}
          className={`lightbox-image ${isLoading ? 'loading' : ''}`}
          onLoad={() => setIsLoading(false)}
        />

        <button
          className="lightbox-close-btn"
          onClick={onClose}
          aria-label="Close lightbox"
          type="button"
        >
          ×
        </button>

        <button
          className="lightbox-nav-btn prev"
          onClick={navigateToPrevious}
          disabled={currentIndex === 0}
          aria-label="Previous image"
          type="button"
        >
          ‹
        </button>

        <button
          className="lightbox-nav-btn next"
          onClick={navigateToNext}
          disabled={currentIndex === images.length - 1}
          aria-label="Next image"
          type="button"
        >
          ›
        </button>

        <div className="lightbox-counter" aria-live="polite">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>
  );
};
