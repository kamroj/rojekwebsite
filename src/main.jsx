import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { Suspense } from 'react'; // Keep Suspense for i18n loading

import App from './App.jsx';
import GlobalStyles from './styles/GlobalStyles.js';
import theme from './styles/theme.js';
import './i18n'; // Keep i18n initialization

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Suspense is still needed for async loading of translations */}
    <Suspense fallback="Loading...">
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App /> {/* Render App directly */}
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);