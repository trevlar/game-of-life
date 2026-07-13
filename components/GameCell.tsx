import { Box } from '@react-three/drei';

import { isCurvedSpaceShape } from '../lib/spaceShapes';
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

const getCurvedCellSize = (boardSize: number) => {
  return Math.max(0.025, Math.min(0.07, 2.65 / boardSize));
};

const getTorusCellTransform = (rowIndex: number, col: number, boardSize: number) => {
  const majorRadius = 2.35;
  const minorRadius = 1.05;
  const cellSize = getCurvedCellSize(boardSize);
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

const getHorizontalCylinderCellTransform = (rowIndex: number, col: number, boardSize: number) => {
  const radius = 1.55;
  const height = 4.4;
  const cellSize = getCurvedCellSize(boardSize);
  const u = ((col + 0.5) / boardSize) * Math.PI * 2;
  const y = (0.5 - (rowIndex + 0.5) / boardSize) * height;
  const surfaceOffset = cellSize * 1.2;

  return {
    position: [
      (radius + surfaceOffset) * Math.cos(u),
      y,
      (radius + surfaceOffset) * Math.sin(u),
    ] as [number, number, number],
    args: [cellSize, cellSize, cellSize] as [number, number, number],
  };
};

const getVerticalCylinderCellTransform = (rowIndex: number, col: number, boardSize: number) => {
  const radius = 1.4;
  const width = 4.8;
  const cellSize = getCurvedCellSize(boardSize);
  const v = ((rowIndex + 0.5) / boardSize) * Math.PI * 2;
  const x = ((col + 0.5) / boardSize - 0.5) * width;
  const surfaceOffset = cellSize * 1.2;

  return {
    position: [
      x,
      (radius + surfaceOffset) * Math.cos(v),
      (radius + surfaceOffset) * Math.sin(v),
    ] as [number, number, number],
    args: [cellSize, cellSize, cellSize] as [number, number, number],
  };
};

const getMobiusCellTransform = (rowIndex: number, col: number, boardSize: number) => {
  const majorRadius = 2.15;
  const stripWidth = 1.25;
  const cellSize = getCurvedCellSize(boardSize);
  const u = ((col + 0.5) / boardSize) * Math.PI * 2;
  const v = ((rowIndex + 0.5) / boardSize - 0.5) * stripWidth;
  const surfaceOffset = cellSize * 1.2;
  const twistedWidth = v + surfaceOffset;
  const radialOffset = majorRadius + twistedWidth * Math.cos(u / 2);

  return {
    position: [
      radialOffset * Math.cos(u),
      radialOffset * Math.sin(u),
      twistedWidth * Math.sin(u / 2),
    ] as [number, number, number],
    args: [cellSize, cellSize, cellSize] as [number, number, number],
  };
};

const getKleinBottleCellTransform = (rowIndex: number, col: number, boardSize: number) => {
  const cellSize = getCurvedCellSize(boardSize);
  const scale = 0.85;
  const u = ((col + 0.5) / boardSize) * Math.PI * 2;
  const v = ((rowIndex + 0.5) / boardSize) * Math.PI * 2;
  const tube = Math.cos(u / 2) * Math.sin(v) - Math.sin(u / 2) * Math.sin(2 * v) + cellSize * 1.2;
  const radialOffset = 2.1 + tube;

  return {
    position: [
      radialOffset * Math.cos(u) * scale,
      radialOffset * Math.sin(u) * scale,
      (Math.sin(u / 2) * Math.sin(v) + Math.cos(u / 2) * Math.sin(2 * v)) * scale,
    ] as [number, number, number],
    args: [cellSize, cellSize, cellSize] as [number, number, number],
  };
};

const getProjectivePlaneCellTransform = (rowIndex: number, col: number, boardSize: number) => {
  const cellSize = getCurvedCellSize(boardSize);
  const scale = 2.1;
  const u = ((rowIndex + 0.5) / boardSize) * Math.PI;
  const v = ((col + 0.5) / boardSize) * Math.PI * 2;
  const sinU = Math.sin(u);
  const surfaceOffset = cellSize * 1.2;

  return {
    position: [
      Math.sin(2 * u) * sinU * Math.cos(v) * scale,
      sinU * Math.sin(2 * v) * scale,
      (Math.cos(u) * Math.sin(2 * v) + surfaceOffset) * scale,
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

  if (spaceShape === 'horizontal-cylinder') {
    return getHorizontalCylinderCellTransform(rowIndex, col, boardSize);
  }

  if (spaceShape === 'vertical-cylinder') {
    return getVerticalCylinderCellTransform(rowIndex, col, boardSize);
  }

  if (spaceShape === 'mobius-strip') {
    return getMobiusCellTransform(rowIndex, col, boardSize);
  }

  if (spaceShape === 'klein-bottle') {
    return getKleinBottleCellTransform(rowIndex, col, boardSize);
  }

  if (spaceShape === 'projective-plane') {
    return getProjectivePlaneCellTransform(rowIndex, col, boardSize);
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

  if (isCurvedSpaceShape(spaceShape)) {
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
