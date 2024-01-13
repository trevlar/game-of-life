# Conway's Game of Life

This is a Next.js app built as a React-based front-end application that simulates [Conway's Game of Life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life). It is a cellular automoton created by British mathmetician John Horton Conway in 1970. This project replicates an interactive implementation of the game that allows users to explore the patterns that emerge based on the initial input state.

## Purpose

This application allows me to demonstrate my ability to build a React application from scratch. The application is built with the following technologies:

- [React](https://react.dev/): A JavaScript library for building user interfaces.
- [Next.js](https://nextjs.org/): A React framework for building server-side rendered and statically generated applications.
- [Redux Toolkit](https://redux-toolkit.js.org/): The official library for Redux stores.
- [React Redux](https://react-redux.js.org/): The official React bindings for Redux.
- [Redux Thunk](https://redux.js.org/usage/writing-logic-thunks): A middleware for Redux that allows asynchronous logic to be dispatched.
- [Three.js](https://github.com/mrdoob/three.js/) Light-weight, cross-browser, general purpose 3D library that uses a WebGL renderer.  
- [React Three Fiber](https://github.com/pmndrs/react-three-fiber) Self contained, reusable React components for three.js.
- [Mantine UI](https://mantine.dev/): A React UI component library.

## Getting Started

### Prerequisites

Before starting ensure that you have the following:

- You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
- You have downloaded or cloned the [repository](https://github.com/trevlar/game-of-life).

### Installing

To install the application, follow these steps:

1. Open a terminal and navigate to the root directory of the repository.
2. Run `npm install` to install the dependencies.
3. Run `npm start` to start the application.
4. Open a browser and navigate to `http://localhost:3000`.
5. Update directions to get the server db running locally.

## Features

The application includes the following features:

- Panning using click and drag and zooming using the scroll wheel.
- Erasing from the board to remove live cells.
- Drawing on the board to create live cells.
- The ability to advance to the next state of the game.
- An option to continuously play the game, automatically advancing states.
- The ability to advance a specified number of states at once.

Additional features include:

- The option to toggle a toroidal board structure, where the edges of the board wrap around to the other side.
- Adjustable speed for automatic playthroughs.
- Adjustable board size.
- The ability to set the color of live cells, dead cells and the boards background.
- The ability to reset or clear the board.
- A counter tracking the number of generations since the board was created.
- The ability to save and load the board state from an API.
- Best performing algorithm that processes live cells and their neighbors for mutations.
- Using Canvas element with three.js to render the board.

## Backend API

The application is backed by a web server integrated into Next.js. The API uses a TBD database and provides endpoints to save and load a board. The API is called from a Redux thunk.
