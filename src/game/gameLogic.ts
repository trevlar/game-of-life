import { Cell } from '../common/types';

const directions = [
  [-1, -1], // top left
  [-1, 0], // top
  [-1, 1], // top right
  [0, 1], // right
  [1, 1], // bottom right
  [1, 0], // bottom
  [1, -1], // bottom left
  [0, -1], // left
];

const isUnderpopulated = (livingNeighborCount: number) => {
  return livingNeighborCount < 2;
};

const isLivingOn = (livingNeighborCount: number) => {
  return livingNeighborCount === 2 || livingNeighborCount === 3;
};

const isOverpopulated = (livingNeighborCount: number) => {
  return livingNeighborCount > 3;
};

const canReproduce = (livingNeighborCount: number) => {
  return livingNeighborCount === 3;
};

const getNeighborIndexes = (
  cell: Cell,
  boardSize: number,
  rowOffset: number,
  cellOffset: number,
  wrapAround: boolean
) => {
  let neighborCell = cell.x + cellOffset;
  let neighborRow = cell.y + rowOffset;

  if (wrapAround) {
    if (neighborRow < 0) {
      neighborRow = boardSize - 1;
    } else if (neighborRow >= boardSize) {
      neighborRow = 0;
    }
    if (neighborCell < 0) {
      neighborCell = boardSize - 1;
    } else if (neighborCell >= boardSize) {
      neighborCell = 0;
    }
  }

  return [neighborRow, neighborCell];
};

function getLivingNeighborCount(
  cell: Cell,
  liveCells: Set<string>,
  boardSize: number,
  wrapAround: boolean
): number {
  return directions.reduce((neighborCount, [rowOffset, cellOffset]) => {
    const [neighborRow, neighborCell] = getNeighborIndexes(
      cell,
      boardSize,
      rowOffset,
      cellOffset,
      wrapAround
    );

    const neighborCellKey = `${neighborCell},${neighborRow}`;
    if (liveCells.has(neighborCellKey)) {
      return neighborCount + 1;
    }
    return neighborCount;
  }, 0);
}

/**
 * This function processes the next generation of the board based on the current state of the board.
 * We are only storing the live cells in the board, so we need to process those cells and their neighbors.
 * @param board This is the board that is being processed
 * @param boardSize This is the size of the board.  It is assumed that the board is square.
 * @param wrapAround This is a boolean that indicates whether the board wraps around the edges.
 */
export const processNextGenByLiveCellsAndNeighbors = (
  liveCells: Set<string>,
  boardSize: number,
  wrapAround: boolean
) => {
  const newLiveCells = new Set<string>();
  const consideredCells = new Set<string>();

  liveCells.forEach((liveCell) => {
    const [x, y] = liveCell.split(',').map(Number);
    const cell = { x, y };

    directions.forEach(([rowOffset, cellOffset]) => {
      const [neighborRow, neighborCell] = getNeighborIndexes(
        cell,
        boardSize,
        rowOffset,
        cellOffset,
        wrapAround
      );

      if (
        neighborRow < 0 - 20 ||
        neighborRow > boardSize + 20 ||
        neighborCell < 0 - 20 ||
        neighborCell > boardSize + 20
      ) {
        return;
      }

      const neighborCellKey = `${neighborCell},${neighborRow}`;
      if (consideredCells.has(neighborCellKey)) {
        return;
      }
      consideredCells.add(neighborCellKey);

      const livingNeighborCount = getLivingNeighborCount(
        { x: neighborCell, y: neighborRow },
        liveCells,
        boardSize,
        wrapAround
      );

      if (liveCells.has(neighborCellKey)) {
        if (isUnderpopulated(livingNeighborCount)) {
          return;
        }

        if (isLivingOn(livingNeighborCount)) {
          newLiveCells.add(neighborCellKey);
          return;
        }

        if (isOverpopulated(livingNeighborCount)) {
          return;
        }
      } else if (canReproduce(livingNeighborCount)) {
        newLiveCells.add(neighborCellKey);
      }
    });
  });

  return newLiveCells;
};

export const convertBoardToLiveCells = (board: boolean[][]) => {
  const liveCells = new Set<string>();
  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell) {
        liveCells.add(`${cellIndex},${rowIndex}`);
      }
    });
  });
  return Array.from(liveCells);
};

/**
 * This function will trim the board to the visible board. It will remove equal rows and columns from the live cells that are beyond the bounds of the newly sized board.
 * @param liveCells The set of live cells that are being trimmed
 * @param boardSize The size of the board
 * @returns A new set of live cells that are within the bounds of the board
 */
export const trimLiveCellsToSize = (liveCells: string[], boardSize: number) => {
  const trimmedLiveCells = [];

  liveCells.forEach((liveCell) => {
    const [x, y] = liveCell.split(',').map(Number);

    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
      trimmedLiveCells.push(liveCell);
    }
  });

  return trimmedLiveCells;
};

export const countLivingCellsInBoard = (liveCells: string[], boardSize: number) => {
  let livingCellCount = 0;
  liveCells.forEach((liveCell) => {
    const [x, y] = liveCell.split(',').map(Number);

    if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
      livingCellCount++;
    }
  });

  return livingCellCount;
};
