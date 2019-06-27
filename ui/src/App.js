import React from "react";

import HumanTheme from "./themes/HumanTheme";
import Home from "./pages/Home";
import NavPage from "./pages/NavPage";
import ChallengeRecorder from "./pages/ChallengeRecorder";
import ResponseRecorder from "./pages/ResponseRecorder";
import ListChallenges from "./pages/ListChallenges";

import { Router } from "@reach/router";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

const App = () => (
  <MuiThemeProvider theme={HumanTheme}>
    <Router>
      <NavPage path="/">
        <Home path="/" />
        <ResponseRecorder path="/challenge/:challengeId" />
        <ChallengeRecorder path="/challenge/create" />
        <ListChallenges path="/challenge/list" />
      </NavPage>
    </Router>
  </MuiThemeProvider>
);

export default App;
