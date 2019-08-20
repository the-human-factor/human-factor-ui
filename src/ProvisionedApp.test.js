import React from 'react';
import ReactDOM from 'react-dom';
import ProvisionedApp from './ProvisionedApp';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ProvisionedApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
