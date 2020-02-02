import { Provider } from 'react-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import ErrorApp from './ErrorApp';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <ErrorApp />
  </Provider>,
  document.getElementById('root'),
);
