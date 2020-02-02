import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

const StyledFigure = styled.figure`
  position: relative;
  background: #4a3753;
  overflow: hidden;

  img {
    position: relative;
    display: block;
    width: 100%;
    opacity: 0.9;
    transition: opacity 0.35s;
  }

  h2 {
    position: absolute;
    bottom: 0;
    left: 0;
    color: #fff;
    font-size: 2em;
    padding: 0.2em 1em;
    width: 100%;
    transform: translate3d(0, -30px, 0);
    transition: transform 0.35s, color;

    span {
      font-weight: 200;
      opacity: 0;
      transition: opacity 0.35s;
    }
  }
  
  figcaption {
    color: #fff;
    
    text-transform: uppercase;
    font-size: 1.25em;

    &::before {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 16px;
      background-color: #fff;
      content: '';
      transform: translate3d(0, 10px, 0);
      transition: transform 0.35s, background-color;
    }
  }

  &:hover img {
    opacity: 0.5;
  }
  &:hover figcaption::before {
    transform: translate3d(0,0,0);
    background-color: #ffc;
  }
  &:hover h2 {
    transform: translate3d(0,0,0);
    color: #ffc;
  }
  &:hover h2 span {
    opacity: 1.0;
  }

  @media (max-width: 1200px) {
    h2 {
      font-size: 1.5em;
    }
  }
  @media (max-width: 900px) {
    h2 {
      font-size: 1.2em;
    }
  }
`;

const HoverPanelLink = ({ caption, imageSrc, revealText }) => (
  <StyledFigure>
    <img src={imageSrc} alt="" />
    <figcaption>
      <h2>
        {caption}
        {
          revealText
            ? <span>{revealText}</span>
            : null
        }
      </h2>
    </figcaption>
  </StyledFigure>
);

HoverPanelLink.propTypes = {
  caption: PropTypes.string.isRequired,
  imageSrc: PropTypes.string.isRequired,
  revealText: PropTypes.string.isRequired,
};

export default HoverPanelLink;
