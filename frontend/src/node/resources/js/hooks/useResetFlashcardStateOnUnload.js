import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { RESET_FLASHCARDS_STATE } from '../constants/actionTypes';

/**
 * Shared hook used to reset flashcard state in the
 * flashcards reducer whenever the calling component unloads.
 */
const useResetFlashcardStateOnUnload = () => {
  const dispatch = useDispatch();
  // This will run when the parent component UNLOADS.
  useEffect(() => () => dispatch({ type: RESET_FLASHCARDS_STATE }), []);
};

export default useResetFlashcardStateOnUnload;
