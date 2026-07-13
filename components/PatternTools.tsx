import {
  Button,
  Group,
  SegmentedControl,
  Select,
  Slider,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { IconDice5, IconDownload, IconUpload } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import {
  createLivingCellsFromCoordinates,
  createRandomLivingCells,
  mergeLivingCells,
  parseRlePattern,
  placePattern,
  serializeLivingCellsToRle,
} from '../lib/gameLogic';
import { patternPresets } from '../lib/presets';
import { setLivingCells } from '../store/game/gameSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

function PatternTools() {
  const dispatch = useAppDispatch();
  const { boardSize, livingCells } = useAppSelector((state) => state.game);
  const [selectedPreset, setSelectedPreset] = useState('glider');
  const [placement, setPlacement] = useState<'center' | 'random'>('center');
  const [applyMode, setApplyMode] = useState<'replace' | 'add'>('replace');
  const [density, setDensity] = useState(25);
  const [rleText, setRleText] = useState('');
  const [message, setMessage] = useState('');
  const presetOptions = useMemo(
    () => patternPresets.map(({ label, value }) => ({ label, value })),
    []
  );

  const applyCoordinates = (coordinates: Array<[row: number, col: number]>, label: string) => {
    const cells = createLivingCellsFromCoordinates(
      placePattern(coordinates, boardSize, placement),
      boardSize
    );
    const nextCells = applyMode === 'add' ? mergeLivingCells(livingCells, cells, boardSize) : cells;

    dispatch(setLivingCells({ livingCells: nextCells }));
    setMessage(`${label} ${applyMode === 'add' ? 'added' : 'applied'} ${placement}`);
  };

  const handleApplyPreset = () => {
    const preset = patternPresets.find(({ value }) => value === selectedPreset);
    if (!preset) {
      return;
    }

    applyCoordinates(preset.cells, preset.label);
  };

  const handleRandomize = () => {
    dispatch(setLivingCells({ livingCells: createRandomLivingCells(boardSize, density) }));
    setMessage(`Random board applied at ${density}% density`);
  };

  const handleImportRle = () => {
    const coordinates = parseRlePattern(rleText);

    if (coordinates.length === 0) {
      setMessage('No live cells found in RLE');
      return;
    }

    applyCoordinates(coordinates, 'RLE pattern');
  };

  const handleExportRle = () => {
    setRleText(serializeLivingCellsToRle(livingCells, boardSize));
    setMessage('Board exported');
  };

  return (
    <Stack gap="sm">
      <Text>Patterns</Text>
      <Select
        label="Preset"
        data={presetOptions}
        value={selectedPreset}
        onChange={(value) => setSelectedPreset(value || patternPresets[0].value)}
        comboboxProps={{ withinPortal: false }}
      />
      <SegmentedControl
        value={placement}
        onChange={(value) => setPlacement(value as 'center' | 'random')}
        data={[
          { label: 'Center', value: 'center' },
          { label: 'Random', value: 'random' },
        ]}
      />
      <SegmentedControl
        value={applyMode}
        onChange={(value) => setApplyMode(value as 'replace' | 'add')}
        data={[
          { label: 'Replace', value: 'replace' },
          { label: 'Add', value: 'add' },
        ]}
      />
      <Button variant="default" onClick={handleApplyPreset}>
        Apply Pattern
      </Button>

      <Stack gap="xs">
        <Text size="sm">Random Density: {density}%</Text>
        <Slider
          value={density}
          min={1}
          max={90}
          onChange={setDensity}
          label={(value) => `${value}%`}
        />
        <Button variant="default" leftSection={<IconDice5 />} onClick={handleRandomize}>
          Randomize
        </Button>
      </Stack>

      <Textarea
        label="RLE"
        minRows={4}
        autosize
        value={rleText}
        onChange={(event) => setRleText(event.currentTarget.value)}
      />
      <Group grow>
        <Button variant="default" leftSection={<IconUpload />} onClick={handleImportRle}>
          Import
        </Button>
        <Button variant="default" leftSection={<IconDownload />} onClick={handleExportRle}>
          Export
        </Button>
      </Group>
      {message && (
        <Text size="sm" c="dimmed">
          {message}
        </Text>
      )}
    </Stack>
  );
}

export default PatternTools;
