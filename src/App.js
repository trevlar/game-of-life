import logo from './logo.svg';
import './App.css';
import GameControls from './features/GameControls';
import GameBoard from './features/GameBoard';

function GameOfLife() {
  return (
    <div className="App">
      <header className="App-header">
        Conways Game of Life
      </header>
      <GameControls />
      <GameBoard />
    </div>
  );
}

export default App;
