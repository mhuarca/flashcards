import agent from './agent';
import {
  ASYNC_START,
  LOGIN,
  LOGOUT,
  REGISTER,
} from './constants/actionTypes';

const isPromise = (obj) => obj && typeof obj.then === 'function';

const promiseMiddleware = (store) => (next) => (action) => {
  if (isPromise(action.payload)) {
    store.dispatch({ type: ASYNC_START, subtype: action.type });

    const modifiedAction = { ...action }; // << Eslint didn't like modifying param directly.
    return action.payload.then(
      (response) => {
        modifiedAction.payload = response;
        store.dispatch(modifiedAction);
      },
      (error) => {
        modifiedAction.error = true;
        modifiedAction.payload = error.response.body;
        store.dispatch(modifiedAction);
      },
    );
  }
  // It was not a promise, continue reducing...
  return next(action);
};

/**
 * Middleware that will add/remove the JWT
 * to/from local storage for specific actions.
 * @param {object} store Store provided by redux
 */
// eslint-disable-next-line no-unused-vars
const localStorageMiddleware = (store) => (next) => (action) => {
  if (action.type === REGISTER || action.type === LOGIN) {
    if (!action.error) {
      window.localStorage.setItem('jwt', action.payload.user.token);
      agent.setToken(action.payload.user.token);
    }
  } else if (action.type === LOGOUT) {
    window.localStorage.setItem('jwt', '');
    agent.setToken(null);
  }
  next(action);
};

export {
  promiseMiddleware,
  localStorageMiddleware,
};
