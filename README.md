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

Additional requirements not implemented:

[ ] Fix switch to continuous and board size to retain live cells in proper positions.
[ ] A mobile friendly painting UX

With a normal web service there might be an API, but the React app should take the place of the API. Include all code to simulate the Game of Life but treat that code as if it were going to be called from an API. Do not implement a backend API, unless you want to. 

The implementation should be production ready. You don’t need to implement any authentication/authorization. Be ready to discuss your solution. 