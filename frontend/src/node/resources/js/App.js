import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import AppRoutingLogic from './AppRoutingLogic';
import theme from './views/Theme';


const App = () => (
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <AppRoutingLogic />
    </BrowserRouter>
  </ThemeProvider>
);

export default App;
