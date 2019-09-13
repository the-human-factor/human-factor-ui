import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Router, navigate } from "@reach/router";
import { bindActionCreators } from "redux";

import * as UserActions from "modules/user/actions";
import * as UserSelectors from "modules/user/selectors";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import LoginRegister from "./pages/LoginRegister";
import NavPage from "./pages/NavPage";
import ChallengeRecorder from "./pages/ChallengeRecorder";
import FullPageLoader from "./pages/FullPageLoader";
import TakeChallenge from "./pages/TakeChallenge";
import ResponseViewer from "./pages/ResponseViewer";
import ChallengeList from "./pages/ChallengeList";
import ResponseList from "./pages/ResponseList";

const App = props =>  {
  const isInitializing = useSelector(state => UserSelectors.isInitializing(state));
  const isLoggedIn = useSelector(state => UserSelectors.isLoggedIn(state));
  const dispatch = useDispatch();
  const actions = bindActionCreators(UserActions, dispatch);

  if (isInitializing) {
    return <FullPageLoader />;
  }

  // TODO: Is this the correct place for the redirect?
  const pathname = window.location.pathname;
  if (!isLoggedIn && pathname !== "/login" && pathname !== "/register") {
    actions.redirectForLogin(pathname);
    navigate("/login");
  }

  return (
    <NavPage>
      <Router>
        <Home path="/" />
        <Profile path="/profile" />
        <LoginRegister path="/login" mode="login" />
        <LoginRegister path="/register" mode="register" />
        <ChallengeList path="/challenges" />
        <ChallengeRecorder path="/challenges/create" />
        <TakeChallenge path="/challenges/:challengeId" />
        <ResponseList path="/responses" />
        <ResponseViewer path="/responses/:responseId" />
      </Router>
    </NavPage>
  );
}

export default App;
