// src/components/layout/Header.jsx
import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX, FiCheck } from 'react-icons/fi'; // Dodano ikonę fajki
import LanguageSwitcher from '../common/LanguageSwitcher';
import Navigation from '../common/Navigation';
import SwipeHandler from '../common/SwipeHandler';
import logoSrc from '../../assets/images/logo.png';
import { fadeIn, fadeOut, slideInRight, slideOutRight, hamburgerToX } from '../../styles/animations.js';

// Animacja podświetlenia aktywnego elementu menu
const activeLinkHighlight = keyframes`
  0% { transform: translateX(-10px) scaleY(0.5); opacity: 0; }
  100% { transform: translateX(0) scaleY(1); opacity: 1; }
`;

// Główny wrapper headera
const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 ${({ theme }) => theme.spacings.medium};
  height: ${({ theme }) => theme.layout.headerHeight};
  z-index: 1000;
  transition: opacity ${({ theme }) => theme.transitions.default}, 
              background-color 0.1s linear, 
              border-color 0.1s linear, 
              color 0.1s linear;

  /* Tło zmienia się na podstawie pozycji przewijania */
  background-color: ${({ isPastThreshold, isVisible, theme }) =>
    isPastThreshold && isVisible ? "#f8f9fa" : '#017e5414'};

  /* Styl bordera */
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #059c4e68;

  /* Kontrola widoczności */
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  pointer-events: ${({ isVisible }) => (isVisible ? 'auto' : 'none')};

  /* Kolor tekstu zmienia się z tłem */
  color: ${({ isPastThreshold, isVisible, theme }) =>
    isPastThreshold ? theme.colors.text : theme.colors.textLight};

  /* Styl dla wszystkich linków wewnątrz headera */
  a {
    color: inherit;
    transition: color ${({ theme }) => theme.transitions.default};

    &:hover {
      /* color: ${({ theme }) => theme.colors.accent}; */
      color: #0ae875;
    }
  }
  
  /* Tylko ciemniejsze tło gdy przewinięto stronę (zachowaj przezroczysty header na górze) */
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background-color: ${({ isPastThreshold, isVisible, theme }) =>
      isPastThreshold && isVisible ? "rgba(248, 249, 250, 0.9)" : '#017e5414'};
    color: ${({ isPastThreshold, theme }) =>
      isPastThreshold ? theme.colors.text : theme.colors.textLight};
  }
`;

// Stylizowany link z logo
const LogoLink = styled(Link)`
  display: block;
  height: 50px;
  cursor: pointer;
  z-index: 1;

  img {
    height: 100%;
    width: auto;
    display: block;
    filter: ${({ isPastThreshold }) =>
      isPastThreshold ? 'brightness(0.3)' : 'brightness(1)'};
    transition: filter 0.3s linear;
  }
  
  /* USUŃ całe @media query */
`;

// Kontener dla desktopowej nawigacji
const DesktopNav = styled.div`
  display: flex;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// Kontener dla przełącznika języka w wersji desktop
const DesktopLangContainer = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

// Przycisk menu mobilnego
const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 2.4rem;
  cursor: pointer;
  /* Kolor przycisku menu zależy od pozycji przewijania */
  color: ${({ theme, isPastThreshold, isOpen }) => 
    isOpen ? theme.colors.text : // Gdy menu jest otwarte, zawsze czarny
    (isPastThreshold ? theme.colors.text : theme.colors.textLight)}; // Inaczej zależy od przewinięcia
  padding: 8px;
  margin: -8px;
  z-index: 1010;
  transition: color 0.3s ease, transform 0.3s ease;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  svg {
    transition: transform 0.3s ease;
    ${props => props.isOpen && css`
      animation: ${hamburgerToX} 0.3s forwards;
    `}
  }
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// Overlay dla menu mobilnego
const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1005;
  animation: ${props => props.isOpen ? fadeIn : fadeOut} 0.3s forwards;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: visibility 0.3s;
  
  /* Dodatkowe style dla płynniejszego przejścia */
  backdrop-filter: ${({ isOpen }) => (isOpen ? 'blur(2px)' : 'blur(0)')};
  transition: backdrop-filter 0.3s ease, visibility 0.3s;
`;

// Kontener dla mobilnego menu
const MobileMenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 350px;
  height: 100vh;
  /* Obsługa bezpiecznego obszaru na telefonach z notchem */
  height: 100dvh;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1009;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  animation: ${props => props.isOpen ? slideInRight : slideOutRight} 0.3s forwards;
  padding: ${({ theme }) => theme.spacings.large} ${({ theme }) => theme.spacings.medium};
  /* Dodatkowy padding dla urządzeń z notchem */
  padding-top: env(safe-area-inset-top, ${({ theme }) => theme.spacings.large});
  padding-right: env(safe-area-inset-right, ${({ theme }) => theme.spacings.medium});
  padding-bottom: env(safe-area-inset-bottom, ${({ theme }) => theme.spacings.large});
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  
  /* Jawne ustawienie koloru tekstu na czarny */
  color: ${({ theme }) => theme.colors.text};
  
  /* Zapobiega widoczności menu przed animacją */
  visibility: ${({ isOpen }) => (isOpen ? 'visible' : 'hidden')};
  transition: visibility 0.3s;
  
  /* Pełne menu na małych ekranach */
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: 100%;
    max-width: none;
  }

  /* Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 20px;
  }
`;

// Logo w mobilnym menu
const MobileMenuLogo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacings.large};
  
  img {
    height: 40px;
    width: auto;
  }
`;

// Nawigacja w mobilnym menu
const MobileNavigation = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${({ theme }) => theme.spacings.large};
  
  /* Więcej przestrzeni na wyższych ekranach */
  @media (min-height: 700px) {
    margin-top: ${({ theme }) => theme.spacings.xlarge};
  }
`;

// Link nawigacyjny w mobilnym menu
const MobileNavItem = styled(Link)`
  font-size: 1.8rem;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacings.small} 0;
  width: 100%;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  text-decoration: none;
  position: relative;
  
  /* Obsługa długich nazw */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  /* Więcej przestrzeni na wyższych ekranach */
  @media (min-height: 700px) {
    padding: ${({ theme }) => theme.spacings.medium} 0;
    font-size: 2rem;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
  
  /* Efekt po kliknięciu - feedback dla użytkownika */
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  /* Aktywny link */
  &.active {
    color: ${({ theme }) => theme.colors.bottleGreen};
    font-weight: 600;
    
    &::after {
      content: '';
      position: absolute;
      left: -15px;
      top: 50%;
      transform: translateY(-50%);
      width: 5px;
      height: 70%;
      background-color: ${({ theme }) => theme.colors.bottleGreen};
      border-radius: 0 3px 3px 0;
      animation: ${activeLinkHighlight} 0.3s forwards;
    }
  }
  
  /* Animacja dla każdego elementu menu z opóźnieniem */
  animation: ${fadeIn} 0.3s forwards;
  animation-delay: ${props => props.index * 0.05}s;
  opacity: 0;
`;

// Kontener dla switcher języka w mobilnym menu
const MobileLangSwitcher = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacings.large};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${fadeIn} 0.3s forwards;
  animation-delay: 0.3s;
  opacity: 0;
`;

// Główny komponent Header
const Header = () => {
  const [isPastThreshold, setIsPastThreshold] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const SCROLL_THRESHOLD = 5;
  const { t } = useTranslation();
  const location = useLocation();

  // Obsługa zdarzeń przewijania dla widoczności i stylowania headera
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
        else if (scrollingDown && !isMobileMenuOpen) setIsVisible(false);
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

    // Inicjalizacja pozycji przewijania
    lastScrollY.current = window.scrollY;
    setIsPastThreshold(lastScrollY.current > SCROLL_THRESHOLD);
    setIsVisible(true);

    // Dodanie nasłuchiwacza zdarzeń przewijania
    window.addEventListener('scroll', onScroll, { passive: true });
    
    // Czyszczenie
    return () => window.removeEventListener('scroll', onScroll);
  }, [isMobileMenuOpen]);

  // Efekt zamykania menu przy zmianie strony
  useEffect(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, [location.pathname]);

  // Przełączanie menu mobilnego
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    // Blokowanie przewijania body gdy menu jest otwarte
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      // Małe opóźnienie, aby animacja wyjścia mogła się zakończyć
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
    }
  };

  // Zamykanie menu po kliknięciu w link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    
    // Małe opóźnienie, aby animacja wyjścia mogła się zakończyć
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 300);
  };

  // Lista elementów nawigacji
  const navItems = [
    { key: 'offer', path: '/realizations', label: 'nav.offer', fallback: 'Oferta' },
    { key: 'realizations', path: '/realizations', label: 'nav.realizations', fallback: 'Realizacje' },
    { key: 'about', path: '/about', label: 'nav.about', fallback: 'O nas' },
    { key: 'contact', path: '/contact', label: 'nav.contact', fallback: 'Kontakt' }
  ];
  
  // Funkcja sprawdzająca, czy element jest aktywny
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return path !== '/' && location.pathname.startsWith(path);
  };

  return (
    <HeaderWrapper 
      isPastThreshold={isPastThreshold} 
      isVisible={isVisible}
    >
      <LogoLink to="/" isPastThreshold={isPastThreshold}>
        <img src={logoSrc} alt="ROJEK okna i drzwi Logo" />
      </LogoLink>

      {/* Nawigacja na desktop - WYCENTROWANA */}
      <DesktopNav>
        <Navigation variant="header" />
      </DesktopNav>
      
      {/* Przełącznik języka na desktop - PO PRAWEJ */}
      <DesktopLangContainer>
        <LanguageSwitcher isPastThreshold={isPastThreshold} />
      </DesktopLangContainer>

      {/* Przycisk menu mobilnego */}
      <MobileMenuButton 
        onClick={toggleMobileMenu} 
        aria-label={t('nav.toggleMenu', 'Przełącz menu')} 
        isOpen={isMobileMenuOpen}
        isPastThreshold={isPastThreshold}
      >
        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
      </MobileMenuButton>

      {/* Overlay dla menu mobilnego */}
      <MobileMenuOverlay isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />

      {/* Kontener menu mobilnego z obsługą gestów */}
      <MobileMenuContainer isOpen={isMobileMenuOpen}>
        <SwipeHandler onSwipeRight={closeMobileMenu} enabled={isMobileMenuOpen}>
          <MobileMenuLogo>
            <img src={logoSrc} alt="ROJEK okna i drzwi Logo" />
          </MobileMenuLogo>

          {/* Nawigacja mobilna */}
          <MobileNavigation>
            {navItems.map((item, index) => (
              <MobileNavItem 
                key={item.key} 
                to={item.path} 
                onClick={closeMobileMenu}
                className={isActive(item.path) ? 'active' : ''}
                index={index}
              >
                {t(item.label, item.fallback)}
              </MobileNavItem>
            ))}
          </MobileNavigation>

          {/* Przełącznik języka w menu mobilnym */}
          <MobileLangSwitcher>
            <LanguageSwitcher isMobile={true} isPastThreshold={true} />
          </MobileLangSwitcher>
        </SwipeHandler>
      </MobileMenuContainer>
    </HeaderWrapper>
  );
};

export default Header;