// adapted from visgl react-google-maps examples
// https://github.com/visgl/react-google-maps/blob/main/examples/advanced-marker/src/components/real-estate-gallery/real-estate-gallery.tsx

import React, {useState, FunctionComponent, MouseEvent} from 'react';

export type ImageGalleryProps = {
  images: string[];
}

export const ImageGallery: FunctionComponent<ImageGalleryProps> = ({
  images
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  return (
    <div className="image-gallery">
      <img src={"https://object-arbutus.cloud.computecanada.ca/soundscapes-public/" + images[currentImageIndex]} alt="Image taken at sound location" />

      <div className="gallery-navigation">
        <div className="nav-btns">
          <button onClick={handleBack} disabled={currentImageIndex === 0}>
            <span className="material-symbols-outlined"> &lsaquo;	</span>
          </button>
          <button onClick={handleNext} disabled={currentImageIndex === images.length - 1}>
            <span className="material-symbols=outlined"> &rsaquo;	</span>
          </button>
        </div>

        <div className="indicators">
          {images.map((_, index) => (
            <span
              key={index}
              className={`dot ${index === currentImageIndex ? 'active' : ''}`}>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}