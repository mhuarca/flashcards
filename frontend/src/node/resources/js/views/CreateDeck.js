import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@material-ui/core';
import styled from 'styled-components';

import agent from '../agent';
import Form from './components/forms/Form';
import TopNav from './components/TopNav';
import Section from './components/Section';
import Footer from './components/Footer';
import SubmitButton from './components/forms/SubmitButton';
import {
  CREATE_DECK,
  CREATE_DECK_PAGE_UNLOADED,
  UPDATE_FLASHCARD_FIELD,
} from '../constants/actionTypes';
import theme from './Theme';


// const Form = styled.form`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   margin-left: auto;
//   margin-right: auto;
//   max-width: 600px;
// `;

// const Section = styled.section`
//   padding: 70px 50px;
//   background-color: #f6f6f6;
//   @media (max-width: 600px) {
//     padding: 60px 20px;
//   }
// `;


const StyledSelect = styled(Select)`
  width: 100%;
  margin-bottom: 1em;

  &.Mui-focused {
    fieldset.MuiOutlinedInput-notchedOutline{
      border-color: ${theme.primary};
    }
  }
`;

const StyledTextField = styled(TextField)`
  && {
    width: 100%;
    margin-bottom: 1em;

    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${theme.primary};
    }

    label.MuiFormLabel-root.Mui-focused {
      color: ${theme.primary};
    }
  }
`;

/**
 * Calculates the URL for the newly created deck.
 * @param {object} createdObject Deck object returned from the API
 */
const newDeckRedirectFn = (createdObject) => {
  if (!createdObject) {
    return console.error('An object must be provided to the redirect function');
  }
  const redirectPath = `/deck/edit/${createdObject.id}`;
  return redirectPath;
};


const CreateDeck = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.flashcards.errors);
  const titleValue = useSelector((state) => state.flashcards.title);
  const handleTitleChange = useCallback(
    (event) => dispatch({ type: UPDATE_FLASHCARD_FIELD, key: 'title', value: event.target.value }),
    [dispatch],
  );
  const categoryValue = useSelector((state) => state.flashcards.category);
  const handleCategoryChange = useCallback(
    (event) => dispatch({ type: UPDATE_FLASHCARD_FIELD, key: 'category', value: event.target.value }),
    [dispatch],
  );

  const submitHandler = (event) => {
    event.preventDefault();
    const payload = agent.Flashcards.createDeck(titleValue, categoryValue);
    dispatch({ type: CREATE_DECK, redirectFn: newDeckRedirectFn, payload });
  };

  // 'componentWillUnmount' in react hoooks.
  useEffect(() => () => dispatch({ type: CREATE_DECK_PAGE_UNLOADED }), []);

  return (
    <>
      <TopNav />
      <Section>
        <Typography variant="h5" align="center" gutterBottom>Create A Flashcard Deck</Typography>
        <Form onSubmit={submitHandler}>
          <StyledTextField
            label="Title"
            error={!!errors && !!errors.title}
            helperText={errors && errors.title ? errors.title.join() : ''}
            variant="outlined"
            value={titleValue || ''}
            onChange={handleTitleChange}
          />
          <InputLabel id="category-select">Select Category</InputLabel>
          <StyledSelect
            labelId="category-select"
            id="id-category-select"
            variant="outlined"
            value={categoryValue}
            onChange={handleCategoryChange}
          >
            <MenuItem value="General">General</MenuItem>
            <MenuItem value="Math">Math</MenuItem>
            <MenuItem value="History">History</MenuItem>
            <MenuItem value="Programming">Programming</MenuItem>
            <MenuItem value="Science">Science</MenuItem>
          </StyledSelect>
          <SubmitButton>
            Create Deck
          </SubmitButton>
        </Form>
      </Section>
      <Footer />
    </>
  );
};

export default CreateDeck;
