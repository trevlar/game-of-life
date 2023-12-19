export interface GameState {
  id?: string;
  title: string;
  description: string;
  board: boolean[][];
  virtualBoard: boolean[][];
  generations: number;
  isPlaying: boolean;
  boardSize: number;
  gameSpeed: string;
  continuousEdges: boolean;
  generationsPerAdvance: number;
  livingCells: number;
  boardList: SavedGame[];
}

export interface SavedGame {
  id: string;
  title: string;
  board?: boolean[][];
  virtualBoard?: boolean[][];
  description: string;
  generations: number;
  isPlaying: boolean;
  livingCells: number;
  settings?: SettingsPayload;
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
  continuousEdges?: boolean;
  generationsPerAdvance?: number;
}
