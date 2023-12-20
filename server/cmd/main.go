package main

import (
	"fmt"
	"game-of-life/api/internal/db"
	"game-of-life/api/pkg/api"
	"log"
	"net/http"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
)

const port = "8080"

func main() {
	db, err := db.OpenDatabase()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := mux.NewRouter()
	r.HandleFunc("/api/boards", api.GetBoardsListHandler(db)).Methods("GET")
	r.HandleFunc("/api/board", api.SaveBoardHandler(db)).Methods("POST")

	r.HandleFunc("/api/board/{id}", api.LoadBoardHandler(db)).Methods("GET")
	r.HandleFunc("/api/board/{id}", api.UpdateBoardHandler(db)).Methods("PUT")

	corsOpts := handlers.CORS(
		handlers.AllowedOrigins([]string{"*"}), // Adjust in production
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}),
		handlers.AllowedHeaders([]string{"Accept", "Accept-Language", "Content-Type", "Authorization"}),
	)

	fmt.Println()
	fmt.Printf(`Conways Game of Life App API listening on port %s`, port)
	fmt.Println()
	fmt.Println()
	fmt.Print(`You can now send requests to the API server`)
	fmt.Println()
	fmt.Println()
	fmt.Printf("\tLocal: \t\t http://localhost:%s/api", port)
	fmt.Println()
	fmt.Printf("\tOn Your Network: http://192.168.0.117:%s/api", port)
	fmt.Println()
	fmt.Println()

	http.ListenAndServe(":8080", corsOpts(r))
}
