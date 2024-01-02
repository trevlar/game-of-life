import { MantineProvider } from '@mantine/core';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import App from './App';
import gameReducer from './game/gameSlice';

jest.mock('axios', () => ({
  default: jest.fn(),
}));

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

jest.mock('./game/components/ThreeJSElements', () => ({
  AmbientLight: () => null,
  DirectionalLight: () => null,
  MeshStandardMaterial: (props) => <div data-ambient-light={props.color} />,
  Group: ({ children }) => <div>{children}</div>,
  CameraHelper3JS: () => null,
}));

describe('App', () => {
  let store;
  const renderApp = () => {
    return render(
      <MantineProvider>
        <Provider store={store}>
          <App />
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
    renderApp();
  });

  it('toggles play state when switch is clicked', () => {
    renderApp();

    const switchButton = screen.getByRole('checkbox');
    fireEvent.click(switchButton);

    expect(store.getState().game.isPlaying).toBe(true);
  });

  it('opens settings when settings icon is clicked', async () => {
    renderApp();

    const settingsButton = screen.getByRole('button', { name: 'settings' });
    fireEvent.click(settingsButton);

    expect(await screen.findByText('Game Settings')).toBeInTheDocument();
  });
});
