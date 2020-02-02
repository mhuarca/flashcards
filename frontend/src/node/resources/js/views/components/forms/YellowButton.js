import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';

import theme from '../../Theme';

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

const YellowButton = ({ children, onClickHandler }) => (
  <StyledButton
    size="large"
    variant="outlined"
    type="button"
    onClick={onClickHandler}
  >
    {children}
  </StyledButton>
);

YellowButton.defaultProps = {
  children: 'Submit',
  onClickHandler: null,
};

YellowButton.propTypes = {
  children: PropTypes.node,
  onClickHandler: PropTypes.func,
};

export default YellowButton;
