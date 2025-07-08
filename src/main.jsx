// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { Suspense } from 'react';
import styled, { keyframes } from 'styled-components';

import App from './App.jsx';
import GlobalStyles from './styles/GlobalStyles.js';
import theme from './styles/theme.js';
// Import internationalization
import './i18n.js';

// Spinner animation
const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Loading container
const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  background-color: #000000;
  position: fixed;
  top: 0;
  left: 0;
`;

// Green spinner component
const GreenSpinner = styled.div`
  width: 60px;
  height: 60px;
  border: 6px solid rgba(1, 126, 84, 0.1);
  border-top: 6px solid #017e54;
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

// Loading component with green spinner
const LoadingFallback = () => (
  <LoadingContainer>
    <GreenSpinner />
  </LoadingContainer>
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