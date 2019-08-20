import { actions } from "./index";

import api from "modules/api";

export const initLogin = () => dispatch => {
  dispatch(actions.initializing());

  return api.refresh().catch(error => {}); // Do nothing about an error.
};

export const redirectForLogin = (previousPath="/") => dispatch => {
  dispatch(actions.setReturnToRoute(previousPath));
};

export const login = (credentials) => dispatch => {
  dispatch(actions.loginPending());
  return api.login(credentials);
}

export const register = (credentials) => dispatch => {
  dispatch(actions.registerPending());
  return api.register(credentials);
}

export const logout = () => dispatch => {
  dispatch(actions.logoutPending());
  return api.logout();
}