import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled, { css, keyframes, useTheme } from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import LanguageSwitcher from './LanguageSwitcher';
import Navigation from './Navigation';
import SwipeHandler from './SwipeHandler';
import { useScrollPosition } from '../../hooks';
import { ROUTES } from '../../constants';
import { handleKeyboardNavigation } from '../../utils';
import { productCategories } from '../../data/products';
import logoWhite from '/images/logo.png';
import logoBlack from '/images/logo-black.png';
import { fadeIn, fadeOut, slideInRight, slideOutRight, hamburgerToX } from '../../styles/animations.js';
import MaxWidthContainer from '../ui/MaxWidthContainer.jsx';
import { getProductCategoryPath, getProductDetailPath, getSectionPath } from '../../lib/i18n/routing';

const MENU_ANIMATION_MS = 300;

const NAV_ITEMS = [
  { key: 'home', path: ROUTES.HOME, label: 'nav.home' },
  { key: 'products', path: ROUTES.PRODUCTS, label: 'nav.products' },
  { key: 'realizations', path: ROUTES.REALIZATIONS, label: 'nav.realizations' },
  { key: 'about', path: ROUTES.ABOUT, label: 'nav.about' },
  { key: 'hs', path: ROUTES.HS_CONFIGURATOR, label: 'nav.hsConfigurator' },
  { key: 'contact', path: ROUTES.CONTACT, label: 'nav.contact' }
];

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
  transition: 
    opacity ${({ theme }) => theme.transitions.default}, 
    background-color 0.15s ease, 
    border-color 0.15s ease, 
    color 0.15s ease;

  background-color: ${({ $isPastThreshold, $isVisible }) =>
    $isPastThreshold && $isVisible ? "#fbfbfb" : 'rgba(1, 126, 84, 0.08)'};
  
  -webkit-backdrop-filter: ${({ $isPastThreshold, $isVisible }) =>
    $isPastThreshold && $isVisible ? 'blur(8px)' : 'blur(12px)'};
  backdrop-filter: ${({ $isPastThreshold, $isVisible }) =>
    $isPastThreshold && $isVisible ? 'blur(8px)' : 'blur(12px)'};

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ $isPastThreshold }) => 
    ($isPastThreshold ? "rgba(0, 74, 36, 0.25)" : "rgba(5, 156, 78, 0.35)")};

  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};

  color: ${({ $isPastThreshold, theme }) =>
    $isPastThreshold ? theme.colors.text : theme.colors.textLight};

  a {
    color: inherit;
    transition: color ${({ theme }) => theme.transitions.default};

    &:hover {
      color: ${({ $isPastThreshold }) => ($isPastThreshold ? "#014d07" : "#028113")};
    }
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    background-color: ${({ $isPastThreshold, $isVisible }) =>
      $isPastThreshold && $isVisible ? "#fbfbfb" : 'rgba(1, 126, 84, 0.08)'};
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
  max-width: 1400px;
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
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  transform: none;
  height: 100%;
  pointer-events: none;

  nav {
    pointer-events: auto;
  }
  
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
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1005;
  animation: ${props => props.$isOpen ? fadeIn : fadeOut} 0.3s forwards;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
  transition: visibility 0.3s;
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
  box-shadow: -5px 0 25px rgba(0, 0, 0, 0.25);
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

const MobileNavButton = styled.button`
  font-size: 1.8rem;
  font-weight: 500;
  padding: ${({ theme }) => theme.spacings.small} 0;
  width: 100%;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  text-align: left;

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

  animation: ${fadeIn} 0.3s forwards;
  animation-delay: ${props => props.$index * 0.05}s;
  opacity: 0;
`;

const MobileSubList = styled.div`
  width: 100%;
  padding: 0 0 0 14px;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 10px;
`;

const MobileBackButton = styled.button`
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: ${({ theme }) => theme.spacings.small} 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary};
  }
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
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileActiveCategoryKey, setMobileActiveCategoryKey] = useState(null);
  const restoreOverflowTimeoutRef = useRef(null);
  const lastPathnameRef = useRef(null);

  const { t, i18n } = useTranslation();
  const location = useLocation();
  const lang = i18n.language;
  const { isPastThreshold, isScrollingUp, isScrollingDown } = useScrollPosition(5);
  const theme = useTheme();

  const isActive = useCallback(
    (path) => {
      const routeMap = {
        [ROUTES.HOME]: getSectionPath(lang, 'home'),
        [ROUTES.PRODUCTS]: getSectionPath(lang, 'products'),
        [ROUTES.REALIZATIONS]: getSectionPath(lang, 'realizations'),
        [ROUTES.ABOUT]: getSectionPath(lang, 'about'),
        [ROUTES.CONTACT]: getSectionPath(lang, 'contact'),
        [ROUTES.HS_CONFIGURATOR]: getSectionPath(lang, 'hsConfigurator'),
      };
      const localized = routeMap[path] || getSectionPath(lang, 'home');
      if (path === ROUTES.HOME && location.pathname === localized) return true;
      return path !== ROUTES.HOME && location.pathname.startsWith(localized);
    },
    [lang, location.pathname]
  );

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setMobileProductsOpen(false);
    setMobileActiveCategoryKey(null);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const openMobileProducts = useCallback(() => {
    setMobileProductsOpen(true);
    if (!mobileActiveCategoryKey) {
      const first = Object.entries(productCategories || {}).find(
        ([, c]) => Array.isArray(c?.products) && c.products.length > 0
      );
      if (first) setMobileActiveCategoryKey(first[0]);
    }
  }, [mobileActiveCategoryKey]);

  const closeMobileProducts = useCallback(() => {
    setMobileProductsOpen(false);
    setMobileActiveCategoryKey(null);
  }, []);

  const handleMenuButtonKeyDown = useCallback(
    (event) => {
      handleKeyboardNavigation(event, toggleMobileMenu, toggleMobileMenu);
    },
    [toggleMobileMenu]
  );

  // Header visibility based on scroll direction
  useEffect(() => {
    if (!isPastThreshold) {
      setIsVisible(true);
      return;
    }

    if (isScrollingUp) {
      setIsVisible(true);
    } else if (isScrollingDown && !isMobileMenuOpen) {
      setIsVisible(false);
    }
  }, [isPastThreshold, isMobileMenuOpen, isScrollingDown, isScrollingUp]);

  // CSS variable for layout offset
  useEffect(() => {
    const gap = theme.spacings.small;
    const offset = isVisible ? `calc(${theme.layout.headerHeight} + ${gap})` : gap;

    document.documentElement.style.setProperty('--header-offset', offset);
    return () => {
      document.documentElement.style.setProperty(
        '--header-offset',
        `calc(${theme.layout.headerHeight} + ${gap})`
      );
    };
  }, [isVisible, theme.layout.headerHeight, theme.spacings.small]);

  // Close menu on route change
  useEffect(() => {
    const prevPathname = lastPathnameRef.current;
    lastPathnameRef.current = location.pathname;

    if (prevPathname == null) return;

    if (prevPathname !== location.pathname && isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, [closeMobileMenu, isMobileMenuOpen, location.pathname]);

  // Lock body scroll while menu is open + close on ESC
  useEffect(() => {
    if (restoreOverflowTimeoutRef.current) {
      window.clearTimeout(restoreOverflowTimeoutRef.current);
      restoreOverflowTimeoutRef.current = null;
    }

    if (!isMobileMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (mobileProductsOpen) {
          closeMobileProducts();
        } else {
          closeMobileMenu();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreOverflowTimeoutRef.current = window.setTimeout(() => {
        document.body.style.overflow = previousOverflow;
        restoreOverflowTimeoutRef.current = null;
      }, MENU_ANIMATION_MS);
    };
  }, [closeMobileMenu, closeMobileProducts, isMobileMenuOpen, mobileProductsOpen]);

  const navItems = useMemo(() => NAV_ITEMS, []);

  const mobileCategories = useMemo(() => {
    const entries = Object.entries(productCategories || {});
    return entries
      .map(([key, c]) => ({
        key,
        title: t(`breadcrumbs.categories.${key}`, c?.pageTitle || key),
        products: Array.isArray(c?.products) ? c.products : [],
      }))
      .filter((c) => c.products.length > 0);
  }, [t]);

  return (
    <HeaderWrapper 
      $isPastThreshold={isPastThreshold} 
      $isVisible={isVisible}
      aria-hidden={!isVisible}
    >
      <HeaderInner>
        <LogoLink to={getSectionPath(lang, 'home')}>
          <img
            src={isPastThreshold ? logoBlack : logoWhite}
            alt={t('nav.logoAlt', 'ROJEK okna i drzwi Logo')}
          />
        </LogoLink>

        <DesktopNav>
          <Navigation variant="header" isPastThreshold={isPastThreshold} isHeaderVisible={isVisible} />
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
            {!mobileProductsOpen ? (
              <>
                {navItems.map((item, index) => {
                  if (item.key === 'products') {
                    return (
                      <MobileNavButton
                        key={item.key}
                        onClick={openMobileProducts}
                        $index={index}
                        aria-haspopup="true"
                        aria-expanded={mobileProductsOpen}
                      >
                        <span>{t(item.label)}</span>
                        <IoIosArrowForward aria-hidden="true" />
                      </MobileNavButton>
                    );
                  }

                  return (
                    <MobileNavItem
                      key={item.key}
                      to={
                        item.path === ROUTES.HOME
                          ? getSectionPath(lang, 'home')
                          : item.path === ROUTES.PRODUCTS
                            ? getSectionPath(lang, 'products')
                            : item.path === ROUTES.REALIZATIONS
                              ? getSectionPath(lang, 'realizations')
                              : item.path === ROUTES.ABOUT
                                ? getSectionPath(lang, 'about')
                                : item.path === ROUTES.CONTACT
                                  ? getSectionPath(lang, 'contact')
                                  : item.path === ROUTES.HS_CONFIGURATOR
                                    ? getSectionPath(lang, 'hsConfigurator')
                                    : getSectionPath(lang, 'home')
                      }
                      onClick={closeMobileMenu}
                      className={isActive(item.path) ? 'active' : ''}
                      $index={index}
                      aria-current={isActive(item.path) ? 'page' : undefined}
                    >
                      {t(item.label)}
                    </MobileNavItem>
                  );
                })}
              </>
            ) : (
              <>
                <MobileBackButton onClick={closeMobileProducts}>
                  {'‹'} {t('buttons.backToHome', 'Wróć')}
                </MobileBackButton>

                {mobileCategories.map((c, idx) => (
                  <React.Fragment key={c.key}>
                    <MobileNavButton
                      onClick={() => setMobileActiveCategoryKey((prev) => (prev === c.key ? null : c.key))}
                      $index={idx}
                      aria-expanded={mobileActiveCategoryKey === c.key}
                    >
                      <span>{c.title}</span>
                      <IoIosArrowForward
                        aria-hidden="true"
                        style={{
                          transform: mobileActiveCategoryKey === c.key ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 180ms ease',
                        }}
                      />
                    </MobileNavButton>

                    {mobileActiveCategoryKey === c.key && (
                      <MobileSubList>
                        {(c.products || []).map((p) => (
                          <MobileNavItem
                            key={p.slug || p.id}
                            to={getProductDetailPath(lang, c.key, p.slug || p.id)}
                            onClick={closeMobileMenu}
                            $index={0}
                          >
                            {p.name}
                          </MobileNavItem>
                        ))}
                        <MobileNavItem
                          to={getProductCategoryPath(lang, c.key)}
                          onClick={closeMobileMenu}
                          $index={0}
                        >
                          {t('common.seeAll', 'Zobacz wszystkie')}
                        </MobileNavItem>
                      </MobileSubList>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
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