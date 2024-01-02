import { Center, Paper } from '@mantine/core';
import { Box } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../app/hooks';
import { setBoardAtLocation } from '../gameSlice';

function GameBoard() {
  const dispatch = useDispatch();
  const { boardSize, livingCells, liveCellColor, deadCellColor, backgroundColor } = useAppSelector(
    (state) => state.game
  );
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorStyle, setCursorStyle] = useState({});

  const board = useMemo(() => {
    return Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => false));
  }, [boardSize]);

  const setIsLiving = (col: number, row: number) => {
    dispatch(setBoardAtLocation({ cell: { row, col } }));
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
  // eslint-disable react/no-unknown-property
  return (
    <Center w="100%">
      <Paper
        padding="0"
        shadow="md"
        radius="md"
        withBorder
        draggable={false}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        style={{ ...cursorStyle, flexWrap: 'nowrap' }}
        w="100%"
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 100 }}
          style={{
            border: '1px solid black',
            width: `100%`,
            height: `${boardSize * 23}px`,
            backgroundColor: backgroundColor,
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 5]} intensity={1} />
          {board.map((row, rowIndex) =>
            row.map((_, col) => (
              <Box
                key={`board-cell-${col}-${rowIndex}`}
                position={[
                  (col - boardSize / 2) * 0.2 + col * 0.05,
                  (rowIndex - boardSize / 2) * 0.2 + rowIndex * 0.05,
                  0,
                ]}
                args={[0.15, 0.15, 0.15]}
                onPointerDown={() => handleMouseDown(col, rowIndex)}
                onPointerEnter={() => shouldToggleLiving(col, rowIndex)}
              >
                <meshStandardMaterial
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
        </Canvas>
      </Paper>
    </Center>
  );
  // eslint-enable react/no-unknown-property
}

export default GameBoard;
