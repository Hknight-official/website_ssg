import logo from './logo.svg';
import './App.css';
import socketClient  from "socket.io-client";
import {useEffect} from "react";

import configWebsite from './config_website.json'

function App() {
  useEffect(() => {
    console.log(configWebsite)
    let socket = socketClient(configWebsite.url)
    socket.on('connection', () => {
      console.log(`I'm connected with the back-end`);
    });
    fetch(configWebsite.url+'/api/bird').then(r => console.log(r))
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
