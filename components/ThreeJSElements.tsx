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
  opacity?: number;
  transparent?: boolean;
}
export const MeshStandardMaterial = ({ color, attach, ...rest }: MeshStandardMaterialProps) => (
  <meshStandardMaterial color={color} attach={attach} {...rest} />
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
