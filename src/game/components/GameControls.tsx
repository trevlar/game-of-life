import { Button, ButtonGroup, Slider, Text, em } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconPlayerSkipForward,
  IconPlayerSkipForwardFilled,
  IconTrashFilled,
} from '@tabler/icons-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

import { useAppSelector } from '../../app/hooks';
import { clearBoard, nextGeneration } from '../gameSlice';

const GameControls = () => {
  const dispatch = useDispatch();
  const { isPlaying } = useAppSelector((state) => state.game);
  const [forwardTicks, setForwardTicks] = useState(1);
  const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
  const handleMoveForward = () => {
    dispatch(nextGeneration({ steps: forwardTicks }));
  };

  return (
    <>
      <Slider
        thumbChildren={<IconPlayerSkipForwardFilled color="blue" />}
        thumbSize={26}
        value={forwardTicks}
        onChange={setForwardTicks}
        onChangeEnd={setForwardTicks}
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
          rightSection={<IconPlayerSkipForward />}
          disabled={isPlaying}
        >
          <Text w={26}>{forwardTicks}</Text>
          &nbsp;
          <Text>ticks Forward</Text>
        </Button>
        <Button
          variant="default"
          onClick={() => dispatch(clearBoard())}
          leftSection={<IconTrashFilled />}
        >
          Clear Board
        </Button>
      </ButtonGroup>
    </>
  );
};

export default GameControls;
