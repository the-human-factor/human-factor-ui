import React from "react";
import { render } from "react-dom";
import "./index.css";

import ProvisionedApp from "./ProvisionedApp";

import * as serviceWorker from "./serviceWorker";

if (process.env.NODE_ENV !== "production") {
  window.store = require("storeContainer").default;
  window.api = require("modules/api");
  window.challenges = require("modules/challenges");
}

const renderApp = () => {
  render(<ProvisionedApp />, document.getElementById("root"));
};

if (process.env.NODE_ENV !== "production" && module.hot) {
  module.hot.accept("./App", renderApp);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

renderApp();
