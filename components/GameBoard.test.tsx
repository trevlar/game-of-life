import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import gameReducer from '../store/game/gameSlice';

import GameBoard from './GameBoard';

jest.mock('@react-three/drei', () => ({
  Box: ({ name, onPointerDown, onPointerEnter }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onPointerDown();
      }}
      onMouseEnter={(e) => {
        e.preventDefault();
        onPointerEnter();
      }}
    >
      {name}
    </button>
  ),
  Preload: () => <div />,
  ScrollControls: ({ children }) => <div>{children}</div>,
}));

jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div>{children}</div>,
  useThree: () => ({
    camera: {
      zoom: 1,
      position: {
        z: 1,
      },
    },
    set: () => null,
  }),
}));

jest.mock('./ThreeJSElements', () => ({
  AmbientLight: () => null,
  DirectionalLight: () => null,
  MeshStandardMaterial: (props) => <div data-ambient-light={props.color} />,
  Group: ({ children }) => <div>{children}</div>,
  CameraHelper3JS: () => null,
}));

describe('GameBoard', () => {
  let store;

  const renderGameboard = () => {
    return render(
      <Provider store={store}>
        <GameBoard />
      </Provider>
    );
  };

  beforeEach(() => {
    store = configureStore({
      reducer: {
        game: gameReducer,
      },
    });
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('renders without crashing', async () => {
    renderGameboard();
  });

  it('toggles cell state on mouse down', async () => {
    renderGameboard();

    const cell0 = await screen.findByRole('button', { name: 'cell-0-0-dead' });
    fireEvent.mouseDown(cell0);

    expect(store.getState().game.livingCells).toContain('0,0');
  });

  it('does not toggle cell state on mouse enter when mouse is not down', async () => {
    renderGameboard();

    const cells = await screen.findByRole('button', { name: 'cell-0-0-dead' });
    fireEvent.mouseEnter(cells);

    expect(store.getState().game.livingCells).not.toContain('0,0');
  });

  it('toggles cell state on mouse enter when mouse is down', async () => {
    renderGameboard();

    const cell0 = await screen.findByRole('button', { name: 'cell-0-0-dead' });
    fireEvent.mouseDown(cell0);
    const cell1 = await screen.findByRole('button', { name: 'cell-0-1-dead' });
    fireEvent.mouseEnter(cell1);
    fireEvent.mouseDown(cell0);

    expect(store.getState().game.livingCells).toContain('0,1');
    expect(store.getState().game.livingCells).not.toContain('0,0');
  });
});
