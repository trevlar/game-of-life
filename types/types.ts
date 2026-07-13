export type SpaceShape =
  | 'flat'
  | 'torus'
  | 'horizontal-cylinder'
  | 'vertical-cylinder'
  | 'mobius-strip'
  | 'klein-bottle'
  | 'projective-plane';

export interface GameState {
  id?: string | number | null;
  title: string;
  description: string;
  livingCells: boolean[][];
  generations: number;
  isPlaying: boolean;
  boardSize: number;
  virtualBoardSize: number;
  boardMouseAction: 'draw' | 'erase' | 'move';
  gameSpeed: string;
  liveCellColor: string;
  deadCellColor: string;
  backgroundColor: string;
  zoomLevel: number;
  continuousEdges: boolean;
  spaceShape: SpaceShape;
  generationsPerAdvance: number;
  livingCellCount: number;
  boardList: SavedGame[];
  isSaveEnabled: boolean;
}

export type Cell = {
  x: number;
  y: number;
};

export interface SavedGame {
  id: string | number;
  title: string;
  description?: string;
  boardDesc?: string | null;
  livingCells: string;
  generations: number;
  isPlaying: boolean;
  livingCellCount: number;
  settings?: SettingsPayload;
  // deprecated
  board?: boolean[][];
}

export interface GamePayload {
  id?: string | number;
  title?: string;
  description?: string;
  steps?: number;
  cell?: { row: number; col: number };
}

export interface SettingsPayload {
  boardSize?: number;
  gameSpeed?: string;
  liveCellColor?: string;
  deadCellColor?: string;
  backgroundColor?: string;
  zoomLevel?: number;
  continuousEdges?: boolean;
  spaceShape?: SpaceShape;
  generationsPerAdvance?: number;
  gensPerAdvance?: number;
  action?: 'draw' | 'erase' | 'move';
  wrapAround?: boolean;
}
