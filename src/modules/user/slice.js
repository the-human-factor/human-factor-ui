import { createSlice } from "redux-starter-kit";
import { LoginState } from "modules/utils";

export const { actions, selectors, reducer } = createSlice({
  slice: "user",
  initialState: {
    user: {},
    returnToRoute: "/",
    meta: LoginState.INITIAL_CHECK
  },
  reducers: {
    setReturnToRoute(state, action) {
      state.returnToRoute = action.payload;
    },
    initialCheck(state) {
      state.meta = LoginState.INITIAL_CHECK;
    },
    loginPending(state) {
      state.meta = LoginState.LOGGING_IN;
    },
    logoutPending(state) {
      state.meta = LoginState.LOGGING_OUT;
    },
    logoutSuccess(state) {
      state.meta = LoginState.LOGGED_OUT;
      state.user = {};
    },
    registerPending(state) {
      state.meta = LoginState.REGISTERING;
    },
    unauthenticated(state) {
      state.meta = LoginState.LOGGED_OUT;
      state.user = {};
    },
    authenticated(state, action) {
      state.meta = LoginState.LOGGED_IN;
      state.user = action.payload;
    }
  }
});
