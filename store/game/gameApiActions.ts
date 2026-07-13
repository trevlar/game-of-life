import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { RootState } from '../store';

import { setBoardId, setBoards, setSaveEnabled, setSelectedBoard } from './gameSlice';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.REACT_APP_API_BASE_URL || '';

const getErrorPayload = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data || { message: error.message };
  }

  return { message: error instanceof Error ? error.message : 'Unknown error' };
};

export const checkApiConnection = createAsyncThunk(
  'boards/checkApiConnection',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/ping`);

      if (response.data.message === 'pong') {
        dispatch(setSaveEnabled({ isSaveEnabled: true }));
      }

      return response.data.message;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

export const loadBoards = createAsyncThunk(
  'boards/loadBoards',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/boards`);

      dispatch(setBoards({ boards: response.data }));

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);

interface SaveBoardResponse {
  id: string | number;
}

export const saveBoard = createAsyncThunk<
  SaveBoardResponse,
  void,
  {
    state: RootState; // Define the type of the state
  }
>('boards/saveBoard', async (_, { getState, dispatch, rejectWithValue }) => {
  const state = getState();
  const gameState = state.game;

  const boardData = {
    id: gameState.id || null,
    title: gameState.title,
    description: gameState.description,
    generations: gameState.generations,
    isPlaying: gameState.isPlaying,
    livingCells: gameState.livingCells,
    livingCellCount: gameState.livingCellCount,
    settings: {
      boardSize: gameState.boardSize,
      gameSpeed: gameState.gameSpeed,
      generationsPerAdvance: gameState.generationsPerAdvance,
      wrapAround: gameState.continuousEdges,
      spaceShape: gameState.spaceShape,
    },
  };
  try {
    const response = gameState.id
      ? await axios.put(`${BASE_URL}/api/board/${gameState.id}`, boardData)
      : await axios.post(`${BASE_URL}/api/board`, boardData);

    const boardId = response.data.id;

    dispatch(setBoardId({ id: boardId }));

    return response.data;
  } catch (error) {
    return rejectWithValue(getErrorPayload(error));
  }
});

// Async thunk for selecting a board
export const selectBoard = createAsyncThunk(
  'boards/selectBoard',
  async (boardId: string | number | null, { dispatch, rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/board/${boardId}`);

      dispatch(setSelectedBoard({ game: response.data }));

      return response.data;
    } catch (error) {
      return rejectWithValue(getErrorPayload(error));
    }
  }
);
