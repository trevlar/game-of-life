import {
  Center,
  SegmentedControl,
  rem,
  Stack,
  NumberInput,
  Switch,
  useMantineTheme,
  Button,
  Text,
  ColorPicker,
  ColorSwatch,
  Group,
} from '@mantine/core';
import {
  IconPlayerPlay,
  IconPlayerPlayFilled,
  IconPlayerTrackNextFilled,
  IconTrashFilled,
} from '@tabler/icons-react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../../components/app/hooks';
import {
  setGameSpeed,
  setBoardSize,
  setLiveCellColor,
  setDeadCellColor,
  setBackgroundColor,
  setContinuousEdges,
  clearBoard,
  resetSaveData,
} from '../gameSlice';

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
  const theme = useMantineTheme();
  const { gameSpeed, boardSize, continuousEdges, liveCellColor, deadCellColor, backgroundColor } =
    useAppSelector((state) => state.game);

  const handleSpeedChange = (value: string) => {
    dispatch(setGameSpeed({ gameSpeed: value }));
  };

  const handleSizeChange = (val: number) => {
    dispatch(setBoardSize({ boardSize: val }));
  };

  const handleLiveCellChange = (color: string) => {
    dispatch(setLiveCellColor({ liveCellColor: color }));
  };

  const handleBackgroundColorChange = (color: string) => {
    dispatch(setBackgroundColor({ backgroundColor: color }));
  };

  const handleDeadCellChange = (color: string) => {
    dispatch(setDeadCellColor({ deadCellColor: color }));
  };

  return (
    <Stack p="sm" gap="lg">
      <Text>Game Settings</Text>
      <NumberInput
        label="Board Size"
        value={boardSize}
        onChange={handleSizeChange}
        min={9}
        max={250}
        step={1}
      />
      <SegmentedControl value={gameSpeed} onChange={handleSpeedChange} data={SPEEDS} />
      <Stack gap="xs">
        <Group>
          <Text>Live Cell Color</Text>
          <ColorSwatch color={liveCellColor} />
        </Group>
        <ColorPicker value={liveCellColor} fullWidth size="xs" onChange={handleLiveCellChange} />
      </Stack>

      <Stack gap="xs">
        <Group>
          <Text>Dead Cell Color</Text>
          <ColorSwatch color={deadCellColor} />
        </Group>
        <ColorPicker value={deadCellColor} fullWidth size="xs" onChange={handleDeadCellChange} />
      </Stack>

      <Stack gap="xs">
        <Group>
          <Text>Background Color</Text>
          <ColorSwatch color={backgroundColor} />
        </Group>
        <ColorPicker
          value={backgroundColor}
          fullWidth
          size="xs"
          onChange={handleBackgroundColorChange}
        />
      </Stack>

      <Switch
        label="Continuous Edges"
        checked={continuousEdges}
        onChange={() => dispatch(setContinuousEdges({ continuousEdges: !continuousEdges }))}
        color={theme.colors.blue[5]}
      />
      <Button
        variant="default"
        onClick={() => dispatch(clearBoard())}
        leftSection={<IconTrashFilled />}
      >
        Reset Board
      </Button>
    </Stack>
  );
};

export default GameSettings;
