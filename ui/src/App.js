import React from "react";

import HumanTheme from "./themes/HumanTheme";
import Home from "./pages/Home";
import NavPage from "./pages/NavPage";
import ChallengeRecorder from "./pages/ChallengeRecorder";
import ResponseRecorder from "./pages/ResponseRecorder";
import ResponseViewer from "./pages/ResponseViewer";
import ListChallenges from "./pages/ListChallenges";
import ListResponses from "./pages/ListResponses";

import { Router } from "@reach/router";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

const App = () => (
  <MuiThemeProvider theme={HumanTheme}>

    <Router>
      <NavPage path="/">
        <Home path="/" />
        <ResponseRecorder path="/challenge/:challengeId" />
        <ChallengeRecorder path="/challenge/create" />
        <ListChallenges path="/list/challenge" />
        <ListResponses path="/list/response" />
        <ResponseViewer path="/response/:responseId" />
      </NavPage>
    </Router>
  </MuiThemeProvider>
);

export default App;
