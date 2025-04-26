import React from 'react';
import styled from 'styled-components';

// Import komponentów layoutu
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Import komponentów sekcji
// Zakładamy, że IntroSection jest w components/home, a reszta w sections/
import IntroSection from './components/home/IntroSection';
import RealizationsSection from './pages/RealizationsPage';
import AboutSection from './pages/AboutPage';
import ContactSection from './pages/ContactPage';
import AppRouter from './router';

// Kontener dla treści poniżej absolutnie pozycjonowanej IntroSection
// Ten margines jest KLUCZOWY dla poprawnego układu
const MainContentWrapper = styled.div`
  margin-top: 100vh; /* Odepchnij treść poniżej IntroSection */
  position: relative; /* Ustawienie kontekstu pozycjonowania dla sekcji wewnątrz, jeśli potrzebne */
  z-index: 2; /* Upewnij się, że jest pod Headerem (który ma z-index 1000), ale nad IntroSection (z-index 1) */
  background-color: ${({ theme }) => theme.colors.background}; /* Domyślne tło dla reszty strony */
`;

function App() {
  return (
    <AppRouter />
  );
}

export default App;