import React from "react";

import HumanTheme from "./themes/HumanTheme";
import Home from "./pages/Home";
import NavPage from "./pages/NavPage";
import ChallengeRecorder from "./pages/ChallengeRecorder";
import ResponseRecorder from "./pages/ResponseRecorder";
import ResponseViewer from "./pages/ResponseViewer";
import ChallengeList from "./pages/ChallengeList";
import ResponseList from "./pages/ResponseList";

import { Router } from "@reach/router";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

const App = () => (
  <MuiThemeProvider theme={HumanTheme}>
    <Router>
      <NavPage path="/">
        <Home path="/" />
        <ChallengeList path="/challenges" />
        <ChallengeRecorder path="/challenges/create" />
        <ResponseRecorder path="/challenges/:challengeId" />
        <ResponseList path="/responses" />
        <ResponseViewer path="/responses/:responseId" />
      </NavPage>
    </Router>
  </MuiThemeProvider>
);

export default App;
