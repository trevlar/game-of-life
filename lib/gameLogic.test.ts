import {
  countLivingCellsInBoard,
  createLivingCellsFromCoordinates,
  isCellAlive,
  mergeLivingCells,
  parseRlePattern,
  placePattern,
  processNextGenByLiveCellsAndNeighbors,
  serializeLivingCellsToRle,
} from './gameLogic';
import { patternPresets } from './presets';

const liveCoordinates = (livingCells: boolean[][], boardSize: number) => {
  const coordinates: string[] = [];

  livingCells.forEach((row, rowIndex) => {
    row?.forEach((cell, colIndex) => {
      if (cell && rowIndex < boardSize && colIndex < boardSize) {
        coordinates.push(`${rowIndex},${colIndex}`);
      }
    });
  });

  return coordinates.sort();
};

describe('gameLogic', () => {
  it('keeps a block still life stable', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [1, 1],
        [1, 2],
        [2, 1],
        [2, 2],
      ],
      4
    );

    const next = processNextGenByLiveCellsAndNeighbors(board, 4, false);

    expect(liveCoordinates(next, 4)).toEqual(['1,1', '1,2', '2,1', '2,2']);
  });

  it('oscillates a blinker', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [2, 1],
        [2, 2],
        [2, 3],
      ],
      5
    );

    const next = processNextGenByLiveCellsAndNeighbors(board, 5, false);

    expect(liveCoordinates(next, 5)).toEqual(['1,2', '2,2', '3,2']);
  });

  it('wraps neighbors around continuous edges', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [0, 0],
        [0, 2],
        [2, 0],
      ],
      3
    );

    const next = processNextGenByLiveCellsAndNeighbors(board, 3, true);

    expect(isCellAlive(next, 2, 2)).toBe(true);
  });

  it('continues patterns across the top and bottom edges', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [3, 2],
        [4, 2],
        [0, 2],
      ],
      5
    );

    const next = processNextGenByLiveCellsAndNeighbors(board, 5, true);

    expect(liveCoordinates(next, 5)).toEqual(['4,1', '4,2', '4,3']);
  });

  it('continues patterns across the left and right edges', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [2, 3],
        [2, 4],
        [2, 0],
      ],
      5
    );

    const next = processNextGenByLiveCellsAndNeighbors(board, 5, true);

    expect(liveCoordinates(next, 5)).toEqual(['1,4', '2,4', '3,4']);
  });

  it('wraps left and right edges only on a horizontal cylinder', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [2, 3],
        [2, 4],
        [2, 0],
      ],
      5
    );

    const next = processNextGenByLiveCellsAndNeighbors(board, 5, false, 'horizontal-cylinder');

    expect(liveCoordinates(next, 5)).toEqual(['1,4', '2,4', '3,4']);
  });

  it('wraps top and bottom edges only on a vertical cylinder', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [3, 2],
        [4, 2],
        [0, 2],
      ],
      5
    );

    const next = processNextGenByLiveCellsAndNeighbors(board, 5, false, 'vertical-cylinder');

    expect(liveCoordinates(next, 5)).toEqual(['4,1', '4,2', '4,3']);
  });

  it('flips rows when crossing a Mobius strip side edge', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [3, 4],
        [1, 1],
        [2, 0],
      ],
      5
    );

    const next = processNextGenByLiveCellsAndNeighbors(board, 5, false, 'mobius-strip');

    expect(isCellAlive(next, 1, 0)).toBe(true);
  });

  it('flips columns when crossing a Klein bottle top or bottom edge', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [4, 3],
        [0, 2],
        [1, 1],
      ],
      5
    );

    const next = processNextGenByLiveCellsAndNeighbors(board, 5, false, 'klein-bottle');

    expect(isCellAlive(next, 0, 1)).toBe(true);
  });

  it('counts only live cells inside the board', () => {
    const board = createLivingCellsFromCoordinates(
      [
        [0, 0],
        [1, 1],
      ],
      2
    );
    board[4] = [];
    board[4][4] = true;

    expect(countLivingCellsInBoard(board, 2)).toBe(2);
  });

  it('places patterns at a random valid location', () => {
    const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(1);

    const placed = placePattern(
      [
        [0, 0],
        [1, 1],
      ],
      5,
      'random'
    );

    expect(placed).toEqual([
      [3, 3],
      [4, 4],
    ]);
    randomSpy.mockRestore();
  });

  it('merges additional living cells into an existing board', () => {
    const base = createLivingCellsFromCoordinates([[1, 1]], 5);
    const addition = createLivingCellsFromCoordinates([[2, 2]], 5);

    const merged = mergeLivingCells(base, addition, 5);

    expect(liveCoordinates(merged, 5)).toEqual(['1,1', '2,2']);
  });

  it('imports and exports RLE patterns', () => {
    const coordinates = parseRlePattern('x = 3, y = 3, rule = B3/S23\nbob$2bo$3o!');
    const board = createLivingCellsFromCoordinates(coordinates, 3);

    expect(liveCoordinates(board, 3)).toEqual(['0,1', '1,2', '2,0', '2,1', '2,2']);
    expect(serializeLivingCellsToRle(board, 3)).toBe('x = 3, y = 3, rule = B3/S23\nbo$2bo$3o!');
  });

  it('includes an expanded preset pattern catalog', () => {
    const presetValues = patternPresets.map(({ value }) => value);

    expect(patternPresets).toHaveLength(16);
    expect(presetValues).toEqual(
      expect.arrayContaining([
        'beehive',
        'toad',
        'pentadecathlon',
        'r-pentomino',
        'diehard',
        'acorn',
        'gosper-glider-gun',
      ])
    );
  });
});
