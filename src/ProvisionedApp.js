import React from "react";
import { Provider } from "react-redux";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";

import App from "./App";
import store from "./storeContainer";
import ErrorBoundary from "./components/ErrorBoundary";
import { UserActions } from "./modules/user";
import { HumanTheme } from "./themes/HumanTheme";

store.dispatch(UserActions.initLogin());

const ProvisionedApp = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <MuiThemeProvider theme={HumanTheme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  </ErrorBoundary>
);

export default ProvisionedApp;