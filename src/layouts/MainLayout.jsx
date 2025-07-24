// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Outlet, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import LoadingScreen from '../components/common/LoadingScreen';
import { PRODUCT_TYPES, VIDEO_SOURCES } from '../constants';
import { collectPageResources } from '../utils/resourceCollector';
import { useResourceCollector } from '../context/ResourceCollectorContext';

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
  const { t } = useTranslation();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isHiding, setIsHiding] = useState(false);
  const [hasInitialLoad, setHasInitialLoad] = useState(false);

  const {
    resourcesLoaded,
    loadedCount,
    totalCount,
    progress,
    addResources,
    resetResources
  } = useResourceCollector();

  // Przygotuj dane produktów dla HomePage (potrzebne do kolektora zasobów)
  const getAdditionalData = () => {
    if (location.pathname === '/') {
      return {
        productData: {
          [PRODUCT_TYPES.WINDOWS]: {
            id: PRODUCT_TYPES.WINDOWS,
            name: t('products.windows.name'),
            videoSrc: VIDEO_SOURCES.WINDOWS,
            description: t('products.windows.description'),
            benefits: t('products.windows.benefits', { returnObjects: true })
          },
          [PRODUCT_TYPES.EXTERIOR_DOORS]: {
            id: PRODUCT_TYPES.EXTERIOR_DOORS,
            name: t('products.exteriorDoors.name'),
            videoSrc: VIDEO_SOURCES.EXTERIOR_DOORS,
            description: t('products.exteriorDoors.description'),
            benefits: t('products.exteriorDoors.benefits', { returnObjects: true })
          },
          [PRODUCT_TYPES.INTERIOR_DOORS]: {
            id: PRODUCT_TYPES.INTERIOR_DOORS,
            name: t('products.interiorDoors.name'),
            videoSrc: VIDEO_SOURCES.INTERIOR_DOORS,
            description: t('products.interiorDoors.description'),
            benefits: t('products.interiorDoors.benefits', { returnObjects: true })
          },
          [PRODUCT_TYPES.SLIDING]: {
            id: PRODUCT_TYPES.SLIDING,
            name: t('products.sliding.name'),
            videoSrc: VIDEO_SOURCES.SLIDING,
            description: t('products.sliding.description'),
            benefits: t('products.sliding.benefits', { returnObjects: true })
          }
        }
      };
    }
    return {};
  };

  // Resetuj i dodaj zasoby przy zmianie strony
  useEffect(() => {
    resetResources();
    const resources = collectPageResources(location.pathname, getAdditionalData());
    addResources(resources);
    setIsLoading(true);
    setIsHiding(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, t]);

  useEffect(() => {
    if (resourcesLoaded && isLoading) {
      setTimeout(() => {
        setIsHiding(true);
        setTimeout(() => {
          setIsLoading(false);
          setIsHiding(false);
          setHasInitialLoad(true);
        }, 500);
      }, 300);
    }
  }, [resourcesLoaded, isLoading]);

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
