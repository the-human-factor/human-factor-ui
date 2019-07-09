import { selectors } from "./slice";
import { State, TEMP_ID } from "modules/utils";

const root = selectors.getChallenges;

export const isLoading = state => root(state).meta === State.LOADING;
export const isLoaded = state => root(state).meta === State.LOADED;

export const challenges = state => root(state).data;

export const challengeCreationPending = (state, props) =>
  root(state).data[TEMP_ID].meta === State.CREATING;

export const challenge = (state, props) => root(state).data[props.challengeId];
