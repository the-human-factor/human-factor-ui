import { selectors } from "./slice";
import { LoginState } from "modules/utils";

const root = selectors.getUser;

export const isLoggingIn = state => root(state).meta === LoginState.LOGGING_IN;

export const isLoggedOut = state => root(state).meta === LoginState.LOGGED_OUT;

export const isLoggedIn = state => root(state).meta === LoginState.LOGGED_IN;

export const isInitialCheck = state => root(state).meta === LoginState.INITIAL_CHECK;

export const returnToRoute = state => root(state).returnToRoute;

export const user = state => root(state).user;
