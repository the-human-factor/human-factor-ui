import React from "react";
import { connect } from "react-redux";
import { compose } from "recompose";
import { Router, navigate } from "@reach/router";
import { bindActionCreators } from "redux";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import * as UserActions from "modules/user/actions";
import * as UserSelectors from "modules/user/selectors";
import HumanTheme from "./themes/HumanTheme";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LoginRegister from "./pages/LoginRegister";
import NavPage from "./pages/NavPage";
import ChallengeRecorder from "./pages/ChallengeRecorder";
import FullPageLoader from "./pages/FullPageLoader";
import ResponseRecorder from "./pages/ResponseRecorder";
import ResponseViewer from "./pages/ResponseViewer";
import ChallengeList from "./pages/ChallengeList";
import ResponseList from "./pages/ResponseList";

const App = props =>  {
  if (props.isInitializing) {
    return <FullPageLoader />;
  }

  // TODO: Is this the correct place for the redirect?
  const pathname = window.location.pathname;
  if (!props.isLoggedIn && pathname !== "/login" && pathname !== "/register") {
    props.actions.redirectForLogin(pathname);
    navigate("/login");
  }

  return (
    <MuiThemeProvider theme={HumanTheme}>
      <NavPage>
        <Router>
          <Home path="/" />
          <Profile path="/profile" />
          <LoginRegister path="/login" mode="login" />
          <LoginRegister path="/register" mode="register" />
          <ChallengeList path="/challenges" />
          <ChallengeRecorder path="/challenges/create" />
          <ResponseRecorder path="/challenges/:challengeId" />
          <ResponseList path="/responses" />
          <ResponseViewer path="/responses/:responseId" />
        </Router>
      </NavPage>
    </MuiThemeProvider>
  );
}

export default compose(
  connect(
    state => ({
        isInitializing: UserSelectors.isInitializing(state),
        isLoggedIn: UserSelectors.isLoggedIn(state)
    }),
    dispatch => ({
      actions: bindActionCreators(UserActions, dispatch)
    })
  )
)(App);
