import { Center, Group, Paper, Stack } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../app/hooks';
import { setBoardAtLocation } from '../gameSlice';

function GameBoard() {
  const dispatch = useDispatch();
  const { boardSize, livingCells } = useAppSelector((state) => state.game);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorStyle, setCursorStyle] = useState({});

  const board = useMemo(() => {
    return Array.from({ length: boardSize }, () => Array.from({ length: boardSize }, () => false));
  }, [boardSize]);

  const setIsLiving = (col: number, row: number) => {
    dispatch(setBoardAtLocation({ cell: { row, col } }));
  };

  const handleMouseDown = (e, col: number, row: number) => {
    e.preventDefault();
    setIsMouseDown(true);
    setIsLiving(col, row);
    setCursorStyle({ cursor: 'default' });
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
    setCursorStyle({});
  };

  const shouldToggleLiving = (e, col: number, row: number) => {
    e.preventDefault();
    if (isMouseDown) {
      setIsLiving(col, row);
    }
  };

  return (
    <Center>
      <Paper
        padding="0"
        shadow="md"
        radius="md"
        withBorder
        draggable={false}
        onMouseLeave={handleMouseUpOrLeave}
        onMouseUp={handleMouseUpOrLeave}
        style={{ ...cursorStyle, flexWrap: 'nowrap' }}
      >
        <Stack gap="0" draggable={false} style={{ flexWrap: 'nowrap' }}>
          {board.map((row, rowIndex) => (
            <Group
              key={`board-row-${rowIndex}`}
              gap="0"
              draggable={false}
              style={{ flexWrap: 'nowrap' }}
            >
              {row.map((_, col) => (
                <Paper
                  onMouseDown={(e) => handleMouseDown(e, col, rowIndex)}
                  onMouseEnter={(e) => shouldToggleLiving(e, col, rowIndex)}
                  style={cursorStyle}
                  key={`${rowIndex}-${col}`}
                  bg={
                    livingCells.length && livingCells.includes(`${col},${rowIndex}`)
                      ? 'black'
                      : 'white'
                  }
                  w={20}
                  h={20}
                  radius="0"
                  withBorder
                  draggable={false}
                />
              ))}
            </Group>
          ))}
        </Stack>
      </Paper>
    </Center>
  );
}

export default GameBoard;
