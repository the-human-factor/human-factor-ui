import { actions as sliceActions,
         selectors as sliceSelectors } from "./slice";
import { LOGIN_STATE } from "modules/constants";
import api from "modules/api";

const root = sliceSelectors.getUser;

export const UserSelectors = {
  user: (state) => root(state).user,
  isLoggingIn: (state) => root(state).meta === LOGIN_STATE.LOGGING_IN,
  isLoggedOut: (state) => root(state).meta === LOGIN_STATE.LOGGED_OUT,
  isLoggedIn: (state) => root(state).meta === LOGIN_STATE.LOGGED_IN,
  isInitializing: (state) => root(state).meta === LOGIN_STATE.INITIALIZING,
  returnToRoute: (state) => root(state).returnToRoute
};

export const UserActions = {
  initLogin: () => dispatch => {
    dispatch(sliceActions.initializing());
    return api.refresh().catch(error => {}); // Do nothing about an error.
  },
  redirectForLogin: (previousPath="/") => dispatch => {
    dispatch(sliceActions.setReturnToRoute(previousPath));
  },
  login: (credentials) => dispatch => {
    dispatch(sliceActions.loginPending());
    return api.login(credentials);
  },
  register: (credentials) => dispatch => {
    dispatch(sliceActions.registerPending());
    return api.register(credentials);
  },
  logout: () => dispatch => {
    dispatch(sliceActions.logoutPending());
    return api.logout();
  }
};
