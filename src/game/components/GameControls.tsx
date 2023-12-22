import { Button, ButtonGroup, Menu, Slider, Text, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconCaretDown,
  IconDeviceFloppy,
  IconDownload,
  IconPlayerPlayFilled,
  IconPlayerSkipForward,
  IconPlayerSkipForwardFilled,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../app/hooks';
import { AppDispatch } from '../../app/store';
import { checkApiConnection } from '../gameApiActions';
import { nextGeneration, setGenerationsPerAdvance, resetSaveData } from '../gameSlice';

import LoadBoardModal from './LoadBoardModal';
import SaveBoardModal from './SaveBoardModal';

const GameControls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isPlaying, generationsPerAdvance, isSaveEnabled } = useAppSelector((state) => state.game);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const handleMoveForward = () => {
    dispatch(nextGeneration());
  };
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

  const handleSetGenerationsPerAdvance = (value: number) => {
    dispatch(setGenerationsPerAdvance({ generationsPerAdvance: value }));
  };

  return (
    <>
      <Slider
        thumbChildren={<IconPlayerSkipForwardFilled color="blue" />}
        thumbSize={26}
        value={generationsPerAdvance}
        onChange={handleSetGenerationsPerAdvance}
        onChangeEnd={handleSetGenerationsPerAdvance}
        showLabelOnHover={false}
        label={null}
        max={100}
        min={1}
        w={isMobile ? '90vw' : 300}
        p="md"
      />
      <ButtonGroup>
        <Button
          variant="default"
          onClick={handleMoveForward}
          rightSection={isPlaying ? <IconPlayerPlayFilled /> : <IconPlayerSkipForward />}
          disabled={isPlaying}
        >
          <Text w={26}>{generationsPerAdvance}</Text>
          &nbsp;
          <Text>Generation</Text>
        </Button>
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
      <SaveBoardModal showModal={showSaveModal} onClose={() => setShowSaveModal(false)} />
      <LoadBoardModal showModal={showLoadModal} onClose={() => setShowLoadModal(false)} />
    </>
  );
};

export default GameControls;
