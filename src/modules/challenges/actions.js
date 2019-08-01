import { actions } from "./index";
import api from "modules/api";
import { selectors } from "./";

export const createChallenge = data => dispatch => {
  dispatch(actions.createChallengePending());
  return api.createChallenge(data).then(challenge => {
	  dispatch(actions.createChallengeSuccess(challenge));
    return challenge;
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
    .then(challenges => dispatch(actions.fetchChallengesSuccess(challenges)));
};
