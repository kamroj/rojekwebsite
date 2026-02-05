// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Suspense } from 'react';

import App from './App.jsx';
import LoadingScreen from './components/ui/LoadingScreen.jsx';
import { ResourceCollectorProvider } from './context/ResourceCollectorContext.jsx';
 // Import internationalization
import './i18n.js';
import './styles/global.css';
import AOS from 'aos';
import 'aos/dist/aos.css';

if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
  try {
    window.history.scrollRestoration = 'manual';
  } catch {
    // ignore - defensive in some browsers
  }
}

// Initialize AOS animations
if (typeof window !== 'undefined' && AOS && typeof AOS.init === 'function') {
  AOS.init({ once: true, duration: 600, easing: 'ease-out-cubic', offset: 80 });
}

// Loading fallback using our LoadingScreen
const LoadingFallback = () => (
  <LoadingScreen 
    isVisible={true}
    isHiding={false}
    progress={0}
    loadedCount={0}
    totalCount={0}
  />
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Suspense for async loading of translations */}
    <Suspense fallback={<LoadingFallback />}>
      <ResourceCollectorProvider>
        <App />
      </ResourceCollectorProvider>
    </Suspense>
  </React.StrictMode>
);
