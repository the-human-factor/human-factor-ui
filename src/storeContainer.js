import createStore from 'createStore';
import { createBrowserHistory } from 'history';

import dataProvider from 'components/HumanAdmin/dataProvider';

export const history = createBrowserHistory();

const store = createStore({
  dataProvider,
  history: history,
});

export default store;
