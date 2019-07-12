import { combineReducers } from "redux";
import challenges from "modules/challenges";
import responses from "modules/responses";

export default combineReducers({ challenges, responses });
