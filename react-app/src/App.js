import logo from './logo.svg';
import './App.css';
import React from 'react';
import rd3 from 'react-d3-library';
import Example from './Visualization.js';




function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Example />
        <p>
          Mitchell's React App
        </p>
      </header>
    </div>
  );
}

export default App;
