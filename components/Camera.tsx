import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';

import { CameraHelper3JS, Group } from './ThreeJSElements';

const minCameraPosition = -6;
const maxCameraPosition = 6;
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

interface Position {
  x: number;
  y: number;
}

export function Camera({ targetPosition, targetZoom }) {
  const { camera } = useThree();
  const currentZoomRef = useRef(camera.position.z);
  const currentPositionRef = useRef({ x: camera.position.x, y: camera.position.y });

  const setCameraZoom = useCallback(
    (zoomLevel: number) => {
      if (camera.position.z !== zoomLevel) {
        camera.position.z = zoomLevel;
        currentZoomRef.current = zoomLevel;
      }
    },
    [camera]
  );

  useEffect(() => {
    const handleZoom = (zoom) => {
      setCameraZoom(zoom);
    };

    if (Math.abs(targetZoom - currentZoomRef.current) > 0.01) {
      handleZoom(targetZoom);
    }
  }, [setCameraZoom, targetZoom]);

  const setCameraPosition = useCallback(
    (x, y) => {
      if (camera.position.x !== x) {
        camera.position.x = x;
        currentPositionRef.current.x = x;
      }
      if (camera.position.y !== y) {
        camera.position.y = y;
        currentPositionRef.current.y = y;
      }
    },
    [camera]
  );

  useLayoutEffect(() => {
    const handleCameraPos = (position) => {
      setCameraPosition(position.x, position.y);
    };

    if (
      Math.abs(targetPosition.x - currentPositionRef.current.x) > 0.01 ||
      Math.abs(targetPosition.y - currentPositionRef.current.y) > 0.01
    ) {
      handleCameraPos(targetPosition);
    }
  });

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
