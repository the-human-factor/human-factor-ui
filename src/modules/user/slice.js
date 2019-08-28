import { createSlice } from "redux-starter-kit";
import { LoginState } from "modules/constants";

export const { actions, selectors, reducer } = createSlice({
  slice: "user",
  initialState: {
    user: {},
    userClaims: {},
    returnToRoute: "/",
    meta: LoginState.INITIALIZING
  },
  reducers: {
    setReturnToRoute(state, action) {
      state.returnToRoute = action.payload;
    },
    initializing(state) {
      state.meta = LoginState.INITIALIZING;
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
      state.userClaims = {};
    },
    registerPending(state) {
      state.meta = LoginState.REGISTERING;
    },
    unauthenticated(state) {
      state.meta = LoginState.LOGGED_OUT;
      state.user = {};
      state.userClaims = {};
    },
    authenticated(state, action) {
      state.meta = LoginState.LOGGED_IN;
      state.user = action.payload.user;
      state.userClaims = action.payload.token.body.user_claims;
    }
  }
});
