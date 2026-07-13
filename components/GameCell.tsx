import { Box } from '@react-three/drei';

import { SpaceShape } from '../types/types';

import { MeshStandardMaterial } from './ThreeJSElements';

interface GameCell {
  col: number;
  rowIndex: number;
  boardSize: number;
  spaceShape: SpaceShape;
  handleMouseClick: (col: number, row: number) => void;
  handleMouseDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  setIsLiving: (col: number, row: number) => void;
  livingCells: boolean[][];
  shouldToggleLiving: (col: number, row: number) => void;
  liveCellColor: string;
  deadCellColor: string;
  isEditMode: boolean;
}

const getFlatCellTransform = (rowIndex: number, col: number, boardSize: number) => ({
  position: [
    (col - boardSize / 2) * 0.2 + col * 0.05,
    -1.5 * (rowIndex - boardSize / 2) * 0.2 + rowIndex * 0.05,
    0,
  ] as [number, number, number],
  args: [0.18, 0.18, 0.02] as [number, number, number],
});

const getTorusCellTransform = (rowIndex: number, col: number, boardSize: number) => {
  const majorRadius = 2.35;
  const minorRadius = 1.05;
  const cellSize = Math.max(0.025, Math.min(0.07, 2.65 / boardSize));
  const u = ((col + 0.5) / boardSize) * Math.PI * 2;
  const v = ((rowIndex + 0.5) / boardSize) * Math.PI * 2;
  const surfaceOffset = cellSize * 1.15;
  const radialOffset = majorRadius + (minorRadius + surfaceOffset) * Math.cos(v);

  return {
    position: [
      radialOffset * Math.cos(u),
      radialOffset * Math.sin(u),
      (minorRadius + surfaceOffset) * Math.sin(v),
    ] as [number, number, number],
    args: [cellSize, cellSize, cellSize] as [number, number, number],
  };
};

const getCellTransform = (
  rowIndex: number,
  col: number,
  boardSize: number,
  spaceShape: SpaceShape
) => {
  if (spaceShape === 'torus') {
    return getTorusCellTransform(rowIndex, col, boardSize);
  }

  return getFlatCellTransform(rowIndex, col, boardSize);
};

function GameCell({
  col,
  rowIndex,
  boardSize,
  spaceShape,
  handleMouseClick,
  handleMouseDown,
  setIsLiving,
  livingCells,
  shouldToggleLiving,
  liveCellColor,
  deadCellColor,
  isEditMode,
}) {
  const { position, args } = getCellTransform(rowIndex, col, boardSize, spaceShape);
  const isLiving = Boolean(livingCells.length && livingCells[rowIndex]?.[col]);
  const cellName = isLiving ? `cell-${col}-${rowIndex}-live` : `cell-${col}-${rowIndex}-dead`;
  const color = isLiving ? liveCellColor : deadCellColor;
  const handleClick = (e) => {
    e.stopPropagation();
    handleMouseClick(col, rowIndex);
  };
  const handlePointerDown = (e) => {
    e.stopPropagation();
    handleMouseDown(e);
    if (isEditMode) {
      setIsLiving(col, rowIndex);
    }
  };
  const handlePointerOver = (e) => {
    e.stopPropagation();
    shouldToggleLiving(col, rowIndex);
  };
  const handlePointerLeave = (e) => {
    e.stopPropagation();
  };

  if (spaceShape === 'torus') {
    return (
      <mesh
        position={position}
        onClick={handleClick}
        onPointerDown={handlePointerDown}
        onPointerOver={handlePointerOver}
        onPointerLeave={handlePointerLeave}
        name={cellName}
      >
        <sphereGeometry args={[args[0], 12, 12]} />
        <MeshStandardMaterial color={color} attach="material" />
      </mesh>
    );
  }

  return (
    <Box
      key={`bc${col}${rowIndex}`}
      position={position}
      args={args}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerOver={handlePointerOver}
      onPointerLeave={handlePointerLeave}
      name={cellName}
    >
      <MeshStandardMaterial color={color} attach="material" />
    </Box>
  );
}

export default GameCell;
