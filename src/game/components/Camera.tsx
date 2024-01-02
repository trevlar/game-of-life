import { useThree } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';

import { CameraHelper3JS, Group } from './ThreeJSElements';

export function Camera({ targetZoom }) {
  const { camera } = useThree();
  const currentZoomRef = useRef(camera.position.z); // Using ref to track current zoom
  const [currentZoom, setCurrentZoom] = useState(camera.position.z);

  useEffect(() => {
    const handleZoom = () => {
      const zoomSpeed = 0.1;
      const newZoom = currentZoomRef.current + (targetZoom - currentZoomRef.current) * zoomSpeed;
      setCurrentZoom(newZoom);
      currentZoomRef.current = newZoom;

      if (Math.abs(targetZoom - newZoom) > 0.01) {
        requestAnimationFrame(handleZoom);
      }
    };

    handleZoom();
  }, [targetZoom]);

  useEffect(() => {
    camera.position.z = currentZoom;
  }, [currentZoom, camera]);

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
