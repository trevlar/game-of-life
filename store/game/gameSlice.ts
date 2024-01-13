import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  processNextGenByLiveCellsAndNeighbors,
  trimLiveCellsToSize,
  countLivingCellsInBoard,
  deepCopyLivingCells,
} from '../../lib/gameLogic';
import { GameState, GamePayload, SettingsPayload, SavedGame } from '../../types/types';

const defaultBoardSize = 38;
const virtualBoardSizeOffset = 40;
const defaultLiveCellColor = '#82c91e';
const defaultBackgroundColor = '#000000';
const defaultDeadCellColor = '#FFFFFF';

const initialState: GameState = {
  title: '',
  description: '',
  livingCells: [[]],
  generations: 0,
  isPlaying: false,
  boardSize: defaultBoardSize,
  virtualBoardSize: defaultBoardSize + virtualBoardSizeOffset,
  gameSpeed: 'normal',
  liveCellColor: defaultLiveCellColor,
  deadCellColor: defaultDeadCellColor,
  backgroundColor: defaultBackgroundColor,
  zoomLevel: 5,
  boardMouseAction: 'move',
  continuousEdges: false,
  generationsPerAdvance: 1,
  livingCellCount: 0,
  boardList: [],
  isSaveEnabled: false,
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
      let newLivingCells = deepCopyLivingCells(livingCells);
      for (let i = 0; i < steps; i++) {
        newLivingCells = processNextGenByLiveCellsAndNeighbors(
          newLivingCells,
          boardSize,
          continuousEdges
        );
      }
      state.livingCells = newLivingCells;
      state.livingCellCount = countLivingCellsInBoard(state.livingCells, boardSize);

      state.generations += steps;
    },
    setSelectedBoard: (state, action: PayloadAction<{ game: SavedGame }>) => {
      const game = action.payload.game;
      state.id = game.id;
      state.title = game.title;
      state.description = game.description;
      state.generations = game.generations;
      state.isPlaying = game.isPlaying;
      state.boardSize = game?.settings?.boardSize || defaultBoardSize;
      state.gameSpeed = game?.settings?.gameSpeed || 'normal';
      state.continuousEdges = game?.settings?.wrapAround || false;
      state.generationsPerAdvance = game?.settings?.generationsPerAdvance || 1;
      state.livingCells = game.livingCells
        ? JSON.parse(game.livingCells)
        : deepCopyLivingCells(game?.board || []);
      state.livingCellCount =
        game?.livingCellCount || countLivingCellsInBoard(state.livingCells, state.boardSize);
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
      const { boardMouseAction } = state;
      if (boardMouseAction === 'move') {
        return;
      }

      const { row, col } = action.payload.cell || { row: 0, col: 0 };

      const newCells = state.livingCells.map((row) => [...row]);
      if (boardMouseAction === 'erase' && newCells[col]?.[row]) {
        delete newCells[col][row];
        state.livingCells = newCells;
        state.livingCellCount = state.livingCellCount > 0 ? state.livingCellCount - 1 : 0;
      } else if (boardMouseAction === 'draw') {
        newCells[col] = newCells[col] || [];
        newCells[col][row] = true;
        state.livingCells = newCells;
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
    setLiveCellColor: (state, action: PayloadAction<SettingsPayload>) => {
      state.liveCellColor = action.payload.liveCellColor || defaultLiveCellColor;
    },
    setDeadCellColor: (state, action: PayloadAction<SettingsPayload>) => {
      state.deadCellColor = action.payload.deadCellColor || defaultDeadCellColor;
    },
    setBackgroundColor: (state, action: PayloadAction<SettingsPayload>) => {
      state.backgroundColor = action.payload.backgroundColor || defaultBackgroundColor;
    },
    setZoomLevel: (state, action: PayloadAction<SettingsPayload>) => {
      state.zoomLevel = action.payload.zoomLevel || 5;
    },
    setBoardMouseAction: (state, action: PayloadAction<SettingsPayload>) => {
      state.boardMouseAction = action.payload.action || 'move';
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
    setSaveEnabled: (state, action: PayloadAction<{ isSaveEnabled: boolean }>) => {
      state.isSaveEnabled = action.payload.isSaveEnabled;
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
  setLiveCellColor,
  setDeadCellColor,
  setBackgroundColor,
  setBoardMouseAction,
  setZoomLevel,
  setDescription,
  setGameSpeed,
  setGenerationsPerAdvance,
  setSelectedBoard,
  setTitle,
  togglePlay,
  setSaveEnabled,
} = gameSlice.actions;

export default gameSlice.reducer;
