export interface GameState {
  board: boolean[][];
  generations: number;
  isPlaying: boolean;
  boardSize: number;
  gameSpeed: string;
}

export interface GamePayload {
  steps?: number;
  cell?: { row: number; col: number };
}

export interface SettingsPayload {
  boardSize?: number;
  gameSpeed?: string;
}
