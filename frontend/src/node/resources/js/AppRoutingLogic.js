import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Switch,
  Route,
  useHistory,
} from 'react-router-dom';

import agent from './agent';
import { APP_LOAD, REDIRECT, LOGOUT } from './constants/actionTypes';
import Home from './views/Home';
import LoadingScreen from './views/components/LoadingScreen';
import Register from './views/Register';
import Browse from './views/Browse';
import PlayDeck from './views/PlayDeck';
import CreateDeck from './views/CreateDeck';
import EditDeck from './views/EditDeck';
import SignIn from './views/SignIn';


const AppRoutingLogic = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const redirectTarget = useSelector((state) => state.common.redirectTo);
  const appIsLoaded = useSelector((state) => state.common.appLoaded);
  const modalIsShowing = useSelector((state) => state.common.modalIsShowing);
  const modalContent = useSelector((state) => state.common.modalContent);

  // Some actions may add a 'redirectTarget', which is handled here.
  useEffect(() => {
    if (redirectTarget) {
      history.push(redirectTarget);
      dispatch({ type: REDIRECT });
    }
  },
  [redirectTarget]);

  // The first time the page loads, try to
  // load the user based on the existing JWT.
  useEffect(() => {
    const token = window.localStorage.getItem('jwt');
    let payload = null;
    if (!appIsLoaded) {
      if (token) {
        agent.setToken(token);
        agent.Auth.current()
          .then(
            (response) => {
              payload = response;
              dispatch({ type: APP_LOAD, token: response.token, payload });
            },
            (err) => { // eslint-disable-line no-unused-vars
              dispatch({ type: LOGOUT });
              dispatch({ type: APP_LOAD });
            },
          );
      } else {
        dispatch({
          type: APP_LOAD,
          payload,
          token,
        });
      }
    }
  }, []);

  return (
    <>
      <Switch>
        <Route path="/deck/play/:id">
          <PlayDeck />
        </Route>
        <Route path="/deck/edit/:id">
          <EditDeck />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/login">
          <SignIn />
        </Route>
        <Route exact path="/browse">
          <Browse />
        </Route>
        <Route exact path="/new">
          <CreateDeck />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
      { modalIsShowing ? modalContent : null }
      <LoadingScreen appLoaded={appIsLoaded} />
    </>
  );
};

export default AppRoutingLogic;
