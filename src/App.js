import React from 'react';
import { Router, navigate } from '@reach/router';

import Home from './pages/Home';
import Profile from './pages/Profile';
import LoginRegister from './pages/LoginRegister';
import NavPage from './pages/NavPage';
import ChallengeRecorder from './pages/ChallengeRecorder';
import FullPageLoader from './pages/FullPageLoader';
import TakeChallenge from './pages/TakeChallenge';
import ResponseViewer from './pages/ResponseViewer';
import ChallengeList from './pages/ChallengeList';
import ResponseList from './pages/ResponseList';
import HumanAdmin from './components/HumanAdmin';
import { UserSelectors, UserActions } from 'modules/user';
import { useActions, useSelectors } from 'hooks';

const App = props => {
  const actions = useActions(UserActions);
  const { isInitializing, isLoggedIn } = useSelectors(UserSelectors);

  if (isInitializing) {
    return <FullPageLoader />;
  }

  const pathname = window.location.pathname;
  if (!isLoggedIn && pathname !== '/login' && pathname !== '/register' && pathname != '/') {
    actions.redirectForLogin(pathname);
    navigate('/login');
  }

  return (
    <NavPage>
      <Router>
        <Home path="/" />
        <Profile path="/profile" />
        <LoginRegister path="/login" mode="login" />
        <LoginRegister path="/register" mode="register" />
        <ChallengeList path="/role-play" />
        <ChallengeRecorder path="/role-play/create" />
        <TakeChallenge path="/role-plays/:challengeId" />
        <ResponseList path="/responses" />
        <ResponseViewer path="/responses/:responseId" />
        <HumanAdmin path="/challengeAdmin" />
      </Router>
    </NavPage>
  );
};

export default App;
