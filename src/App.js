import React from 'react';
import './App.css';
import UserPicker from './components/UserPicker/UserPicker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Select Recipient</h1>
        <UserPicker />
      </header>
    </div>
  );
}

export default App;
