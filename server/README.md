# Conways Game of Life Server

This is the backend API allows users to save and retrieve board configurations for [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

### Endpoints

The API provides the following endpoints:

- `GET /api/boards`: Returns a list of all saved boards.
- `GET /board/{id}`: Returns the board with the specified ID.
- `POST /board`: Saves a new board and returns the ID.
- `PUT /board/{id}`: Updates the board with the specified ID.
