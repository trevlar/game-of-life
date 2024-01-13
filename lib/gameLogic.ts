import { Cell } from '../../types/types';

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
): Cell => {
  let nX = cell.x + cellOffset;
  let nY = cell.y + rowOffset;

  if (wrapAround) {
    if (nY < 0) {
      nY = boardSize - 1;
    } else if (nY >= boardSize) {
      nY = 0;
    }
    if (nX < 0) {
      nX = boardSize - 1;
    } else if (nX >= boardSize) {
      nX = 0;
    }
  }

  return { x: nX, y: nY };
};

function getLivingNeighborCount(
  cell: Cell,
  liveCells: boolean[][],
  boardSize: number,
  wrapAround: boolean
): number {
  return directions.reduce((neighborCount, [rowOffset, cellOffset]) => {
    const { x: nX, y: nY } = getNeighborIndexes(cell, boardSize, rowOffset, cellOffset, wrapAround);

    if (liveCells[nY]?.[nX]) {
      return neighborCount + 1;
    }
    return neighborCount;
  }, 0);
}

/**
 * This function processes the next generation of the board based on the current state of the board.
 * We are only storing the live cells in the board, so we need to process those cells and their neighbors.
 * @param liveCells The living cells on the board represented by a sparsely populated muldimensional array.
 * @param boardSize This is the size of the board.  It is assumed that the board is square.
 * @param wrapAround This is a boolean that indicates whether the board wraps around the edges.
 */
export const processNextGenByLiveCellsAndNeighbors = (
  liveCells: boolean[][],
  boardSize: number,
  wrapAround: boolean
) => {
  const newLiveCells: boolean[][] = [];
  const consideredCells: boolean[][] = [];

  liveCells.forEach((row, rowIndex) => {
    row?.forEach((_, cellIndex) => {
      const cell = { x: cellIndex, y: rowIndex };

      directions.forEach(([rowOffset, cellOffset]) => {
        const { x: nX, y: nY } = getNeighborIndexes(
          cell,
          boardSize,
          rowOffset,
          cellOffset,
          wrapAround
        );

        if (nY < 0 - 20 || nY > boardSize + 20 || nX < 0 - 20 || nX > boardSize + 20) {
          return;
        }

        if (consideredCells[nY]?.[nX]) {
          return;
        } else {
          consideredCells[nY] = consideredCells[nY] || [];
          consideredCells[nY][nX] = true;
        }

        const livingNeighborCount = getLivingNeighborCount(
          { x: nX, y: nY },
          liveCells,
          boardSize,
          wrapAround
        );

        if (liveCells[nY]?.[nX]) {
          if (isUnderpopulated(livingNeighborCount)) {
            return;
          }

          if (isLivingOn(livingNeighborCount)) {
            newLiveCells[nY] = newLiveCells[nY] || [];
            newLiveCells[nY][nX] = true;
            return;
          }

          if (isOverpopulated(livingNeighborCount)) {
            return;
          }
        } else if (canReproduce(livingNeighborCount)) {
          newLiveCells[nY] = newLiveCells[nY] || [];
          newLiveCells[nY][nX] = true;
        }
      });
    });
  });

  return newLiveCells;
};

/**
 * This function will trim the live cells to the size of the visible board.
 * It removes equal rows and columns from live cells beyond the bounds of the newly sized board.
 * @param liveCells A sparsley populated array of the live cells being trimmed
 * @param boardSize The size of the board
 * @returns A new set of live cells that are within the bounds of the board
 */
export const trimLiveCellsToSize = (liveCells: boolean[][], boardSize: number) => {
  const trimmedLiveCells: boolean[][] = [];

  liveCells.forEach((row, rowIndex) => {
    if (rowIndex < boardSize) {
      trimmedLiveCells[rowIndex] = [];
      row.forEach((cell, cellIndex) => {
        if (cellIndex < boardSize) {
          trimmedLiveCells[rowIndex][cellIndex] = true;
        }
      });
    }
  });

  return trimmedLiveCells;
};

export const countLivingCellsInBoard = (liveCells: boolean[][], boardSize) => {
  return liveCells.reduce((totalLivingCount, row, rowIndex) => {
    return row.reduce((cellCount, cell, cellIndex) => {
      if (
        cell &&
        rowIndex >= 0 &&
        rowIndex < boardSize &&
        cellIndex >= 0 &&
        cellIndex < boardSize
      ) {
        cellCount++;
      }

      return cellCount;
    }, totalLivingCount);
  }, 0);
};

export function deepCopyLivingCells(liveCells: boolean[][]): boolean[][] {
  const newLiveCells: boolean[][] = [];

  liveCells.forEach((row, rowIndex) => {
    newLiveCells[rowIndex] = [];
    row?.forEach((cell, cellIndex) => {
      if (cell) {
        newLiveCells[rowIndex][cellIndex] = true;
      }
    });
  });

  return newLiveCells;
}
