import {
  APP_LOAD,
  CREATE_RESOURCE_AND_REDIRECT,
  SHOW_MODAL,
  HIDE_MODAL,
  LOGIN,
  LOGOUT,
  PLAY_DECK,
  REDIRECT,
  REGISTER,
  CREATE_DECK,
  GET_RESOURCE,
} from '../constants/actionTypes';

const defaultState = {
  appLoaded: false,
  currentUser: null,
  token: null,
  modalIsShowing: false,
  modalContent: null,
  redirectTo: null,
  createdObject: null,
  createdLink: null,
};


export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null,
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGOUT:
      return {
        ...state,
        redirectTo: '/',
        token: null,
        currentUser: null,
      };
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        token: action.error ? null : action.payload.user.token,
        currentUser: action.error ? null : action.payload.user,
      };
    case CREATE_DECK:
    case CREATE_RESOURCE_AND_REDIRECT:
      /**
       * Note: This front end logic expects the API to return an object of
       * the below format whenever we use POST to create a resource:
       * {
       *  "created": {}
       *  "link": {}
       * }
       */

      let redirectDest = '/'; // eslint-disable-line no-case-declarations
      if (!action.error && action.redirectFn) {
        redirectDest = action.redirectFn(action.payload.created, action.payload.link);
      }
      return {
        ...state,
        redirectTo: action.error ? null : redirectDest,
        createdObject: action.error ? null : action.payload.created,
        createdLink: action.error ? null : action.payload.link,
      };
    case GET_RESOURCE:
      return {
        ...state,
        createdLink: null,
      };
    case SHOW_MODAL:
      return {
        ...state,
        modalIsShowing: true,
        modalContent: action.value,
      };
    case HIDE_MODAL:
      return {
        ...state,
        modalIsShowing: false,
        modalContent: null,
      };
    case PLAY_DECK:
      return {
        ...state,
        redirectTo: `/deck/play/${action.deckId}`,
      };
    default:
      return state;
  }
};
