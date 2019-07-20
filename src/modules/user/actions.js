import { actions } from "./index";
import api from "modules/api";
import { loadToken } from "modules/localStorage";

export const initLogin = () => dispatch => {
  const token = loadToken();
  if (token) {
    api.setToken(token);
    dispatch(actions.initLogin());
    return api
      .fetchUser(token)
      .then(user => {
        const payload = { token: token, user: user };
        dispatch(actions.loginSuccess(payload));
      })
      .catch(error => {
        dispatch(actions.unauthenticated());
        console.error(error);
      });
  }
  dispatch(actions.unauthenticated());
};

export const redirectForLogin = (previousPath="/") => dispatch => {
  console.log("dispatching setReturnToRoute: " + previousPath)
  dispatch(actions.setReturnToRoute(previousPath));
};
