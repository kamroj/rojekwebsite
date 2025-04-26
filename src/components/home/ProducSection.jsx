import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';

const colors = {
  bottleGreen: '#1a6039',
  bottleGreenLight: '#008a62',
  darkGreenLabel: '#003f2a',
  textDark: '#212529',
  textLightGray: '#555',
  white: '#ffffff',
  lightGrayBorder: '#017e543f',
  videoBackground: '#e0e0e0',
};

// --- Style Produktów ---
const ProductVideoWrapper = styled.div`
  flex: 1;
  max-width: 50%;
  min-width: 300px;
  position: relative;
  @media (max-width: 992px) {
    max-width: 90%;
    width: 100%;
    margin-bottom: 1rem;
  }
`;

const ProductVideoContainer = styled.div`
  width: 100%;
  position: relative;
  border-radius: 4px;
  background-color: ${colors.videoBackground};
  box-shadow: 0 4px 12px rgb(30 62 44 / 73%);
  overflow: hidden;
  aspect-ratio: 16 / 9;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  display: block;
  opacity: ${props => props.isLoading ? 0 : 1};
  transition: opacity 0.3s ease;
`;

// Animacja dla spinnera
const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Komponent Spinner
const LoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  border: 5px solid rgba(26, 96, 57, 0.1);
  border-top: 5px solid ${colors.bottleGreen};
  border-radius: 50%;
  animation: ${spinAnimation} 1s linear infinite;
  display: ${props => props.isLoading ? 'block' : 'none'};
`;

// --- Sekcja Produktów (ZMODYFIKOWANA) ---
const ProductSection = ({ productData, selectedProductId, setSelectedProductId }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const currentProduct = productData[selectedProductId];

  // Reset loading state when product changes
  useEffect(() => {
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, [currentProduct.videoSrc]);

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
            <LoadingSpinner isLoading={isLoading} />
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
        <PrductDescriptionContainer>
          <ProductDescriptionTitle>{currentProduct.name}</ProductDescriptionTitle>
          <ProductDescriptionText>{currentProduct.description}</ProductDescriptionText>
          <ProductBenefitsList>
            {currentProduct.benefits.map((benefit, index) => (
              <ProductBenefitItem key={index}>{benefit}</ProductBenefitItem>
            ))}
          </ProductBenefitsList>
        </PrductDescriptionContainer>
      </ProductDetailsWrapper>
    </ProductContentContainer>
  );
};

// --- Uzupełniające komponenty ---
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
  color: ${colors.textDark};
  cursor: pointer;
  transition: border-color 0.2s ease, color 0.2s ease;
  font-weight: 500;
  margin: 0 5px;
  &:hover {
    color: ${colors.bottleGreen};
    border-bottom-color: ${colors.bottleGreenLight};
  }
  ${({ active }) =>
    active &&
    css`
      color: ${colors.bottleGreen};
      font-weight: 700;
      border-bottom-color: ${colors.bottleGreen};
    `}
`;

const ProductDetailsWrapper = styled.div`
  display: flex;
  width: 100%;
  gap: 8rem;
  align-items: flex-start;
  margin-top: 1.6rem;
  @media (max-width: 992px) {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }
`;

const PrductDescriptionContainer = styled.div`
  flex: 1;
  text-align: left;
  max-width: 50%;
  @media (max-width: 992px) {
    max-width: 90%;
    width: 100%;
  }
`;

const ProductDescriptionTitle = styled.h3`
  font-size: 2.4rem;
  margin-bottom: 1.5rem;
  color: ${colors.bottleGreen};
  font-weight: 600;
  border-bottom: 1px solid ${colors.bottleGreen};
  padding-bottom: 0.5rem;
`;

const ProductDescriptionText = styled.p`
  font-size: 1.6rem;
  line-height: 1.7;
  margin-bottom: 2rem;
  color: ${colors.textLightGray};
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
  color: ${colors.textDark};
  &::before {
    content: '✓';
    position: absolute;
    left: 0;
    top: 1px;
    color: ${colors.bottleGreen};
    font-weight: bold;
    font-size: 1.8rem;
  }
`;

export default ProductSection;