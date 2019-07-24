import { actions } from "./index";
import api from "modules/api";
import { loadToken } from "modules/localStorage";

export const tryTokenVerification = () => dispatch => {
  const token = loadToken();
  if (token) {
    api.setToken(token);
    dispatch(actions.initialCheck());
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
  dispatch(actions.setReturnToRoute(previousPath));
};

export const login = (values) => dispatch => {
  console.log(values);
  dispatch(actions.loginPending());
  return api
    .login(values)
    .then(user => {
      // TODO: I need both token and user
      // const
      console.log("Logging in!")
    })
}