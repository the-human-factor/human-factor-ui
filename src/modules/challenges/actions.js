import { actions } from "./index";
import api from "modules/api";
import { selectors } from "./";

export const createChallenge = data => dispatch => {
  dispatch(actions.createChallengePending());
  return api.createChallenge(data).then(response => {
    dispatch(actions.createChallengeSuccess(response.data));
    return response.data;
  });
};

export const fetchChallenges = (force = false) => (dispatch, getState) => {
  if (selectors.isLoaded(getState()) && !force) {
    console.log("Challenges already loaded");
    return;
  }

  dispatch(actions.fetchChallengesPending());
  return api
    .fetchChallenges()
    .then(response => {
      dispatch(actions.fetchChallengesSuccess(response.data));
    });
};
