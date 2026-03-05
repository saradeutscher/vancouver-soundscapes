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
        alt="Taken at sound location"
        onClick={enableLightbox ? handleImageClick : undefined}
        style={{ cursor: enableLightbox ? 'pointer' : 'default' }}
      />

      <div className="gallery-navigation">
        <div className="nav-btns">
          <button onClick={handleBack} disabled={currentImageIndex === 0}>
            <span className="material-symbols-outlined"> &lsaquo; </span>
          </button>
          <button onClick={handleNext} disabled={currentImageIndex === images.length - 1}>
            <span className="material-symbols=outlined"> &rsaquo; </span>
          </button>
        </div>

        <div className="indicators">
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
