// src/components/home/ProductSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

// --- Styled Components ---
const ProductContentContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProductListContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
`;

const ProductListButton = styled.button`
  font-size: 1.6rem;
  padding: 8px 18px;
  border: none;
  border-bottom: 2px solid transparent;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.default}, 
              color ${({ theme }) => theme.transitions.default};
  font-weight: 500;
  margin: 0 5px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.bottleGreen};
    border-bottom-color: ${({ theme }) => theme.colors.bottleGreenLight};
  }
  
  ${({ active, theme }) =>
    active &&
    css`
      color: ${theme.colors.bottleGreen};
      font-weight: 700;
      border-bottom-color: ${theme.colors.bottleGreen};
    `}
`;

const ProductDetailsWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 8rem;
  align-items: flex-start;
  margin-top: 1.6rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const ProductVideoWrapper = styled.div`
  flex: 1;
  max-width: 40%;
  min-width: 300px;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 90%;
    width: 100%;
    margin-bottom: 1rem;
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
  opacity: ${props => props.isLoading ? 1 : 0};
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
  opacity: ${props => props.isLoading ? 0 : 1};
  transition: opacity ${({ theme }) => theme.transitions.default};
`;

const ProductDescriptionContainer = styled.div`
  flex: 1;
  text-align: left;
  max-width: 50%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 90%;
    width: 100%;
  }
`;

const ProductDescriptionTitle = styled.h3`
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.bottleGreen};
  font-weight: 600;
  border-bottom: 1px solid ${({ theme }) => theme.colors.bottleGreen};
  padding-bottom: 0.5rem;
`;

const ProductDescriptionText = styled.p`
  font-size: 1.6rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.textMuted};
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
    color: ${({ theme }) => theme.colors.bottleGreen};
    font-weight: bold;
    font-size: 1.8rem;
  }
`;

// --- Main Component ---
const ProductSection = ({ productData, initialProductId = Object.keys(productData)[0] }) => {
  const [selectedProductId, setSelectedProductId] = useState(initialProductId);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef(null);
  const currentProduct = productData[selectedProductId];

  // Reset loading state when product changes
  useEffect(() => {
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentProduct?.videoSrc]);

  // Handle video loaded event
  const handleVideoLoaded = () => {
    setIsLoading(false);
  };

  return (
    <ProductContentContainer>
      <ProductListContainer>
        {Object.values(productData).map((product) => (
          <ProductListButton
            key={product.id}
            onClick={() => setSelectedProductId(product.id)}
            active={selectedProductId === product.id}
          >
            {product.name}
          </ProductListButton>
        ))}
      </ProductListContainer>
      
      <ProductDetailsWrapper>
        <ProductVideoWrapper>
          <ProductVideoContainer>
            {/* Opakowanie spinnera dla lepszego wyśrodkowania */}
            <SpinnerWrapper isLoading={isLoading}>
              <LoadingSpinner />
            </SpinnerWrapper>
            
            <Video
              ref={videoRef}
              key={currentProduct.videoSrc}
              src={currentProduct.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              poster={currentProduct.posterSrc}
              preload="metadata"
              isLoading={isLoading}
              onLoadedData={handleVideoLoaded}
              onPlaying={handleVideoLoaded}
            />
          </ProductVideoContainer>
        </ProductVideoWrapper>
        
        <ProductDescriptionContainer>
          <ProductDescriptionTitle>{currentProduct.name}</ProductDescriptionTitle>
          <ProductDescriptionText>{currentProduct.description}</ProductDescriptionText>
          <ProductBenefitsList>
            {currentProduct.benefits.map((benefit, index) => (
              <ProductBenefitItem key={index}>{benefit}</ProductBenefitItem>
            ))}
          </ProductBenefitsList>
        </ProductDescriptionContainer>
      </ProductDetailsWrapper>
    </ProductContentContainer>
  );
};

export default ProductSection;