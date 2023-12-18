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

const getNeighborIndices = (
  board: boolean[][],
  rowIndex: number,
  cellIndex: number,
  rowOffset: number,
  cellOffset: number
) => {
  let neighborRow = rowIndex + rowOffset;
  let neighborCell = cellIndex + cellOffset;

  // handle other side of board.
  if (neighborRow < 0) {
    neighborRow = board.length - 1;
  } else if (neighborRow >= board.length) {
    neighborRow = 0;
  }
  if (neighborCell < 0) {
    neighborCell = board[0].length - 1;
  } else if (neighborCell >= board[0].length) {
    neighborCell = 0;
  }

  return [neighborRow, neighborCell];
};

const getLivingNeighbors = (board: boolean[][], rowIndex: number, cellIndex: number) => {
  // check each direction to count the number of living cells surrounding this cell
  return directions.reduce((acc, [rowOffset, cellOffset]) => {
    const [neighborRow, neighborCell] = getNeighborIndices(
      board,
      rowIndex,
      cellIndex,
      rowOffset,
      cellOffset
    );

    if (board[neighborRow][neighborCell]) {
      acc++;
    }

    return acc;
  }, 0);
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

export const processNextGeneration = (board: boolean[][], boardSize: number) => {
  const newBoard: boolean[][] = board.map((row) => [...row]);

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const livingNeighbors = getLivingNeighbors(board, i, j);
      if (board[i][j]) {
        // 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
        if (isUnderpopulated(livingNeighbors)) {
          newBoard[i][j] = false;
        }
        // 2. Any live cell with two or three live neighbours lives on to the next generation.
        if (isLivingOn(livingNeighbors)) {
          newBoard[i][j] = true;
        }
        // 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
        else if (isOverpopulated(livingNeighbors)) {
          newBoard[i][j] = false;
        }
      } else if (canReproduce(livingNeighbors)) {
        // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
        newBoard[i][j] = true;
      }
    }
  }

  // board.forEach((row, rowIndex) => {
  //   row.forEach((isLiving, cellIndex) => {
  //     const livingNeighbors = getLivingNeighbors(board, rowIndex, cellIndex);
  //     if (isLiving) {
  //       // 1. Any live cell with fewer than two live neighbours dies, as if by underpopulation.
  //       if (isUnderpopulated(livingNeighbors)) {
  //         newBoard[rowIndex][cellIndex] = false;
  //       }
  //       // 2. Any live cell with two or three live neighbours lives on to the next generation.
  //       if (isLivingOn(livingNeighbors)) {
  //         newBoard[rowIndex][cellIndex] = true;
  //       }
  //       // 3. Any live cell with more than three live neighbours dies, as if by overpopulation.
  //       else if (isOverpopulated(livingNeighbors)) {
  //         newBoard[rowIndex][cellIndex] = false;
  //       }
  //     } else if (canReproduce(livingNeighbors)) {
  //       // 4. Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
  //       newBoard[rowIndex][cellIndex] = true;
  //     }
  //   });
  // });

  return newBoard;
};

export const buildBoard = (size: number) => {
  const board: boolean[][] = [];
  for (let i = 0; i < size; i++) {
    board.push(Array(size).fill(false));
  }
  return board;
};
