/* eslint-disable jsx-a11y/interactive-supports-focus */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  NavLink,
} from 'react-router-dom';
import styled from 'styled-components';

import { LOGOUT, SHOW_MODAL } from '../../constants/actionTypes';
import TimedModal from './TimedModal';
import theme from '../Theme';
import RocketSVG from '../../../img/rocket_logo.svg';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  height: 100px;
  background-color: #fff;
`;

const Greeting = styled.span`
  display: block;
  padding: 1em;
  font-family: 'Roboto', sans-serif;
  cursor: default;
  color: #747474;
`;

const StyledLogoutAnchor = styled.a`
  display: block;
  padding: 1em;
  font-family: 'Roboto', sans-serif;
  font-size: 0.8em;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
  text-transform: uppercase;

  &:hover {
    color: ${theme.primary};
  }
`;

const StyledDiv = styled.div`
  list-style-type: none;
  display: flex;
  align-items: center;
`;

const StyledNavLink = styled(NavLink)`
  display: block;
  padding: 1em;
  color: #474747;

  font-family: 'Roboto', serif;
  font-size: 0.8em;
  text-decoration: none;
  font-weight: 600;
  color: #474747;
  text-transform: uppercase;
  :visited {
    color: #474747;
  }
  :hover {
    color: ${theme.primary};
  }
`;

const SignInNavLink = styled(StyledNavLink)`
  margin-right: 1em;
`;

const Logo = styled.img`
  width: 50px;
  margin: 0px 1em;
`;

const logoutAction = { type: LOGOUT };
const logoutModal = <TimedModal actionToDispatch={logoutAction} />;

const TopNav = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.common.currentUser);

  let registrationLinks = (
    <>
      <SignInNavLink activeStyle={{ color: theme.primary }} to="/login">Sign In</SignInNavLink>
      <SignInNavLink activeStyle={{ color: theme.primary }} to="/register">Register</SignInNavLink>
    </>
  );

  if (currentUser) {
    registrationLinks = (
      <>
        <Greeting>{`Welcome ${currentUser.username}`}</Greeting>
        <StyledLogoutAnchor role="button" onClick={() => dispatch({ type: SHOW_MODAL, value: logoutModal })}>
          Logout
        </StyledLogoutAnchor>
      </>
    );
  }

  return (
    <Nav>
      <StyledDiv>
        <NavLink to="/">
          <Logo src={`/${RocketSVG}`} />
        </NavLink>
        <StyledNavLink exact activeStyle={{ color: theme.primary }} to="/">Home</StyledNavLink>
        <StyledNavLink activeStyle={{ color: theme.primary }} to="/new">New</StyledNavLink>
        <StyledNavLink activeStyle={{ color: theme.primary }} to="/browse">Browse</StyledNavLink>
      </StyledDiv>
      <StyledDiv>
        {registrationLinks}
      </StyledDiv>
    </Nav>
  );
};

export default TopNav;
