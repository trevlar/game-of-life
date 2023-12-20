import { Modal, Button, TextInput, Card, Text, Group } from '@mantine/core';
import { useDebouncedValue, useFocusTrap } from '@mantine/hooks';
import { IconDeviceFloppy } from '@tabler/icons-react';
import { FC, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { AppDispatch, RootState } from '../../app/store';
import { saveBoard } from '../gameApiActions';
import { setTitle, setDescription } from '../gameSlice';

interface SaveBoardModalProps {
  showModal: boolean;
  onClose: () => void;
}

const SaveBoardModal: FC<SaveBoardModalProps> = ({ showModal, onClose }) => {
  const focusTrapRef = useFocusTrap(showModal);

  const dispatch: AppDispatch = useDispatch();
  const {
    title,
    description,
    generations,
    isPlaying,
    boardSize,
    gameSpeed,
    continuousEdges,
    generationsPerAdvance,
    livingCellCount,
  } = useSelector((state: RootState) => state.game);

  const [titleValue, setTitleValue] = useState(title);
  const [debouncedTitle] = useDebouncedValue(titleValue, 200);
  useEffect(() => {
    dispatch(setTitle({ title: debouncedTitle }));
  }, [dispatch, debouncedTitle]);

  const [desc, setDesc] = useState(description);
  const [debouncedDesc] = useDebouncedValue(desc, 200);
  useEffect(() => {
    dispatch(setDescription({ title: debouncedDesc }));
  }, [dispatch, debouncedDesc]);

  const handleSave = () => {
    dispatch(saveBoard());
    onClose();
  };

  return (
    <Modal opened={showModal} onClose={onClose} title="Save Board Configuration" ref={focusTrapRef}>
      <TextInput
        label="Title"
        value={titleValue}
        onChange={(event) => setTitleValue(event.currentTarget.value)}
      />
      <TextInput
        label="Description"
        value={desc}
        onChange={(event) => setDesc(event.currentTarget.value)}
      />

      <Card>
        <Text>{isPlaying ? 'Actively Playing' : 'Stopped'}</Text>
        <Text>Generations: {generations}</Text>
        <Text>Board Size: {boardSize}</Text>
        <Text>Game Speed: {gameSpeed}</Text>
        <Text>Continuous Edges: {continuousEdges ? 'Yes' : 'No'}</Text>
        <Text>Generations Per Advance: {generationsPerAdvance}</Text>
        <Text>Living Cells: {livingCellCount}</Text>
      </Card>

      <Group position="right" justify="flex-end">
        <Button onClick={onClose} variant="transparent">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="outline" leftSection={<IconDeviceFloppy />}>
          Save
        </Button>
      </Group>
    </Modal>
  );
};

export default SaveBoardModal;
