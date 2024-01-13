import { Preload } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../store/hooks';
import { setBoardAtLocation, setZoomLevel } from '../store/game/gameSlice';

import { Camera, getMaxZoomLevel } from './Camera';
import { AmbientLight, DirectionalLight } from './ThreeJSElements';
import GameCell from './GameCell';

const gameBoardMouseCursor = {
  move: ['grab', 'grabbing'],
  draw: 'crosshair',
  erase: 'crosshair',
};

const getCursor = (boardMouseAction, isDragging) => {
  if (boardMouseAction === 'move') {
    return gameBoardMouseCursor[boardMouseAction][isDragging ? 1 : 0];
  }

  return gameBoardMouseCursor[boardMouseAction];
};

function GameBoard() {
  const dispatch = useDispatch();
  const {
    boardMouseAction,
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
  const [cameraPosition, setCameraPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
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

  const handleMouseUpOrLeave = (e) => {
    lastMousePosition.current = { x: e.clientX, y: e.clientY };
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
          const updated = { ...prev };

          const newX = dx * (0.01 * zoomLevel);
          const newY = dy * (0.01 * zoomLevel);

          updated.x -= Math.max(-6, Math.min(newX, 6));
          updated.y += Math.max(-6, Math.min(newY, 6));

          return updated;
        });
      }
    },
    [isDragging, boardMouseAction]
  );

  const isEditMode = boardMouseAction === 'draw' || boardMouseAction === 'erase';

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
      onMouseUp={handleMouseUpOrLeave}
      onMouseMove={handleMouseMove}
      onMouseLeave={(e) => {
        e.preventDefault();
        handleMouseUpOrLeave(e);
        setIsMouseOverCanvas(false);
      }}
      onMouseEnter={(e) => {
        e.preventDefault();
        setIsMouseOverCanvas(true);
      }}
      aria-label="game board"
    >
      <Suspense fallback={null}>
        <Preload all />
        <Camera targetZoom={zoomLevel} targetPosition={cameraPosition} />
        <AmbientLight intensity={0.5} />
        <DirectionalLight position={[0, 0, 5]} intensity={1} />
        {board.map((row, rowIndex) =>
          row.map((_, col) => (
            <GameCell
              key={`bc${col}${rowIndex}`}
              {...{
                shouldToggleLiving,
                col,
                rowIndex,
                boardSize,
                livingCells,
                liveCellColor,
                deadCellColor,
                handleMouseClick,
                handleMouseDown,
                handleMouseUpOrLeave,
                isEditMode,
              }}
            />
          ))
        )}
      </Suspense>
    </Canvas>
  );
}

export default GameBoard;
