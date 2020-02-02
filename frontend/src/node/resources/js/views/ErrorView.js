import React from 'react';
import styled from 'styled-components';

import TopNav from './components/TopNav';
import Footer from './components/Footer';

const Section = styled.section`
  padding: 70px 50px;
  background-color: #f6f6f6;
  @media (max-width: 600px) {
    padding: 60px 20px;
  }
`;

const Home = () => (
  <>
    <TopNav />
    <Section>
      <h2>Could not locate requested page. Please navigate to another page.</h2>
    </Section>
    <Footer />
  </>
);

export default Home;
