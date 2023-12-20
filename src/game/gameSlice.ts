import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { GameState, GamePayload, SettingsPayload } from '../common/types';

import {
  convertBoardToLiveCells,
  processNextGenByLiveCellsAndNeighbors,
  trimLiveCellsToSize,
  countLivingCellsInBoard,
} from './gameLogic';

const defaultBoardSize = 38;
const virtualBoardSizeOffset = 40;

const initialState: GameState = {
  title: '',
  description: '',
  livingCells: [],
  generations: 0,
  isPlaying: false,
  boardSize: defaultBoardSize,
  virtualBoardSize: defaultBoardSize + virtualBoardSizeOffset,
  gameSpeed: 'normal',
  continuousEdges: false,
  generationsPerAdvance: 1,
  livingCellCount: 0,
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

      if (state.livingCells.length === 0) {
        state.generations += steps;
        console.log('no living cells to process');
        return;
      }

      const { livingCells, boardSize, continuousEdges } = state;
      let newLiveCells = new Set(livingCells);
      for (let i = 0; i < steps; i++) {
        newLiveCells = processNextGenByLiveCellsAndNeighbors(
          newLiveCells,
          boardSize,
          continuousEdges
        );
      }
      state.livingCells = Array.from(newLiveCells);
      state.livingCellCount = countLivingCellsInBoard(state.livingCells, boardSize);

      state.generations += steps;
    },
    setSelectedBoard: (state, action: PayloadAction<{ game: any }>) => {
      const game = action.payload.game;
      state.id = game.id;
      state.title = game.title;
      state.description = game.description;
      state.livingCells = game.livingCells || convertBoardToLiveCells(game.board);
      state.generations = game.generations;
      state.isPlaying = game.isPlaying;
      state.boardSize = game.settings.boardSize;
      state.gameSpeed = game.settings.gameSpeed;
      state.continuousEdges = game.settings.wrapAround;
      state.generationsPerAdvance = game.settings.generationsPerAdvance;
      state.livingCellCount = game.settings.livingCellCount;
    },
    resetSaveData: (state) => {
      state.id = null;
      state.title = state.title + ' (copy)';
    },
    clearBoard: (state) => {
      state.id = null;
      state.title = '';
      state.description = '';
      state.livingCells = [];
      state.generations = 0;
      state.livingCellCount = 0;
    },
    setBoardAtLocation: (state, action: PayloadAction<GamePayload>) => {
      const { row, col } = action.payload.cell || { row: 0, col: 0 };

      if (state.livingCells.includes(`${col},${row}`)) {
        const newCells = state.livingCells.filter((cell) => cell !== `${col},${row}`);
        state.livingCells = [...newCells];
        state.livingCellCount = state.livingCellCount - 1;
      } else {
        state.livingCells = [...state.livingCells, `${col},${row}`];
        state.livingCellCount = state.livingCellCount + 1;
      }
    },
    setGameSpeed: (state, action: PayloadAction<SettingsPayload>) => {
      state.gameSpeed = action.payload.gameSpeed || 'normal';
    },
    setBoardSize: (state, action: PayloadAction<SettingsPayload>) => {
      state.boardSize = action.payload.boardSize || defaultBoardSize;
      state.generations = 0;
      state.livingCells = trimLiveCellsToSize(state.livingCells, state.boardSize);
      state.livingCellCount = countLivingCellsInBoard(state.livingCells, state.boardSize);
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
  clearBoard,
  nextGeneration,
  resetSaveData,
  setBoardAtLocation,
  setBoardId,
  setBoards,
  setBoardSize,
  setContinuousEdges,
  setDescription,
  setGameSpeed,
  setGenerationsPerAdvance,
  setSelectedBoard,
  setTitle,
  togglePlay,
} = gameSlice.actions;

export default gameSlice.reducer;
