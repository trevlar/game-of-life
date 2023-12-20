# Conways Game of Life

This React front end application implements a simulation of [Conway’s Game of Life Conway's Game of Life - Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

The UI has fulfilled the following requirements: 

[x] A board that allows turning on and off squares 
[x] A way to advance to the next state 
[x] A way to play forever the next states 
[x] A way to advance x number of states 

The following additional requirements have been implemented:

[x] The board uses a toroidal structure such that the edges board wrap to the other side.
[x] A way to set the speed of the play through
[x] A way to set the size of the board
[x] A way to reset or clear the board
[x] A way to track the number of generations since the board was created
[x] A way to save and load the board from an API
[x] A mobile friendly UI
[x] Switch to continuous edges retains live cells in proper positions.
[x] Board size changes to retain live cells in proper positions.
[x] Performance gains by tracking primarily live cells and their neighbors.

Additional requirements not implemented:

[ ] A mobile friendly painting UX

I've built a web service in Golang for the API that uses a SQLite database. The API implements a save and load functionality that is not required by the react front end. The API is called from a Redux thunk. The API is not deployed to a server, but the code is included in the repo.