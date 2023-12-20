import '@mantine/core/styles/global.css';
import '@mantine/core/styles.css';
import {
  AppShell,
  Center,
  Group,
  Menu,
  ScrollArea,
  Stack,
  Switch,
  Text,
  rem,
  useMantineTheme,
} from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import { IconPlayerPlayFilled, IconPlayerStopFilled, IconSettings } from '@tabler/icons-react';
import { useEffect, useRef } from 'react';

import { useAppDispatch, useAppSelector } from './app/hooks';
import GameBoard from './game/components/GameBoard';
import GameControls from './game/components/GameControls';
import GameSettings from './game/components/GameSettings';
import { togglePlay, nextGeneration } from './game/gameSlice';

const gameSpeeds = {
  slow: 1000,
  normal: 300,
  fast: 150,
};

function App() {
  const dispatch = useAppDispatch();
  const { gameSpeed, generations, isPlaying, livingCellCount } = useAppSelector(
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
    if (viewport?.current) {
      viewport.current.scrollTo({ top: viewport.current.scrollHeight / 2, behavior: 'smooth' });
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
      header={{ height: 60 }}
      padding="md"
      footer={{ height: 100, collapsed: false, offset: false }}
    >
      <AppShell.Header w="100vw">
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
                <Menu.Target>
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

      <AppShell.Main>
        <Stack>
          <Center>
            <Group>
              <Text size="xl" weight={700} align="center">
                {generations} Generations
              </Text>
              <Text size="xl" weight={700} align="center">
                {livingCellCount} Living Cells
              </Text>
            </Group>
          </Center>
          <ScrollArea
            type="always"
            w="calc(100vw - 32px)"
            h="auto"
            scrollbarSize={20}
            viewportRef={viewport}
            pb="xl"
            px={0}
            mx={0}
          >
            <GameBoard />
          </ScrollArea>
        </Stack>
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
