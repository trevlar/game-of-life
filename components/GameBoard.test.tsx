import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';

import gameReducer, { setBoardMouseAction } from '../store/game/gameSlice';

import GameBoard from './GameBoard';

jest.mock('@react-three/drei', () => ({
  Box: ({ children, name, onClick, onPointerDown, onPointerOver }) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick({ stopPropagation: jest.fn() });
      }}
      onMouseDown={(e) => {
        e.preventDefault();
        onPointerDown({ clientX: 0, clientY: 0, stopPropagation: jest.fn() });
      }}
      onMouseEnter={(e) => {
        e.preventDefault();
        onPointerOver({ stopPropagation: jest.fn() });
      }}
    >
      {name}
      {children}
    </button>
  ),
  OrbitControls: () => <div />,
  Preload: () => <div />,
}));

jest.mock('@react-three/fiber', () => {
  const Canvas = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(function Canvas(
    { children },
    ref
  ) {
    return <div ref={ref}>{children}</div>;
  });

  return {
    Canvas,
    useThree: () => ({
      camera: {
        zoom: 1,
        position: {
          z: 1,
        },
      },
      set: () => null,
    }),
  };
});

jest.mock('./ThreeJSElements', () => ({
  AmbientLight: () => null,
  CurvedSpaceSurface: () => null,
  DirectionalLight: () => null,
  MeshStandardMaterial: ({ color }) => <span data-color={color} />,
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
    expect(screen.getByRole('button', { name: /cell-0-0-dead/i })).toBeInTheDocument();
  });

  it('does not draw while move mode is selected', async () => {
    renderGameboard();

    fireEvent.click(screen.getByRole('button', { name: /cell-2-1-dead/i }));

    expect(store.getState().game.livingCells[1]?.[2]).toBeUndefined();
  });

  it('draws a cell when draw mode is selected', async () => {
    store.dispatch(setBoardMouseAction({ action: 'draw' }));
    renderGameboard();

    fireEvent.mouseDown(screen.getByRole('button', { name: /cell-2-1-dead/i }));

    expect(store.getState().game.livingCells[1][2]).toBe(true);
    expect(store.getState().game.livingCellCount).toBe(1);
  });

  it('draws while dragging in draw mode', async () => {
    store.dispatch(setBoardMouseAction({ action: 'draw' }));
    renderGameboard();

    fireEvent.mouseDown(screen.getByRole('button', { name: /cell-2-1-dead/i }));
    fireEvent.mouseEnter(screen.getByRole('button', { name: /cell-3-1-dead/i }));

    expect(store.getState().game.livingCells[1][2]).toBe(true);
    expect(store.getState().game.livingCells[1][3]).toBe(true);
  });
});
