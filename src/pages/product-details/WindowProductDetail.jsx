import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FiDownload, FiPhone, FiCheck, FiExternalLink, FiPlus, FiMinus } from 'react-icons/fi';
import { BsQuestionCircle } from 'react-icons/bs';
import { Trans, useTranslation } from 'react-i18next';
import Page from '../../components/common/Page';
import Section from '../../components/common/Section';
import { WINDOW_COLORS_PALETTE, WINDOW_SPECS_DEFS, WINDOW_SPECS_ORDER_LIST } from '../../data/products/windows';

// --- Styled Components ---

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
  /* auto-fit -> lepsze ułożenie dla 3 lub 4 parametrów */
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 3rem 0;
  border-radius: 12px;
  background: #ffff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.096);
  align-items: stretch;
`;

const SpecCard = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 12px;
  position: relative;
  transition: all 0.3s ease;
  min-height: 96px;
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

const TooltipBubble = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 280px;
  max-width: min(75vw, 320px);
  background: rgba(17, 24, 39, 0.96);
  color: #ffffff;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  font-size: 1.1rem;
  line-height: 1.5;
  z-index: 50;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);

  opacity: 0;
  transform: translateY(-4px);
  pointer-events: none;
  transition: opacity 0.15s ease, transform 0.15s ease;

  &::before {
    content: '';
    position: absolute;
    top: -7px;
    right: 10px;
    width: 14px;
    height: 14px;
    background: rgba(17, 24, 39, 0.96);
    transform: rotate(45deg);
  }
`;

const TooltipWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 60;

  /* hover (desktop) + focus (keyboard) */
  &:hover ${TooltipBubble},
  &:focus-within ${TooltipBubble} {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* click (mobile) */
  &[data-open='true'] ${TooltipBubble} {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
`;

const TooltipButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: 1px solid rgba(209, 213, 219, 0.9);
  background: rgba(255, 255, 255, 0.85);
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    color: #1a5618;
    border-color: rgba(26, 86, 24, 0.35);
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(26, 86, 24, 0.25);
    border-color: rgba(26, 86, 24, 0.65);
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
  padding: 5rem 0 3rem 0;
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

// ============================================
// FAQ SECTION
// ============================================

const FAQSection = styled.div`
  margin: 0 -4rem;
  padding-left: 4rem;
  padding-right: 4rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin: 0 -1.5rem;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
`;

const FAQHeader = styled.div`
  margin-bottom: 2.5rem;
`;

const FAQTitleWrapper = styled.h2`
  font-size: 2.8rem;
  font-weight: 400;
  color: #374151;
  margin: 0 0 0.5rem 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 2rem;
  }
`;

const FAQProductName = styled.span`
  color: #013613;
  font-weight: 500;
`;

const FAQSubtitle = styled.p`
  font-size: 1.3rem;
  color: #6b7280;
  margin: 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.15rem;
  }
`;

const FAQContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FAQItem = styled.div`
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
  border: 1px solid ${({ $isOpen }) => $isOpen ? '#1a5618' : '#e5e7eb'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${({ $isOpen }) => $isOpen ? '#1a5618' : '#1a561850'};
    box-shadow: 0 4px 20px rgba(26, 86, 24, 0.08);
  }
`;

const FAQQuestion = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.5rem 2rem;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: all 0.3s ease;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 1.25rem 1.5rem;
    gap: 1rem;
  }
`;

const FAQQuestionContent = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
`;

const FAQNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $isOpen }) => $isOpen 
    ? 'linear-gradient(135deg, #1a5618 0%, #2d7a2a 100%)' 
    : 'linear-gradient(135deg, #e8f5e8 0%, #d4ecd4 100%)'};
  color: ${({ $isOpen }) => $isOpen ? '#ffffff' : '#1a5618'};
  font-size: 1.1rem;
  font-weight: 600;
  flex-shrink: 0;
  transition: all 0.3s ease;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
`;

const FAQQuestionText = styled.span`
  font-size: 1.3rem;
  font-weight: 500;
  color: ${({ $isOpen }) => $isOpen ? '#013613' : '#374151'};
  line-height: 1.4;
  transition: color 0.3s ease;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.2rem;
  }
`;

const FAQIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${({ $isOpen }) => $isOpen 
    ? 'linear-gradient(135deg, #1a5618 0%, #2d7a2a 100%)' 
    : '#f3f4f6'};
  flex-shrink: 0;
  transition: all 0.3s ease;
  transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  
  svg {
    font-size: 1.3rem;
    color: ${({ $isOpen }) => $isOpen ? '#ffffff' : '#6b7280'};
    transition: color 0.3s ease;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    width: 36px;
    height: 36px;
    
    svg {
      font-size: 1.1rem;
    }
  }
`;

const FAQAnswerWrapper = styled.div`
  max-height: ${({ $isOpen }) => $isOpen ? '500px' : '0'};
  overflow: hidden;
  transition: max-height 0.4s ease;
`;

const FAQAnswer = styled.div`
  padding: 0 2rem 1.5rem 5.5rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 0 1.5rem 1.25rem 1.5rem;
  }
`;

const FAQAnswerText = styled.p`
  font-size: 1.2rem;
  color: #000000;
  line-height: 1.8;
  margin: 0;
  padding-top: 0.5rem;
  border-top: 1px dashed #e5e7eb;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.1rem;
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

const CTANote = styled.span`
  display: block;
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #9ca3af;
`;

// FAQ Data
const faqData = [
  {
    question: "Jak często należy konserwować okna PVC?",
    answer: "Okna PVC wymagają minimalnej konserwacji. Zalecamy czyszczenie ram i szyb co najmniej 2-3 razy w roku przy użyciu łagodnych środków czyszczących. Okucia warto smarować specjalnym olejem raz w roku, najlepiej przed sezonem zimowym. Uszczelki można przecierać preparatem silikonowym, co przedłuży ich żywotność."
  },
  {
    question: "Jaki współczynnik przenikania ciepła Uw jest najlepszy?",
    answer: "Im niższy współczynnik Uw, tym lepsza izolacja termiczna okna. Dla domów energooszczędnych zalecamy okna z Uw poniżej 0,9 W/m²K. Standardowe okna mają Uw na poziomie 1,1-1,3 W/m²K. Nasze okna premium osiągają nawet Uw = 0,7 W/m²K, co przekłada się na znaczne oszczędności w ogrzewaniu."
  },
  {
    question: "Czy oferujecie montaż okien i ile trwa realizacja?",
    answer: "Tak, oferujemy profesjonalny montaż wykonywany przez certyfikowanych monterów. Czas realizacji zamówienia wynosi zazwyczaj 4-6 tygodni od momentu pomiaru. Sam montaż standardowego okna trwa około 2-3 godzin. Oferujemy również demontaż starych okien i wywóz gruzu w cenie usługi."
  },
  {
    question: "Czy mogę zamówić okna w niestandardowych wymiarach?",
    answer: "Oczywiście! Specjalizujemy się w produkcji okien na wymiar. Możemy wykonać okna o nietypowych kształtach - łukowe, trójkątne, trapezowe czy okrągłe. Minimalny wymiar to 30x30 cm, a maksymalny zależy od typu okna i może sięgać nawet 300x280 cm dla okien przesuwnych."
  },
  {
    question: "Jakie są różnice między oknami dwu- a trzyszybowymi?",
    answer: "Okna trzyszybowe oferują lepszą izolację termiczną (Ug nawet 0,5 W/m²K vs 1,0 W/m²K dla dwuszybowych) i akustyczną. Są cięższe o około 30%, co wymaga mocniejszych okuć. Przy dzisiejszych cenach energii okna trzyszybowe zwracają się w ciągu 5-7 lat. Polecamy je szczególnie do domów energooszczędnych i budynków przy ruchliwych ulicach."
  },
  {
    question: "Jak długo trwa gwarancja na okna?",
    answer: "Udzielamy 5-letniej gwarancji na wszystkie elementy stolarki okiennej, obejmującej profile, okucia i uszczelki. Dodatkowo oferujemy rozszerzoną 10-letnią gwarancję na szczelność pakietów szybowych z ciepłą ramką. Gwarancja obejmuje bezpłatne naprawy i wymianę wadliwych elementów."
  }
];

const WindowProductDetail = ({ product }) => {
  const { t } = useTranslation();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(0);
  const [openFAQIndex, setOpenFAQIndex] = useState(null);
  const [openSpecTooltip, setOpenSpecTooltip] = useState(null);

  // zamknij tooltip po kliknięciu poza nim (głównie mobile)
  React.useEffect(() => {
    if (!openSpecTooltip) return;
    const onDocClick = () => setOpenSpecTooltip(null);
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [openSpecTooltip]);

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

  const toggleFAQ = (index) => {
    setOpenFAQIndex(openFAQIndex === index ? null : index);
  };

  const specTooltipKeyMap = {
    profileThickness: 'productSpecs.tooltips.profileThickness',
    thermalTransmittance: 'productSpecs.tooltips.thermalTransmittance',
    waterTightness: 'productSpecs.tooltips.waterTightness'
  };

  // W CMS okna nie mają kolorów (kolory są wspólne i zdefiniowane w kodzie),
  // więc jeśli produkt nie ma `colors`, używamy palety domyślnej.
  const colors = product?.colors?.length ? product.colors : WINDOW_COLORS_PALETTE;
  const currentColor = colors?.[selectedColor];

  return (
    <Page
      imageSrc={product.headerImage}
      title={product.name}
      headerProps={{
        badge: { label: product.name },
        headerContent: {
          content: {
            isSubpage: true,
            pageType: 'product',
            subpageType: 'product'
          }
        }
      }}
    >
      <Section>
        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <ProductCategory>
              {t(`products.${product.categoryKey || 'windows'}.name`, product.category)}
            </ProductCategory>
            <ProductTitle>{product.name}</ProductTitle>
            <TitleDivider />
            <ProductDescription>{product.shortDescription}</ProductDescription>
            <ProductHighlight>{product.longDescription}</ProductHighlight>

            <ButtonsContainer>
              <PrimaryButton to="/contact">
                <FiPhone />
                {t('common.contactUs', 'Skontaktuj się z nami')}
              </PrimaryButton>
              <OutlineButton>
                <FiDownload />
                {t('productDetail.downloadCatalogPdf', 'Pobierz katalog PDF')}
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
          {WINDOW_SPECS_ORDER_LIST.map((specKey) => {
            const def = WINDOW_SPECS_DEFS[specKey]
            const value = product?.specs?.[specKey]
            if (!def || !value) return null

            const IconComponent = def.icon

            return (
              <SpecCard key={specKey}>
                <SpecIconWrapper>
                  <IconComponent />
                </SpecIconWrapper>
                <SpecContent>
                  <SpecValue>{value}</SpecValue>
                  <SpecLabel>{def?.labelKey ? t(def.labelKey, def.label) : def.label}</SpecLabel>
                </SpecContent>

                {specTooltipKeyMap[specKey] && (
                  <TooltipWrapper
                    data-open={openSpecTooltip === specKey ? 'true' : 'false'}
                    onClick={(e) => {
                      // nie zamykaj tooltipa gdy klikamy w środku wrappera (dymek/przycisk)
                      e.stopPropagation();
                    }}
                  >
                    <TooltipButton
                      type="button"
                      aria-label={t('productSpecs.tooltipAria', {
                        spec: def?.labelKey ? t(def.labelKey, def.label) : def.label,
                      })}
                      onClick={(e) => {
                        // click działa też na mobile, ale nie blokuje hover/focus na desktopie
                        e.preventDefault();
                        e.stopPropagation();
                        setOpenSpecTooltip((prev) => (prev === specKey ? null : specKey));
                      }}
                      onBlur={() => setOpenSpecTooltip(null)}
                    >
                      <BsQuestionCircle />
                    </TooltipButton>

                    <TooltipBubble role="tooltip">
                      {t(specTooltipKeyMap[specKey])}
                    </TooltipBubble>
                  </TooltipWrapper>
                )}
              </SpecCard>
            )
          })}
        </SpecsSection>

        {/* Features Section */}
        {product.features.length > 0 && (
          <FeaturesSection>
            <SectionTitle>
              {t('productDetail.windows.featuresTitle', {
                product: product.name,
                defaultValue: 'Co wyróżnia okno {{product}}?',
              })}
            </SectionTitle>

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
      {colors.length > 0 && (
        <ColorsSection>
          <Section>
            <SectionTitle>{t('productDetail.windows.colorsTitle', 'Kolorystyka RAL')}</SectionTitle>

            <ColorsLayout>
              {/* Lewa strona - próbki kolorów */}
              <ColorSwatchesContainer>
                <ColorSwatchesLabel>
                  {t('productDetail.windows.colorsMostPopular', 'Najczęściej wybierane kolory')}
                </ColorSwatchesLabel>
                
                <ColorSwatchesGrid>
                  {colors.map((color, index) => (
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
                  {t('productDetail.windows.colorsFullPalette', 'Pełna paleta kolorów RAL')}
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
            <SectionTitle>
              {t('productDetail.windows.advantagesTitle', {
                product: product.name,
                defaultValue: 'Dlaczego warto wybrać {{product}}?',
              })}
            </SectionTitle>

            <AdvantagesGrid>
              {product.advantages.map((advantage, index) => (
                <AdvantageCard key={index}>
                  <AdvantageTitle>{advantage.title}</AdvantageTitle>
                  <AdvantageDescription>{advantage.description}</AdvantageDescription>
                </AdvantageCard>
              ))}
            </AdvantagesGrid>

            <WarrantySection>
              <WarrantyBadge>
                <WarrantyImage 
                  src="/images/products/windows/gwarancja.png" 
                  alt={t('common.warranty', 'Gwarancja')} 
                />
              </WarrantyBadge>
              
              <WarrantyContent>
                <WarrantyTitle>
                  {t('productDetail.windows.warranty.title', 'Pewność jakości na lata')}
                </WarrantyTitle>
                <WarrantyText>
                  <Trans
                    i18nKey="productDetail.windows.warranty.text"
                    defaults="Jesteśmy pewni jakości naszych produktów, dlatego w ciągu <strong>5 lat</strong> od montażu możesz nam zgłosić jakikolwiek problem z wszystkimi elementami naszej stolarki okiennej. Dodatkowo oferujemy <strong>10 lat gwarancji</strong> na szczelność pakietów szybowych z ramką Warmatec."
                    components={{ strong: <strong /> }}
                  />
                </WarrantyText>
                <WarrantyHighlight>
                  <FiCheck />
                  <span>
                    {t('productDetail.windows.warranty.highlight', 'Bezpłatny serwis gwarancyjny')}
                  </span>
                </WarrantyHighlight>
              </WarrantyContent>
            </WarrantySection>
          </AdvantagesSection>
        )}
      </Section>

      {/* FAQ Section */}
      <FAQSection>
        <Section>
          <FAQHeader>
            <FAQTitleWrapper>
              <Trans
                i18nKey="productDetail.faq.title"
                defaults="<product>{{product}}</product> – Najczęściej zadawane pytania"
                values={{ product: product.name }}
                components={{ product: <FAQProductName /> }}
              />
            </FAQTitleWrapper>
            <FAQSubtitle>
              {t(
                'productDetail.faq.subtitle',
                'Znajdź odpowiedzi na najważniejsze pytania dotyczące naszego produktu'
              )}
            </FAQSubtitle>
          </FAQHeader>

          <FAQContainer>
            {faqData.map((faq, index) => (
              <FAQItem key={index} $isOpen={openFAQIndex === index}>
                <FAQQuestion onClick={() => toggleFAQ(index)}>
                  <FAQQuestionContent>
                    <FAQNumber $isOpen={openFAQIndex === index}>
                      {String(index + 1).padStart(2, '0')}
                    </FAQNumber>
                    <FAQQuestionText $isOpen={openFAQIndex === index}>
                      {faq.question}
                    </FAQQuestionText>
                  </FAQQuestionContent>
                  <FAQIconWrapper $isOpen={openFAQIndex === index}>
                    {openFAQIndex === index ? <FiMinus /> : <FiPlus />}
                  </FAQIconWrapper>
                </FAQQuestion>
                
                <FAQAnswerWrapper $isOpen={openFAQIndex === index}>
                  <FAQAnswer>
                    <FAQAnswerText>{faq.answer}</FAQAnswerText>
                  </FAQAnswer>
                </FAQAnswerWrapper>
              </FAQItem>
            ))}
          </FAQContainer>
        </Section>
      </FAQSection>

      <Section>
        {/* CTA Section */}
        <CTASection>
          <CTAInner>
            <CTATitle>
              {t('productDetail.windows.cta.title', {
                product: product.name,
                defaultValue: 'Zainteresowany oknami {{product}}?',
              })}
            </CTATitle>
            <CTADescription>
              {t(
                'productDetail.windows.cta.description',
                'Nasi eksperci pomogą Ci dobrać idealne rozwiązanie dla Twojego domu. Skontaktuj się z nami, aby uzyskać bezpłatną wycenę.'
              )}
            </CTADescription>
            <PrimaryButton to="/contact">
              <FiPhone />
              {t('common.contactUs', 'Skontaktuj się z nami')}
            </PrimaryButton>
            <CTANote>{t('productDetail.windows.cta.note', 'Odpowiadamy w ciągu 24 godzin')}</CTANote>
          </CTAInner>
        </CTASection>
      </Section>
    </Page>
  );
};

export default WindowProductDetail;
