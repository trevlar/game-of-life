import { Center, Group, Paper, Stack } from '@mantine/core';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../app/hooks';
import { setBoardAtLocation } from '../gameSlice';

function GameBoard() {
  const dispatch = useDispatch();
  const { board } = useAppSelector((state) => state.game);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [cursorStyle, setCursorStyle] = useState({});

  const setIsLiving = (row: number, col: number) => {
    dispatch(setBoardAtLocation({ cell: { row, col } }));
  };

  const handleMouseDown = (e, row: number, col: number) => {
    e.preventDefault();
    setIsMouseDown(true);
    setIsLiving(row, col);
    setCursorStyle({ cursor: 'default' });
  };

  const handleMouseUpOrLeave = () => {
    setIsMouseDown(false);
    setCursorStyle({});
  };

  const shouldToggleLiving = (e, row: number, col: number) => {
    e.preventDefault();
    if (isMouseDown) {
      setIsLiving(row, col);
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
              {row.map((isLiving, col) => (
                <Paper
                  onMouseDown={(e) => handleMouseDown(e, rowIndex, col)}
                  onMouseEnter={(e) => shouldToggleLiving(e, rowIndex, col)}
                  style={cursorStyle}
                  key={`${rowIndex}-${col}`}
                  bg={isLiving ? 'black' : 'white'}
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
