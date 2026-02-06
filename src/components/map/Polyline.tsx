import { useMap } from '@vis.gl/react-google-maps';
import { useRef, useEffect, useState } from 'react';

type LatLng = google.maps.LatLngLiteral;

type PolylineProps = {
  path: LatLng[];
  options?: google.maps.PolylineOptions;
  animate?: boolean;
  animationDuration?: number; // Duration in milliseconds
};

function interpolatePoint(start: LatLng, end: LatLng, fraction: number): LatLng {
  return {
    lat: start.lat + (end.lat - start.lat) * fraction,
    lng: start.lng + (end.lng - start.lng) * fraction,
  };
}

export function Polyline({
  path,
  options,
  animate = false,
  animationDuration = 1000,
}: PolylineProps) {
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const [animatedPath, setAnimatedPath] = useState<LatLng[]>(path);
  const animationFrameRef = useRef<number | null>(null);

  const map = useMap();

  // Handle animation
  useEffect(() => {
    if (!animate || path.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAnimatedPath(path);
      return;
    }

    // Cancel any ongoing animation
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Reset to show only the first point
    setAnimatedPath([path[0]]);

    const startTime = Date.now();

    const animateDrawing = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      if (progress < 1) {
        // Calculate the current position along the path
        const totalSegments = path.length - 1;
        const currentPosition = progress * totalSegments;
        const currentSegmentIndex = Math.floor(currentPosition);
        const segmentProgress = currentPosition - currentSegmentIndex;

        // Build the path up to the current segment
        const newPath = path.slice(0, currentSegmentIndex + 1);

        // Add interpolated point if we're in the middle of a segment
        if (currentSegmentIndex < totalSegments) {
          const interpolated = interpolatePoint(
            path[currentSegmentIndex],
            path[currentSegmentIndex + 1],
            segmentProgress
          );
          newPath.push(interpolated);
        }

        setAnimatedPath(newPath);
        animationFrameRef.current = requestAnimationFrame(animateDrawing);
      } else {
        setAnimatedPath(path);
        animationFrameRef.current = null;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animateDrawing);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [animate, path, animationDuration]);

  // Handle polyline rendering
  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        map,
        path: animatedPath,
        ...options,
      });
    } else {
      polylineRef.current.setPath(animatedPath);
      if (options) {
        polylineRef.current.setOptions(options);
      }
    }
  }, [map, animatedPath, options]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, []);

  return null;
}
