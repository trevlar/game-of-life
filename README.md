# Conway's Game of Life

This is a React-based front-end application that simulates [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). It is a cellular automoton created by British mathmetician John Horton Conway in 1970. This project replicates an interactive implementation of the game that allows users to explore the patterns that emerge based on the initial input state.

## Purpose

This application allows me to demonstrate my ability to build a React application from scratch. The application is built with the following technologies:

- [React](https://reactjs.org/): A JavaScript library for building user interfaces.
- [Redux Toolkit](https://redux-toolkit.js.org/): The official library for Redux stores.
- [React Redux](https://react-redux.js.org/): The official React bindings for Redux.
- [Redux Thunk](https://redux.js.org/usage/writing-logic-thunks): A middleware for Redux that allows asynchronous logic to be dispatched.
- [Mantine UI](https://mantine.dev/): A React UI component library.
- [Golang](https://golang.org/): A statically typed, compiled programming language.
- [SQLite](https://www.sqlite.org/index.html): A relational database management system.

## Getting Started

### Prerequisites

Before starting ensure that you have the following:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
- You have downloaded or cloned the [repository](https://github.com/trevlar/game-of-life).
- If you plan to run the backend API locally:
  - You have installed the latest version of [Golang](https://golang.org/dl/).
  - You have installed and properly configured [SQLite](https://www.sqlite.org/download.html).

### Installing

To install the application, follow these steps:

1. Open a terminal and navigate to the root directory of the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm start` to start the application.
4. Open a browser and navigate to `http://localhost:3000`.
5. If you plan to run the backend API locally:
   1. Open a separate terminal and navigate to the `server` directory.
   2. Run `go run cmd/main.go` to start the API.
   3. The API will be available at `http://localhost:8080`.
   4. Refresh the client application to use the API.

## Features

The application includes the following features:

- Toggling Cells: Click on squares to toggle their state.
- The ability to advance to the next state of the game.
- An option to continuously play the game, automatically advancing states.
- The ability to advance a specified number of states at once.

Additional features include:

- The option to toggle a toroidal board structure, where the edges of the board wrap around to the other side.
- Adjustable speed for automatic playthroughs.
- Adjustable board size.
- The ability to reset or clear the board.
- A counter tracking the number of generations since the board was created.
- The ability to save and load the board state from an API.
- Best performing algorithm that processes live cells and their neighbors for mutations.

## Backend API

The application is backed by a web service API built with Golang. The API uses a SQLite database and provides endpoints to save and load a board. The API is called from a Redux thunk. The API is not deployed and is included in this repository with instructions on how to run it locally.

For more information about the API, see the [README](server/README.md) in the `server` directory.
