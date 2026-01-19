// src/pages/ProductDetailPage.jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';
import { RxDimensions } from 'react-icons/rx';
import { TbTemperatureSun, TbVolume, TbWind } from 'react-icons/tb';
import { RiContrastDrop2Line } from 'react-icons/ri';
import { FiDownload, FiPhone, FiCheck, FiExternalLink } from 'react-icons/fi';
import { BsQuestionCircle } from 'react-icons/bs';
import Page from '../components/common/Page';
import Section from '../components/common/Section';

// --- Styled Components ---

// Breadcrumbs
const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1.5rem 0;
  font-size: 1.1rem;
  color: #6b7280;
  flex-wrap: wrap;
  
  a {
    color: #6b7280;
    text-decoration: none;
    transition: color 0.2s ease;
    
    &:hover {
      color: #1a5618;
    }
  }
  
  span {
    color: #1a5618;
    font-weight: 500;
  }
  
  svg {
    font-size: 0.85rem;
    color: #9ca3af;
  }
`;

// Hero Section
const HeroSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.2fr;
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
`;

const ProductCategory = styled.span`
  font-size: 1.5rem;
  color: #000000;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
`;

const ProductTitle = styled.h1`
  font-size: 5.5rem;
  font-weight: 400;
  color: #013613;
  margin: 0 0 1.5rem 0;
  letter-spacing: 1px;
  line-height: 1.1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 4rem;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 3rem;
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

// Hero Image Slider z efektem crossfade
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
  background: ${({ $active }) => $active ? '#1a5618b3' : 'rgba(255, 255, 255, 0.41)'};
  backdrop-filter: blur(0.4rem);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${({ $active }) => $active ? '#1a5618' : 'rgb(255, 255, 255)'};
  }
`;

const SliderArrow = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${({ $direction }) => $direction === 'left' ? 'left: 1rem;' : 'right: 1rem;'}
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

// Specs Section
const SpecsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  padding: 3rem 0;
  border-radius: 12px;
  background: #ffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.096);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const SpecCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
`;

const SpecIconWrapper = styled.div`
  width: 56px;
  height: 56px;
  background-color: #f0f4f0;
  border: 1px solid #e0e5e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  
  svg {
    font-size: 1.8rem;
    color: #1a5618;
  }
`;

const SpecContent = styled.div`
  flex: 1;
`;

const SpecValue = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: #013613;
  margin-bottom: 0.25rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.4rem;
  }
`;

const SpecLabel = styled.div`
  font-size: 1.2rem;
  color: #6b7280;
  line-height: 1.4;
`;

const TooltipIcon = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
  color: #9ca3af;
  transition: color 0.2s ease;
  
  &:hover {
    color: #1a5618;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

// Features Section
const FeaturesSection = styled.div`
  padding: 5rem 0 0 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.8rem;
  font-weight: 400;
  color: #013613;
  margin: 0 0 3rem 0;
  text-align: ${({ $center }) => $center ? 'center' : 'left'}; 
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2.2rem;
    margin-bottom: 2rem;
  }
`;

const FeaturesLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
`;

const VideoWrapper = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  background: #0a0a0a;
  aspect-ratio: 4/3;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.096);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    order: -1;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
  }
`;

const ProductVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const FeaturesContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    gap: 1rem;
  }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #00460f52;
  transition: all 0.3s ease;
`;

const FeatureText = styled.p`
  font-size: 1.2rem;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
  
  strong {
    color: #013613;
    font-weight: 600;
  }
`;

// ============================================
// SEKCJA KOLORÓW
// ============================================

const ColorsSection = styled.div`
  padding: 5rem 0;
  background: #f6f8f9;
  margin: 0 -4rem;
  padding-left: 4rem;
  padding-right: 4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const ColorsLayout = styled.div`
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 3rem;
  align-items: start;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ColorSwatchesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const ColorSwatchesLabel = styled.span`
  font-size: 1.4rem;
  color: #4b5563;
  font-weight: 500;
`;

const ColorSwatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const ColorSwatchButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.6rem;
  border-radius: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.8);
  }
`;

const ColorSquare = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 6px;
  background: ${({ $color }) => $color};
  background-image: ${({ $image }) => $image ? `url(${$image})` : 'none'};
  background-size: cover;
  background-position: center;
  border: 2px solid ${({ $active }) => $active ? '#1a5618' : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: ${({ $active }) => 
    $active 
      ? '0 0 0 2px rgba(26, 86, 24, 0.2)' 
      : '0 2px 6px rgba(0, 0, 0, 0.08)'
  };
  transition: all 0.2s ease;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 52px;
    height: 52px;
  }
`;

const ColorSwatchRAL = styled.span`
  font-size: 1rem;
  color: ${({ $active }) => $active ? '#1a5618' : '#6b7280'};
  font-weight: ${({ $active }) => $active ? '600' : '500'};
  letter-spacing: 0.3px;
  transition: color 0.2s ease;
`;

const FullPaletteLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.4rem;
  color: #1a5618;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
  
  &:hover {
    color: #2d7a2a;
    text-decoration: underline;
  }
  
  svg {
    font-size: 1rem;
  }
`;

const ColorPreviewContainer = styled.div`
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    max-width: 550px;
    margin: 0 auto;
    width: 100%;
  }
`;

const ColorPreviewMain = styled.div`
  aspect-ratio: 16/9;
  background: ${({ $color }) => $color};
  background-image: ${({ $image }) => $image ? `url(${$image})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const ColorPreviewInfo = styled.div`
  padding: 1.75rem 2rem;
  border-top: 1px solid #e5e7eb;
`;

const ColorPreviewName = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: #013613;
  margin: 0 0 0.35rem 0;
`;

const ColorPreviewRAL = styled.span`
  font-size: 1.2rem;
  color: #1a5618;
  font-weight: 500;
`;

const ColorPreviewDescription = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  line-height: 1.7;
  margin: 1.25rem 0 0 0;
`;

// Advantages Section
const AdvantagesSection = styled.div`
  padding: 5rem 0;
`;

const AdvantagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const AdvantageCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid #0d6b035e;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    transform: translateY(-5px);
  }
`;

const AdvantageIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #e8f5e8 0%, #d4ecd4 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  
  svg {
    font-size: 1.8rem;
    color: #1a5618;
  }
`;

const AdvantageTitle = styled.h3`
  font-size: 1.35rem;
  font-weight: 600;
  color: #013613;
  margin: 0 0 0.75rem 0;
`;

const AdvantageDescription = styled.p`
  font-size: 1.2rem;
  color: #6b7280;
  line-height: 1.6;
  margin: 0;
`;

// ============================================
// SEKCJA GWARANCJI
// ============================================

const WarrantySection = styled.div`
  background: #ffffff;
  border-radius: 20px;
  padding: 3.5rem 4rem;
  display: flex;
  align-items: center;
  gap: 4rem;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.06);
  border: 1px solid #0d6b035e;
  margin-top: 2rem;
  position: relative;
  overflow: hidden;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    gap: 2.5rem;
    padding: 3rem 2.5rem;
    text-align: center;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 2.5rem 1.5rem;
  }
`;

const WarrantyBadge = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  position: relative;
`;

const WarrantyImage = styled.img`
  width: 350px;
  height: auto;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    width: 250px;
  }
`;

const WarrantyYears = styled.div`
  font-size: 4.5rem;
  font-weight: 700;
  color: #013613;
  line-height: 1;
  margin-top: 0.5rem;
  
  span {
    font-size: 2rem;
    font-weight: 500;
    display: block;
    color: #1a5618;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 3.5rem;
    
    span {
      font-size: 1.6rem;
    }
  }
`;

const WarrantyContent = styled.div`
  flex: 1;
`;

const WarrantyTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 600;
  color: #013613;
  margin: 0 0 1rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.5rem;
  }
`;

const WarrantyText = styled.p`
  font-size: 1.3rem;
  color: #4b5563;
  line-height: 1.8;
  margin: 0;
  
  strong {
    color: #013613;
    font-weight: 600;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.2rem;
  }
`;

const WarrantyHighlight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, #e8f5e8 0%, #d4ecd4 100%);
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  margin-top: 1.5rem;
  
  svg {
    color: #1a5618;
    font-size: 1.3rem;
  }
  
  span {
    font-size: 1.15rem;
    color: #1a5618;
    font-weight: 600;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1rem;
    padding: 0.6rem 1rem;
  }
`;

// CTA Section
const CTASection = styled.div`
  padding: 4rem 0;
  margin: 3rem 0;
  border-top: 1px solid #e5e7eb;
`;

const CTAInner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
`;

const CTATitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 500;
  color: #013613;
  margin: 0 0 1rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.8rem;
  }
`;

const CTADescription = styled.p`
  font-size: 1.4rem;
  color: #6b7280;
  margin: 0 0 2rem 0;
  line-height: 1.7;
`;

const CTAButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.2rem 3rem;
  border-radius: 8px;
  font-size: 1.15rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  background: #013613;
  color: #ffffff;
  
  &:hover {
    background: #1a5618;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(1, 54, 19, 0.25);
  }
  
  svg {
    font-size: 1.3rem;
  }
`;

const CTANote = styled.span`
  display: block;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #9ca3af;
`;

// --- Dane produktów ---
const productsData = {
  pava: {
    category: 'Okna',
    name: 'PAVA',
    shortDescription: 'Nowatorskie okno zaprojektowane z myślą o rosnących potrzebach, takich jak większa energooszczędność i nieprzemijający design.',
    longDescription: 'Obniżony profil skrzydła to nawet 10% więcej naturalnego światła we wnętrzu. Dzięki dodatkowej uszczelce w ramie, system PAVA zapewnia skuteczniejszą izolację cieplną i akustyczną. Przełomowa technologia suchego wklejania szyby sprawia, że otwieranie i zamykanie okna przebiega niezwykle płynnie.',
    headerImage: '/images/hs/top.jpg',
    images: [
      '/images/products/windows/pava/pava-1.jpg',
      '/images/products/windows/pava/pava-2.jpg'
    ],
    video: '/videos/products/windows/pava/pava.mp4',
    specs: {
      soundInsulation: {
        value: 'Rw = 38 (-2; -7) dB',
        label: 'Wskaźnik izolacyjności akustycznej właściwej',
        icon: TbVolume
      },
      thermalTransmittance: {
        value: 'Uw = 0,75 W/(m²K)',
        label: 'Współczynnik przenikania ciepła',
        icon: TbTemperatureSun
      },
      windResistance: {
        value: '800 - 1600 Pa',
        label: 'Odporność na obciążenie wiatrem',
        icon: TbWind
      },
      waterTightness: {
        value: '600 Pa',
        label: 'Wodoszczelność',
        icon: RiContrastDrop2Line
      }
    },
    features: [
      {
        text: 'Skrzydło posiada <strong>obniżoną przylgę szybową</strong>. Dzięki temu do wnętrza wpada nawet 10% więcej światła.'
      },
      {
        text: '<strong>7-komorowy profil ramy</strong> i 6-komorowy profil skrzydła klasy A o głębokości zabudowy 82 mm (rama), 86 mm (skrzydło).'
      },
      {
        text: 'Szeroki <strong>zakres grubości możliwych do zastosowania pakietów szybowych</strong>, między 35 a 59 mm.'
      },
      {
        text: 'Możliwość wyboru <strong>listwy przyszybowej PIXEL</strong> lub KONCEPT.'
      },
      {
        text: '<strong>Zewnętrzna uszczelka szybowa</strong> maskująca taśmę STV.'
      },
      {
        text: 'Okna nie wymagają tak częstej regulacji jak okna bez <strong>technologii STV</strong>.'
      },
      {
        text: 'Okucia działają jeszcze lżej w porównaniu do okna z szybą wbijaną, co wpływa na <strong>bardziej komfortowe otwieranie i zamykanie</strong> okna PAVA.'
      }
    ],
    colors: [
      { 
        id: 'ral9016', 
        name: 'Biały Ruchu Drogowego', 
        ral: 'RAL 9016',
        color: '#F7F9F4',
        description: 'Klasyczna biel w wykończeniu matowym. Idealnie komponuje się z nowoczesnymi wnętrzami, dodając im lekkości i świeżości.'
      },
      { 
        id: 'ral7016', 
        name: 'Szary Antracytowy', 
        ral: 'RAL 7016',
        color: '#383E42',
        description: 'Głęboki odcień antracytu z satynowym wykończeniem. Elegancki i nowoczesny, doskonale podkreśla minimalistyczny charakter budynku.'
      },
      { 
        id: 'ral9005', 
        name: 'Czarny Głęboki', 
        ral: 'RAL 9005',
        color: '#0E0E10',
        description: 'Intensywna czerń o głębokim, satynowym połysku. Nadaje oknom luksusowy, wyrazisty charakter.'
      },
      { 
        id: 'ral7035', 
        name: 'Szary Jasny', 
        ral: 'RAL 7035',
        color: '#C5C7C4',
        description: 'Delikatny, jasny odcień szarości. Neutralny ton, który doskonale harmonizuje z różnymi stylami architektonicznymi.'
      },
      { 
        id: 'ral8017', 
        name: 'Brąz Czekoladowy', 
        ral: 'RAL 8017',
        color: '#3E2B23',
        description: 'Ciepły, głęboki odcień brązu przypominający czekoladę. Nadaje ciepła i przytulności.'
      },
      { 
        id: 'ral6005', 
        name: 'Zielony Mchowy', 
        ral: 'RAL 6005',
        color: '#0F4336',
        description: 'Głęboka, butelkowa zieleń o eleganckim charakterze. Nawiązuje do natury i doskonale komponuje się z otoczeniem.'
      },
      { 
        id: 'ral7021', 
        name: 'Szary Czarny', 
        ral: 'RAL 7021',
        color: '#2F3234',
        description: 'Ciemny odcień grafitu z subtelnym niebieskim podtonem. Nowoczesny i wyrafinowany.'
      },
      { 
        id: 'ral1015', 
        name: 'Kość Słoniowa Jasna', 
        ral: 'RAL 1015',
        color: '#E6D2B5',
        description: 'Ciepły, kremowy odcień kości słoniowej. Elegancka alternatywa dla czystej bieli.'
      },
      { 
        id: 'ral9006', 
        name: 'Aluminium Białe', 
        ral: 'RAL 9006',
        color: '#A1A1A0',
        description: 'Metaliczny odcień aluminium z charakterystycznym połyskiem. Nowoczesny i industrialny.'
      },
      { 
        id: 'ral7039', 
        name: 'Szary Kwarcowy', 
        ral: 'RAL 7039',
        color: '#6B665E',
        description: 'Ciepły odcień szarości z brązowym podtonem. Naturalny i stonowany, harmonijnie łączy się z drewnem.'
      },
      { 
        id: 'ral8019', 
        name: 'Brąz Szary', 
        ral: 'RAL 8019',
        color: '#3D3635',
        description: 'Ciemny brąz z szarym podtonem. Elegancki i dyskretny, idealny do klasycznych aranżacji.'
      },
      { 
        id: 'ral5011', 
        name: 'Granatowy Stalowy', 
        ral: 'RAL 5011',
        color: '#1A2B3C',
        description: 'Głęboki odcień granatu ze stalowym połyskiem. Elegancki i wyrafinowany.'
      },
      { 
        id: 'ral3005', 
        name: 'Czerwień Winna', 
        ral: 'RAL 3005',
        color: '#5E2028',
        description: 'Głęboka, burgundowa czerwień. Nadaje charakter i wyróżnia budynek spośród innych.'
      },
      { 
        id: 'ral9001', 
        name: 'Biały Kremowy', 
        ral: 'RAL 9001',
        color: '#FFFDF4',
        description: 'Delikatna, ciepła biel z kremowym podtonem. Stonowana i elegancka alternatywa dla czystej bieli.'
      },
      { 
        id: 'ral7022', 
        name: 'Szary Umbra', 
        ral: 'RAL 7022',
        color: '#4B4D46',
        description: 'Ciepły, ziemisty odcień szarości. Naturalny i uniwersalny, pasuje do różnych stylów.'
      },
    ],
    advantages: [
      {
        icon: TbTemperatureSun,
        title: 'Doskonała izolacja termiczna',
        description: 'Współczynnik Uw = 0,75 W/(m²K) zapewnia minimalne straty ciepła i niższe rachunki za ogrzewanie.'
      },
      {
        icon: TbVolume,
        title: 'Wysoka izolacyjność akustyczna',
        description: 'Rw = 38 dB skutecznie redukuje hałas z zewnątrz, zapewniając ciszę i komfort w domu.'
      },
      {
        icon: RxDimensions,
        title: 'Więcej światła',
        description: 'Obniżony profil skrzydła pozwala na wpuszczenie nawet 10% więcej naturalnego światła.'
      },
      {
        icon: FiCheck,
        title: 'Technologia STV',
        description: 'Suche wklejanie szyby zapewnia płynne działanie i rzadszą potrzebę regulacji.'
      },
      {
        icon: RiContrastDrop2Line,
        title: 'Wodoszczelność 600 Pa',
        description: 'Wysoka odporność na działanie wody opadowej nawet przy silnym wietrze.'
      },
      {
        icon: TbWind,
        title: 'Odporność na wiatr',
        description: 'Klasa odporności 800-1600 Pa gwarantuje stabilność nawet przy ekstremalnych warunkach.'
      }
    ]
  },
  pilar: {
    category: 'Okna',
    name: 'PILAR',
    shortDescription: 'System okienny łączący elegancję z funkcjonalnością.',
    longDescription: 'Okna PILAR to połączenie nowoczesnego designu z najwyższą jakością wykonania.',
    headerImage: '/images/hs/top.jpg',
    images: ['/images/products/windows/pilar.png'],
    video: '/videos/products/pilar-demo.mp4',
    specs: {
      soundInsulation: { value: 'Rw = 36 dB', label: 'Izolacyjność akustyczna', icon: TbVolume },
      thermalTransmittance: { value: 'Uw = 0,79 W/(m²K)', label: 'Współczynnik przenikania ciepła', icon: TbTemperatureSun },
      windResistance: { value: '800 - 1400 Pa', label: 'Odporność na wiatr', icon: TbWind },
      waterTightness: { value: '500 Pa', label: 'Wodoszczelność', icon: RiContrastDrop2Line }
    },
    features: [
      { text: '<strong>7-komorowy profil</strong> zapewniający doskonałą izolację.' },
      { text: 'Możliwość zastosowania <strong>pakietów szybowych do 52 mm</strong>.' }
    ],
    colors: [
      { 
        id: 'ral9016', 
        name: 'Biały', 
        ral: 'RAL 9016',
        color: '#F7F9F4',
        description: 'Klasyczna biel w wykończeniu matowym.'
      },
      { 
        id: 'ral7016', 
        name: 'Antracyt', 
        ral: 'RAL 7016',
        color: '#383E42',
        description: 'Głęboki odcień antracytu z satynowym wykończeniem.'
      },
      { 
        id: 'ral9005', 
        name: 'Czarny Głęboki', 
        ral: 'RAL 9005',
        color: '#0E0E10',
        description: 'Intensywna czerń o głębokim połysku.'
      },
      { 
        id: 'ral7035', 
        name: 'Szary Jasny', 
        ral: 'RAL 7035',
        color: '#C5C7C4',
        description: 'Delikatny, jasny odcień szarości.'
      },
      { 
        id: 'ral8017', 
        name: 'Brąz Czekoladowy', 
        ral: 'RAL 8017',
        color: '#3E2B23',
        description: 'Ciepły, głęboki odcień brązu.'
      },
      { 
        id: 'ral6005', 
        name: 'Zielony Mchowy', 
        ral: 'RAL 6005',
        color: '#0F4336',
        description: 'Głęboka, butelkowa zieleń.'
      },
    ],
    advantages: []
  },
  prismatic: {
    category: 'Okna',
    name: 'PRISMATIC',
    shortDescription: 'Okna o geometrycznym, nowoczesnym designie.',
    longDescription: 'System PRISMATIC wyróżnia się charakterystycznym kształtem profilu.',
    headerImage: '/images/hs/top.jpg',
    images: ['/images/products/windows/pilar.png'],
    video: '/videos/products/prismatic-demo.mp4',
    specs: {
      soundInsulation: { value: 'Rw = 35 dB', label: 'Izolacyjność akustyczna', icon: TbVolume },
      thermalTransmittance: { value: 'Uw = 0,82 W/(m²K)', label: 'Współczynnik przenikania ciepła', icon: TbTemperatureSun },
      windResistance: { value: '600 - 1200 Pa', label: 'Odporność na wiatr', icon: TbWind },
      waterTightness: { value: '450 Pa', label: 'Wodoszczelność', icon: RiContrastDrop2Line }
    },
    features: [],
    colors: [
      { 
        id: 'ral9016', 
        name: 'Biały', 
        ral: 'RAL 9016',
        color: '#F7F9F4',
        description: 'Klasyczna biel w wykończeniu matowym.'
      },
      { 
        id: 'ral7016', 
        name: 'Antracyt', 
        ral: 'RAL 7016',
        color: '#383E42',
        description: 'Głęboki odcień antracytu.'
      },
      { 
        id: 'ral9005', 
        name: 'Czarny', 
        ral: 'RAL 9005',
        color: '#0E0E10',
        description: 'Intensywna czerń.'
      },
    ],
    advantages: []
  }
};

// --- Component ---
const ProductDetailPage = () => {
  const { t } = useTranslation();
  const { category, productId } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);

  const product = productsData[productId];

  if (!product) {
    return (
      <Page
        imageSrc="/images/products/default-header.jpg"
        title="Nie znaleziono produktu"
      >
        <Section>
          <p>Wybrany produkt nie istnieje.</p>
          <PrimaryButton to={`/produkty/${category}`}>
            Wróć do kategorii
          </PrimaryButton>
        </Section>
      </Page>
    );
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const currentColor = product.colors[selectedColor];

  return (
    <Page
      imageSrc={product.headerImage}
      title={product.name}
    >
      <Section>
        {/* Breadcrumbs */}
        <Breadcrumbs>
          <Link to="/">Strona główna</Link>
          <IoIosArrowForward />
          <Link to="/produkty">Produkty</Link>
          <IoIosArrowForward />
          <Link to={`/produkty/${category}`}>{product.category}</Link>
          <IoIosArrowForward />
          <span>{product.name}</span>
        </Breadcrumbs>

        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <ProductCategory>{product.category}</ProductCategory>
            <ProductTitle>{product.name}</ProductTitle>
            <TitleDivider />
            <ProductDescription>{product.shortDescription}</ProductDescription>
            <ProductHighlight>{product.longDescription}</ProductHighlight>

            <ButtonsContainer>
              <PrimaryButton to="/contact">
                <FiPhone />
                Skontaktuj się z nami
              </PrimaryButton>
              <OutlineButton>
                <FiDownload />
                Pobierz katalog PDF
              </OutlineButton>
            </ButtonsContainer>
          </HeroContent>

          {/* Hero Image Slider z efektem crossfade */}
          <HeroImageContainer>
            {product.images.map((image, index) => (
              <HeroImage
                key={index}
                src={image}
                alt={`${product.name} - zdjęcie ${index + 1}`}
                $active={index === currentImageIndex}
              />
            ))}

            {product.images.length > 1 && (
              <>
                <SliderArrow $direction="left" onClick={prevImage}>
                  <IoIosArrowBack />
                </SliderArrow>
                <SliderArrow $direction="right" onClick={nextImage}>
                  <IoIosArrowForward />
                </SliderArrow>
                <SliderNav>
                  {product.images.map((_, index) => (
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

        {/* Specs Section */}
        <SpecsSection>
          {Object.entries(product.specs).map(([key, spec]) => {
            const IconComponent = spec.icon;
            return (
              <SpecCard key={key}>
                <SpecIconWrapper>
                  <IconComponent />
                </SpecIconWrapper>
                <SpecContent>
                  <SpecValue>{spec.value}</SpecValue>
                  <SpecLabel>{spec.label}</SpecLabel>
                </SpecContent>
                <TooltipIcon>
                  <BsQuestionCircle />
                </TooltipIcon>
              </SpecCard>
            );
          })}
        </SpecsSection>

        {/* Features Section */}
        {product.features.length > 0 && (
          <FeaturesSection>
            <SectionTitle>Co wyróżnia okno {product.name}?</SectionTitle>

            <FeaturesLayout>
              <VideoWrapper>
                <ProductVideo
                  src={product.video}
                  autoPlay
                  loop
                  muted
                  playsInline
                />
              </VideoWrapper>

              <FeaturesContent>
                {product.features.map((feature, index) => (
                  <FeatureItem key={index}>
                    <FeatureText dangerouslySetInnerHTML={{ __html: feature.text }} />
                  </FeatureItem>
                ))}
              </FeaturesContent>
            </FeaturesLayout>
          </FeaturesSection>
        )}
      </Section>

      {/* Colors Section */}
      {product.colors.length > 0 && (
        <ColorsSection>
          <Section>
            <SectionTitle>Kolorystyka RAL</SectionTitle>

            <ColorsLayout>
              {/* Lewa strona - próbki kolorów */}
              <ColorSwatchesContainer>
                <ColorSwatchesLabel>Najczęściej wybierane kolory</ColorSwatchesLabel>
                
                <ColorSwatchesGrid>
                  {product.colors.map((color, index) => (
                    <ColorSwatchButton
                      key={color.id}
                      onClick={() => setSelectedColor(index)}
                    >
                      <ColorSquare
                        $color={color.color}
                        $image={color.image}
                        $active={selectedColor === index}
                      />
                      <ColorSwatchRAL $active={selectedColor === index}>
                        {color.ral}
                      </ColorSwatchRAL>
                    </ColorSwatchButton>
                  ))}
                </ColorSwatchesGrid>

                <FullPaletteLink 
                  href="https://www.ralcolorchart.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  Pełna paleta kolorów RAL
                  <FiExternalLink />
                </FullPaletteLink>
              </ColorSwatchesContainer>

              {/* Prawa strona - podgląd koloru */}
              <ColorPreviewContainer>
                <ColorPreviewMain 
                  $color={currentColor?.color} 
                  $image={currentColor?.image} 
                />
                
                <ColorPreviewInfo>
                  <ColorPreviewName>{currentColor?.name}</ColorPreviewName>
                  <ColorPreviewRAL>{currentColor?.ral}</ColorPreviewRAL>
                  <ColorPreviewDescription>
                    {currentColor?.description}
                  </ColorPreviewDescription>
                </ColorPreviewInfo>
              </ColorPreviewContainer>
            </ColorsLayout>
          </Section>
        </ColorsSection>
      )}

      <Section>
        {/* Advantages Section */}
        {product.advantages.length > 0 && (
          <AdvantagesSection>
            <SectionTitle>Dlaczego warto wybrać {product.name}?</SectionTitle>

            <AdvantagesGrid>
              {product.advantages.map((advantage, index) => {
                const IconComponent = advantage.icon;
                return (
                  <AdvantageCard key={index}>
                    <AdvantageIcon>
                      <IconComponent />
                    </AdvantageIcon>
                    <AdvantageTitle>{advantage.title}</AdvantageTitle>
                    <AdvantageDescription>{advantage.description}</AdvantageDescription>
                  </AdvantageCard>
                );
              })}
            </AdvantagesGrid>

            <WarrantySection>
              <WarrantyBadge>
                <WarrantyImage 
                  src="/images/products/windows/gwarancja.png" 
                  alt="Gwarancja" 
                />
              </WarrantyBadge>
              
              <WarrantyContent>
                <WarrantyTitle>Pewność jakości na lata</WarrantyTitle>
                <WarrantyText>
                  Jesteśmy pewni jakości naszych produktów, dlatego w ciągu <strong>5 lat</strong> od 
                  montażu możesz nam zgłosić jakikolwiek problem z wszystkimi elementami 
                  naszej stolarki okiennej. Dodatkowo oferujemy <strong>10 lat gwarancji</strong> na 
                  szczelność pakietów szybowych z ramką Warmatec.
                </WarrantyText>
                <WarrantyHighlight>
                  <FiCheck />
                  <span>Bezpłatny serwis gwarancyjny</span>
                </WarrantyHighlight>
              </WarrantyContent>
            </WarrantySection>
          </AdvantagesSection>
        )}

        {/* CTA Section */}
        <CTASection>
          <CTAInner>
            <CTATitle>Zainteresowany oknami {product.name}?</CTATitle>
            <CTADescription>
              Nasi eksperci pomogą Ci dobrać idealne rozwiązanie dla Twojego domu.
              Skontaktuj się z nami, aby uzyskać bezpłatną wycenę.
            </CTADescription>
            <PrimaryButton to="/contact">
              <FiPhone />
              Skontaktuj się z nami
            </PrimaryButton>
            <CTANote>Odpowiadamy w ciągu 24 godzin</CTANote>
          </CTAInner>
        </CTASection>
      </Section>
    </Page>
  );
};

export default ProductDetailPage;