import { createSlice } from "redux-starter-kit";
import { State, TEMP_ID } from "modules/utils";

export const { actions, selectors, reducer } = createSlice({
  slice: "responses",
  initialState: { data: {}, meta: State.NOT_LOADED },
  reducers: {
    // Create responses
    createResponsePending(state) {
      const response = { meta: State.CREATING };
      response.meta = State.CREATING;
      state.data[TEMP_ID] = response;
    },
    createResponseSuccess(state, action) {
      const response = action.payload;
      console.log(state, response);
      state.data[response.id] = response;
    },
    // Fetch responses
    fetchResponsesPending(state) {
      state.meta = State.LOADING;
    },
    fetchResponsesSuccess(state, action) {
      const responsesById = action.payload.reduce((acc, response) => {
        acc[response.id] = response;
        return acc;
      }, {});
      state.meta = State.LOADED;
      state.data = responsesById;
    }
  }
});
