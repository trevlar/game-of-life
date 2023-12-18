import { Center, SegmentedControl, rem, Stack, NumberInput } from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconPlayerTrackNextFilled,
} from '@tabler/icons-react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../app/hooks';
import { setGameSpeed, setBoardSize } from '../gameSlice';

const SPEEDS = [
  {
    value: 'slow',
    label: (
      <Center style={{ gap: 10 }}>
        <IconPlayerPlay style={{ width: rem(16), height: rem(16) }} />
        <span>Slow</span>
      </Center>
    ),
  },
  {
    value: 'normal',
    label: (
      <Center style={{ gap: 10 }}>
        <IconPlayerPlayFilled style={{ width: rem(16), height: rem(16) }} />
        <span>Normal</span>
      </Center>
    ),
  },
  {
    value: 'fast',
    label: (
      <Center style={{ gap: 10 }}>
        <IconPlayerTrackNextFilled style={{ width: rem(16), height: rem(16) }} />
        <span>Fast</span>
      </Center>
    ),
  },
];

const GameSettings = () => {
  const dispatch = useDispatch();
  const { gameSpeed, boardSize } = useAppSelector((state) => state.game);
  const handleSpeedChange = (value: string) => {
    dispatch(setGameSpeed({ gameSpeed: value }));
  };

  const handleSizeChange = (val: number) => {
    dispatch(setBoardSize({ boardSize: val }));
  };

  return (
    <Stack p="sm">
      <NumberInput
        label="Board Size"
        value={boardSize}
        onChange={handleSizeChange}
        min={9}
        max={250}
        step={1}
      />
      <SegmentedControl value={gameSpeed} onChange={handleSpeedChange} data={SPEEDS} />
    </Stack>
  );
};

export default GameSettings;
