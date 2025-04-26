import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';
import logoSrc from '../../assets/images/logo.png';
import IntroNavigation from '../home/IntroNavigation';

// --- Styled Components ---

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacings.medium};
  height: 80px;
  z-index: 1000;
  transition: opacity 0.3s ease-out, background-color 0.1s linear, border-color 0.1s linear, color 0.1s linear; /* Dodano color do transition */

  /* Twoje tła */
  background-color: ${({ isPastThreshold, isVisible, theme }) =>
    isPastThreshold && isVisible ? "#f8f9fa" : '#017e5414'};

  /* Twój stały border */
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #e6c71968;

  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};

  /* === KLUCZOWA ZMIANA: Kolor tekstu === */
  color: ${({ isPastThreshold, isVisible, theme }) =>
    /* Jeśli tło jest jasne -> użyj ciemnego tekstu */
    isPastThreshold && isVisible ? theme.colors.text : theme.colors.textLight};

  /* Specyficzne style dla linków (<a>) wewnątrz HeaderWrapper */
  a {
     /* Dziedzicz kolor z HeaderWrapper - automatycznie się dostosuje */
     color: inherit;
     transition: color 0.3s ease;

     &:hover {
        /* Kolor hover zawsze secondary, niezależnie od tła */
        color: ${({ theme }) => "#e6c619"};
     }
  }
`;

const LogoLink = styled.a`
  display: block;
  height: 50px;
  cursor: pointer;
  z-index: 1;

  img {
    height: 100%;
    width: auto;
    display: block;
    /* Dodajemy filtr, gdy tekst jest ciemny, aby logo było lepiej widoczne na jasnym tle? Opcjonalne */
    filter: ${({ isPastThreshold, isVisible }) =>
      isPastThreshold && isVisible ? 'brightness(0.5)' : 'none'}; /* Przykład: przyciemnij logo na jasnym tle */
     transition: filter 0.1s linear;
  }
`;

const RightControls = styled.div`
  display: flex;
  align-items: center;
`;

// --- Komponent Header ---

const Header = () => {
  const { t } = useTranslation(); // Używamy t do tłumaczeń
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const SCROLL_THRESHOLD = 5;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      const scrollingUp = currentScrollY < lastScrollY.current;
      const pastThreshold = currentScrollY > SCROLL_THRESHOLD;

      setIsPastThreshold(pastThreshold);

      if (!pastThreshold) {
        setIsVisible(true);
      } else {
        if (scrollingUp) setIsVisible(true);
        else if (scrollingDown) setIsVisible(false);
      }

      lastScrollY.current = currentScrollY;
      ticking.current = false;
    };
    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(handleScroll);
        ticking.current = true;
      }
    };
    lastScrollY.current = window.scrollY;
    setIsPastThreshold(lastScrollY.current > SCROLL_THRESHOLD);
    setIsVisible(true); // Zawsze widoczny na starcie
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <HeaderWrapper isPastThreshold={isPastThreshold} isVisible={isVisible}>
      <LogoLink href="/" isPastThreshold={isPastThreshold} isVisible={isVisible}>
        <img src={logoSrc} alt="ROJEK okna i drzwi Logo" />
      </LogoLink>

      <IntroNavigation />

      <RightControls>
        <LanguageSwitcher />
      </RightControls>
    </HeaderWrapper>
  );
};

export default Header;