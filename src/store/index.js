import { configureStore } from 'redux-starter-kit';
import rootReducer from './reducers';

export default function createStore(preloadedState) {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState,
  });

  if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./reducers', () => store.replaceReducer(rootReducer));
  }

  return store;
}
