import React from 'react';
import { ThemeProvider } from '@mui/material';
import { theme } from './utils/theme';
import { Home } from './pages/Home';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Home />
    </ThemeProvider>
  );
}

export default App;
