import React, { useState, useEffect, useRef } from 'react';
import styled, { css, keyframes, useTheme } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';
import LanguageSwitcher from '../common/LanguageSwitcher';
import Navigation from '../common/Navigation';
import SwipeHandler from '../common/SwipeHandler';
import { useScrollPosition, useResponsive } from '../../hooks';
import { ROUTES, IMAGE_PATHS } from '../../constants';
import { handleKeyboardNavigation } from '../../utils';
import logoWhite from '/images/logo.png';
import logoBlack from '/images/logo-black.png';
import { fadeIn, fadeOut, slideInRight, slideOutRight, hamburgerToX } from '../../styles/animations.js';
import MaxWidthContainer from '../common/MaxWidthContainer.jsx';

const activeLinkHighlight = keyframes`
  0% { transform: translateX(-10px) scaleY(0.5); opacity: 0; }
  100% { transform: translateX(0) scaleY(1); opacity: 1; }
`;

const HeaderWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0;
  height: ${({ theme }) => theme.layout.headerHeight};
  z-index: 1000;
  transition: opacity ${({ theme }) => theme.transitions.default}, 
              background-color 0.1s linear, 
              border-color 0.1s linear, 
              color 0.1s linear;

  background-color: ${({ $isPastThreshold, $isVisible, theme }) =>
    $isPastThreshold && $isVisible ? "#fffefe" : '#017e5414'};

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color:  ${({ $isPastThreshold }) => ($isPastThreshold ? "#004a2468" : "#059c4e68")};

  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};

  color: ${({ $isPastThreshold, $isVisible, theme }) =>
    $isPastThreshold ? theme.colors.text : theme.colors.textLight};

  a {
    color: inherit;
    transition: color ${({ theme }) => theme.transitions.default};

    &:hover {
      color: ${({ $isPastThreshold }) => ($isPastThreshold ? "#039b10" : "#e6c619")};
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background-color: ${({ $isPastThreshold, $isVisible, theme }) =>
      $isPastThreshold && $isVisible ? "#fffefe" : '#017e5414'};
    color: ${({ $isPastThreshold, theme }) =>
      $isPastThreshold ? theme.colors.text : theme.colors.textLight};
  }
`;

const HeaderInner = styled(MaxWidthContainer)`
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
`;

const LogoLink = styled(Link)`
  display: block;
  height: 50px;
  cursor: pointer;
  z-index: 1;

  img {
    height: 100%;
    width: auto;
    display: block;
  }
`;

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

const DesktopLangContainer = styled.div`
  display: flex;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 2.4rem;
  cursor: pointer;
  color: ${({ theme, $isPastThreshold, $isOpen }) => 
    $isOpen ? theme.colors.text : 
    ($isPastThreshold ? theme.colors.text : theme.colors.textLight)};
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
    ${props => props.$isOpen && css`
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

const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1005;
  animation: ${props => props.$isOpen ? fadeIn : fadeOut} 0.3s forwards;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: visibility 0.3s;
  backdrop-filter: ${({ $isOpen }) => ($isOpen ? 'blur(2px)' : 'blur(0)')};
  transition: backdrop-filter 0.3s ease, visibility 0.3s;
`;

const MobileMenuContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 80%;
  max-width: 350px;
  height: 100vh;
  height: 100dvh;
  background-color: ${({ theme }) => theme.colors.background};
  z-index: 1009;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.2);
  animation: ${props => props.$isOpen ? slideInRight : slideOutRight} 0.3s forwards;
  padding: ${({ theme }) => theme.spacings.large} ${({ theme }) => theme.spacings.medium};
  padding-top: env(safe-area-inset-top, ${({ theme }) => theme.spacings.large});
  padding-right: env(safe-area-inset-right, ${({ theme }) => theme.spacings.medium});
  padding-bottom: env(safe-area-inset-bottom, ${({ theme }) => theme.spacings.large});
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  color: ${({ theme }) => theme.colors.text};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  transition: visibility 0.3s;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.xs}) {
    width: 100%;
    max-width: none;
  }

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

const MobileMenuLogo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacings.large};
  margin-top: 2rem;
  
  img {
    height: 40px;
    width: auto;
  }
`;

const MobileNavigation = styled.nav`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-top: ${({ theme }) => theme.spacings.large};
  
  @media (min-height: 700px) {
    margin-top: ${({ theme }) => theme.spacings.xlarge};
  }
`;

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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  
  @media (min-height: 700px) {
    padding: ${({ theme }) => theme.spacings.medium} 0;
    font-size: 1.8rem;
  }
  
  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }

  
  &:active {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
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
  
  animation: ${fadeIn} 0.3s forwards;
  animation-delay: ${props => props.$index * 0.05}s;
  opacity: 0;
`;

const MobileLangSwitcher = styled.div`
  margin-top: auto;
  padding-top: ${({ theme }) => theme.spacings.large};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${fadeIn} 0.3s forwards;
  animation-delay: 0.3s;
  opacity: 0;
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const ticking = useRef(false);
  
  const { t } = useTranslation();
  const location = useLocation();
  const { isPastThreshold, scrollY, isScrollingUp, isScrollingDown } = useScrollPosition(5);
  const theme = useTheme();

  useEffect(() => {
    const gap = theme.spacings.small;
    const offset = isVisible ? `calc(${theme.layout.headerHeight} + ${gap})` : gap;
    document.documentElement.style.setProperty('--header-offset', offset);
    return () => {
      document.documentElement.style.setProperty('--header-offset', `calc(${theme.layout.headerHeight} + ${gap})`);
    };
  }, [isVisible, theme.layout.headerHeight, theme.spacings.small]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isPastThreshold) {
        setIsVisible(true);
      } else {
        if (isScrollingUp) setIsVisible(true);
        else if (isScrollingDown && !isMobileMenuOpen) setIsVisible(false);
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(handleScroll);
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isPastThreshold, isScrollingUp, isScrollingDown, isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    
    if (!isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 300);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setTimeout(() => {
      document.body.style.overflow = '';
    }, 300);
  };

  const handleMenuButtonKeyDown = (event) => {
    handleKeyboardNavigation(
      event,
      toggleMobileMenu,
      toggleMobileMenu
    );
  };

  const navItems = [
    { key: 'home', path: ROUTES.HOME, label: 'nav.home' },
    { key: 'realizations', path: ROUTES.REALIZATIONS, label: 'nav.realizations' },
    { key: 'about', path: ROUTES.ABOUT, label: 'nav.about' },
    { key: 'hs', path: ROUTES.HS_CONFIGURATOR, label: 'nav.hsConfigurator' },
    { key: 'contact', path: ROUTES.CONTACT, label: 'nav.contact' }
  ];
  
  const isActive = (path) => {
    if (path === ROUTES.HOME && location.pathname === ROUTES.HOME) {
      return true;
    }
    return path !== ROUTES.HOME && location.pathname.startsWith(path);
  };

  return (
    <HeaderWrapper 
      $isPastThreshold={isPastThreshold} 
      $isVisible={isVisible}
    >
      <HeaderInner>
      <LogoLink to={ROUTES.HOME}>
        <img src={isPastThreshold ? logoBlack : logoWhite} alt={t('nav.logoAlt', 'ROJEK okna i drzwi Logo')} />
      </LogoLink>

      <DesktopNav>
        <Navigation variant="header" isPastThreshold={isPastThreshold} />
      </DesktopNav>
      
      <DesktopLangContainer>
        <LanguageSwitcher isPastThreshold={isPastThreshold} />
      </DesktopLangContainer>

      <MobileMenuButton 
        onClick={toggleMobileMenu}
        onKeyDown={handleMenuButtonKeyDown}
        aria-label={t('nav.toggleMenu', 'Toggle menu')} 
        aria-expanded={isMobileMenuOpen}
        $isOpen={isMobileMenuOpen}
        $isPastThreshold={isPastThreshold}
      >
        {isMobileMenuOpen ? <FiX /> : <FiMenu />}
      </MobileMenuButton>

      </HeaderInner>

      <MobileMenuOverlay $isOpen={isMobileMenuOpen} onClick={closeMobileMenu} />

      <MobileMenuContainer $isOpen={isMobileMenuOpen}>
        <SwipeHandler onSwipeRight={closeMobileMenu} enabled={isMobileMenuOpen}>
          <MobileMenuLogo>
            <img src={logoBlack} alt={t('nav.logoAlt', 'ROJEK okna i drzwi Logo')} />
          </MobileMenuLogo>

          <MobileNavigation role="navigation" aria-label={t('nav.mobileNavigation', 'Mobile navigation')}>
            {navItems.map((item, index) => (
              <MobileNavItem 
                key={item.key} 
                to={item.path} 
                onClick={closeMobileMenu}
                className={isActive(item.path) ? 'active' : ''}
                $index={index}
                aria-current={isActive(item.path) ? 'page' : undefined}
              >
                {t(item.label)}
              </MobileNavItem>
            ))}
          </MobileNavigation>

          <MobileLangSwitcher>
            <LanguageSwitcher isMobile={true} isPastThreshold={true} />
          </MobileLangSwitcher>
        </SwipeHandler>
      </MobileMenuContainer>
    </HeaderWrapper>
  );
};

export default Header;
