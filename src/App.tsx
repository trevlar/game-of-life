import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';
import {
  ActionIcon,
  AppShell,
  Center,
  Group,
  Menu,
  Stack,
  Switch,
  Text,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import {
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconSettings,
  IconPlus,
  IconMinus,
} from '@tabler/icons-react';
import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from './app/hooks';
import GameBoard from './game/components/GameBoard';
import GameControls from './game/components/GameControls';
import GameSettings from './game/components/GameSettings';
import { togglePlay, nextGeneration, setZoomLevel } from './game/gameSlice';

const gameSpeeds = {
  slow: 200,
  normal: 100,
  fast: 50,
};

function App() {
  const dispatch = useAppDispatch();
  const { gameSpeed, generations, isPlaying, livingCellCount, zoomLevel } = useAppSelector(
    (state) => state.game
  );

  const interval = useInterval(() => {
    try {
      dispatch(nextGeneration());
    } catch (error) {
      dispatch(togglePlay());
      console.error('error while running mutation', error);
    }
  }, gameSpeeds[gameSpeed]);

  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (viewport?.current?.scrollTo) {
      viewport?.current?.scrollTo({ top: viewport.current.scrollHeight / 2, behavior: 'smooth' });
    }
  }, [viewport]);

  const theme = useMantineTheme();

  useEffect(() => {
    if (isPlaying) {
      interval.start();
    } else {
      interval.stop();
    }
    return interval.stop;
  }, [isPlaying, interval]);

  return (
    <AppShell
      className="App"
      style={{ overflow: 'hidden' }}
      header={{ height: 60, collapsed: false, offset: true }}
      pt="0"
      footer={{ height: 100, collapsed: false, offset: false }}
    >
      <AppShell.Header w="100vw" style={{ position: 'relative' }}>
        <Group w="100%" h="100%" px="md" style={{ flexWrap: 'nowrap' }}>
          <Group justify="space-between" style={{ flex: 1, flexWrap: 'nowrap' }}>
            <Text visibleFrom="xs">Conways Game of Life</Text>
            <Group
              gap="md"
              justify="center"
              align="center"
              p="0"
              visibleFrom="sm"
              style={{ flexWrap: 'nowrap' }}
            >
              <GameControls />
            </Group>
            <Group gap="md" style={{ flexWrap: 'nowrap' }}>
              <Switch
                w={rem(120)}
                checked={isPlaying}
                onChange={() => dispatch(togglePlay())}
                color={theme.colors.blue[6]}
                size="md"
                label={isPlaying ? 'Playing' : 'Stopped'}
                onLabel="Stop"
                offLabel="Play"
                thumbIcon={
                  isPlaying ? (
                    <IconPlayerPlayFilled
                      style={{ width: rem(16), height: rem(16), color: theme.colors.blue[6] }}
                      stroke={3}
                    />
                  ) : (
                    <IconPlayerStopFilled
                      style={{ width: rem(12), height: rem(12), color: theme.colors.gray[6] }}
                      stroke={3}
                    />
                  )
                }
              />
              <Menu offset={12}>
                <Menu.Target aria-label="settings" role="button">
                  <IconSettings style={{ width: rem(35), height: rem(35) }} />
                </Menu.Target>

                <Menu.Dropdown>
                  <GameSettings />
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Main pt="md" m="0" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <Center>
          <Group>
            <Text size="xl" weight={700} align="center">
              {generations} Generations
            </Text>
            <Text size="xl" weight={700} align="center">
              {livingCellCount} Living Cells
            </Text>
            <ActionIcon
              variant="outline"
              color="blue"
              radius="xl"
              onClick={() => dispatch(setZoomLevel({ zoomLevel: zoomLevel - 0.5 }))}
            >
              <IconPlus />
            </ActionIcon>
            <ActionIcon
              variant="outline"
              color="blue"
              radius="xl"
              onClick={() => dispatch(setZoomLevel({ zoomLevel: zoomLevel + 0.5 }))}
            >
              <IconMinus />
            </ActionIcon>
          </Group>
        </Center>
        <GameBoard />
      </AppShell.Main>

      <AppShell.Footer hiddenFrom="sm" withBorder>
        <Stack gap="md" justify="center" align="center" p="0">
          <GameControls />
        </Stack>
      </AppShell.Footer>
    </AppShell>
  );
}

export default App;
