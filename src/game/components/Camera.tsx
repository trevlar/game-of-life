import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';

import { CameraHelper3JS, Group } from './ThreeJSElements';

const minZoomLevel = 0.5;
const maxZoomLevel = 20;

export function getMaxZoomLevel(newZoomLevel: number): number {
  return Number(Math.max(minZoomLevel, Math.min(newZoomLevel, maxZoomLevel)).toFixed(3));
}

export function getZoomLevel(zoomLevel: number, zoomBy: number): number {
  const newZoomLevel = zoomLevel + zoomBy;

  const clampedZoomLevel = getMaxZoomLevel(newZoomLevel);

  return clampedZoomLevel;
}

export function Camera({ targetZoom }) {
  const { camera } = useThree();
  const currentZoomRef = useRef(camera.position.z);

  const setCameraPosition = useCallback(
    (zoomLevel: number) => {
      if (camera.position.z !== zoomLevel) {
        camera.position.z = zoomLevel;
        currentZoomRef.current = zoomLevel;
      }
    },
    [camera]
  );

  useEffect(() => {
    const handleZoom = () => {
      setCameraPosition(targetZoom);
    };

    if (Math.abs(targetZoom - currentZoomRef.current) > 0.01) {
      handleZoom();
    }
  }, [setCameraPosition, targetZoom]);

  return null;
}

export function CameraHelper() {
  const { camera } = useThree();

  return (
    <Group position={[0, 0, 2]}>
      <CameraHelper3JS args={[camera]} />
    </Group>
  );
}
