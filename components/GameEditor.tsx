import { ActionIcon, Group, Button, ButtonGroup, Menu, Badge } from '@mantine/core';
import {
  IconPlus,
  IconMinus,
  IconPencil,
  IconEraser,
  IconHandMove,
  IconDeviceFloppy,
  IconCaretDown,
  IconDownload,
} from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { checkApiConnection } from '../store/game/gameApiActions';
import { resetSaveData, setBoardMouseAction, setZoomLevel } from '../store/game/gameSlice';

import LoadBoardModal from './LoadBoardModal';
import SaveBoardModal from './SaveBoardModal';
import { useAppSelector } from '../store/hooks';
import { getZoomLevel } from './Camera';

function calculateZoomPercentage(zoomLevel: number) {
  const percentage = (1 - (zoomLevel - 5) / 15) * 100;

  return Math.floor(Math.max(5, Math.min(percentage, 200)));
}

function GameEditor() {
  const { isSaveEnabled, boardMouseAction, zoomLevel } = useAppSelector((state) => state.game);
  const dispatch = useDispatch();
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);

  useEffect(() => {
    dispatch(checkApiConnection());
  }, [dispatch]);

  const handleShowSaveModal = (isNew = false) => {
    setShowSaveModal(true);
    if (isNew) {
      dispatch(resetSaveData());
    }
  };

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
    <div>
      <Group justify="space-between">
        <ButtonGroup>
          {process.env.NODE_ENV === 'development' && (
            <>
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
            </>
          )}

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
            <Badge color="blue" variant="outline">
              Zoom {calculateZoomPercentage(zoomLevel)}%
            </Badge>
          </Group>
        </Group>
      </Group>
      <SaveBoardModal showModal={showSaveModal} onClose={() => setShowSaveModal(false)} />
      <LoadBoardModal showModal={showLoadModal} onClose={() => setShowLoadModal(false)} />
    </div>
  );
}

export default GameEditor;
