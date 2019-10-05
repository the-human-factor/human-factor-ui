import { actions as sliceActions, selectors as sliceSelectors } from './slice';
import { STATE, TEMP_ID } from 'modules/constants';
import api from 'modules/api';

const root = sliceSelectors.getResponses;

export const ResponsesSelectors = {
  isLoading: state => root(state).meta === STATE.LOADING,
  isLoaded: state => root(state).meta === STATE.LOADED,
  responses: state => root(state).data,
  responseCreationPending: (state, props) =>
    (root(state).data[TEMP_ID] || {}).meta === STATE.CREATING,
  response: (state, props) => root(state).data[props.responseId],
};

export const ResponsesActions = {
  createResponse: data => dispatch => {
    dispatch(sliceActions.createResponsePending());
    return api.createResponse(data).then(response => {
      dispatch(sliceActions.createResponseSuccess(response));
      return response;
    });
  },
  fetchResponses: (force = false) => (dispatch, getState) => {
    if (ResponsesSelectors.isLoaded(getState()) && !force) {
      console.log('Responses already loaded');
      return;
    }

    dispatch(sliceActions.fetchResponsesPending());
    return api.fetchResponses().then(response => {
      dispatch(sliceActions.fetchResponsesSuccess(response));
    });
  },
};
