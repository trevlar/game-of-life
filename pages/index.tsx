import {
  ActionIcon,
  AppShell,
  Container,
  Group,
  Menu,
  ScrollArea,
  Switch,
  Text,
  Tooltip,
  rem,
  useComputedColorScheme,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useInterval } from '@mantine/hooks';
import {
  IconMoon,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconSettings,
  IconSun,
} from '@tabler/icons-react';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

import GameControls from '../components/GameControls';
import GameEditor from '../components/GameEditor';
import GameSettings from '../components/GameSettings';
import { checkApiConnection } from '../store/game/gameApiActions';
import { togglePlay, nextGeneration } from '../store/game/gameSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

const gameSpeeds = {
  slow: 200,
  normal: 100,
  fast: 50,
};

const GameBoard = dynamic(() => import('../components/GameBoard'), { ssr: false });

function Home() {
  const dispatch = useAppDispatch();
  const { gameSpeed, generations, isPlaying, livingCellCount } = useAppSelector(
    (state) => state.game
  );

  useEffect(() => {
    dispatch(checkApiConnection());
  }, [dispatch]);

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
  const { setColorScheme } = useMantineColorScheme();
  const [isMounted, setIsMounted] = useState(false);
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  const renderedColorScheme = isMounted ? computedColorScheme : 'light';
  const nextColorScheme = renderedColorScheme === 'dark' ? 'light' : 'dark';

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      footer={{ height: 60, collapsed: false, offset: false }}
    >
      <AppShell.Header w="100vw" style={{ position: 'relative' }}>
        <Container py="md">
          <Group w="100%" h="100%" px="md" style={{ flexWrap: 'nowrap' }}>
            <Group justify="space-between" style={{ flex: 1, flexWrap: 'nowrap' }}>
              <Text>Conways Game of Life</Text>

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
                <Tooltip label={`Switch to ${nextColorScheme} mode`}>
                  <ActionIcon
                    aria-label={`Switch to ${nextColorScheme} mode`}
                    variant="subtle"
                    size="lg"
                    onClick={() => setColorScheme(nextColorScheme)}
                  >
                    {renderedColorScheme === 'dark' ? <IconSun /> : <IconMoon />}
                  </ActionIcon>
                </Tooltip>
                <Menu offset={12} position="bottom-end" withinPortal>
                  <Menu.Target aria-label="settings">
                    <IconSettings style={{ width: rem(35), height: rem(35) }} />
                  </Menu.Target>

                  <Menu.Dropdown>
                    <ScrollArea.Autosize mah="calc(100vh - 96px)" type="always">
                      <GameSettings />
                    </ScrollArea.Autosize>
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main pt="md" m="0" style={{ minHeight: 'calc(100vh - 60px)' }}>
        <Container>
          <Group
            gap="md"
            justify="center"
            align="center"
            p="sm"
            visibleFrom="sm"
            style={{ flexWrap: 'nowrap' }}
          >
            <GameControls />
            <Group style={{ flexWrap: 'nowrap' }}>
              <Text size="xl">{generations} Generations</Text>
              <Text size="xl">{livingCellCount} Living Cells</Text>
            </Group>
          </Group>
        </Container>
        <GameBoard />
      </AppShell.Main>

      <AppShell.Footer withBorder>
        <Container p="md">
          <GameEditor />
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}

export default Home;
