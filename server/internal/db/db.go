package db

import (
	"database/sql"
	"fmt"
	"path/filepath"
	"runtime"

	_ "github.com/mattn/go-sqlite3"
)

func OpenDatabase() (*sql.DB, error) {
	_, b, _, _ := runtime.Caller(0)
	root := filepath.Join(filepath.Dir(b), "../..")

	dbPath := filepath.Join(root, "internal/db/gameOfLife.db")

	fmt.Printf("dbPath: %s\n", dbPath)
	return sql.Open("sqlite3", dbPath)
}
