import { selectors } from "./slice";
import { State, TEMP_ID } from "modules/utils";

const root = selectors.getResponses;

export const isLoading = state => root(state).meta === State.LOADING;
export const isLoaded = state => root(state).meta === State.LOADED;

export const responses = state => root(state).data;

export const responseCreationPending = (state, props) =>
  root(state).data[TEMP_ID].meta === State.CREATING;

export const response = (state, props) => root(state).data[props.responseId];
