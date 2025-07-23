// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingScreen from '../components/common/LoadingScreen';
import { useImagePreloader } from '../hooks';
import { REALIZATION_IMAGES, PARTNER_LOGOS, WHY_US_ICONS, IMAGE_PATHS } from '../constants';

// Main layout wrapper
const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

// Main content area
const MainContent = styled.main`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

// MainLayout component wraps all pages with Header and Footer
const MainLayout = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isHiding, setIsHiding] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  // Determine which images to preload based on current route
  const getImagesToPreload = () => {
    const baseImages = [
      '/images/logo.png', // Use public path
      ...Object.values(WHY_US_ICONS)
    ];

    switch (location.pathname) {
      case '/realizations':
        return [
          ...baseImages,
          ...REALIZATION_IMAGES.map(img => img.src)
        ];
      case '/':
        return [
          ...baseImages,
          ...REALIZATION_IMAGES.slice(0, 6).map(img => img.src), // First 6 for homepage
          ...PARTNER_LOGOS.map(logo => logo.src)
        ];
      default:
        return baseImages;
    }
  };

  const imagesToPreload = getImagesToPreload();
  const { imagesLoaded, loadedCount, totalCount, progress } = useImagePreloader(imagesToPreload);

  useEffect(() => {
    if (imagesLoaded && isLoading) {
      // Add a small delay to show completion
      setTimeout(() => {
        setIsHiding(true);
        // Hide loader completely after animation
        setTimeout(() => {
          setIsLoading(false);
          setIsHiding(false);
          setHasInitialLoad(true);
        }, 500);
      }, 300);
    }
  }, [imagesLoaded, isLoading]);

  // Only reset loading state on first load, not on route changes
  useEffect(() => {
    if (!hasInitialLoad) {
      setIsLoading(true);
      setIsHiding(false);
    }
  }, [location.pathname, hasInitialLoad]);

  return (
    <LayoutWrapper>
      {(isLoading || isHiding) && (
        <LoadingScreen
          isVisible={isLoading || isHiding}
          isHiding={isHiding}
          progress={progress}
          loadedCount={loadedCount}
          totalCount={totalCount}
        />
      )}
      
      <Header />
      <MainContent>
        <Outlet /> {/* Child routes will be rendered here */}
      </MainContent>
      <Footer />
    </LayoutWrapper>
  );
};

export default MainLayout;
