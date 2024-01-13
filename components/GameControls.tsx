import { Button, ButtonGroup, Slider, Text, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconPlayerPlayFilled,
  IconPlayerSkipForward,
  IconPlayerSkipForwardFilled,
} from '@tabler/icons-react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../store/hooks';
import { AppDispatch } from '../store/store';
import { nextGeneration, setGenerationsPerAdvance } from '../store/game/gameSlice';

const GameControls = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isPlaying, generationsPerAdvance } = useAppSelector((state) => state.game);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const handleMoveForward = () => {
    dispatch(nextGeneration());
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
      </ButtonGroup>
    </>
  );
};

export default GameControls;
