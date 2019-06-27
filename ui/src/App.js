import React from "react";
import Home from "./Home";
import Header from "./Header";
import ChallengeRecorder from "./ChallengeRecorder";
import ResponseRecorder from "./ResponseRecorder";
import { Router } from "@reach/router";
import "./App.css";

const App = () => (
  <React.Fragment>
    <Router>
      <Header path="/">
        <Home path="/" />
        <ResponseRecorder path="/challenge/:challengeId" />
        <ChallengeRecorder path="/createchallenge/" />
      </Header>
    </Router>
  </React.Fragment>
);

export default App;
