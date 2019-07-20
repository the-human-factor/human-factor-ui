import { createSlice } from "redux-starter-kit";
import { LoginState } from "modules/utils";

export const { actions, selectors, reducer } = createSlice({
  slice: "user",
  initialState: {
    user: {},
    token: "",
    returnToRoute: "/",
    meta: LoginState.INIT_STATE
  },
  reducers: {
    setReturnToRoute(state, action) {
      state.returnToRoute = action.payload;
    },
    initLogin(state) {
      state.meta = LoginState.INIT_STATE;
    },
    unauthenticated(state) {
      state.meta = LoginState.LOGGED_OUT;
      state.user = {};
      state.token = "";
    },
    loginPending(state) {
      state.meta = LoginState.LOGGING_IN;
    },
    loginSuccess(state, action) {
      state.user = action.payload;
      state.meta = LoginState.LOGGED_IN;
    },
    registerPending(state) {
      state.meta = LoginState.LOGGING_IN;
    },
    registerSuccess(state, action) {
      state.user = action.payload;
      state.meta = LoginState.LOGGED_IN;
    }
    // TODO: logout
  }
});
