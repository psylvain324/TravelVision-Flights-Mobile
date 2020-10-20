import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import FindFlight from './components/flights/FindFlights';

class App extends Component {
  render() {
    return (
      <div>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Travel Vision - Flights</h1>
          </header>
        </div>
        <FindFlight></FindFlight>
      </div>
    );
  }
}

export default App;
