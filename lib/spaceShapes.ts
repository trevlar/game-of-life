import { SpaceShape } from '../types/types';

export const spaceShapeOptions: Array<{ value: SpaceShape; label: string }> = [
  { value: 'flat', label: 'Flat' },
  { value: 'torus', label: 'Torus' },
  { value: 'horizontal-cylinder', label: 'Cylinder' },
  { value: 'vertical-cylinder', label: 'Vertical Cylinder' },
  { value: 'mobius-strip', label: 'Mobius Strip' },
  { value: 'klein-bottle', label: 'Klein Bottle' },
  { value: 'projective-plane', label: 'Projective Plane' },
];

export const isFixedTopologyShape = (spaceShape: SpaceShape) => spaceShape !== 'flat';

export const getSpaceShapeLabel = (spaceShape: SpaceShape) => {
  return spaceShapeOptions.find(({ value }) => value === spaceShape)?.label || 'Flat';
};
