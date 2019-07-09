import { actions } from "./index";
import HumanApi from "api";

const api = new HumanApi();

export const createChallenge = data => dispatch => {
  dispatch(actions.createChallengePending());
  return api.createChallenge(data).then(challenge => {
    dispatch(actions.createChallengeSuccess(challenge));
  });
};
