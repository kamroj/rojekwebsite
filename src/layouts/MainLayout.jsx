// src/layouts/MainLayout.jsx
import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import LoadingScreen from '../components/ui/LoadingScreen';
import ScrollToTop from '../components/shared/ScrollToTop';
import { useResourceCollector } from '../context/ResourceCollectorContext';

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

// Ukrywa treść gdy loading jest aktywny (ale utrzymuje w DOM dla pre-loadingu)
const ContentWrapper = styled.div`
  display: ${props => props.$hidden ? 'none' : 'contents'};
`;

const MainLayout = () => {
  const location = useLocation();
  const [overlayState, setOverlayState] = useState('visible'); // Startujemy jako WIDOCZNY
  const [contentReady, setContentReady] = useState(false);
  
  const overlayShownAtRef = useRef(Date.now());
  const hideTimerRef = useRef(null);
  const fadeOutTimerRef = useRef(null);
  const minVisibleTimeRef = useRef(null);
  const previousPathRef = useRef(location.pathname);

  const MIN_VISIBLE_MS = 600; // Minimalna widoczność loadera

  const {
    resourcesLoaded,
    loadedCount,
    totalCount,
    progress,
    resetResources,
    pendingTasks
  } = useResourceCollector();

  // Czy są jeszcze zasoby do załadowania?
  const hasWorkToDo = useMemo(() => {
    if (pendingTasks > 0) return true;
    if (totalCount > 0 && !resourcesLoaded) return true;
    return false;
  }, [pendingTasks, totalCount, resourcesLoaded]);

  // Cleanup wszystkich timerów
  const clearAllTimers = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (fadeOutTimerRef.current) {
      clearTimeout(fadeOutTimerRef.current);
      fadeOutTimerRef.current = null;
    }
    if (minVisibleTimeRef.current) {
      clearTimeout(minVisibleTimeRef.current);
      minVisibleTimeRef.current = null;
    }
  }, []);

  // Pokaż overlay natychmiast
  const showOverlay = useCallback(() => {
    clearAllTimers();
    overlayShownAtRef.current = Date.now();
    setOverlayState('visible');
    setContentReady(false);
  }, [clearAllTimers]);

  // Rozpocznij proces ukrywania (z fade-out)
  const startHiding = useCallback(() => {
    setOverlayState('hiding');
    setContentReady(true); // Teraz pokaż treść
    
    fadeOutTimerRef.current = setTimeout(() => {
      setOverlayState('hidden');
      fadeOutTimerRef.current = null;
    }, 500); // Czas trwania animacji fade-out
  }, []);

  // Ukryj overlay (z uwzględnieniem minimalnego czasu)
  const hideOverlay = useCallback(() => {
    const elapsed = Date.now() - overlayShownAtRef.current;
    const remainingTime = Math.max(0, MIN_VISIBLE_MS - elapsed);

    if (remainingTime > 0) {
      // Poczekaj do minimalnego czasu
      hideTimerRef.current = setTimeout(() => {
        hideTimerRef.current = null;
        startHiding();
      }, remainingTime);
    } else {
      startHiding();
    }
  }, [startHiding]);

  // Reaguj na zmianę ścieżki - NATYCHMIAST pokaż loader
  useEffect(() => {
    // Sprawdź czy to rzeczywista zmiana ścieżki
    if (previousPathRef.current !== location.pathname) {
      previousPathRef.current = location.pathname;
      
      // Natychmiast pokaż loader PRZED renderem nowej strony
      showOverlay();
      
      // Reset zasobów
      resetResources();
      
      // Wyczyść style body
      try {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
      } catch {
        // ignore
      }
      
      // Scroll na górę
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname, resetResources, showOverlay]);

  // Reaguj na zakończenie ładowania zasobów
  useEffect(() => {
    // Jeśli overlay jest ukryty lub w trakcie chowania - nie rób nic
    if (overlayState !== 'visible') return;

    // Jeśli nadal jest praca do wykonania - czekaj
    if (hasWorkToDo) return;

    // Praca zakończona - ukryj overlay
    hideOverlay();
  }, [hasWorkToDo, overlayState, hideOverlay]);

  // Cleanup przy unmount
  useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  // Dla pierwszego renderowania - ustaw minimalny czas
  useEffect(() => {
    // Jeśli nie ma pracy do wykonania przy pierwszym renderze,
    // i tak poczekaj minimalny czas
    if (!hasWorkToDo && overlayState === 'visible') {
      hideOverlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Tylko przy pierwszym renderze

  const showLoadingScreen = overlayState !== 'hidden';

  return (
    <LayoutWrapper>
      {/* LoadingScreen zawsze renderowany gdy potrzebny */}
      {showLoadingScreen && (
        <LoadingScreen
          isVisible={overlayState === 'visible'}
          isHiding={overlayState === 'hiding'}
          progress={progress}
          loadedCount={loadedCount}
          totalCount={totalCount}
        />
      )}

      {/* Header i Footer zawsze widoczne pod loaderem */}
      <Header />
      <ScrollToTop />
      
      <MainContent>
        {/* Treść ukryta dopóki loader jest aktywny */}
        <ContentWrapper $hidden={!contentReady && showLoadingScreen}>
          <Outlet />
        </ContentWrapper>
      </MainContent>
      
      <Footer />
    </LayoutWrapper>
  );
};

export default MainLayout;