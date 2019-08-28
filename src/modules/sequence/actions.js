import { actions } from "./index";
import api from "modules/api";

export const loadSequence = (id) => dispatch => {
  dispatch(actions.fetchSequencePending());
  return api
    .loadSequence(id)
    .then(response => {
      dispatch(actions.fetchSequenceSuccess(response));
      return response;
    });
}