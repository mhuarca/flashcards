import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';

import ErrorView from './views/ErrorView';
import theme from './views/Theme';


const ErrorApp = () => (
  <ThemeProvider theme={theme}>
    <Router forceRefresh>
      <div>
        <Switch>
          <Route path="/">
            <ErrorView />
          </Route>
        </Switch>
      </div>
    </Router>
  </ThemeProvider>
);

export default ErrorApp;
