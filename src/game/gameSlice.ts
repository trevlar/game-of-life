import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GameState, GamePayload, SettingsPayload } from '../common/types';

import { buildBoard, processNextGeneration } from './gameLogic';

const initialState: GameState = {
  board: buildBoard(38),
  generations: 0,
  isPlaying: false,
  boardSize: 38,
  gameSpeed: 'normal',
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    nextGeneration: (state, action: PayloadAction<GamePayload>) => {
      const steps = action.payload.steps || 1;
      for (let i = 0; i < steps; i++) {
        state.board = processNextGeneration(state.board, state.boardSize);
      }
      state.generations += steps;
    },
    clearBoard: (state) => {
      state.board = buildBoard(state.boardSize);
      state.generations = 0;
    },
    setBoardAtLocation: (state, action: PayloadAction<GamePayload>) => {
      const { row, col } = action.payload.cell || { row: 0, col: 0 };
      state.board[row][col] = !state.board[row][col];
    },
    setGameSpeed: (state, action: PayloadAction<SettingsPayload>) => {
      state.gameSpeed = action.payload.gameSpeed || 'normal';
    },
    setBoardSize: (state, action: PayloadAction<SettingsPayload>) => {
      state.boardSize = action.payload.boardSize || 38;
      state.board = buildBoard(state.boardSize);
      state.generations = 0;
    },
  },
});

export const {
  setBoardSize,
  setBoardAtLocation,
  setGameSpeed,
  togglePlay,
  nextGeneration,
  clearBoard,
} = gameSlice.actions;

export default gameSlice.reducer;
