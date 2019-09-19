import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import challenges from "modules/challenges";
import responses from "modules/responses";
import {reducer as user} from "modules/user/slice";

export default combineReducers({ 
  challenges,
  responses,
  user,
  form: formReducer
});
