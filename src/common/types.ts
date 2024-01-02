export interface GameState {
  id?: string;
  title: string;
  description: string;
  livingCells: string[];
  generations: number;
  isPlaying: boolean;
  boardSize: number;
  virtualBoardSize: number;
  gameSpeed: string;
  liveCellColor: string;
  deadCellColor: string;
  backgroundColor: string;
  continuousEdges: boolean;
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
  id: string;
  title: string;
  description: string;
  livingCells: string[];
  generations: number;
  isPlaying: boolean;
  livingCellCount: number;
  settings?: SettingsPayload;
  // deprecated
  board?: boolean[][];
}

export interface GamePayload {
  id?: string;
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
  continuousEdges?: boolean;
  generationsPerAdvance?: number;
}
