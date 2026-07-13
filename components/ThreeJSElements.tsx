import { Camera } from '@react-three/fiber';

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
}
export const MeshStandardMaterial = ({ color, attach }: MeshStandardMaterialProps) => (
  <meshStandardMaterial color={color} attach={attach} />
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
