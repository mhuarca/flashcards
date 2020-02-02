/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Fade from '@material-ui/core/Fade';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Paper from '@material-ui/core/Paper';
import Shuffle from '@material-ui/icons/Shuffle';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import agent from '../agent';
import theme from './Theme';
import useResetFlashcardStateOnUnload from '../hooks/useResetFlashcardStateOnUnload';
import util from '../util';
import TopNav from './components/TopNav';
import Section from './components/Section';
import {
  GET_PLAY_DECK,
} from '../constants/actionTypes';

const StyledProgressIcon = styled(CircularProgress)`
  .MuiCircularProgress-colorPrimary {
    color: ${theme.primary}
  }
`;

const StyledFade = styled(Fade)`
  display: flex;
  min-height: 10em;
  align-items: center;
  && {
    background-color: #fffff6;  
  }
  
  &&.answer {
    background-color: #fff6fe;
  }
`;

const StyledQuestionAnswerTypography = styled(Typography)`
  width: 100%;
  color: #000;
  padding: 2em;
  cursor: pointer;
  user-select: none;
`;

const PlayBackHolder = styled.div`
  display: flex;
  margin-bottom: 2em;
`;

const TopButtonBar = styled.div`
  text-align: center;
  margin-bottom: 1em;
`;

const CardContainer = styled.div`
  width: 90%;
`;

const LeftButtonHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
`;

const RightButtonHolder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
`;

const PlayDeck = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const getPlayDeckAttempted = useSelector((state) => state.flashcards.getPlayDeckAttempted);
  const apiError = useSelector((state) => state.flashcards.apiError);
  const playDeck = useSelector((state) => state.flashcards.playDeck);

  // UI specific state where we don't need redux involved.
  const [dataReady, setDataReady] = useState(false);
  const [shuffleNeeded, setShuffleNeeded] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  const [cardArray, setCardArray] = useState([]);

  // Load the deck on component load.
  useEffect(() => {
    const payload = agent.Flashcards.getDeck(id);
    dispatch({ type: GET_PLAY_DECK, payload });
  }, []);

  useEffect(() => {
    if (shuffleNeeded) {
      setDataReady(false);
      const arrayCopy = playDeck.cards.slice();
      util.shuffleArray(arrayCopy);
      setCardArray(arrayCopy);
      setCurrentCardIndex(0);
      setShowQuestion(true);
      setShuffleNeeded(false);
      setDataReady(true);
    }
  }, [shuffleNeeded]);

  // Prepare the downloaded data before letting the UI show it.
  useEffect(() => {
    if (getPlayDeckAttempted && !apiError) {
      setShuffleNeeded(true);
    }
  }, [getPlayDeckAttempted, apiError]);

  useResetFlashcardStateOnUnload();

  /* =============== CLICK LISTENERS ================= */
  const toggleQuestionAnswer = () => {
    if (showQuestion) {
      setShowQuestion(false);
    } else {
      setShowQuestion(true);
    }
    document.activeElement.blur();
  };

  const handleShuffleRequested = () => {
    setShuffleNeeded(true);
  };

  const incrementIndex = () => {
    const maxIndex = cardArray.length - 1;
    if (currentCardIndex === maxIndex) {
      setCurrentCardIndex(0);
    } else {
      setCurrentCardIndex(currentCardIndex + 1);
    }
    setShowQuestion(true);
    document.activeElement.blur();
  };

  const decrementIndex = () => {
    const maxIndex = cardArray.length - 1;
    if (currentCardIndex === 0) {
      setCurrentCardIndex(maxIndex);
    } else {
      setCurrentCardIndex(currentCardIndex - 1);
    }
    setShowQuestion(true);
    document.activeElement.blur();
  };

  document.body.onkeyup = (e) => {
    // Spacebar
    if (e.keyCode === 32) {
      toggleQuestionAnswer();
    }

    // Left arrow
    if (e.keyCode === 37) {
      decrementIndex();
    }

    // Right arrow
    if (e.keyCode === 39) {
      incrementIndex();
    }
  };
  /* ============== END CLICK LISTENERS ============== */

  const getPlayDeckContent = () => {
    if (!getPlayDeckAttempted) {
      return (
        <div style={{ textAlign: 'center' }}>
          <StyledProgressIcon />
        </div>
      );
    }

    if (apiError || !playDeck) {
      return (
        <Typography align="center" variant="h5">
          Error while contacting API, please try again later.
        </Typography>
      );
    }

    if (playDeck.cards.length === 0) {
      return (
        <Typography align="center" variant="h5">
          This flashcard deck has no cards configured.
          Please add cards
          <Link to={`/deck/edit/${playDeck.id}`}>here.</Link>
        </Typography>
      );
    }

    if (!dataReady) {
      return null;
    }

    return (
      <Container maxWidth="md">
        <Typography
          align="center"
          variant="h5"
          gutterBottom
        >
          {`Deck Title: ${playDeck.title}`}
        </Typography>
        <TopButtonBar>
          <Button
            variant="contained"
            onClick={handleShuffleRequested}
            startIcon={<Shuffle />}
          >
            Shuffle
          </Button>
        </TopButtonBar>
        <Typography variant="body2" align="center" gutterBottom>
          {`Card ${currentCardIndex + 1} of ${cardArray.length}`}
        </Typography>
        <PlayBackHolder>
          <LeftButtonHolder>
            <Button variant="contained" onClick={decrementIndex}>
              <KeyboardArrowLeft />
            </Button>
          </LeftButtonHolder>
          <CardContainer>
            <StyledFade
              in
              className={showQuestion ? '' : 'answer'}
              onClick={toggleQuestionAnswer}
              key={`${currentCardIndex}-${showQuestion ? 'Q' : 'A'}`}
            >
              <Paper>
                <StyledQuestionAnswerTypography variant="h5" align="center">
                  {
                    showQuestion
                      ? cardArray[currentCardIndex].question
                      : cardArray[currentCardIndex].answer
                  }
                </StyledQuestionAnswerTypography>
              </Paper>
            </StyledFade>
          </CardContainer>
          <RightButtonHolder>
            <Button variant="contained" onClick={incrementIndex}>
              <KeyboardArrowRight />
            </Button>
          </RightButtonHolder>
        </PlayBackHolder>
        <Typography
          align="center"
          variant="body1"
          gutterBottom
        >
          <strong>Left Arrow Key:</strong> Previous Card
        </Typography>
        <Typography
          align="center"
          variant="body1"
          gutterBottom
        >
          <strong>Right Arrow Key:</strong> Next Card
        </Typography>
        <Typography
          align="center"
          variant="body1"
          gutterBottom
        >
          <strong>Spacebar (or click card):</strong> Toggle Question/Answer
        </Typography>
      </Container>
    );
  };

  return (
    <>
      <TopNav />
      <Section>
        {getPlayDeckContent()}
      </Section>
    </>
  );
};

export default PlayDeck;
