// adapted from visgl react-google-maps examples
// https://github.com/visgl/react-google-maps/blob/main/examples/advanced-marker/src/components/real-estate-gallery/real-estate-gallery.tsx

import { useState, FunctionComponent, MouseEvent } from 'react';

import { ImageLightbox } from './ImageLightbox';
import { getAssetUrl } from '../../constants/assets';

export type ImageGalleryProps = {
  images: string[];
  enableLightbox?: boolean;
};

export const ImageGallery: FunctionComponent<ImageGalleryProps> = ({
  images,
  enableLightbox = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  const handleBack = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNext = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handleImageClick = () => {
    setLightboxStartIndex(currentImageIndex);
    setIsLightboxOpen(true);
  };

  return (
    <div className={`image-gallery ${enableLightbox ? 'lightbox-enabled' : ''}`}>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <img
        src={getAssetUrl(images[currentImageIndex])}
        alt={`${currentImageIndex + 1} of ${images.length}, taken at sound location`}
        onClick={enableLightbox ? handleImageClick : undefined}
        style={{ cursor: enableLightbox ? 'pointer' : 'default' }}
      />

      <div className="gallery-navigation">
        <div className="nav-btns">
          <button
            onClick={handleBack}
            disabled={currentImageIndex === 0}
            aria-label="Previous image"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {' '}
              &lsaquo;{' '}
            </span>
          </button>
          <button
            onClick={handleNext}
            disabled={currentImageIndex === images.length - 1}
            aria-label="Next image"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              {' '}
              &rsaquo;{' '}
            </span>
          </button>
        </div>

        <div className="gallery-counter sr-only" aria-live="polite">
          {currentImageIndex + 1} / {images.length}
        </div>

        <div className="indicators" aria-hidden="true">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentImageIndex ? 'active' : ''}`}
            ></span>
          ))}
        </div>
      </div>

      {enableLightbox && (
        <ImageLightbox
          images={images}
          initialIndex={lightboxStartIndex}
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
};
