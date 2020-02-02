import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Prompt, useParams } from 'react-router-dom';
import styled from 'styled-components';
import AddBox from '@material-ui/icons/AddBox';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Snackbar from '@material-ui/core/Snackbar';

import agent from '../agent';
import Section from './components/Section';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import YellowButton from './components/forms/YellowButton';
import {
  CARD_DATA_FIELD_UPDATE,
  GET_DECK_EDIT_DATA,
  EDIT_DECK_PAGE_UNLOADED,
  PLAY_DECK,
  UPDATE_SNACKBAR_TRIGGER,
  UPDATE_ROWS,
} from '../constants/actionTypes';


const PlayButton = styled(Button)`
  && {
    border-color: #ab76fc;
    background-color: transparent;
    transition: background-color 0.2s linear;

    .MuiButton-label {
      color: #ab76fc;
      transition: color 0.2s linear;
    }

    &:hover {
      background-color: #ab76fc;

      .MuiButton-label {
        color: #fff;
      }
    }
  }
`;

const Wrapper = styled.div`
  max-width: 1000px;
  margin-right: auto;
  margin-left: auto;
`;

const ButtonBar = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const StyledAddBox = styled(AddBox)`
  margin-right: 0.3em;
`;

const StyledPlayCircle = styled(PlayCircleFilled)`
  margin-right: 0.3em;
`;

const StyledTextArea = styled.textarea`
  display: block;
  width: 100%;
  resize: none;
`;

/**
 * Assumes keys are in "columnName.type" format and extracts
 * the unique columnName's.
 * @param {Map} map Javascript map to get uniqueKeys from.
 */
const getUniqueIds = (map) => {
  const uniqueIds = [];
  Array.from(map.keys()).forEach((key) => {
    const splitItems = key.split('.');
    const cardId = splitItems[0];
    if (uniqueIds.indexOf(cardId) === -1) {
      uniqueIds.push(cardId);
    }
  });
  return uniqueIds;
};

/**
 * React Page used to edit the entries for the current deck.
 * The ID param in the URL is used to load the Deck and its cards
 * from the API.
 */
const EditDeck = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const deckLink = `/decks/${id}`;

  // Flags that control if the "empty textarea" warning is allowed to be triggered.
  // Since these are mainly for UI, we don't need the redux store.
  const [allowEmptyWarning, setAllowEmptyWarning] = useState(false);
  const [showPlaybackWarning, setShowPlaybackWarning] = useState(false);
  const snackbarTriggerDetected = useSelector((state) => state.flashcards.snackbarTriggerDetected);
  const emptyWarningOnCloseHandler = () => {
    dispatch({ type: UPDATE_SNACKBAR_TRIGGER, value: false });
  };

  const rowsNeedToBeUpdated = useSelector((state) => state.flashcards.rowsNeedToBeUpdated);
  const cardDataMap = useSelector((state) => state.flashcards.cardDataMap);
  // eslint-disable-next-line max-len
  const getDeckEditDataApiCallComplete = useSelector((state) => state.flashcards.getDeckEditDataApiCallComplete);
  const getDeckDataApiError = useSelector((state) => state.flashcards.getDeckDataApiError);
  const editableDeck = useSelector((state) => state.flashcards.editableDeck);
  const emptyFieldsLookup = useSelector((state) => state.flashcards.emptyFieldsLookup);

  const sendCardFieldUpdate = (fieldId, fieldValue) => {
    dispatch({ type: CARD_DATA_FIELD_UPDATE, fieldId, fieldValue });
  };

  // eslint-disable-next-line max-len
  const cardFieldUpdateHandler = (fieldId, event) => sendCardFieldUpdate(fieldId, event.target.value);

  // questionField vars
  const updateUnsavedQuestion = useCallback(
    (event) => {
      sendCardFieldUpdate('unsavedRow.question', event.target.value);
    },
    [dispatch],
  );

  const updateUnsavedAnswer = useCallback(
    (event) => sendCardFieldUpdate('unsavedRow.answer', event.target.value),
    [dispatch],
  );

  /* ============== CLICK HANDLERS =============== */
  const addRowHandler = useCallback(
    () => {
      dispatch({ type: UPDATE_SNACKBAR_TRIGGER, value: true });
      // Only run handler if no empty fields.
      if (emptyFieldsLookup.size === 0) {
        const cardIds = getUniqueIds(cardDataMap);
        const cards = [];
        cardIds.forEach((cardId) => {
          const cardEntry = {};
          cardEntry.id = cardId;
          cardEntry.question = cardDataMap.get(`${cardId}.question`);
          cardEntry.answer = cardDataMap.get(`${cardId}.answer`);
          cards.push(cardEntry);
        });
        const postData = {
          modifiedDeck: {
            deckId: id,
            cards,
          },
        };

        const payload = agent.Flashcards.updateRows(postData);
        dispatch({ type: UPDATE_ROWS, payload });
      }
    }, [emptyFieldsLookup, cardDataMap],
  );

  const playButtonHandler = () => {
    if (editableDeck.cards === undefined || editableDeck.cards.length === 0) {
      return setShowPlaybackWarning(true);
    }
    return dispatch({ type: PLAY_DECK, deckId: editableDeck.id });
  };

  const promptHandler = () => {
    let showPrompt = false;
    if (cardDataMap.has('unsavedRow.question')) {
      const unsavedQuestion = cardDataMap.get('unsavedRow.question');
      if (unsavedQuestion) {
        showPrompt = true;
      }
    } else if (cardDataMap.has('unsavedRow.answer')) {
      const unsavedAnswer = cardDataMap.get('unsavedRow.answer');
      if (unsavedAnswer) {
        showPrompt = true;
      }
    }
    return showPrompt;
  };
  /* ============== END CLICK HANDLERS =============== */

  // Run whenever the deck needs to be re-downloaded from the API.
  useEffect(() => {
    if (rowsNeedToBeUpdated) {
      const payload = agent.Api.getResource(deckLink);
      dispatch({ type: GET_DECK_EDIT_DATA, payload });
    }
  }, [rowsNeedToBeUpdated]);

  // After the API data loads THE FIRST TIME this effect allows the Snackbar warning to show.
  useEffect(() => {
    if (getDeckEditDataApiCallComplete && getDeckDataApiError == null) {
      // Don't allow the 'Empty field' Snackbar until the Deck is loaded.
      setAllowEmptyWarning(true);
    }
  }, [getDeckEditDataApiCallComplete, editableDeck, getDeckDataApiError]);

  // 'componentWillUnmount' in react hoooks.
  useEffect(() => () => dispatch({ type: EDIT_DECK_PAGE_UNLOADED }), []);


  /**
   * Logic for generating rows for each Card entry. Note that on page
   * load, we retrieve the Deck and Card info from the API, and the initial
   * data in the 'cardDataMap' variable is hydrated from within the
   * flashcards reducer. We read the 'cardDataMap' and update it as the source
   * of truth for textareas, until we reload the deck from the API.
   * We reload the deck from the API when we hit the save button.
   */
  const getTableRows = () => {
    const rows = [];
    let counter = 0;
    editableDeck.cards.forEach((card) => {
      counter += 1;
      const newRow = (
        <TableRow key={card.id}>
          <TableCell>
            {counter}
          </TableCell>
          <TableCell>
            <StyledTextArea
              className={emptyFieldsLookup.has(`${card.id}.question`) ? 'empty' : null}
              rows="4"
              placeholder="Write out question"
              value={cardDataMap.get(`${card.id}.question`)}
              onChange={(event) => cardFieldUpdateHandler(`${card.id}.question`, event)}
            />
          </TableCell>
          <TableCell>
            <StyledTextArea
              className={emptyFieldsLookup.has(`${card.id}.answer`) ? 'empty' : null}
              rows="4"
              placeholder="Write out question"
              value={cardDataMap.get(`${card.id}.answer`)}
              onChange={(event) => cardFieldUpdateHandler(`${card.id}.answer`, event)}
            />
          </TableCell>
        </TableRow>
      );
      rows.push(newRow);
    });

    // Now add an empty row at the end ready for editing.
    counter += 1;
    const unsavedRow = (
      <TableRow key="unsavedRow">
        <TableCell>
          {counter}
        </TableCell>
        <TableCell>
          <StyledTextArea
            className={emptyFieldsLookup.has('unsavedRow.question') ? 'empty' : null}
            rows="4"
            placeholder="Write out question"
            value={cardDataMap.get('unsavedRow.question') || ''}
            onChange={updateUnsavedQuestion}
          />
        </TableCell>
        <TableCell>
          <StyledTextArea
            className={emptyFieldsLookup.has('unsavedRow.answer') ? 'empty' : null}
            rows="4"
            placeholder="Write out answer"
            value={cardDataMap.get('unsavedRow.answer') || ''}
            onChange={updateUnsavedAnswer}
          />
        </TableCell>
      </TableRow>
    );
    rows.push(unsavedRow);
    return rows;
  };

  const getSectionContent = () => {
    if (getDeckDataApiError) {
      return 'There was an error accessing the API, please try again later.';
    }

    return (
      <>
        <Paper><Typography gutterBottom variant="h5" align="center">{`[${editableDeck.category}] ${editableDeck.title}`}</Typography></Paper>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Answer</TableCell>
                <TableCell> </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { getTableRows() }
            </TableBody>
          </Table>
        </TableContainer>
        <ButtonBar>
          <YellowButton onClickHandler={addRowHandler}>
            <StyledAddBox />
            Add Card
          </YellowButton>
          <PlayButton
            size="large"
            variant="outlined"
            type="button"
            onClick={playButtonHandler}
          >
            <StyledPlayCircle />
            Study Flashcards
          </PlayButton>
        </ButtonBar>
        <Typography variant="body1" align="center">
          Please add at least one row using
          the &quot;Add Card&quot; button before navigating away.
        </Typography>
        <Snackbar
          open={snackbarTriggerDetected && allowEmptyWarning && emptyFieldsLookup.size > 0}
          autoHideDuration={3000}
          onClose={emptyWarningOnCloseHandler}
          message="Questions and Answers cannot be empty."
          action={(
            <IconButton size="small" color="inherit" onClick={emptyWarningOnCloseHandler}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        />
        <Snackbar
          open={showPlaybackWarning}
          autoHideDuration={3000}
          onClose={() => setShowPlaybackWarning(false)}
          message="You must add at least one row before you can play this deck!"
          action={(
            <IconButton size="small" color="inherit" onClick={() => setShowPlaybackWarning(false)}>
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        />
      </>
    );
  };


  return (
    <>
      <Prompt
        when={promptHandler()}
        message="There is unsubmitted data for a new Question/Answer pair, are you sure you want to leave?"
      />
      <TopNav />
      <Section>
        <Wrapper>
          {
            getDeckEditDataApiCallComplete
              ? getSectionContent()
              : 'Loading'
          }
        </Wrapper>
      </Section>
      <Footer />
    </>
  );
};

export default EditDeck;
