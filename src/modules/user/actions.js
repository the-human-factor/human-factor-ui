import { actions } from "./index";
import api from "modules/api";

export const initLogin = () => dispatch => {
  dispatch(actions.initialCheck());
  return api
    .getUser()
    .then(user => {
      dispatch(actions.loginSuccess(user));
    })
    .catch(error => {
      dispatch(actions.unauthenticated());
      console.error(error);
    });
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