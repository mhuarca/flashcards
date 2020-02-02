import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';


const StyledDiv = styled.div`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  display: block;

  &.loaded {
    display: none;
  }
`;

/**
 * Simple invisible layer that prevents mouse events from happening
 * until the app tries to load the user account from the 'jwt' token
 * saved in localStorage. If there is no jwt token in localStorage
 * then this layer will display:none almost immediately.
 * @param {boolean} 'appLoaded' true after page tries to load saved user.
 */
const LoadingScreen = ({ appLoaded }) => (
  <StyledDiv
    id="loading"
    className={
      appLoaded ? 'loaded' : ''
    }
  />
);

LoadingScreen.propTypes = {
  appLoaded: PropTypes.bool.isRequired,
};

export default LoadingScreen;
