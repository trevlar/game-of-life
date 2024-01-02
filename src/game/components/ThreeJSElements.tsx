// eslint-disable react/no-unknown-property
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
// eslint-enable react/no-unknown-property
