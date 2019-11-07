import React from 'react';

import { Provider } from 'react-redux';
import { MuiThemeProvider } from '@material-ui/core/styles';

import App from './App';
import { store } from './reduxGlobals';
import ErrorBoundary from './components/ErrorBoundary';
import { UserActions } from './modules/user';
import humanTheme from './themes/humanTheme';

store.dispatch(UserActions.initLogin());

const ProvisionedApp = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <MuiThemeProvider theme={humanTheme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  </ErrorBoundary>
);

export default ProvisionedApp;
