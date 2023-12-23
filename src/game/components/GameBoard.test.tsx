import { MantineProvider } from '@mantine/core';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import gameReducer from '../gameSlice';

import GameBoard from './GameBoard';

describe('GameBoard', () => {
  let store;

  const renderGameboard = () => {
    return render(
      <MantineProvider>
        <Provider store={store}>
          <GameBoard />
        </Provider>
      </MantineProvider>
    );
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        game: gameReducer,
      },
    });
  });

  it('renders without crashing', () => {
    renderGameboard();
  });

  it('toggles cell state on mouse down', async () => {
    renderGameboard();

    const cell0 = await screen.findByRole('button', { name: 'cell-0,0' });
    fireEvent.mouseDown(cell0);

    expect(store.getState().game.livingCells).toContain('0,0');
  });

  it('does not toggle cell state on mouse enter when mouse is not down', async () => {
    renderGameboard();

    const cells = await screen.findByRole('button', { name: 'cell-0,0' });
    fireEvent.mouseEnter(cells);

    expect(store.getState().game.livingCells).not.toContain('0,0');
  });

  it('toggles cell state on mouse enter when mouse is down', async () => {
    renderGameboard();

    const cell0 = await screen.findByRole('button', { name: 'cell-0,0' });
    fireEvent.mouseDown(cell0);
    const cell1 = await screen.findByRole('button', { name: 'cell-0,1' });
    fireEvent.mouseEnter(cell1);
    fireEvent.mouseDown(cell0);

    expect(store.getState().game.livingCells).toContain('0,1');
    expect(store.getState().game.livingCells).not.toContain('0,0');
  });
});
