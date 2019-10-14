import { combineReducers } from 'redux';
import { reducer as challenges } from 'modules/challenges/slice';
import { reducer as responses } from 'modules/responses/slice';
import { reducer as user } from 'modules/user/slice';

export default combineReducers({
  challenges,
  responses,
  user,
});
