import React from "react";
import Home from "./Home";
import NavPage from './components/NavPage'
import ChallengeRecorder from "./ChallengeRecorder";
import ResponseRecorder from "./ResponseRecorder";
import HumanTheme from "./theme/HumanTheme";
import { Router } from "@reach/router";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import "./App.css";

const App = () => (
  <MuiThemeProvider theme={HumanTheme}>
    <Router>
      <NavPage path="/">
        <Home path="/" />
        <ResponseRecorder path="/challenge/:challengeId" />
        <ChallengeRecorder path="/challenge/create" />
      </NavPage>
    </Router>
  </MuiThemeProvider>
);

export default App;
