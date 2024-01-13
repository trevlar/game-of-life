CREATE TABLE game_states (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  board_desc TEXT,
  living_cells TEXT NOT NULL,
  generations INTEGER NOT NULL,
  is_playing BOOLEAN NOT NULL,
  living_cell_count INTEGER NOT NULL,
  settings_id INTEGER NOT NULL,
  -- deprecated in favor of the live_cells column
  board TEXT NOT NULL,
  virtual_board TEXT NOT NULL,
  FOREIGN KEY(settings_id) REFERENCES settings(id)
);

CREATE TABLE game_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  board_size INTEGER,
  game_speed TEXT,
  gens_per_advance INTEGER,
  wrap_around BOOLEAN
);

CREATE TABLE game_progress (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  generations INTEGER,
  live_cells TEXT NOT NULL,
  settings_id INTEGER,
  steps INTEGER,
  cell_row INTEGER,
  cell_col INTEGER,
  FOREIGN KEY(settings_id) REFERENCES game_settings(id)
);