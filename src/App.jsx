import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { useHistory } from "react-router-dom";

import Landing from "./components/Landing"
import Lobby from "./components/lobby"
//import Create from "./components/Create";
//import Game from "./components/Game";


class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path='/' render={props => <Landing {...props} />} />
          <Route path= '/lobby' render={props => <Lobby {...props} />} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App;

// <Route path='/rooms/:id' render={props => <Game {...props} />} />