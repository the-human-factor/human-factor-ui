import { actions } from "./index";

import api from "modules/api";

export const initLogin = () => dispatch => {
  dispatch(actions.initialCheck());

  api.updateUser = (user) => {
    if (user === undefined) {
      dispatch(actions.unauthenticated());
    } else {
      dispatch(actions.authenticated(user));
    }
  }

  return api.refresh()
    .then(user => {})
    .catch(error => {});
};

export const redirectForLogin = (previousPath="/") => dispatch => {
  dispatch(actions.setReturnToRoute(previousPath));
};

export const login = (credentials) => dispatch => {
  dispatch(actions.loginPending());
  return api.login(credentials)
    .then(user => {
      console.log("login succcess");
    })
    .catch(error => {
      console.error(error);
    });
}

export const register = (credentials) => dispatch => {
  dispatch(actions.registerPending());
  return api.register(credentials);
}

export const logout = () => dispatch => {
  dispatch(actions.logoutPending());
  return api.logout();
}