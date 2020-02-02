/* eslint-disable react/forbid-prop-types */
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';

import { HIDE_MODAL } from '../../constants/actionTypes';

const FADE_DURATION = 200; // In milliseconds
const StyledDiv = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  opacity: 0;
  background-color: #838383;
  transition: opacity ${FADE_DURATION / 1000}s ease-in 0s;

  &.fadeIn {
    opacity: 0.4;
  }
`;


const TimedModal = ({ timeout, actionToDispatch }) => {
  const dispatch = useDispatch();
  const modalRef = React.createRef();

  useEffect(() => {
    modalRef.current.classList.add('fadeIn');

    setTimeout(() => { // Dispatch action and Fade Out
      if (actionToDispatch) {
        dispatch(actionToDispatch);
      }
      modalRef.current.classList.remove('fadeIn');
    }, timeout + FADE_DURATION);

    setTimeout(() => { // Close modal after fade out.
      dispatch({ type: HIDE_MODAL });
    }, timeout + (FADE_DURATION * 2));
  },
  []);

  return (
    <StyledDiv ref={modalRef}>
      <Typography variant="h1">Logging Out</Typography>
    </StyledDiv>
  );
};

TimedModal.propTypes = {
  timeout: PropTypes.number,
  actionToDispatch: PropTypes.object,
};

TimedModal.defaultProps = {
  timeout: 400, // Milliseconds
  actionToDispatch: null,
};

export default TimedModal;
