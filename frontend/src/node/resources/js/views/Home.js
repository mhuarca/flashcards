import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import TopNav from './components/TopNav';
import Footer from './components/Footer';
import HoverPanelLink from './components/HoverPanelLink';
import theme from './Theme';
import QuillImg from '../../img/quill2.jpg';
import BookImg from '../../img/books2.jpg';

const Section = styled.section`
  padding: 70px 50px;
  background-color: #f6f6f6;
  @media (max-width: 600px) {
    padding: 60px 20px;
  }
`;

const BlockPair = styled.div`
  display: flex;
  justify-content: space-between;
  margin: auto;
  width: 100%;
  max-width: ${theme.widthMaxFeature}
`;

const Home = () => (
  <>
    <TopNav />
    <Section>
      <BlockPair>
        <Link to="/new">
          <HoverPanelLink
            imageSrc={`/${QuillImg}`}
            caption="Create"
            revealText="Flashcards"
          />
        </Link>
        <Link to="/browse">
          <HoverPanelLink
            imageSrc={`/${BookImg}`}
            caption="Study"
            revealText="Flashcards"
          />
        </Link>
      </BlockPair>
    </Section>
    <Footer />
  </>
);

export default Home;
