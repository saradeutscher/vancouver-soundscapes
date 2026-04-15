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

/**
 * Serialize a single point to GeoJSON Point format [lng, lat]
 *
 * @param lat - Latitude
 * @param lng - Longitude
 * @returns JSON string in format "[lng, lat]"
 */
export function serializePoint(lat: number, lng: number): string {
  // GeoJSON format is [lng, lat] (flipped from typical lat, lng)
  return JSON.stringify([lng, lat]);
}

/**
 * Serialize multiple points to GeoJSON LineString format [[lng, lat], ...]
 *
 * @param points - Array of {lat, lng} objects
 * @returns JSON string in format "[[lng, lat], [lng, lat], ...]"
 */
export function serializePath(points: LatLng[]): string {
  // GeoJSON format is [lng, lat] for each point
  const coords = points.map(({ lat, lng }) => [lng, lat]);
  return JSON.stringify(coords);
}

/**
 * Deserialize LineString coordinates to array of {lat, lng} objects
 * Used for restoring path in form editors
 *
 * @param coordinates - JSON string containing array of [lng, lat] pairs
 * @returns Array of {lat, lng} objects
 */
export function deserializePath(coordinates: string): LatLng[] {
  const coords = JSON.parse(coordinates.trim()) as [number, number][];
  return coords.map(([lng, lat]) => ({ lat, lng }));
}

/**
 * Validate that a coordinate pair is within valid lat/lng ranges
 *
 * @param lat - Latitude to validate
 * @param lng - Longitude to validate
 * @returns true if valid, false otherwise
 */
export function isValidCoordinate(lat: number, lng: number): boolean {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in meters
 *
 * @param p1 - First point {lat, lng}
 * @param p2 - Second point {lat, lng}
 * @returns Distance in meters
 */
export function calculateDistance(p1: LatLng, p2: LatLng): number {
  const R = 6371000; // Earth's radius in meters
  const lat1 = (p1.lat * Math.PI) / 180;
  const lat2 = (p2.lat * Math.PI) / 180;
  const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
  const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}
