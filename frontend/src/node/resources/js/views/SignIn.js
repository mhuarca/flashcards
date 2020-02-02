import React, { useCallback, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

import agent from '../agent';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import theme from './Theme';
import {
  LOGIN,
  LOGIN_PAGE_UNLOADED,
  UPDATE_AUTH_FIELD,
} from '../constants/actionTypes';


const Section = styled.section`
  padding: 70px 50px;
  background-color: #f6f6f6;
  @media (max-width: 600px) {
    padding: 60px 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  max-width: 600px;
`;

const StyledTextField = styled(TextField)`
  && {
    width: 100%;
    margin-bottom: 1em;

    .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
      border-color: ${theme.primary}
    }

    label.MuiFormLabel-root.Mui-focused {
      color: ${theme.primary}
    }
  }
`;

const StyledButton = styled(Button)`
  && {
    align-self: flex-end;
    border-color: ${theme.primary};
    background-color: transparent;
    transition: background-color 0.2s linear;

    .MuiButton-label {
      color: ${theme.primary};
      transition: color 0.2s linear;
    }

    &:hover {
      background-color: ${theme.primary};

      .MuiButton-label {
        color: #fff;
      }
    }
  }
`;

const SignIn = () => {
  const dispatch = useDispatch();
  const errors = useSelector((state) => state.auth.errors);
  const emailValue = useSelector((state) => state.auth.email);
  const handleEmailChange = useCallback(
    (event) => dispatch({ type: UPDATE_AUTH_FIELD, key: 'email', value: event.target.value }),
    [dispatch],
  );
  const passwordValue = useSelector((state) => state.auth.password);
  const handlePasswordChange = useCallback(
    (event) => dispatch({ type: UPDATE_AUTH_FIELD, key: 'password', value: event.target.value }),
    [dispatch],
  );

  const submitHandler = (event) => {
    event.preventDefault();
    const payload = agent.Auth.login(emailValue, passwordValue);
    dispatch({ type: LOGIN, payload });
  };

  // 'componentWillUnmount' in react hoooks.
  useEffect(() => () => dispatch({ type: LOGIN_PAGE_UNLOADED }), []);

  return (
    <>
      <TopNav />
      <Section>
        <Form onSubmit={submitHandler}>
          <StyledTextField
            label="Email"
            error={!!errors && !!errors.email}
            helperText={errors && errors.email ? errors.email.join() : ''}
            variant="outlined"
            value={emailValue || ''}
            onChange={handleEmailChange}
          />
          <StyledTextField
            label="Password"
            error={!!errors && !!errors.password}
            helperText={errors && errors.password ? errors.password.join() : ''}
            variant="outlined"
            type="password"
            value={passwordValue || ''}
            onChange={handlePasswordChange}
          />
          <StyledButton
            size="large"
            variant="outlined"
            type="submit"
          >
              Sign In
          </StyledButton>
        </Form>
      </Section>
      <Footer />
    </>
  );
};

export default SignIn;
