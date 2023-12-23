import { MantineProvider } from '@mantine/core';
import { configureStore } from '@reduxjs/toolkit';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';

import App from './App';
import gameReducer from './game/gameSlice';

jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: {} })),
}));

// jest.mock('@mantine/hooks', () => ({
//   useMediaQuery: jest.fn(() => false),
//   useIsomorphicEffect: jest.fn(),
//   useInterval: jest.fn(() => ({
//     start: jest.fn(),
//     stop: jest.fn(),
//   })),
//   useWindowEvent: jest.fn(),
//   useFocusTrap: jest.fn(),
//   clamp: jest.fn((value, min, max) => {
//     return Math.min(Math.max(value, min), max);
//   }),
// }));

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
