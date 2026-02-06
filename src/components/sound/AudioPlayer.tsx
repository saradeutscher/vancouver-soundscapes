import React from 'react';

import { getAssetUrl } from '../../constants/assets';

type AudioPlayerProps = {
  soundfile: string;
  preload?: 'none' | 'metadata' | 'auto';
  className?: string;
};

/**
 * Reusable audio player component
 * Automatically constructs the full asset URL from the CDN
 */
export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  soundfile,
  preload = 'metadata',
  className,
}) => {
  return (
    // eslint-disable-next-line jsx-a11y/media-has-caption
    <audio controls preload={preload} src={getAssetUrl(soundfile)} className={className} />
  );
};
