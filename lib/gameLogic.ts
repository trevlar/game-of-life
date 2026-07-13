import { Cell, SpaceShape } from '../types/types';

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

export const isInBounds = (row: number, col: number, boardSize: number) => {
  return row >= 0 && row < boardSize && col >= 0 && col < boardSize;
};

export const isCellAlive = (liveCells: boolean[][], row: number, col: number) => {
  return Boolean(liveCells[row]?.[col]);
};

export const setCellAlive = (liveCells: boolean[][], row: number, col: number, alive: boolean) => {
  const newLiveCells = deepCopyLivingCells(liveCells);

  if (alive) {
    newLiveCells[row] = newLiveCells[row] || [];
    newLiveCells[row][col] = true;
  } else if (newLiveCells[row]?.[col]) {
    delete newLiveCells[row][col];
  }

  return newLiveCells;
};

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

const wrapIndex = (index: number, boardSize: number) => (index + boardSize) % boardSize;

const flipIndex = (index: number, boardSize: number) => boardSize - 1 - index;

const crossesBoardEdge = (index: number, boardSize: number) => index < 0 || index >= boardSize;

const getNeighborIndexes = (
  cell: Cell,
  boardSize: number,
  rowOffset: number,
  cellOffset: number,
  wrapAround: boolean,
  spaceShape: SpaceShape
): Cell => {
  const rawX = cell.x + cellOffset;
  const rawY = cell.y + rowOffset;
  const crossedX = crossesBoardEdge(rawX, boardSize);
  const crossedY = crossesBoardEdge(rawY, boardSize);

  if (spaceShape === 'horizontal-cylinder') {
    return { x: wrapIndex(rawX, boardSize), y: rawY };
  }

  if (spaceShape === 'vertical-cylinder') {
    return { x: rawX, y: wrapIndex(rawY, boardSize) };
  }

  if (spaceShape === 'mobius-strip') {
    if (crossedY) {
      return { x: rawX, y: rawY };
    }

    return {
      x: crossedX ? wrapIndex(rawX, boardSize) : rawX,
      y: crossedX ? flipIndex(rawY, boardSize) : rawY,
    };
  }

  if (spaceShape === 'klein-bottle') {
    const wrappedX = crossedX ? wrapIndex(rawX, boardSize) : rawX;

    return {
      x: crossedY ? flipIndex(wrappedX, boardSize) : wrappedX,
      y: crossedY ? wrapIndex(rawY, boardSize) : rawY,
    };
  }

  if (spaceShape === 'projective-plane') {
    const wrappedX = crossedX ? wrapIndex(rawX, boardSize) : rawX;
    const wrappedY = crossedY ? wrapIndex(rawY, boardSize) : rawY;

    return {
      x: crossedY ? flipIndex(wrappedX, boardSize) : wrappedX,
      y: crossedX ? flipIndex(wrappedY, boardSize) : wrappedY,
    };
  }

  if (spaceShape === 'torus' || wrapAround) {
    return {
      x: wrapIndex(rawX, boardSize),
      y: wrapIndex(rawY, boardSize),
    };
  }

  return { x: rawX, y: rawY };
};

function getLivingNeighborCount(
  cell: Cell,
  liveCells: boolean[][],
  boardSize: number,
  wrapAround: boolean,
  spaceShape: SpaceShape
): number {
  return directions.reduce((neighborCount, [rowOffset, cellOffset]) => {
    const { x: nX, y: nY } = getNeighborIndexes(
      cell,
      boardSize,
      rowOffset,
      cellOffset,
      wrapAround,
      spaceShape
    );

    if (isInBounds(nY, nX, boardSize) && isCellAlive(liveCells, nY, nX)) {
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
  wrapAround: boolean,
  spaceShape: SpaceShape = 'flat'
) => {
  const newLiveCells: boolean[][] = [];
  const consideredCells: boolean[][] = [];

  liveCells.forEach((row, rowIndex) => {
    row?.forEach((_, cellIndex) => {
      const cell = { x: cellIndex, y: rowIndex };
      if (!isInBounds(cell.y, cell.x, boardSize)) {
        return;
      }

      [[0, 0], ...directions].forEach(([rowOffset, cellOffset]) => {
        const { x: nX, y: nY } = getNeighborIndexes(
          cell,
          boardSize,
          rowOffset,
          cellOffset,
          wrapAround,
          spaceShape
        );

        if (!isInBounds(nY, nX, boardSize)) {
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
          wrapAround,
          spaceShape
        );

        if (isCellAlive(liveCells, nY, nX)) {
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

export const countLivingCellsInBoard = (liveCells: boolean[][], boardSize: number) => {
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

export const createLivingCellsFromCoordinates = (
  coordinates: Array<[row: number, col: number]>,
  boardSize: number
) => {
  const livingCells: boolean[][] = [];

  coordinates.forEach(([row, col]) => {
    if (isInBounds(row, col, boardSize)) {
      livingCells[row] = livingCells[row] || [];
      livingCells[row][col] = true;
    }
  });

  return livingCells;
};

export const centerPattern = (
  coordinates: Array<[row: number, col: number]>,
  boardSize: number
) => {
  if (coordinates.length === 0) {
    return [];
  }

  const rows = coordinates.map(([row]) => row);
  const cols = coordinates.map(([, col]) => col);
  const height = Math.max(...rows) - Math.min(...rows) + 1;
  const width = Math.max(...cols) - Math.min(...cols) + 1;
  const rowOffset = Math.floor((boardSize - height) / 2) - Math.min(...rows);
  const colOffset = Math.floor((boardSize - width) / 2) - Math.min(...cols);

  return coordinates.map(([row, col]) => [row + rowOffset, col + colOffset] as [number, number]);
};

export const placePattern = (
  coordinates: Array<[row: number, col: number]>,
  boardSize: number,
  placement: 'center' | 'random'
) => {
  if (placement === 'center' || coordinates.length === 0) {
    return centerPattern(coordinates, boardSize);
  }

  const rows = coordinates.map(([row]) => row);
  const cols = coordinates.map(([, col]) => col);
  const minRow = Math.min(...rows);
  const minCol = Math.min(...cols);
  const height = Math.max(...rows) - minRow + 1;
  const width = Math.max(...cols) - minCol + 1;
  const maxRowOffset = Math.max(0, boardSize - height);
  const maxColOffset = Math.max(0, boardSize - width);
  const randomRowOffset = Math.min(maxRowOffset, Math.floor(Math.random() * (maxRowOffset + 1)));
  const randomColOffset = Math.min(maxColOffset, Math.floor(Math.random() * (maxColOffset + 1)));
  const rowOffset = randomRowOffset - minRow;
  const colOffset = randomColOffset - minCol;

  return coordinates.map(([row, col]) => [row + rowOffset, col + colOffset] as [number, number]);
};

export const mergeLivingCells = (
  baseCells: boolean[][],
  cellsToAdd: boolean[][],
  boardSize: number
) => {
  const mergedCells = deepCopyLivingCells(baseCells);

  cellsToAdd.forEach((row, rowIndex) => {
    row?.forEach((cell, colIndex) => {
      if (cell && isInBounds(rowIndex, colIndex, boardSize)) {
        mergedCells[rowIndex] = mergedCells[rowIndex] || [];
        mergedCells[rowIndex][colIndex] = true;
      }
    });
  });

  return mergedCells;
};

export const createRandomLivingCells = (boardSize: number, densityPercent: number) => {
  const density = Math.max(0, Math.min(densityPercent, 100)) / 100;
  const livingCells: boolean[][] = [];

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (Math.random() < density) {
        livingCells[row] = livingCells[row] || [];
        livingCells[row][col] = true;
      }
    }
  }

  return livingCells;
};

export const parseRlePattern = (rle: string) => {
  const body = rle
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#') && !line.startsWith('x'))
    .join('');
  const coordinates: Array<[row: number, col: number]> = [];
  let row = 0;
  let col = 0;
  let runLength = '';

  for (const char of body) {
    if (/\d/.test(char)) {
      runLength += char;
      continue;
    }

    const count = runLength ? Number(runLength) : 1;
    runLength = '';

    if (char === 'o') {
      for (let i = 0; i < count; i++) {
        coordinates.push([row, col + i]);
      }
      col += count;
    } else if (char === 'b') {
      col += count;
    } else if (char === '$') {
      row += count;
      col = 0;
    } else if (char === '!') {
      break;
    }
  }

  return coordinates;
};

export const serializeLivingCellsToRle = (liveCells: boolean[][], boardSize: number) => {
  const coordinates: Array<[row: number, col: number]> = [];

  liveCells.forEach((row, rowIndex) => {
    row?.forEach((cell, colIndex) => {
      if (cell && isInBounds(rowIndex, colIndex, boardSize)) {
        coordinates.push([rowIndex, colIndex]);
      }
    });
  });

  if (coordinates.length === 0) {
    return 'x = 0, y = 0, rule = B3/S23\n!';
  }

  const rows = coordinates.map(([row]) => row);
  const cols = coordinates.map(([, col]) => col);
  const minRow = Math.min(...rows);
  const maxRow = Math.max(...rows);
  const minCol = Math.min(...cols);
  const maxCol = Math.max(...cols);
  const width = maxCol - minCol + 1;
  const height = maxRow - minRow + 1;
  const lines: string[] = [];

  for (let row = minRow; row <= maxRow; row++) {
    let line = '';
    let currentType = '';
    let runLength = 0;

    for (let col = minCol; col <= maxCol; col++) {
      const type = isCellAlive(liveCells, row, col) ? 'o' : 'b';

      if (type === currentType) {
        runLength++;
      } else {
        if (currentType) {
          line += `${runLength > 1 ? runLength : ''}${currentType}`;
        }
        currentType = type;
        runLength = 1;
      }
    }

    line += `${runLength > 1 ? runLength : ''}${currentType}`;
    lines.push(line.replace(/b+$/, ''));
  }

  return `x = ${width}, y = ${height}, rule = B3/S23\n${lines.join('$')}!`;
};
