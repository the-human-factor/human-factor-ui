import createStore from 'createStore';
import { createBrowserHistory } from 'history';
import requestDispatcher from 'modules/requestDispatcher';

export const history = createBrowserHistory();

export const store = createStore(history);

requestDispatcher.setStore(store);
