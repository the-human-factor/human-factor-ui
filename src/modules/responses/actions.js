import { actions } from "./index";
import api from "modules/api";
import { selectors } from "./";

export const createResponse = data => dispatch => {
  dispatch(actions.createResponsePending());
  return api.createResponse(data).then(response => {
    dispatch(actions.createResponseSuccess(response));
  });
};

export const fetchResponses = (force = false) => (dispatch, getState) => {
  if (selectors.isLoaded(getState()) && !force) {
    console.log("Responses already loaded");
    return;
  }

  dispatch(actions.fetchResponsesPending());
  return api
    .fetchResponses()
    .then(responses => dispatch(actions.fetchResponsesSuccess(responses)));
};
