import { createSlice } from "redux-starter-kit";

const challengesSlice = createSlice({
  slice: "chalenges",
  initialState: {},
  reducers: {
    createChallengePending() {},
    createChallengeSuccess(state, action) {
      const challenge = action.payload;
      state[challenge.id] = challenge;
    }
  }
});

const { actions, selectors, reducer } = challengesSlice;

export { actions, selectors };
export default reducer;
