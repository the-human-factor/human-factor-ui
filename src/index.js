import React from 'react';
import { render } from 'react-dom';

import * as Sentry from '@sentry/browser';

import './index.css';
import ProvisionedApp from './ProvisionedApp';
import * as serviceWorker from './serviceWorker';

// https://docs.sentry.io/error-reporting/configuration/?platform=javascript
Sentry.init({
  dsn: 'https://0041534a8c7c47cfa5b910c330f71397@sentry.io/1543622',
  environment: process.env.NODE_ENV,
});

if (process.env.NODE_ENV !== 'production') {
  window.store = require('reduxGlobals').store;
  window.api = require('modules/api');
  window.challenges = require('modules/challenges');
  window.theme = require('./themes/humanTheme');
  window.setEnv = env => localStorage.setItem('env', env);
}

const renderApp = () => {
  render(<ProvisionedApp />, document.getElementById('root'));
};

if (process.env.NODE_ENV !== 'production' && module.hot) {
  module.hot.accept('./App', renderApp);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

renderApp();
