import { Camera } from '@react-three/fiber';
import { useMemo } from 'react';
import { BufferGeometry, DoubleSide, Float32BufferAttribute, Side } from 'three';

import { SpaceShape } from '../types/types';

interface LightProps {
  intensity: number;
  position?: [number, number, number];
}
export const AmbientLight = ({ intensity }: LightProps) => <ambientLight intensity={intensity} />;
export const DirectionalLight = ({ intensity, position }: LightProps) => (
  <directionalLight intensity={intensity} position={position} />
);

interface MeshStandardMaterialProps {
  color: string;
  attach: string;
  side?: Side;
  wireframe?: boolean;
}
export const MeshStandardMaterial = ({
  color,
  attach,
  side,
  wireframe,
}: MeshStandardMaterialProps) => (
  <meshStandardMaterial color={color} attach={attach} side={side} wireframe={wireframe} />
);

interface TorusSurfaceProps {
  color: string;
}

export const TorusSurface = ({ color }: TorusSurfaceProps) => (
  <mesh>
    <torusGeometry args={[2.35, 1.05, 64, 160]} />
    <MeshStandardMaterial color={color} attach="material" />
  </mesh>
);

const createParametricSurfaceGeometry = (
  uSegments: number,
  vSegments: number,
  getPosition: (u: number, v: number) => [number, number, number]
) => {
  const positions: number[] = [];
  const indices: number[] = [];

  for (let uIndex = 0; uIndex <= uSegments; uIndex++) {
    for (let vIndex = 0; vIndex <= vSegments; vIndex++) {
      positions.push(...getPosition(uIndex / uSegments, vIndex / vSegments));
    }
  }

  for (let uIndex = 0; uIndex < uSegments; uIndex++) {
    for (let vIndex = 0; vIndex < vSegments; vIndex++) {
      const current = uIndex * (vSegments + 1) + vIndex;
      const nextU = current + vSegments + 1;

      indices.push(current, nextU, current + 1);
      indices.push(nextU, nextU + 1, current + 1);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();

  return geometry;
};

const useParametricSurfaceGeometry = (
  uSegments: number,
  vSegments: number,
  getPosition: (u: number, v: number) => [number, number, number]
) => {
  return useMemo(
    () => createParametricSurfaceGeometry(uSegments, vSegments, getPosition),
    [getPosition, uSegments, vSegments]
  );
};

const HorizontalCylinderSurface = ({ color }: TorusSurfaceProps) => (
  <mesh>
    <cylinderGeometry args={[1.55, 1.55, 4.4, 64, 1, true]} />
    <MeshStandardMaterial color={color} attach="material" wireframe side={DoubleSide} />
  </mesh>
);

const VerticalCylinderSurface = ({ color }: TorusSurfaceProps) => (
  <mesh rotation={[0, 0, Math.PI / 2]}>
    <cylinderGeometry args={[1.4, 1.4, 4.8, 64, 1, true]} />
    <MeshStandardMaterial color={color} attach="material" wireframe side={DoubleSide} />
  </mesh>
);

const MobiusSurface = ({ color }: TorusSurfaceProps) => {
  const geometry = useParametricSurfaceGeometry(96, 16, (uRatio, vRatio) => {
    const majorRadius = 2.15;
    const stripWidth = 1.25;
    const u = uRatio * Math.PI * 2;
    const v = (vRatio - 0.5) * stripWidth;
    const radialOffset = majorRadius + v * Math.cos(u / 2);

    return [radialOffset * Math.cos(u), radialOffset * Math.sin(u), v * Math.sin(u / 2)];
  });

  return (
    <mesh geometry={geometry}>
      <MeshStandardMaterial color={color} attach="material" wireframe side={DoubleSide} />
    </mesh>
  );
};

const KleinBottleSurface = ({ color }: TorusSurfaceProps) => {
  const geometry = useParametricSurfaceGeometry(96, 48, (uRatio, vRatio) => {
    const scale = 0.85;
    const u = uRatio * Math.PI * 2;
    const v = vRatio * Math.PI * 2;
    const tube = Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v);
    const radialOffset = 2.1 + tube;

    return [
      radialOffset * Math.cos(u) * scale,
      radialOffset * Math.sin(u) * scale,
      (Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v)) * scale,
    ];
  });

  return (
    <mesh geometry={geometry}>
      <MeshStandardMaterial color={color} attach="material" wireframe side={DoubleSide} />
    </mesh>
  );
};

const ProjectivePlaneSurface = ({ color }: TorusSurfaceProps) => {
  const geometry = useParametricSurfaceGeometry(64, 96, (uRatio, vRatio) => {
    const scale = 2.1;
    const u = uRatio * Math.PI;
    const v = vRatio * Math.PI * 2;
    const sinU = Math.sin(u);

    return [
      Math.sin(2 * u) * sinU * Math.cos(v) * scale,
      sinU * Math.sin(2 * v) * scale,
      Math.cos(u) * Math.sin(2 * v) * scale,
    ];
  });

  return (
    <mesh geometry={geometry}>
      <MeshStandardMaterial color={color} attach="material" wireframe side={DoubleSide} />
    </mesh>
  );
};

interface CurvedSpaceSurfaceProps {
  color: string;
  spaceShape: SpaceShape;
}

export const CurvedSpaceSurface = ({ color, spaceShape }: CurvedSpaceSurfaceProps) => {
  if (spaceShape === 'torus') {
    return <TorusSurface color={color} />;
  }

  if (spaceShape === 'horizontal-cylinder') {
    return <HorizontalCylinderSurface color={color} />;
  }

  if (spaceShape === 'vertical-cylinder') {
    return <VerticalCylinderSurface color={color} />;
  }

  if (spaceShape === 'mobius-strip') {
    return <MobiusSurface color={color} />;
  }

  if (spaceShape === 'klein-bottle') {
    return <KleinBottleSurface color={color} />;
  }

  if (spaceShape === 'projective-plane') {
    return <ProjectivePlaneSurface color={color} />;
  }

  return null;
};

interface GroupProps {
  children: React.ReactNode;
  position?: [number, number, number];
}
export const Group = ({ children, position }: GroupProps) => (
  <group position={position}>{children}</group>
);

interface CameraHelperProps {
  args: [camera: Camera];
}

export const CameraHelper3JS = ({ args }: CameraHelperProps) => <cameraHelper args={args} />;
