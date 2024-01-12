import { Box, Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../../components/app/hooks';
import { setBoardAtLocation, setZoomLevel } from '../gameSlice';

import { Camera, getMaxZoomLevel, getZoomLevel } from './Camera';
import { AmbientLight, DirectionalLight, MeshStandardMaterial } from './ThreeJSElements';
import { ActionIcon, Center, Group, Text } from '@mantine/core';
import { IconMinus, IconPlus } from '@tabler/icons-react';

const gameBoardMouseCursor = {
  move: ['grab', 'grabbing'],
  draw: 'crosshair',
  erase: 'crosshair',
};

const getCursor = (boardMouseAction, isDragging) => {
  if (boardMouseAction === 'move') {
    console.log(boardMouseAction, gameBoardMouseCursor[boardMouseAction], isDragging);
    return gameBoardMouseCursor[boardMouseAction][isDragging ? 1 : 0];
  }

  return gameBoardMouseCursor[boardMouseAction];
};

function GameBoard() {
  const dispatch = useDispatch();
  const {
    boardMouseAction,
    generations,
    livingCellCount,
    boardSize,
    livingCells,
    liveCellColor,
    deadCellColor,
    backgroundColor,
    zoomLevel,
  } = useAppSelector((state) => state.game);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isMouseOverCanvas, setIsMouseOverCanvas] = useState(false);
  const [cameraPosition, setCameraPosition] = useState<number[]>([0, 0, 5]);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const board = useMemo(() => {
    return Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => false));
  }, [boardSize]);

  const setIsLiving = (col: number, row: number) => {
    dispatch(setBoardAtLocation({ cell: { row, col } }));
  };

  const handleWheel = (event) => {
    if (isMouseOverCanvas) {
      let zoomChange = event.deltaY * -0.005;
      if (zoomLevel < 1) {
        zoomChange *= 5;
      }

      let newZoomLevel = zoomLevel + zoomChange;
      newZoomLevel = getMaxZoomLevel(newZoomLevel);

      dispatch(setZoomLevel({ zoomLevel: newZoomLevel }));
    }
  };

  const handleMouseDown = useCallback((e) => {
    setIsDragging(true);
    if (boardMouseAction === 'move') {
      lastMousePosition.current = { x: e.clientX, y: e.clientY };
    }
  }, []);

  const handleMouseClick = (col: number, row: number) => {
    setIsDragging(false);
    setIsLiving(col, row);
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  const shouldToggleLiving = (col: number, row: number) => {
    if (isDragging) {
      setIsLiving(col, row);
    }
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (boardMouseAction === 'move' && isDragging) {
        const dx = e.clientX - lastMousePosition.current.x;
        const dy = e.clientY - lastMousePosition.current.y;
        lastMousePosition.current = { x: e.clientX, y: e.clientY };

        setCameraPosition((prev) => {
          console.log('setting');
          prev[0] -= dx * 0.01;
          prev[1] += dy * 0.01;

          return prev;
        });
      }
    },
    [isDragging]
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 100 }}
      style={{
        cursor: getCursor(boardMouseAction, isDragging),
        border: '1px solid black',
        width: `100%`,
        height: `calc(100vh - 109px)`,
        backgroundColor: backgroundColor,
      }}
      ref={canvasRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => {
        e.preventDefault();
        handleMouseUpOrLeave();
        setIsMouseOverCanvas(false);
      }}
      onMouseEnter={(e) => {
        e.preventDefault();
        setIsMouseOverCanvas(true);
      }}
      onMouseUp={handleMouseUpOrLeave}
      aria-label="game board"
    >
      <Suspense fallback={null}>
        <Preload all />
        <Camera targetZoom={zoomLevel} targetPosition={cameraPosition} />
        <AmbientLight intensity={0.5} />
        <DirectionalLight position={[0, 0, 5]} intensity={1} />
        {board.map((row, rowIndex) =>
          row.map((_, col) => (
            <Box
              key={`bc${col}${rowIndex}`}
              position={[
                (col - boardSize / 2) * 0.2 + col * 0.05,
                (rowIndex - boardSize / 2) * 0.2 + rowIndex * 0.05,
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
                shouldToggleLiving(col, rowIndex);
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                handleMouseUpOrLeave();
              }}
              name={
                livingCells.length && livingCells[col]?.[rowIndex]
                  ? `cell-${col}-${rowIndex}-live`
                  : `cell-${col}-${rowIndex}-dead`
              }
            >
              <MeshStandardMaterial
                color={
                  livingCells.length && livingCells[col]?.[rowIndex] ? liveCellColor : deadCellColor
                }
                attach="material"
              />
            </Box>
          ))
        )}
      </Suspense>
    </Canvas>
  );
}

export default GameBoard;
