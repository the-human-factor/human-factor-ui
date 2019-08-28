import { selectors } from "./slice";
import { SequenceState } from "modules/constants";

export const sequence = state => root(state).sequence;
export const isLoaded = state => root(state).meta === SequenceState.LOADED;