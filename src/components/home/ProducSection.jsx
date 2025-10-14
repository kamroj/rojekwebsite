// src/components/home/ProductSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import SwipeHandler from '../common/SwipeHandler';
import MaxWidthContainer from '../common/MaxWidthContainer';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from '../../pages/HomePage';

// --- Styled Components ---
const ProductContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// Kontener dla Swiper na mobile - teraz z obsługą gestów
const MobileButtonsContainer = styled.div`
  display: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    position: relative;
    margin-top: 2rem;     /* większe odsunięcie od góry na mobile */
    margin-bottom: 2.5rem;/* dostosowane odsunięcie od dołu */
    gap: 2.5rem;          /* nieco większe odstępy między przyciskami */
    padding: 0 20px;
  }
`;

// Pojedynczy przycisk na mobile - wyśrodkowany
const MobileSingleButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    min-width: 180px;
  }
`;

const ProductListButton = styled.button`
  font-size: 1.6rem;
  padding: 8px 18px;
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.default}, 
              color ${({ theme }) => theme.transitions.default};
  font-weight: 500;
  margin: 0 5px;
  white-space: nowrap;
  flex-shrink: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.bottleGreen};
    border-bottom-color: ${({ theme }) => theme.colors.bottleGreenLight};
  }
  
  ${({ $active, theme }) =>
    $active &&
    css`
      color: ${theme.colors.bottleGreen};
      font-weight: 700;
      border-bottom-color: ${theme.colors.bottleGreen};
    `}
    
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.5rem;
    padding: 6px 16px;
    margin: 0 3px;
  }
`;

// Przycisk nawigacji - tylko na mobile
const NavigationButton = styled.button`
  appearance: none;
  margin: 0;
  padding: 0;
  
  width: 48px;
  height: 48px;
  border: none;
  border-radius: 50%;
  background-color: #254429;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  color: #fff;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
  transition: opacity ${({ theme }) => theme.transitions.default},
              background-color ${({ theme }) => theme.transitions.default};
  opacity: ${({ disabled }) => disabled ? 0.3 : 1};
  
  pointer-events: ${({ disabled }) => disabled ? 'none' : 'auto'};
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  flex-shrink: 0;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.bottleGreen};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 36px;
    height: 36px;
    font-size: 2.5rem;
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none; /* Ukryj na desktop */
  }
`;

const ProductVideoWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex: unset;            /* don't force flex growth on mobile */
    width: 100%;
    margin-bottom: 10px;       /* remove extra gap under video on mobile */
  }
`;

// Kontener dla wideo
const ProductVideoContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.background};
  /* box-shadow: ${({ theme }) => theme.shadows.large}; */
  overflow: hidden;
  padding-bottom: 75%; /* Proporcja 4:3 - węższe okno */
`;

// Spinner Animation
const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Opakowanie dla spinnera, które jest dokładnie dopasowane do kontenera wideo
const SpinnerWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 5;
  pointer-events: none;
  opacity: ${props => props.$isLoading ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(26, 96, 57, 0.1);
  border-top: 5px solid ${({ theme }) => theme.colors.bottleGreen};
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
`;

const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #fff;
  display: block;
  opacity: ${props => props.$isLoading ? 0 : 1};
  transition: opacity ${({ theme }) => theme.transitions.default};
`;

const ProductDescriptionContainer = styled.div`
  flex: 1;
  text-align: left;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 100%;
  }
`;

const ProductDescriptionTitle = styled.h3`
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.bottleGreen};
  font-weight: 600;
  border-bottom: 1px solid #015508;
  padding-bottom: 0.5rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const ProductDescriptionText = styled.p`
  font-size: 1.6rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ProductBenefitsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ProductBenefitItem = styled.li`
  font-size: 1.5rem;
  line-height: 1.8;
  margin-bottom: 0.8rem;
  position: relative;
  padding-left: 25px;
  color: ${({ theme }) => theme.colors.text};
  
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    top: 1px;
    color: #015508;
    font-weight: bold;
    font-size: 1.8rem;
  }
`;

const SwipeableContainer = styled.div`
  width: 100%;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    pointer-events: none;
    
    * {
      pointer-events: auto;
    }
  }
`;

/* --- Desktop side arrows and slider --- */
const SideArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;

  /* Larger, taller clickable area (non-circular) */
  width: 80px;
  height: 160px;
  border-radius: 4px;
  border: none;
  display: none;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: ${({ theme }) => theme.colors.bottleGreen};
  font-size: 3rem;
  cursor: pointer;
  /* no background change on hover, subtle transitions for transform only */
  transition: transform 0.18s ease, opacity ${({ theme }) => theme.transitions.default};
  opacity: 1;

  /* Icon styling */
  svg {
    display: block;
    width: 2em;
    height: 2em;
    color: ${({ theme }) => theme.colors.bottleGreen};
    transition: transform 0.18s ease, color 0.18s ease;
    transform: translateX(0);
  }

  /* No background/scale change on hover (kept transparent) */
  &:hover {
    /* intentionally empty */
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
  }
`;

const SideArrowLeft = styled(SideArrow)`
  left: 8px; /* keep arrow visible inside viewport */

  /* Rotate icon to point left */
  svg {
    transform: rotate(180deg) translateX(0);
  }

  /* Subtle container shift to the left on hover */
  &:hover {
    transform: translateY(-50%) translateX(-4px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none; /* hide on mobile */
  }
`;

const SideArrowRight = styled(SideArrow)`
  right: 8px; /* keep arrow visible inside viewport */

  /* Normal orientation */
  svg {
    transform: translateX(0);
  }

  /* Subtle container shift to the right on hover */
  &:hover {
    transform: translateY(-50%) translateX(4px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none; /* hide on mobile */
  }
`;

/* Slider viewport and inner */
const SlidesWrapper = styled.div`
  position: relative;
  width: 100%;
  overflow: visible; /* allow arrows to sit outside the viewport */
  padding-left: 96px;  /* reserve space so arrows remain visible */
  padding-right: 96px; /* reserve space so arrows remain visible */

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: 0;
    padding-right: 0;
  }
`;

const SlideViewport = styled.div`
  overflow: hidden;
  width: 100%;
`;

const SlideInner = styled(motion.div)`
  display: flex;
  width: 100%;
`;

const SlideItem = styled.div`
  min-width: 100%;
  display: flex;
  gap: 8rem;
  align-items: flex-start;
  padding-top: 1.6rem;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    gap: 1rem; /* reduced gap between video and description on mobile */
    align-items: center;
    padding-top: 0; /* ensure no extra top padding on mobile */
  }
`;

const ProductSection = ({ productData, initialProductId = Object.keys(productData)[0] }) => {
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 992 : false);
  const videoRef = useRef(null);
  const currentProduct = productData[selectedProductId];

  const productIds = Object.keys(productData);
  const currentIndex = productIds.indexOf(selectedProductId);
  const isFirstProduct = currentIndex === 0;
  const isLastProduct = currentIndex === productIds.length - 1;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 992); // breakpoint md
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentProduct?.videoSrc]);

  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  const goToPrevProduct = () => {
    if (!isFirstProduct) {
      const prevIndex = currentIndex - 1;
      setSelectedProductId(productIds[prevIndex]);
    }
  };

  const goToNextProduct = () => {
    if (!isLastProduct) {
      const nextIndex = currentIndex + 1;
      setSelectedProductId(productIds[nextIndex]);
    }
  };

  const handleSwipeLeft = () => {
    if (isMobile && !isLastProduct) {
      goToNextProduct();
    }
  };

  const handleSwipeRight = () => {
    if (isMobile && !isFirstProduct) {
      goToPrevProduct();
    }
  };

  return (
    <>

      <MaxWidthContainer>
        <HeaderWrap className='full-width'>
          <ProductHeader>
            NASZE PRODUKTY
          </ProductHeader>
          <ProductHeaderSubtitle>Nowoczesność, styl, ekologia</ProductHeaderSubtitle>
        </HeaderWrap>
        <SwipeableContainer>
          <SwipeHandler
            onSwipeLeft={handleSwipeLeft}
            onSwipeRight={handleSwipeRight}
            enabled={isMobile}
            threshold={80}
          >
            <ProductContentContainer>
              <MobileButtonsContainer>
                <NavigationButton
                  onClick={goToPrevProduct}
                  disabled={isFirstProduct}
                  aria-label="Poprzedni produkt"
                >
                  <FiChevronLeft />
                </NavigationButton>

                <MobileSingleButton>
                  <ProductListButton $active={true} disabled={true}>
                    {currentProduct.name}
                  </ProductListButton>
                </MobileSingleButton>

                <NavigationButton
                  onClick={goToNextProduct}
                  disabled={isLastProduct}
                  aria-label="Następny produkt"
                >
                  <FiChevronRight />
                </NavigationButton>
              </MobileButtonsContainer>

              <SlidesWrapper>
                {!isMobile && !isFirstProduct && (
                  <SideArrowLeft
                    onClick={goToPrevProduct}
                    aria-label="Poprzedni produkt"
                  >
                    <IoIosArrowForward />
                  </SideArrowLeft>
                )}

                <SlideViewport>
                  <SlideInner
                    animate={{ x: `-${currentIndex * 100}%` }}
                    transition={{ type: 'tween', duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {productIds.map((id) => {
                      const prod = productData[id];
                      return (
                        <SlideItem key={id}>
                          <ProductVideoWrapper>
                            <ProductVideoContainer>
                              <SpinnerWrapper $isLoading={isLoading && selectedProductId === id}>
                                <LoadingSpinner />
                              </SpinnerWrapper>

                              <Video
                                ref={selectedProductId === id ? videoRef : null}
                                key={prod.videoSrc}
                                src={prod.videoSrc}
                                autoPlay={selectedProductId === id}
                                loop
                                muted
                                playsInline
                                poster={prod.posterSrc}
                                preload="metadata"
                                $isLoading={isLoading && selectedProductId === id}
                                onLoadedData={selectedProductId === id ? handleVideoLoaded : undefined}
                                onPlaying={selectedProductId === id ? handleVideoLoaded : undefined}
                              />
                            </ProductVideoContainer>
                          </ProductVideoWrapper>

                          <ProductDescriptionContainer>
                            <ProductDescriptionTitle>{prod.name}</ProductDescriptionTitle>
                            <ProductDescriptionText>{prod.description}</ProductDescriptionText>
                            <ProductBenefitsList>
                              {prod.benefits.map((benefit, index) => (
                                <ProductBenefitItem key={index}>{benefit}</ProductBenefitItem>
                              ))}
                            </ProductBenefitsList>
                          </ProductDescriptionContainer>
                        </SlideItem>
                      );
                    })}
                  </SlideInner>
                </SlideViewport>

                {!isMobile && !isLastProduct && (
                  <SideArrowRight
                    onClick={goToNextProduct}
                    aria-label="Następny produkt"
                  >
                    <IoIosArrowForward />
                  </SideArrowRight>
                )}
              </SlidesWrapper>



            </ProductContentContainer>
          </SwipeHandler>
        </SwipeableContainer>
      </MaxWidthContainer>
    </>
  );
};

export default ProductSection;
