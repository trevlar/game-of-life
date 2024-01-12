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

  const handleZoomButtonClick = useCallback(
    (zoomBy: number) => {
      const newZoomLevel = getZoomLevel(zoomLevel, zoomBy);

      dispatch(setZoomLevel({ zoomLevel: newZoomLevel }));
    },
    [dispatch, zoomLevel]
  );

  const handleEditGrid = useCallback(
    () => dispatch(setBoardMouseAction({ action: 'draw' })),
    [dispatch]
  );

  const handleEraseGrid = useCallback(
    () => dispatch(setBoardMouseAction({ action: 'erase' })),
    [dispatch]
  );

  const handleMoveGrid = useCallback(
    () => dispatch(setBoardMouseAction({ action: 'move' })),
    [dispatch]
  );

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
            <Text size="xl" weight={700} align="center">
              {generations} Generations
            </Text>
            <Text size="xl" weight={700} align="center">
              {livingCellCount} Living Cells
            </Text>
          </Group>
        </Container>
        <GameBoard />
      </AppShell.Main>

      <AppShell.Footer withBorder>
        <Container p="md">
          <Group justify="space-between">
            <ButtonGroup>
              <Button
                variant="outline"
                leftSection={<IconDeviceFloppy />}
                onClick={() => handleShowSaveModal()}
                disabled={!isSaveEnabled}
              >
                Save
              </Button>
              <Menu disabled={!isSaveEnabled}>
                <Menu.Target>
                  <Button variant="outline" disabled={!isSaveEnabled}>
                    <IconCaretDown />
                  </Button>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Item onClick={() => handleShowSaveModal(true)}>Save As</Menu.Item>
                </Menu.Dropdown>
              </Menu>
              <Button
                variant="outline"
                leftSection={<IconDownload />}
                onClick={() => setShowLoadModal(true)}
                disabled={!isSaveEnabled}
              >
                Load
              </Button>
            </ButtonGroup>
            <Group justify="flex-end">
              <Group>
                <ActionIcon
                  variant={boardMouseAction === 'move' ? 'filled' : 'light'}
                  color="blue"
                  radius="xl"
                  onClick={() => handleMoveGrid()}
                >
                  <IconHandMove />
                </ActionIcon>
                <ActionIcon
                  variant={boardMouseAction === 'draw' ? 'filled' : 'light'}
                  color="blue"
                  radius="xl"
                  onClick={() => handleEditGrid()}
                >
                  <IconPencil />
                </ActionIcon>
                <ActionIcon
                  variant={boardMouseAction === 'erase' ? 'filled' : 'light'}
                  color="blue"
                  radius="xl"
                  onClick={() => handleEraseGrid()}
                >
                  <IconEraser />
                </ActionIcon>
              </Group>

              <Group justify="flex-end">
                <ActionIcon
                  variant="outline"
                  color="blue"
                  radius="xl"
                  onClick={() => handleZoomButtonClick(0.5)}
                >
                  <IconMinus />
                </ActionIcon>
                <ActionIcon
                  variant="outline"
                  color="blue"
                  radius="xl"
                  onClick={() => handleZoomButtonClick(-0.5)}
                >
                  <IconPlus />
                </ActionIcon>
              </Group>
            </Group>
          </Group>
        </Container>
      </AppShell.Footer>
    </AppShell>
  );
}

export default Home;
