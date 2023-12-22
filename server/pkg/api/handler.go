package api

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"game-of-life/api/internal/game"
	"io"
	"net/http"

	"github.com/gorilla/mux"
)

func PingHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode("pong")
}

/**
 * SaveBoardHandler handles the saving of a game board
 * @param {sql.DB} db
 * @returns {http.HandlerFunc}
 */
func SaveBoardHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var payload game.SaveGamePayload

		body, err := io.ReadAll(r.Body)
		if err != nil {
			fmt.Printf("Error Reading Body: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		err = json.Unmarshal(body, &payload)
		if err != nil {
			fmt.Printf("Error getting payload: %v\n", err)
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		settingsStmt, err := db.Prepare("INSERT INTO game_settings (board_size, game_speed, gens_per_advance, wrap_around) VALUES (?, ?, ?, ?)")
		if err != nil {
			fmt.Printf("Error inserting settings: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer settingsStmt.Close()

		result, err := settingsStmt.Exec(
			payload.Settings.BoardSize,
			payload.Settings.GameSpeed,
			payload.Settings.GenerationsPerAdvance,
			payload.Settings.WrapAround,
		)
		if err != nil {
			fmt.Printf("Error executing settings insert: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		settingsID, err := result.LastInsertId()
		if err != nil {
			fmt.Printf("Error getting insert id: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		livingCellsJSON, err := json.Marshal(payload.LivingCells)
		if err != nil {
			fmt.Printf("Error marshaling board: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		gameStateStmt, err := db.Prepare("INSERT INTO game_states (title, board_desc, living_cells, generations, is_playing, living_cell_count, settings_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
		if err != nil {
			fmt.Printf("Error preparing game_states insert: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer gameStateStmt.Close()

		_, err = gameStateStmt.Exec(payload.Title, payload.Description, livingCellsJSON, payload.Generations, payload.IsPlaying, payload.LivingCells, settingsID)

		if err != nil {
			fmt.Printf("Error executing game_states insert: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		gameStateId, err := result.LastInsertId()
		if err != nil {
			fmt.Printf("Error getting game states id: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")

		response := struct {
			ID int64 `json:"id"`
		}{
			ID: gameStateId,
		}

		if err := json.NewEncoder(w).Encode(response); err != nil {
			fmt.Printf("Error encoding response: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

/**
 * UpdateBoardHandler handles the updating of a game board
 * @param {sql.DB} db
 * @returns {http.HandlerFunc}
 */
func UpdateBoardHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		boardId := vars["id"]

		var payload game.SaveGamePayload

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer r.Body.Close()

		err = json.Unmarshal(body, &payload)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		_, err = db.Exec(`
					UPDATE settings
					SET board_size = ?, game_speed = ?, wrap_around = ?
					WHERE id = (SELECT settings_id FROM game_states WHERE id = ?)`, payload.Settings.BoardSize, payload.Settings.GameSpeed, payload.Settings.WrapAround, boardId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		livingCellsJSON, err := json.Marshal(payload.LivingCells)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		_, err = db.Exec(`
					UPDATE game_states
					SET title = ?, board_desc = ?, living_cells = ?
					WHERE id = ?`, payload.Title, payload.Description, livingCellsJSON, boardId)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(payload)
	}
}

/**
 * GetBoardsListHandler handles the getting of a list of game boards
 * @param {sql.DB} db
 * @returns {http.HandlerFunc}
 */
func GetBoardsListHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT id, title, board_desc, generations, is_playing, living_cell_count FROM game_states")
		if err != nil {
			fmt.Printf("Error getting boards list: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		var boardsList []game.SavedGame

		for rows.Next() {
			var board game.SavedGame

			err = rows.Scan(&board.ID, &board.Title, &board.Description, &board.Generations, &board.IsPlaying, &board.LivingCellCount)
			if err != nil {
				fmt.Printf("Error scanning rows: %v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			boardsList = append(boardsList, board)
		}

		if err = rows.Err(); err != nil {
			fmt.Printf("Error iterating rows: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(boardsList)
	}
}

/**
 * LoadBoardHandler handles the loading of a game board
 * @param {sql.DB} db
 * @returns {http.HandlerFunc}
 */
func LoadBoardHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]

		var savedGame game.SavedGame
		savedGame.Settings = new(game.Settings)
		var boardJSON, virtualBoardJSON, livingCellsJSON string

		err := db.QueryRow(`
			SELECT gs.id, gs.title, gs.board_desc, gs.living_cells, gs.board, gs.virtual_board, gs.generations, gs.is_playing, gs.living_cell_count, s.board_size, s.game_speed, s.gens_per_advance, s.wrap_around
			FROM game_states gs
			JOIN game_settings s ON gs.settings_id = s.id
			WHERE gs.id = ?`, id).Scan(
			&savedGame.ID,
			&savedGame.Title,
			&savedGame.Description,
			&livingCellsJSON,
			&boardJSON,
			&virtualBoardJSON,
			&savedGame.Generations,
			&savedGame.IsPlaying,
			&savedGame.LivingCellCount,
			&savedGame.Settings.BoardSize,
			&savedGame.Settings.GameSpeed,
			&savedGame.Settings.GenerationsPerAdvance,
			&savedGame.Settings.WrapAround,
		)
		if err != nil {
			if err == sql.ErrNoRows {
				fmt.Printf("No rows found: %v\n", err)
				http.NotFound(w, r)
			} else {
				fmt.Printf("Error querying database: %v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}
			return
		}

		if livingCellsJSON != "" {
			if err := json.Unmarshal([]byte(livingCellsJSON), &savedGame.LivingCells); err != nil {
				fmt.Printf("Error unmarshaling living cells: %v\n", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}

		if err := json.Unmarshal([]byte(boardJSON), &savedGame.Board); err != nil {
			fmt.Printf("Error unmarshaling board: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		if err := json.Unmarshal([]byte(virtualBoardJSON), &savedGame.VirtualBoard); err != nil {
			fmt.Printf("Error unmarshaling virtualBoard: %v\n", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(savedGame)
	}
}
