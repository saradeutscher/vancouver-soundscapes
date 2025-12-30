import {useMap} from '@vis.gl/react-google-maps';
import {useRef, useEffect} from 'react';

type LatLng = google.maps.LatLngLiteral;

type PolylineProps = {
  path: LatLng[];
  options?: google.maps.PolylineOptions;
};

export function Polyline({ path, options }: PolylineProps) {
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  const map = useMap();

  useEffect(() => {
    if (!map) return;

    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        map,
        path,
        ...options,
      });
    } else {
      polylineRef.current.setPath(path);
    }

    return () => {
      polylineRef.current?.setMap(null);
      polylineRef.current = null;
    };
  }, [map, path, options]);

  return null;
}
