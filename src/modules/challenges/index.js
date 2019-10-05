import { actions as sliceActions, selectors as sliceSelectors } from './slice';
import { STATE, TEMP_ID } from 'modules/constants';
import api from 'modules/api';

const root = sliceSelectors.getChallenges;

export const ChallengesSelectors = {
  isLoading: state => root(state).meta === STATE.LOADING,
  isLoaded: state => root(state).meta === STATE.LOADED,
  challenges: state => root(state).data,
  challengeCreationPending: (state, props) =>
    (root(state).data[TEMP_ID] || {}).meta === STATE.CREATING,
  challenge: (state, props) => root(state).data[props.challengeId],
};

export const ChallengesActions = {
  createChallenge: data => dispatch => {
    dispatch(sliceActions.createChallengePending());
    return api.createChallenge(data).then(response => {
      dispatch(sliceActions.createChallengeSuccess(response));
      return response;
    });
  },

  fetchChallenges: (force = false) => (dispatch, getState) => {
    if (ChallengesSelectors.isLoaded(getState()) && !force) {
      console.log('Challenges already loaded');
      return;
    }

    dispatch(sliceActions.fetchChallengesPending());
    return api.fetchChallenges().then(response => {
      dispatch(sliceActions.fetchChallengesSuccess(response));
    });
  },
};
