import { createSlice } from "redux-starter-kit";
import { SequenceState, TEMP_ID } from "modules/constants";

export const { actions, selectors, reducer } = createSlice({
  slice: "sequence",
  initialState: {
    sequence: {},
    meta: SequenceState.NOT_LOADED
  },
  reducers: {
    fetchSequencePending(state) {
      state.meta = SequenceState.LOADING;
    },
    fetchSequenceSuccess(state, action) {
      state.meta = SequenceState.LOADED;
      state.sequence = action.payload;
    }
  }
});