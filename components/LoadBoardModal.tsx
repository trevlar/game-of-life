import { Modal, Button, Group, Accordion, Stack, Text } from '@mantine/core';
import { useFocusTrap } from '@mantine/hooks';
import { IconCircleCheckFilled, IconDownload } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { loadBoards, selectBoard } from '../store/game/gameApiActions';
import { AppDispatch, RootState } from '../store/store';

interface LoadBoardModalProps {
  showModal: boolean;
  onClose: () => void;
}

const LoadBoardModal: FC<LoadBoardModalProps> = ({ showModal, onClose }) => {
  const focusTrapRef = useFocusTrap(showModal);
  const [selectedBoardId, setSelectedBoardId] = useState<string | number | null>(null);

  const dispatch: AppDispatch = useDispatch();
  const { boardList } = useSelector((state: RootState) => state.game);
  useEffect(() => {
    if (showModal) {
      dispatch(loadBoards());
    }
  }, [showModal, dispatch]);

  const handleSelectBoard = () => {
    if (selectedBoardId) {
      dispatch(selectBoard(selectedBoardId));
    }
    onClose();
  };

  return (
    <Modal opened={showModal} onClose={onClose} title="Load Board Configuration" ref={focusTrapRef}>
      <Accordion variant="contained" radius="md" defaultValue={String(boardList?.[0]?.id || '')}>
        {boardList.map((board) => (
          <Accordion.Item key={board.id} value={String(board.id)}>
            <Accordion.Control
              icon={
                selectedBoardId === board.id ? (
                  <IconCircleCheckFilled style={{ color: 'green' }} />
                ) : null
              }
            >
              {board.title}
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                {board.description && <Text>{board.description}</Text>}
                <Button
                  onClick={() => setSelectedBoardId(board.id)}
                  variant="outline"
                  disabled={selectedBoardId === board.id}
                >
                  {selectedBoardId === board.id ? 'Selected' : 'Select'}
                </Button>
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <Group justify="flex-end" mt="lg">
        <Button onClick={onClose} variant="transparent">
          Cancel
        </Button>
        <Button
          onClick={handleSelectBoard}
          disabled={!selectedBoardId}
          variant="gradient"
          leftSection={<IconDownload />}
        >
          Load Selection
        </Button>
      </Group>
    </Modal>
  );
};

export default LoadBoardModal;
