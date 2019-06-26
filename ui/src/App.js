import React from "react";
import Home from "./Home";
import ChallengeRecorder from "./ChallengeRecorder";
import ResponseRecorder from "./ResponseRecorder";
import { Router } from "@reach/router";
import "./App.css";

const App = () => (
  <Router>
  <Home path="/" />
  <ResponseRecorder path="/challenge/:challengeId" />
  <ChallengeRecorder path="/createchallenge/" />
  </Router>
);

export default App;
