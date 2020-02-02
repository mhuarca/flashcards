import React from 'react';
import styled from 'styled-components';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';

const StyledSection = styled.section`
  background-color: #171717;

  .copyright {
    margin-top: 5em;
    margin-bottom: 5em;
    color: #595959;
    text-transform: uppercase;
  }
`;

const Footer = () => (
  <StyledSection>
    <Container>
      <Typography
        className="copyright"
        variant="body2"
        align="center"
      >
        &copy; Rocket Flashcards Inc.
      </Typography>
    </Container>
  </StyledSection>
);

export default Footer;
