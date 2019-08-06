import { actions, selectors } from "./index";

import api from "modules/api";

export const initLogin = () => dispatch => {
  dispatch(actions.initialCheck());
  // TODO: See if tokens are in the local storage
  return api
    .getUser()
    .then(user => {
      dispatch(actions.loginSuccess(user));
    })
    .catch(error => {
      console.error(error);
      dispatch(actions.unauthenticated());
    });
};

export const redirectForLogin = (previousPath="/") => dispatch => {
  dispatch(actions.setReturnToRoute(previousPath));
};

export const login = (values) => dispatch => {
  dispatch(actions.loginPending());
  return api
    .login(values)
    .then(res => {
      console.log("Logged in as:");
      console.log(res);
      dispatch(actions.loginSuccess(res.user));
      // TODO: Redirect
      console.log(`Need to redirect to ${selectors.returnToRoute}`);
    })
    .catch(error => {
      dispatch(actions.unauthenticated());
    });
}

export const register = (values) => dispatch => {
  dispatch(actions.registerPending());
  return api
    .register(values)
    .then(res => {
      console.log("Registered as:");
      console.log(res);
      dispatch(actions.registerSuccess(res.user));
      // TODO: Redirect
      console.log(`Need to redirect to ${selectors.returnToRoute}`);
    })
    .catch(error => {
      dispatch(actions.unauthenticated());
    });
}