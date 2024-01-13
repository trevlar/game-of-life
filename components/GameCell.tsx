import { Box } from '@react-three/drei';
import { MeshStandardMaterial } from './ThreeJSElements';
import { useState } from 'react';

interface GameCell {
  col: number;
  rowIndex: number;
  boardSize: number;
  handleMouseClick: (col: number, row: number) => void;
  handleMouseDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  livingCells: boolean[][];
  shouldToggleLiving: (col: number, row: number) => void;
  liveCellColor: string;
  deadCellColor: string;
  isEditMode: boolean;
}

function GameCell({
  col,
  rowIndex,
  boardSize,
  handleMouseClick,
  handleMouseDown,
  livingCells,
  shouldToggleLiving,
  liveCellColor,
  deadCellColor,
  isEditMode,
}) {
  const [hovered, setHovered] = useState(false);
  const showTransparency = isEditMode && hovered;

  return (
    <Box
      key={`bc${col}${rowIndex}`}
      position={[
        (col - boardSize / 2) * 0.2 + col * 0.05,
        -1.5 * (rowIndex - boardSize / 2) * 0.2 + rowIndex * 0.05,
        0,
      ]}
      args={[0.18, 0.18, 0.02]}
      onClick={(e) => {
        e.stopPropagation();
        handleMouseClick(col, rowIndex);
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        handleMouseDown(e);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        shouldToggleLiving(col, rowIndex);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHovered(false);
      }}
      name={
        livingCells.length && livingCells[col]?.[rowIndex]
          ? `cell-${col}-${rowIndex}-live`
          : `cell-${col}-${rowIndex}-dead`
      }
    >
      <MeshStandardMaterial
        color={livingCells.length && livingCells[col]?.[rowIndex] ? liveCellColor : deadCellColor}
        opacity={showTransparency ? 0.8 : 1}
        transparent
        attach="material"
      />
    </Box>
  );
}

export default GameCell;
