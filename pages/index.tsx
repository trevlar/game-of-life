import {
  ActionIcon,
  AppShell,
  Button,
  ButtonGroup,
  Center,
  Container,
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
  IconEdit,
  IconPencil,
  IconEraser,
  IconHandMove,
  IconDeviceFloppy,
  IconCaretDown,
  IconDownload,
} from '@tabler/icons-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useAppDispatch, useAppSelector } from '../components/app/hooks';
import { getZoomLevel } from '../components/game/components/Camera';
import GameBoard from '../components/game/components/GameBoard';
import GameControls from '../components/game/components/GameControls';
import GameSettings from '../components/game/components/GameSettings';
import {
  togglePlay,
  nextGeneration,
  setZoomLevel,
  setBoardMouseAction,
} from '../components/game/gameSlice';
import { checkApiConnection } from '../components/game/gameApiActions';
import GameEditor from '../components/game/components/GameEditor';

const gameSpeeds = {
  slow: 200,
  normal: 100,
  fast: 50,
};

function Home() {
  const dispatch = useAppDispatch();
  const {
    isSaveEnabled,
    boardMouseAction,
    gameSpeed,
    generations,
    isPlaying,
    livingCellCount,
    zoomLevel,
  } = useAppSelector((state) => state.game);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

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
                <Menu offset={12}>
                  <Menu.Target aria-label="settings">
                    <IconSettings style={{ width: rem(35), height: rem(35) }} />
                  </Menu.Target>

                  <Menu.Dropdown>
                    <GameSettings />
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
