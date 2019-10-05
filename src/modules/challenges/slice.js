import { createSlice } from 'redux-starter-kit';
import { STATE, TEMP_ID } from 'modules/constants';

export const { actions, selectors, reducer } = createSlice({
  slice: 'challenges',
  initialState: { data: {}, meta: STATE.NOT_LOADED },
  reducers: {
    // Create challenge
    createChallengePending(state) {
      const challenge = { meta: STATE.CREATING };
      challenge.meta = STATE.CREATING;
      state.data[TEMP_ID] = challenge;
    },
    createChallengeSuccess(state, action) {
      const challenge = action.payload;
      state.data[challenge.id] = challenge;
      delete state.data[TEMP_ID];
    },

    // Fetch challenges
    fetchChallengesPending(state) {
      state.meta = STATE.LOADING;
    },
    fetchChallengesSuccess(state, action) {
      const challengesById = action.payload.reduce((acc, challenge) => {
        acc[challenge.id] = challenge;
        return acc;
      }, {});
      state.meta = STATE.LOADED;
      state.data = challengesById;
    },
  },
});
