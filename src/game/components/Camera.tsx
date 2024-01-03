import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';

import { CameraHelper3JS, Group } from './ThreeJSElements';

const minZoomLevel = 0.125;
const maxZoomLevel = 20;

export function getMaxZoomLevel(newZoomLevel: number): number {
  return Number(Math.max(minZoomLevel, Math.min(newZoomLevel, maxZoomLevel)).toFixed(3));
}

export function getZoomLevel(zoomLevel: number, zoomBy: number): number {
  const logZoom = Math.log(Math.max(zoomLevel, 1));
  const newLogZoom = logZoom + zoomBy;
  const newZoomLevel = Math.exp(newLogZoom) - 1;

  const clampedZoomLevel = getMaxZoomLevel(newZoomLevel);

  return clampedZoomLevel;
}

const zoomSpeed = 0.1;

export function Camera({ targetZoom }) {
  const { camera } = useThree();
  const currentZoomRef = useRef(camera.position.z);

  const setCameraPosition = useCallback(
    (zoomLevel: number) => {
      camera.position.z = zoomLevel;
      currentZoomRef.current = zoomLevel;
    },
    [camera]
  );

  useEffect(() => {
    const handleZoom = () => {
      const newZoomLevel =
        currentZoomRef.current + (targetZoom - currentZoomRef.current) * zoomSpeed;
      const clampedZoomLevel = Math.max(minZoomLevel, Math.min(newZoomLevel, maxZoomLevel));

      setCameraPosition(clampedZoomLevel);

      if (Math.abs(targetZoom - clampedZoomLevel) > 0.01) {
        requestAnimationFrame(handleZoom);
      } else {
        setCameraPosition(targetZoom);
      }
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
