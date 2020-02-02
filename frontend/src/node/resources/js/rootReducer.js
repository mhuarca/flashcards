import { combineReducers } from 'redux';

import auth from './reducers/auth';
import common from './reducers/common';
import flashcards from './reducers/flashcards';


export default combineReducers({
  auth,
  flashcards,
  common,
});
