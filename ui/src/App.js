import React from "react";
import Home from "./Home";
import NavBar from './components/NavBar'
import ChallengeRecorder from "./ChallengeRecorder";
import ResponseRecorder from "./ResponseRecorder";
import { Router } from "@reach/router";
import "./App.css";

const App = () => (
  <React.Fragment>
    <Router>
      <NavBar path="/">
        <Home path="/" />
        <ResponseRecorder path="/challenge/:challengeId" />
        <ChallengeRecorder path="/createchallenge/" />
      </NavBar>
    </Router>
  </React.Fragment>
);

export default App;
