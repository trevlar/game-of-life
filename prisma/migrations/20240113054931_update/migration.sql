-- CreateTable
CREATE TABLE "game_states" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "board_desc" TEXT,
    "living_cells" TEXT NOT NULL,
    "generations" INTEGER NOT NULL,
    "is_playing" BOOLEAN NOT NULL,
    "living_cell_count" INTEGER NOT NULL,
    "settings_id" INTEGER NOT NULL,
    "board" TEXT NOT NULL,
    "virtual_board" TEXT NOT NULL,
    CONSTRAINT "game_states_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "game_settings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "game_settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "board_size" INTEGER,
    "game_speed" TEXT,
    "gens_per_advance" INTEGER,
    "wrap_around" BOOLEAN
);

-- CreateTable
CREATE TABLE "game_progress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "generations" INTEGER NOT NULL,
    "live_cells" TEXT NOT NULL,
    "settings_id" INTEGER,
    "steps" INTEGER,
    "cell_row" INTEGER,
    "cell_col" INTEGER,
    CONSTRAINT "game_progress_settings_id_fkey" FOREIGN KEY ("settings_id") REFERENCES "game_settings" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
