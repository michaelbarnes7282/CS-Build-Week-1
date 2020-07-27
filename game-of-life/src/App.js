import React, { useState } from 'react';
import Grid from './components/Grid.js'
import './App.css';



function App() {

  return (
    <div className="App">
      <header>
        <h3>Welcome to Conway's Game of Life!</h3>
      </header>
      <div>
        <Grid />
      </div>
    </div>
  );
}

export default App;
