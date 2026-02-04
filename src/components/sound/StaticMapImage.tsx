import React from 'react';
import type { Sound } from '../../types/Sound';
import { getDecadeColor } from '../../constants/colors';

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
  zoom = 14
}) => {
  const decadeColor = getDecadeColor(sound.properties.decade);
  let url: string;

  if (sound.geometry.type === "Point") {
    const coords = JSON.parse(sound.geometry.coordinates) as [number, number];
    const [lng, lat] = coords;
    url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&markers=color:${encodeURIComponent(decadeColor)}|${lat},${lng}&key=${API_KEY}`;
  } else { // LineString
    const coords = JSON.parse(sound.geometry.coordinates) as [number, number][];
    const pathCoords = coords.map(([lng, lat]) => `${lat},${lng}`).join('|');
    url = `https://maps.googleapis.com/maps/api/staticmap?path=color:${encodeURIComponent(decadeColor)}|weight:3|${pathCoords}&size=${width}x${height}&key=${API_KEY}`;
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
