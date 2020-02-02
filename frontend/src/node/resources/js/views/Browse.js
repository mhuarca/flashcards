import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Edit from '@material-ui/icons/Edit';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Paper from '@material-ui/core/Paper';
import PlayCircleFilled from '@material-ui/icons/PlayCircleFilled';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import agent from '../agent';
import theme from './Theme';
import TopNav from './components/TopNav';
import Section from './components/Section';
import {
  GET_DECKS,
} from '../constants/actionTypes';

const StyledProgressIcon = styled(CircularProgress)`
  .MuiCircularProgress-colorPrimary {
    color: ${theme.primary}
  }
`;

const StyledLink = styled(Link)`
  color: ${theme.primary}
`;

const Browse = () => {
  const dispatch = useDispatch();
  const deckList = useSelector((state) => state.flashcards.deckList);
  const getDeckListApiError = useSelector((state) => state.flashcards.getDeckListApiError);
  const getDeckListAttempted = useSelector((state) => state.flashcards.getDeckListAttempted);

  // Run once on load, get the all the decks for this user.
  useEffect(() => {
    const payload = agent.Flashcards.getDecks();
    dispatch({ type: GET_DECKS, payload });
  }, []);

  const getDecks = () => {
    if (!getDeckListAttempted) {
      return (
        <div style={{ textAlign: 'center' }}>
          <StyledProgressIcon />
        </div>
      );
    }
    if (getDeckListApiError) {
      return (
        <Typography align="center" variant="h5">
          Error while contacting API, please try again later.
        </Typography>
      );
    }
    if (deckList === null || deckList.length === 0) {
      return (
        <Typography align="center" variant="h5">
          No Decks found for this user account.
          Please create a new Flashcard Deck.
        </Typography>
      );
    }
    const deckListMaxIndex = deckList.length - 1;
    const listItems = deckList.map((deck, index) => (
      <ListItem
        key={deck.id}
        divider={index !== deckListMaxIndex}
        component={Paper}
      >
        <ListItemIcon>
          <StyledLink to={`deck/play/${deck.id}`}>
            <PlayCircleFilled />
          </StyledLink>
        </ListItemIcon>
        <ListItemText primary={deck.title} />
        <ListItemSecondaryAction>
          <StyledLink to={`deck/edit/${deck.id}`}>
            <Edit />
          </StyledLink>
        </ListItemSecondaryAction>
      </ListItem>
    ));

    return <List>{listItems}</List>;
  };

  return (
    <>
      <TopNav />
      <Section>
        <Container maxWidth="md">
          <Typography align="center" variant="h4" gutterBottom>Your Flashcard Decks</Typography>
          <Divider />
          {getDecks()}
        </Container>
      </Section>
    </>
  );
};

export default Browse;
