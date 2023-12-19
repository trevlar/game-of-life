import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from '../app/store';
import { GameState, GamePayload, SettingsPayload } from '../common/types';

import {
  buildBoard,
  getLivingCellCount,
  processNextGeneration,
  trimToVisibleBoard,
} from './gameLogic';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || '';
export const loadBoards = createAsyncThunk(
  'boards/loadBoards',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/boards`);

      dispatch(setBoards({ boards: response.data }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

interface SaveBoardResponse {
  id: string;
}

export const saveBoard = createAsyncThunk<
  SaveBoardResponse,
  void,
  {
    state: RootState; // Define the type of the state
  }
>('boards/saveBoard', async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState() as any;
  const gameState = state.game;

  const boardData = {
    id: gameState.id || null,
    title: gameState.title,
    description: gameState.description,
    board: gameState.board,
    generations: gameState.generations,
    isPlaying: gameState.isPlaying,
    virtualBoard: gameState.virtualBoard,
    livingCells: gameState.livingCells,
    settings: {
      boardSize: gameState.boardSize,
      gameSpeed: gameState.gameSpeed,
      generationsPerAdvance: gameState.generationsPerAdvance,
      wrapAround: gameState.continuousEdges,
    },
  };
  try {
    const response = await axios.post(`${BASE_URL}/api/board`, boardData);

    const boardId = response.data.id;

    dispatch(setBoardId({ id: boardId }));

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Async thunk for selecting a board
export const selectBoard = createAsyncThunk(
  'boards/selectBoard',
  async (boardId: string | null, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/board/${boardId}`);

      dispatch(setSelectedBoard({ game: response.data }));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const defaultBoardSize = 38;
const virtualBoardSizeOffset = 40;

const initialState: GameState = {
  title: '',
  description: '',
  board: buildBoard(defaultBoardSize),
  virtualBoard: buildBoard(defaultBoardSize + virtualBoardSizeOffset),
  generations: 0,
  isPlaying: false,
  boardSize: 38,
  gameSpeed: 'normal',
  continuousEdges: false,
  generationsPerAdvance: 1,
  livingCells: 0,
  boardList: [],
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextGeneration: (state) => {
      const steps = state.generationsPerAdvance || 1;
      if (state.livingCells === 0) {
        state.generations += steps;
        console.log('no living cells to process');
        return;
      }

      const { board, virtualBoard, boardSize, continuousEdges } = state;

      let nextBoard = continuousEdges
        ? board.map((row) => [...row])
        : virtualBoard.map((row) => [...row]);
      for (let i = 0; i < steps; i++) {
        if (continuousEdges) {
          nextBoard = processNextGeneration(nextBoard, boardSize, continuousEdges);
        } else {
          nextBoard = processNextGeneration(
            nextBoard,
            boardSize + virtualBoardSizeOffset,
            continuousEdges
          );
        }
      }

      if (continuousEdges) {
        state.board = nextBoard;
        state.livingCells = getLivingCellCount(board);
      } else {
        state.virtualBoard = nextBoard;
        state.board = trimToVisibleBoard(nextBoard, boardSize);
        state.livingCells = getLivingCellCount(board);
        if (state.livingCells === 0) {
          state.virtualBoard = buildBoard(boardSize + virtualBoardSizeOffset);
        }
      }
      state.generations += steps;
    },
    setSelectedBoard: (state, action: PayloadAction<{ game: any }>) => {
      const game = action.payload.game;
      state.title = game.title;
      state.description = game.description;
      state.board = game.board;
      state.virtualBoard = game.virtualBoard;
      state.generations = game.generations;
      state.isPlaying = game.isPlaying;
      state.boardSize = game.settings.boardSize;
      state.gameSpeed = game.settings.gameSpeed;
      state.continuousEdges = game.settings.wrapAround;
      state.generationsPerAdvance = game.settings.generationsPerAdvance;
      state.livingCells = game.livingCells;
    },
    clearBoard: (state) => {
      state.virtualBoard = buildBoard(state.boardSize + virtualBoardSizeOffset);
      state.board = buildBoard(state.boardSize);
      state.generations = 0;
      state.livingCells = 0;
      state.id = null;
    },
    setBoardAtLocation: (state, action: PayloadAction<GamePayload>) => {
      const { row, col } = action.payload.cell || { row: 0, col: 0 };
      const isLiving = state.board[row][col];
      state.board[row][col] = !isLiving;

      if (!state.continuousEdges) {
        const extendedSize = state.virtualBoard.length;
        const startOffset = Math.floor((extendedSize - state.boardSize) / 2);

        const offsetRow = row + startOffset;
        const offsetCol = col + startOffset;
        state.virtualBoard[offsetRow][offsetCol] = !isLiving;
      }
      state.livingCells = state.livingCells + (isLiving ? -1 : 1);
    },
    setGameSpeed: (state, action: PayloadAction<SettingsPayload>) => {
      state.gameSpeed = action.payload.gameSpeed || 'normal';
    },
    setBoardSize: (state, action: PayloadAction<SettingsPayload>) => {
      state.boardSize = action.payload.boardSize || defaultBoardSize;
      state.board = buildBoard(state.boardSize);
      state.virtualBoard = buildBoard(state.boardSize + virtualBoardSizeOffset);
      state.generations = 0;
    },
    setContinuousEdges: (state, action: PayloadAction<SettingsPayload>) => {
      state.continuousEdges = action.payload.continuousEdges || false;
    },
    setGenerationsPerAdvance: (state, action: PayloadAction<SettingsPayload>) => {
      state.generationsPerAdvance = action.payload.generationsPerAdvance || 1;
    },
    setTitle: (state, action: PayloadAction<GamePayload>) => {
      state.title = action.payload.title || '';
    },
    setDescription: (state, action: PayloadAction<GamePayload>) => {
      state.description = action.payload.description || '';
    },
    setBoardId: (state, action: PayloadAction<GamePayload>) => {
      state.id = action.payload.id || '';
    },
    setBoards: (state, action: PayloadAction<{ boards: any[] }>) => {
      state.boardList = action.payload.boards;
    },
  },
});

export const {
  setBoardSize,
  setSelectedBoard,
  setBoardAtLocation,
  setGameSpeed,
  togglePlay,
  nextGeneration,
  clearBoard,
  setContinuousEdges,
  setGenerationsPerAdvance,
  setTitle,
  setDescription,
  setBoardId,
  setBoards,
} = gameSlice.actions;

export default gameSlice.reducer;
