import React from 'react';
import './App.css';
import RecipeFinder from './RecipeFinder';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Finder</h1>
      </header>
      <main>
        <RecipeFinder />
      </main>
    </div>
  );
}

export default App;
