import { createSlice } from "redux-starter-kit";
import { State, TEMP_ID } from "modules/utils";

export const { actions, selectors, reducer } = createSlice({
  slice: "challenges",
  initialState: { data: {}, meta: State.NOT_LOADED },
  reducers: {
    // Create challenge
    createChallengePending(state) {
      const challenge = { meta: State.CREATING };
      challenge.meta = State.CREATING;
      state.data[TEMP_ID] = challenge;
    },
    createChallengeSuccess(state, action) {
      const challenge = action.payload;
      console.log(state, challenge);
      state.data[challenge.id] = challenge;
      delete state.data[TEMP_ID];
    },

    // Fetch challenges
    fetchChallengesPending(state) {
      state.meta = State.LOADING;
    },
    fetchChallengesSuccess(state, action) {
      const challengesById = action.payload.reduce((acc, challenge) => {
        acc[challenge.id] = challenge;
        return acc;
      }, {});
      state.meta = State.LOADED;
      state.data = challengesById;
    }
  }
});
