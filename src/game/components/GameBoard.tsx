import { Box, Preload, ScrollControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../app/hooks';
import { setBoardAtLocation, setZoomLevel } from '../gameSlice';

import { Camera } from './Camera';
import { AmbientLight, DirectionalLight, MeshStandardMaterial } from './ThreeJSElements';

function GameBoard() {
  const dispatch = useDispatch();
  const { boardSize, livingCells, liveCellColor, deadCellColor, backgroundColor, zoomLevel } =
    useAppSelector((state) => state.game);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isMouseOverCanvas, setIsMouseOverCanvas] = useState(false);
  const [cursorStyle, setCursorStyle] = useState({});
  const [targetZoom, setTargetZoom] = useState(zoomLevel);

  const board = useMemo(() => {
    return Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => false));
  }, [boardSize]);

  useEffect(() => {
    setTargetZoom(zoomLevel);
  }, [zoomLevel, setTargetZoom]);

  const setIsLiving = (col: number, row: number) => {
    dispatch(setBoardAtLocation({ cell: { row, col } }));
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const newZoomLevel = Math.max(1, zoomLevel + event.deltaY * 0.01);
    setTargetZoom(newZoomLevel);
    dispatch(setZoomLevel({ zoomLevel: newZoomLevel }));
  };

  const handleMouseDown = (col: number, row: number) => {
    setIsMouseDown(true);
    setIsLiving(col, row);
    setCursorStyle({ cursor: 'default' });
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
    setCursorStyle({});
  };

  const shouldToggleLiving = (col: number, row: number) => {
    if (isMouseDown) {
      setIsLiving(col, row);
    }
  };

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 100 }}
      style={{
        ...cursorStyle,
        border: '1px solid black',
        width: `100%`,
        height: `calc(100vh - 109px)`,
        backgroundColor: backgroundColor,
      }}
      onWheel={(event) => {
        const e = event || window.event;
        if (e.preventDefault) {
          e.preventDefault();
        }
        if (isMouseOverCanvas) {
          handleWheel(event);
        }
      }}
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
    >
      <Suspense fallback={null}>
        <Preload all />
        <Camera targetZoom={targetZoom} />
        <AmbientLight intensity={0.5} />
        <DirectionalLight position={[0, 0, 5]} intensity={1} />
        <ScrollControls>
          {board.map((row, rowIndex) =>
            row.map((_, col) => (
              <Box
                key={`board-cell-${col}-${rowIndex}`}
                position={[
                  (col - boardSize / 2) * 0.2 + col * 0.05,
                  (rowIndex - boardSize / 2) * 0.2 + rowIndex * 0.05,
                  0,
                ]}
                args={[0.18, 0.18, 0.18]}
                onPointerDown={() => handleMouseDown(col, rowIndex)}
                onPointerEnter={() => shouldToggleLiving(col, rowIndex)}
                name={
                  livingCells.length && livingCells.includes(`${col},${rowIndex}`)
                    ? `cell-${col}-${rowIndex}-live`
                    : `cell-${col}-${rowIndex}-dead`
                }
              >
                <MeshStandardMaterial
                  color={
                    livingCells.length && livingCells.includes(`${col},${rowIndex}`)
                      ? liveCellColor
                      : deadCellColor
                  }
                  attach="material"
                />
              </Box>
            ))
          )}
        </ScrollControls>
      </Suspense>
    </Canvas>
  );
}

export default GameBoard;
