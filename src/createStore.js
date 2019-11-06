import { combineReducers } from 'redux';

import { configureStore, getDefaultMiddleware } from 'redux-starter-kit';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import { adminReducer, adminSaga } from 'react-admin';

import { reducer as challenges } from 'modules/challenges/slice';
import { reducer as responses } from 'modules/responses/slice';
import { reducer as user } from 'modules/user/slice';

// This is based on the react-admin's store initialization. It sets up the
// routerMiddleware for the react-router, but the main app uses reach router.
// TODO: Decide how to integrate the app with react-admin better.

export default ({ dataProvider, history, preloadedState = {} }) => {
  const reducer = combineReducers({
    challenges,
    responses,
    user,
    admin: adminReducer,
    router: connectRouter(history),
  });

  const saga = function* rootSaga() {
    yield all(
      [
        adminSaga(dataProvider),
        // add your own sagas here
      ].map(fork)
    );
  };

  const sagaMiddleware = createSagaMiddleware();

  const store = configureStore({
    reducer,
    middleware: [
      sagaMiddleware,
      routerMiddleware(history),
      ...getDefaultMiddleware(),
    ],
    preloadedState,
  });

  sagaMiddleware.run(saga);
  return store;
};
