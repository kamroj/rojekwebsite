// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { Suspense } from 'react';

import App from './App.jsx';
import GlobalStyles from './styles/GlobalStyles.js';
import theme from './styles/theme.js';
// Import internationalization
import './i18n.js';

// Loading component for translation loading
const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    color: '#017e54',
    fontSize: '1.6rem'
  }}>
    Ładowanie...
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Suspense for async loading of translations */}
    <Suspense fallback={<LoadingFallback />}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <App />
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);