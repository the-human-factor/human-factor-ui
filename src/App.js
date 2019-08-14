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
import LoginRegister from "./pages/LoginRegister";
import NavPage from "./pages/NavPage";
import ChallengeRecorder from "./pages/ChallengeRecorder";
import FullPageLoader from "./pages/FullPageLoader";
import ResponseRecorder from "./pages/ResponseRecorder";
import ResponseViewer from "./pages/ResponseViewer";
import ChallengeList from "./pages/ChallengeList";
import ResponseList from "./pages/ResponseList";

const App = props => {
  if (props.isInitialCheck) {
    return <FullPageLoader />;
  }

  // TODO: Is this the correct place for the redirect?
  const pathname = window.location.pathname;
  if (!props.isLoggedIn && pathname !== "/login" && pathname !== "/register") {
    props.actions.redirectForLogin(pathname);
    navigate("/login");
    // return <Router><FullPageLoader default /></Router>;
  }

  return (
    <MuiThemeProvider theme={HumanTheme}>
      <NavPage>
        <Router>
          <Home path="/" />
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
        isInitialCheck: UserSelectors.isInitialCheck(state),
        isLoggedIn: UserSelectors.isLoggedIn(state),
        // returnToRoute is included to cause a rerender after redirectForLogin.
        returnToRoute: UserSelectors.returnToRoute(state)

    }),
    dispatch => ({
      actions: bindActionCreators(UserActions, dispatch)
    })
  )
)(App);
