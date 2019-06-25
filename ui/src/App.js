import React from "react";
import Home from "./Home";
import VideoRecorder from "./VideoRecorder";
import { Router } from "@reach/router";
import "./App.css";

const App = () => (
  <Router>
    <Home path="/" />
    <VideoRecorder path="/challenge/:challengeId" />
  </Router>
);

export default App;
