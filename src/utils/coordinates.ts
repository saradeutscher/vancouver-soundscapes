import type { Sound } from '../types/Sound';

/**
 * Coordinate type: [lat, lng]
 */
export type Coordinate = [number, number];

/**
 * Latitude/Longitude object
 */
export type LatLng = {
  lat: number;
  lng: number;
};

/**
 * Parse Point coordinates from JSON string [lng, lat] to {lat, lng}
 *
 * @param coordinates - JSON string containing [lng, lat]
 * @returns Object with lat and lng properties
 */
export function getLatLng(coordinates: string): LatLng {
  const coords = JSON.parse(coordinates.trim()) as [number, number];
  const [lng, lat] = coords;
  return { lat, lng };
}

/**
 * Parse LineString coordinates from JSON string
 * Flips coordinates from [lng, lat] to [lat, lng] format
 *
 * @param coordinates - JSON string containing array of [lng, lat] pairs
 * @returns Object with line array of [lat, lng] coordinates
 */
export function parseLineString(coordinates: string): {
  line: Coordinate[];
} {
  const coords = JSON.parse(coordinates.trim()) as [number, number][];
  const flipped = coords.map(([lng, lat]) => [lat, lng] as Coordinate);
  return { line: flipped };
}

/**
 * Get first point from LineString coordinates
 *
 * @param coordinates - JSON string containing array of [lng, lat] pairs
 * @returns First point as {lat, lng}
 */
export function getFirstPoint(coordinates: string): LatLng {
  const coords = JSON.parse(coordinates.trim()) as [number, number][];
  const [lng, lat] = coords[0];
  return { lat, lng };
}

/**
 * Get position for any Sound geometry type (Point or LineString)
 * Convenience function that handles both geometry types
 *
 * @param sound - Sound object with geometry
 * @returns Position as {lat, lng}
 */
export function getSoundPosition(sound: Sound): LatLng {
  if (sound.geometry.type === 'Point') {
    return getLatLng(sound.geometry.coordinates);
  }
  return getFirstPoint(sound.geometry.coordinates);
}
