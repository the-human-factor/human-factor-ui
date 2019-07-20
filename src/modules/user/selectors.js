import { selectors } from "./slice";
import { LoginState } from "modules/utils";

const root = selectors.getUser;

export const isLoggingOn = state => root(state).meta === LoginState.LOGGING_IN;

export const isLoggedOut = state => root(state).meta === LoginState.LOGGED_OUT;

export const isLoggedOn = state => root(state).meta === LoginState.LOGGED_ON;

export const isLoginInit = state => root(state).meta === LoginState.INIT_STATE;

export const returnToRoute = state => root(state).returnToRoute;

export const user = state => root(state).user;
