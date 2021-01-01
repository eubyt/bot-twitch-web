import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createConection } from './wss/streamlabsRemote';
import { createTmi } from './wss/twitchChatbot';
import Home from './page/home';
import Comando from './page/comando';

function App() {

  const [state, setState] = useState("Home")
  const project = useSelector(state => state.project);
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("obs-data")) {
      let data = JSON.parse(localStorage.getItem("obs-data"))
      createConection(data.url, data.token, () => {
      }, () => { }, dispatch)
    }

    if (localStorage.getItem("twitch-data")) {
      let data = JSON.parse(localStorage.getItem("twitch-data"))
      createTmi(data.username, data.oauth, [data.username], () => { }, () => { }, dispatch)
    }

    if (!localStorage.getItem("command-obsRemote")) {
      localStorage.setItem("command-obsRemote", JSON.stringify({
        command: "!setscene",
        defaultScene: "Game",
        response: "Scene changed to: $name"
      }))
    }

  }, [])

  return (
    <div>
      <nav className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0">
        <div className="navbar-brand col-sm-3 col-md-2 mr-0 fs-4">Twitch Bot</div>
      </nav>
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 d-none d-md-block bg-light sidebar">
            <div className="sidebar-sticky">
              <ul className="nav flex-column">
                <li className="nav-item">
                  <a className="nav-link" href="/#" onClick={() => setState("Home")}>
                    <span data-feather="home"></span>
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/#" onClick={() => setState("Comando")}>
                    <span data-feather="terminal"></span>
                    Comando
                </a>
                </li>
              </ul>
            </div>
          </nav>
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
            {state == "Home" && (<Home />)}
            {state == "Comando" && (<Comando />)}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
