import React, { useState } from 'react';
import styled from 'styled-components';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiDownload, FiPhone } from 'react-icons/fi';
import { useFitText } from '../../../hooks';
import { Link } from 'react-router-dom';

const HeroSection = styled.div`
  display: grid;
  /* IMPORTANT:
     Allow the text column to shrink instead of forcing the grid to expand.
     Without minmax(0, ...), long titles can overflow the grid tracks.
  */
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 4rem;
  padding: 2rem 0 4rem;
  min-height: 550px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 2rem;
    min-height: auto;
  }
`;

const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* Allow children (like long ProductTitle) to shrink within the grid cell */
  min-width: 0;
`;

const ProductCategory = styled.span`
  white-space: nowrap;
  font-size: clamp(0.85rem, 1.35vw, 1.4rem);
  letter-spacing: clamp(0.8px, 0.25vw, 2px);
  color: #000000;
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
`;

const ProductTitle = styled.h1`
  font-size: 5.5rem;
  font-weight: 400;
  color: #013613;
  margin: 0 0 1.5rem 0;
  letter-spacing: 1px;
  line-height: 1.1;
  white-space: nowrap;
  overflow: hidden;
  text-transform: uppercase;

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: clamp(3rem, 5vw, 3.5rem);
  }
`;

const TitleDivider = styled.div`
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #1a5618, #4a7c59);
  margin-bottom: 1.5rem;
`;

const ProductDescription = styled.p`
  font-size: 1.6rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0 0 1.5rem 0;
  max-width: 550px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.4rem;
  }
`;

const ProductHighlight = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 2rem 0;
  max-width: 550px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  align-items: center;
`;

const PrimaryButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #1a5618 0%, #2d7a2a 100%);
  color: #ffffff;
  padding: 1.1rem 2.2rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 1.15rem;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0px 3px 10px 0px rgb(13 43 12 / 35%);
  }

  svg {
    font-size: 1.3rem;
  }
`;

const OutlineButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: transparent;
  color: #6b7280;
  padding: 1.1rem 1.8rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  border: 1px solid #d1d5db;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #1a5618;
    color: #1a5618;
  }

  svg {
    font-size: 1.2rem;
  }
`;

const HeroImageContainer = styled.div`
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px #075400 solid;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  background: #f8faf8;
  aspect-ratio: 4/3;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    aspect-ratio: 16/10;
    max-height: 450px;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    aspect-ratio: 4/3;
    max-height: 400px;
  }
`;

const HeroImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $active }) => ($active ? 1 : 0)};
  transition: opacity 0.6s ease-in-out;
  z-index: ${({ $active }) => ($active ? 2 : 1)};
`;

const SliderNav = styled.div`
  position: absolute;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 0.5rem;
  z-index: 10;
`;

const SliderDot = styled.button`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: none;
  background: ${({ $active }) => ($active ? '#1a5618b3' : 'rgba(255, 255, 255, 0.41)')};
  backdrop-filter: blur(0.4rem);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: ${({ $active }) => ($active ? '#1a5618' : 'rgb(255, 255, 255)')};
  }
`;

const SliderArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $direction }) => ($direction === 'left' ? 'left: 1rem;' : 'right: 1rem;')}
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgb(36 96 2 / 30%);
  backdrop-filter: blur(0.4rem);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(42, 228, 36, 0.3);
  z-index: 10;

  &:hover {
    background: rgb(16 44 1 / 30%);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  svg {
    font-size: 1.5rem;
    color: #ffffff;
  }
`;

export default function ProductDetailHero({
  product,
  categoryLabel,
  longDescriptionContent,
  contactHref = '/kontakt',
  onDownloadCatalog,
  t,
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const titleRef = useFitText({ minPx: 32, deps: [product?.name] });

  const images = Array.isArray(product?.images) ? product.images : [];

  const nextImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <HeroSection>
      <HeroContent>
        <ProductCategory>{categoryLabel}</ProductCategory>
        <ProductTitle ref={titleRef}>{product?.name}</ProductTitle>
        <TitleDivider />
        <ProductDescription>{product?.shortDescription}</ProductDescription>
        <ProductHighlight as="div">{longDescriptionContent}</ProductHighlight>

        <ButtonsContainer>
          <PrimaryButton to={contactHref}>
            <FiPhone />
            {t?.('common.contactUs', 'Skontaktuj się z nami')}
          </PrimaryButton>
          <OutlineButton type="button" onClick={onDownloadCatalog}>
            <FiDownload />
            {t?.('productDetail.downloadCatalogPdf', 'Pobierz katalog PDF')}
          </OutlineButton>
        </ButtonsContainer>
      </HeroContent>

      <HeroImageContainer>
        {images.map((image, index) => (
          <HeroImage
            key={index}
            src={image}
            alt={`${product?.name || 'product'} - zdjęcie ${index + 1}`}
            $active={index === currentImageIndex}
          />
        ))}

        {images.length > 1 && (
          <>
            <SliderArrow $direction="left" onClick={prevImage}>
              <IoIosArrowBack />
            </SliderArrow>
            <SliderArrow $direction="right" onClick={nextImage}>
              <IoIosArrowForward />
            </SliderArrow>
            <SliderNav>
              {images.map((_, index) => (
                <SliderDot
                  key={index}
                  $active={index === currentImageIndex}
                  onClick={() => setCurrentImageIndex(index)}
                />
              ))}
            </SliderNav>
          </>
        )}
      </HeroImageContainer>
    </HeroSection>
  );
}
