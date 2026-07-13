import gameReducer, {
  nextGeneration,
  setBoardAtLocation,
  setBoardMouseAction,
  setBoardSize,
  setContinuousEdges,
  setLivingCells,
  setSelectedBoard,
  setSpaceShape,
} from './gameSlice';

describe('gameSlice', () => {
  it('uses continuous edges by default for new boards', () => {
    const state = gameReducer(undefined, { type: 'test/init' });

    expect(state.continuousEdges).toBe(true);
  });

  it('draws and erases cells idempotently', () => {
    let state = gameReducer(undefined, setBoardMouseAction({ action: 'draw' }));

    state = gameReducer(state, setBoardAtLocation({ cell: { row: 1, col: 2 } }));
    state = gameReducer(state, setBoardAtLocation({ cell: { row: 1, col: 2 } }));

    expect(state.livingCells[1][2]).toBe(true);
    expect(state.livingCellCount).toBe(1);

    state = gameReducer(state, setBoardMouseAction({ action: 'erase' }));
    state = gameReducer(state, setBoardAtLocation({ cell: { row: 1, col: 2 } }));
    state = gameReducer(state, setBoardAtLocation({ cell: { row: 1, col: 2 } }));

    expect(state.livingCells[1]?.[2]).toBeUndefined();
    expect(state.livingCellCount).toBe(0);
  });

  it('normalizes saved board API fields', () => {
    const state = gameReducer(
      undefined,
      setSelectedBoard({
        game: {
          id: 12,
          title: 'Loaded',
          boardDesc: 'Stored description',
          livingCells: JSON.stringify([[true]]),
          generations: 8,
          isPlaying: false,
          livingCellCount: 1,
          settings: {
            boardSize: 12,
            gameSpeed: 'fast',
            gensPerAdvance: 5,
            wrapAround: true,
          },
        },
      })
    );

    expect(state.id).toBe(12);
    expect(state.description).toBe('Stored description');
    expect(state.generationsPerAdvance).toBe(5);
    expect(state.continuousEdges).toBe(true);
  });

  it('preserves explicitly disabled continuous edges from saved boards', () => {
    const state = gameReducer(
      undefined,
      setSelectedBoard({
        game: {
          id: 13,
          title: 'Loaded',
          livingCells: JSON.stringify([]),
          generations: 0,
          isPlaying: false,
          livingCellCount: 0,
          settings: {
            wrapAround: false,
          },
        },
      })
    );

    expect(state.continuousEdges).toBe(false);
  });

  it('advances cells across edges by default', () => {
    const livingCells: boolean[][] = [];
    livingCells[0] = [];
    livingCells[0][2] = true;
    livingCells[3] = [];
    livingCells[3][2] = true;
    livingCells[4] = [];
    livingCells[4][2] = true;

    let state = gameReducer(undefined, setBoardSize({ boardSize: 5 }));
    state = gameReducer(
      state,
      setLivingCells({
        livingCells,
      })
    );

    state = gameReducer(state, nextGeneration());

    expect(state.livingCells[4][1]).toBe(true);
    expect(state.livingCells[4][2]).toBe(true);
    expect(state.livingCells[4][3]).toBe(true);
  });

  it('can disable continuous edges', () => {
    const state = gameReducer(undefined, setContinuousEdges({ continuousEdges: false }));

    expect(state.continuousEdges).toBe(false);
  });

  it('forces continuous edges when torus space is selected', () => {
    let state = gameReducer(undefined, setContinuousEdges({ continuousEdges: false }));

    state = gameReducer(state, setSpaceShape({ spaceShape: 'torus' }));

    expect(state.spaceShape).toBe('torus');
    expect(state.continuousEdges).toBe(true);
  });

  it('forces continuous edges for every non-flat topology', () => {
    const topologies = [
      'horizontal-cylinder',
      'vertical-cylinder',
      'mobius-strip',
      'klein-bottle',
      'projective-plane',
    ] as const;

    topologies.forEach((spaceShape) => {
      let state = gameReducer(undefined, setContinuousEdges({ continuousEdges: false }));

      state = gameReducer(state, setSpaceShape({ spaceShape }));
      state = gameReducer(state, setContinuousEdges({ continuousEdges: false }));

      expect(state.spaceShape).toBe(spaceShape);
      expect(state.continuousEdges).toBe(true);
    });
  });
});
