import React from 'react';

import { getDecadeColor } from '../../constants/colors';
import { getLatLng, parseLineString } from '../../utils/coordinates';

import type { Sound } from '../../types/Sound';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

type StaticMapImageProps = {
  sound: Sound;
  width?: number;
  height?: number;
  zoom?: number;
};

export const StaticMapImage: React.FC<StaticMapImageProps> = ({
  sound,
  width = 300,
  height = 200,
  zoom = 14,
}) => {
  const decadeColor = getDecadeColor(sound.properties.decade);
  // Convert hex color from #RRGGBB to 0xRRGGBB format for Google Static Maps API
  const googleColor = decadeColor.replace('#', '0x');
  let url: string;

  if (sound.geometry.type === 'Point') {
    const { lat, lng } = getLatLng(sound.geometry.coordinates);
    url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=color:${googleColor}|${lat},${lng}&key=${API_KEY}`;
  } else {
    // LineString
    const { line } = parseLineString(sound.geometry.coordinates);
    const pathCoords = line.map(([lat, lng]) => `${lat},${lng}`).join('|');
    url = `https://maps.googleapis.com/maps/api/staticmap?path=color:${googleColor}|weight:4|${pathCoords}&size=${width}x${height}&key=${API_KEY}`;
  }

  return (
    <img
      src={url}
      alt={`Map of ${sound.properties.name}`}
      className="static-map-image"
      loading="lazy"
    />
  );
};
