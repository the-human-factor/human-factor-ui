import React from "react";
import { render } from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import { initLogin } from "./modules/user/actions";
import createStore from "./store";
import * as serviceWorker from "./serviceWorker";

const store = createStore();

// Actually it should redirect to /login ( /register)
// if needed and save the previous path
// 
// but it could be loggingOn, in which case
// the FullPageLoader should be first 
const boundInitLogin = () => store.dispatch(initLogin())
boundInitLogin();

if (process.env.NODE_ENV !== "production") {
  window.store = store;
  window.api = require("modules/api");
  window.challenges = require("modules/challenges");
}

const renderApp = () => {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById("root")
  );
};

if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./App", renderApp);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

renderApp();
