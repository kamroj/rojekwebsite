// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import { Suspense } from 'react';

import App from './App.jsx';
import GlobalStyles from './styles/GlobalStyles.js';
import theme from './styles/theme.js';
import LoadingScreen from './components/common/LoadingScreen.jsx';
import { ResourceCollectorProvider } from './context/ResourceCollectorContext.jsx';
// Import internationalization
import './i18n.js';

// Loading fallback using our LoadingScreen
const LoadingFallback = () => (
  <ThemeProvider theme={theme}>
    <LoadingScreen 
      isVisible={true}
      isHiding={false}
      progress={0}
      loadedCount={0}
      totalCount={0}
    />
  </ThemeProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Suspense for async loading of translations */}
    <Suspense fallback={<LoadingFallback />}>
      <ThemeProvider theme={theme}>
        <ResourceCollectorProvider>
          <GlobalStyles />
          <App />
        </ResourceCollectorProvider>
      </ThemeProvider>
    </Suspense>
  </React.StrictMode>
);
