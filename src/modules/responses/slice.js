import { createSlice } from 'redux-starter-kit';
import { STATE } from 'modules/constants';

export const { actions, selectors, reducer } = createSlice({
  slice: 'responses',
  initialState: { data: {}, meta: STATE.NOT_LOADED },
  reducers: {
    // Create responses
    createResponsePending(state) {
      // TODO(Alex): This was causing a bug because it wasn't being removed on
      // successful creation - wondering what the intention was @Leo
      // There is a similar pattern in challenges
      // const response = { meta: STATE.CREATING };
      // response.meta = STATE.CREATING;
      // state.data[TEMP_ID] = response;
    },
    createResponseSuccess(state, action) {
      const response = action.payload;
      state.data[response.id] = response;
    },
    // Fetch responses
    fetchResponsesPending(state) {
      state.meta = STATE.LOADING;
    },
    fetchResponsesSuccess(state, action) {
      const responsesById = action.payload.reduce((acc, response) => {
        acc[response.id] = response;
        return acc;
      }, {});
      state.meta = STATE.LOADED;
      state.data = responsesById;
    },
  },
});
