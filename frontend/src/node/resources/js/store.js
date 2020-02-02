import { applyMiddleware, createStore } from 'redux';

import rootReducer from './rootReducer';
import { promiseMiddleware, localStorageMiddleware } from './middleware';


export default createStore(
  rootReducer,
  applyMiddleware(promiseMiddleware, localStorageMiddleware),
);
