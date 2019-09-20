import { createSlice } from "redux-starter-kit";
import { LOGIN_STATE } from "modules/constants";

export const { actions, selectors, reducer } = createSlice({
  slice: "user",
  initialState: {
    user: {},
    userClaims: {},
    returnToRoute: "/",
    meta: LOGIN_STATE.INITIALIZING
  },
  reducers: {
    setReturnToRoute(state, action) {
      state.returnToRoute = action.payload;
    },
    initializing(state) {
      state.meta = LOGIN_STATE.INITIALIZING;
    },
    loginPending(state) {
      state.meta = LOGIN_STATE.LOGGING_IN;
    },
    logoutPending(state) {
      state.meta = LOGIN_STATE.LOGGING_OUT;
    },
    logoutSuccess(state) {
      state.meta = LOGIN_STATE.LOGGED_OUT;
      state.user = {};
      state.userClaims = {};
    },
    registerPending(state) {
      state.meta = LOGIN_STATE.REGISTERING;
    },
    unauthenticated(state) {
      state.meta = LOGIN_STATE.LOGGED_OUT;
      state.user = {};
      state.userClaims = {};
    },
    authenticated(state, action) {
      state.meta = LOGIN_STATE.LOGGED_IN;
      state.user = action.payload.user;
      state.userClaims = action.payload.token.body.user_claims;
    }
  }
});
