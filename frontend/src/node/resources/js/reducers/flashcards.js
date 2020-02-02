import {
  ASYNC_START,
  BLUR_DATA_FIELD_UPDATE,
  CARD_DATA_FIELD_UPDATE,
  UPDATE_FLASHCARD_FIELD,
  CREATE_DECK,
  CREATE_DECK_PAGE_UNLOADED,
  EDIT_DECK_PAGE_UNLOADED,
  GET_DECK_EDIT_DATA,
  GET_DECKS,
  GET_PLAY_DECK,
  EMPTY_EDITABLE_FIELD_FOUND,
  EDITABLE_FIELD_HAS_VALUE,
  RESET_FLASHCARDS_STATE,
  UPDATE_ROWS,
  UPDATE_SNACKBAR_TRIGGER,
} from '../constants/actionTypes';

const defaultState = {
  apiError: null,
  inProgress: false,
  validationAllowed: false,
  title: null,
  category: 'General',
  rowsNeedToBeUpdated: true,
  getDeckEditDataApiCallComplete: false,
  editableDeck: null,
  cardFoundWithEmptyValue: false,
  getDeckDataApiError: null,
  unsavedRowQuestion: '',
  unsavedRowAnswer: '',
  emptyFieldsLookup: new Map(),
  cardDataMap: new Map(),
  snackbarTriggerDetected: false,
  deckList: null,
  getDeckListApiError: null,
  getDeckListAttempted: false,
  getPlayDeckAttempted: false,
  playDeck: null,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case CREATE_DECK:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null,
      };
    case EDIT_DECK_PAGE_UNLOADED:
    case CREATE_DECK_PAGE_UNLOADED:
    case RESET_FLASHCARDS_STATE:
      return defaultState;
    case ASYNC_START:
      if (action.subtype === CREATE_DECK
          || action.subtype === UPDATE_ROWS
          || action.subtype === GET_DECKS
          || action.subtype === GET_PLAY_DECK) {
        return { ...state, inProgress: true };
      }
      if (action.subtype === GET_DECK_EDIT_DATA) {
        return {
          ...state,
          rowsNeedToBeUpdated: false,
          inProgress: true,
        };
      }
      break;
    case UPDATE_SNACKBAR_TRIGGER:
      return { ...state, snackbarTriggerDetected: action.value };
    case UPDATE_FLASHCARD_FIELD:
      return { ...state, [action.key]: action.value };
    case EMPTY_EDITABLE_FIELD_FOUND:
      // If array doesn't have this value yet, add it.
      if (!state.emptyFieldsLookup.has(action.fieldId)) {
        state.emptyFieldsLookup.set(action.fieldId, true);
      }
      return {
        ...state,
        emptyFieldsLookup: state.emptyFieldsLookup,
      };
    case EDITABLE_FIELD_HAS_VALUE:
      // If this newly filled field didn't have a value before, remove it
      // from the array.
      if (state.emptyFieldsLookup.has(action.fieldId)) {
        state.emptyFieldsLookup.delete(action.fieldId);
      }
      return {
        ...state,
        emptyFieldsLookup: new Map(state.emptyFieldsLookup),
      };
    case BLUR_DATA_FIELD_UPDATE:
    case CARD_DATA_FIELD_UPDATE:
      if (action.fieldValue) {
        state.emptyFieldsLookup.delete(action.fieldId);
      } else {
        state.emptyFieldsLookup.set(action.fieldId, true);
      }
      state.cardDataMap.set(action.fieldId, action.fieldValue);
      return {
        ...state,
        snackbarTriggerDetected: action.type === BLUR_DATA_FIELD_UPDATE ? true : state.snackbarTriggerDetected,
        cardDataMap: new Map(state.cardDataMap),
        emptyFieldsLookup: new Map(state.emptyFieldsLookup),
      };
    case GET_DECK_EDIT_DATA:
      // If no error, hydrate the cardDataMap with the card entries
      if (!action.error) {
        state.cardDataMap.clear();
        action.payload.deck.cards.forEach((card) => {
          state.cardDataMap.set(`${card.id}.question`, card.question);
          state.cardDataMap.set(`${card.id}.answer`, card.answer);
        });
        // Also add the 'unsaved' fields to the 'empty' map by default.
        state.emptyFieldsLookup.set('unsavedRow.question', true);
        state.emptyFieldsLookup.set('unsavedRow.answer', true);
      }
      return {
        ...state,
        inProgress: false,
        cardDataMap: new Map(state.cardDataMap),
        emptyFieldsLookup: new Map(state.emptyFieldsLookup),
        rowsNeedToBeUpdated: false,
        getDeckEditDataApiCallComplete: true,
        editableDeck: action.error ? null : action.payload.deck,
        getDeckDataApiError: action.error || null,
      };
    case GET_DECKS:
      return {
        ...state,
        getDeckListAttempted: true,
        getDeckListApiError: action.error ? action.payload.apiError : null,
        deckList: action.error ? null : action.payload.decks,
      };
    case UPDATE_ROWS:
      return {
        ...state,
        apiError: action.error ? action.payload.apiError : null,
        rowsNeedToBeUpdated: !action.error,
        snackbarTriggerDetected: false,
      };
    case GET_PLAY_DECK:
      return {
        ...state,
        getPlayDeckAttempted: true,
        apiError: action.error ? action.payload.apiError : null,
        playDeck: action.payload.deck,
      };
    default:
      return state;
  }
  return state;
};
