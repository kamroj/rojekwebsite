import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { productCategories } from '../../data/products';
import { getProductCategoryPath, getProductDetailPath, getSectionPath } from '../../utils/i18nRouting';

const BaseNavContainer = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacings.large};
  justify-content: center;
  flex-grow: 1;
  align-items: center;
  height: 100%;
`;

const NavItemWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 100%;
`;

const BaseNavItem = styled(Link)`
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: ${({ $isPastThreshold }) => ($isPastThreshold ? "600" : "400")};
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  padding: 5px 0;
  position: relative;
  transition: color ${({ theme }) => theme.transitions.default};
  display: inline-flex;
  align-items: center;
  height: 100%;
  
  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }

  &.active {
    font-weight: ${({ $isPastThreshold }) => ($isPastThreshold ? "800" : "600")};
    &::after {
      content: '';
      position: absolute;
      transform: translateX(-5%);
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      width: 110%;
      background-color: ${({ $isPastThreshold }) => ($isPastThreshold ? "#009247" : "#026303b1")};
      transition: background-color 1s ease;
    }
  }
`;

export const HeaderNavContainer = styled(BaseNavContainer)`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: none;
  }
`;

export const HeaderNavItem = styled(BaseNavItem)`
  color: ${({ theme, $isPastThreshold }) => ($isPastThreshold ? theme.colors.text : theme.colors.textLight)};
`;

export const IntroNavContainer = styled(BaseNavContainer)`
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacings.medium};

  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: row;
    gap: ${({ theme }) => theme.spacings.large};
  }
`;

export const IntroNavItem = styled(BaseNavItem)`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.6rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.sm}) {
    font-size: 1.4rem;
  }
`;

// MegaMenu - teraz renderowane przez Portal bezpośrednio do body
const MegaMenu = styled.div`
  position: fixed;
  top: ${({ theme }) => theme.layout.headerHeight};
  left: 0;
  right: 0;
  z-index: 2000;

  visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};

  /*
    MegaMenu jest renderowane przez Portal (poza HeaderWrapper).
    Kiedy header znika przy scrollu, chowamy MegaMenu razem z nim.
  */

  padding: 0 15px;
`;

const MegaMenuInner = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;

  /* Tło MUSI być semi-transparentne żeby blur był widoczny */
  background-color: ${({ $isPastThreshold }) => 
    ($isPastThreshold ? "#fbfbfb" : 'rgba(1, 126, 84, 0.12)')};
  
  /* Tylko JEDNA definicja backdrop-filter */
  -webkit-backdrop-filter: ${({ $isPastThreshold }) => 
    ($isPastThreshold ? 'blur(8px)' : 'blur(16px)')};
  backdrop-filter: ${({ $isPastThreshold }) => 
    ($isPastThreshold ? 'blur(8px)' : 'blur(16px)')};

  border-radius: 0 0 12px 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  border: 1px solid ${({ $isPastThreshold }) => 
    ($isPastThreshold ? "rgba(0, 74, 36, 0.25)" : 'rgba(5, 156, 78, 0.35)')};
  border-top: none;
  padding: 22px 18px;
`;

const MegaMenuGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  min-height: 320px;
`;

const MegaMenuLeft = styled.div`
  padding-right: 18px;
  border-right: 1px solid ${({ $isPastThreshold }) => 
    ($isPastThreshold ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.18)')};
`;

const MegaMenuRight = styled.div`
  padding-left: 22px;
`;

const MegaTitle = styled.div`
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ $isPastThreshold }) => 
    ($isPastThreshold ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.75)')};
  margin-bottom: 14px;
  font-weight: 600;
`;

const CategoryList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CategoryRow = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 12px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: ${({ theme, $isPastThreshold }) => 
    ($isPastThreshold ? theme.colors.text : theme.colors.textLight)};
  font-size: 1.35rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: background-color 150ms ease;

  ${({ $active, $isPastThreshold }) =>
    $active
      ? `background: ${$isPastThreshold ? 'rgba(2, 99, 3, 0.12)' : 'rgba(255, 255, 255, 0.15)'};`
      : `background: transparent;`}

  &:hover {
    background: ${({ $isPastThreshold }) => 
      ($isPastThreshold ? 'rgba(2, 99, 3, 0.14)' : 'rgba(255, 255, 255, 0.18)')};
    color: inherit;
  }
`;

const CategoryLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const CategoryIcon = styled.span`
  width: 32px;
  height: 32px;
  border: 1px solid ${({ $isPastThreshold }) => 
    ($isPastThreshold ? 'rgba(2, 99, 3, 0.25)' : 'rgba(255, 255, 255, 0.3)')};
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background: ${({ $isPastThreshold }) => 
    ($isPastThreshold ? 'rgba(2, 99, 3, 0.05)' : 'rgba(255, 255, 255, 0.1)')};

  img {
    width: 18px;
    height: 18px;
    display: block;
    filter: ${({ $isPastThreshold }) => ($isPastThreshold ? 'none' : 'brightness(10)')};
  }
`;

const Chevron = styled.span`
  color: ${({ $isPastThreshold }) => 
    ($isPastThreshold ? 'rgba(2, 99, 3, 0.75)' : 'rgba(255, 255, 255, 0.7)')};
  font-size: 2.2rem;
  line-height: 1;
  margin-top: -2px;
`;

const ProductList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const ProductLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme, $isPastThreshold }) => 
    ($isPastThreshold ? theme.colors.text : theme.colors.textLight)};
  font-size: 1.6rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  transition: color 150ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.accent};
  }
`;

// Hook do obsługi hover z opóźnieniem (zapobiega migotaniu)
const useHoverIntent = (delay = 1) => {
  const [isHovered, setIsHovered] = useState(false);
  const timeoutRef = useRef(null);

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsHovered(false);
    }, delay);
  }, [delay]);

  return { isHovered, handleMouseEnter, handleMouseLeave };
};

const Navigation = ({ variant = 'header', isPastThreshold, isHeaderVisible = true }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const location = useLocation();
  
  const { isHovered: isMegaOpen, handleMouseEnter, handleMouseLeave } = useHoverIntent(1);
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);

  // Jeśli header znika (scroll w dół), to natychmiast chowamy MegaMenu.
  // Ponieważ MegaMenu otwiera się hoverem, najprościej jest zasymulować mouseleave.
  useEffect(() => {
    if (variant !== 'header') return;
    if (!isHeaderVisible && isMegaOpen) {
      handleMouseLeave();
    }
  }, [handleMouseLeave, isHeaderVisible, isMegaOpen, variant]);
  
  const NavContainer = variant === 'intro' ? IntroNavContainer : HeaderNavContainer;
  const NavItem = variant === 'intro' ? IntroNavItem : HeaderNavItem;
  
  const navItems = [
    { key: 'home', path: ROUTES.HOME, label: 'nav.home' },
    { key: 'products', path: ROUTES.PRODUCTS, label: 'nav.products' },
    { key: 'realizations', path: ROUTES.REALIZATIONS, label: 'nav.realizations' },
    { key: 'about', path: ROUTES.ABOUT, label: 'nav.about' },
    { key: 'hs', path: ROUTES.HS_CONFIGURATOR, label: 'nav.hsConfigurator' },
    { key: 'contact', path: ROUTES.CONTACT, label: 'nav.contact' }
  ];
  
  const isActive = (path) => {
    const routeMap = {
      [ROUTES.HOME]: getSectionPath(lang, 'home'),
      [ROUTES.PRODUCTS]: getSectionPath(lang, 'products'),
      [ROUTES.REALIZATIONS]: getSectionPath(lang, 'realizations'),
      [ROUTES.ABOUT]: getSectionPath(lang, 'about'),
      [ROUTES.CONTACT]: getSectionPath(lang, 'contact'),
      [ROUTES.HS_CONFIGURATOR]: getSectionPath(lang, 'hsConfigurator'),
    };
    const localized = routeMap[path] || getSectionPath(lang, 'home');

    if (path === ROUTES.HOME && location.pathname === localized) {
      return true;
    }
    return path !== ROUTES.HOME && location.pathname.startsWith(localized);
  };

  const menuCategories = useMemo(() => {
    const entries = Object.entries(productCategories || {});

    const iconByKey = {
      okna: '/images/icons/window-icon.png',
      drzwi: '/images/icons/tools-icon.png',
      bramy: '/images/icons/tools-icon.png',
      rolety: '/images/icons/tools-icon.png',
    };

    return entries
      .map(([key, c]) => ({
        key,
        title: t(`breadcrumbs.categories.${key}`, c?.pageTitle || key),
        icon: iconByKey[key] || '/images/icons/tools-icon.png',
        products: Array.isArray(c?.products) ? c.products : [],
      }))
      .filter((c) => c.products.length > 0);
  }, [t]);

  const resolvedActiveCategoryKey = useMemo(() => {
    if (activeCategoryKey) return activeCategoryKey;
    return menuCategories?.[0]?.key || null;
  }, [activeCategoryKey, menuCategories]);

  const activeCategory = useMemo(() => {
    if (!resolvedActiveCategoryKey) return null;
    return menuCategories.find((c) => c.key === resolvedActiveCategoryKey) || null;
  }, [menuCategories, resolvedActiveCategoryKey]);

  const getLocalizedPath = (path) => {
    const pathMap = {
      [ROUTES.HOME]: getSectionPath(lang, 'home'),
      [ROUTES.PRODUCTS]: getSectionPath(lang, 'products'),
      [ROUTES.REALIZATIONS]: getSectionPath(lang, 'realizations'),
      [ROUTES.ABOUT]: getSectionPath(lang, 'about'),
      [ROUTES.CONTACT]: getSectionPath(lang, 'contact'),
      [ROUTES.HS_CONFIGURATOR]: getSectionPath(lang, 'hsConfigurator'),
    };
    return pathMap[path] || getSectionPath(lang, 'home');
  };

  // Render MegaMenu przez Portal
  const renderMegaMenu = () => {
    if (variant !== 'header') return null;

    const isOpen = isMegaOpen && isHeaderVisible;

    return createPortal(
      <MegaMenu 
        $isOpen={isOpen} 
        $isHeaderVisible={isHeaderVisible}
        role="menu" 
        aria-label={t('nav.products', 'Produkty')}
        aria-hidden={!isOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <MegaMenuInner $isPastThreshold={isPastThreshold}>
          <MegaMenuGrid>
            <MegaMenuLeft $isPastThreshold={isPastThreshold}>
              <CategoryList>
                {menuCategories.map((c) => (
                  <CategoryRow
                    key={c.key}
                    to={getProductCategoryPath(lang, c.key)}
                    $active={c.key === resolvedActiveCategoryKey}
                    $isPastThreshold={isPastThreshold}
                    role="menuitem"
                    onMouseEnter={() => setActiveCategoryKey(c.key)}
                    onFocus={() => setActiveCategoryKey(c.key)}
                  >
                    <CategoryLeft>
                      <CategoryIcon $isPastThreshold={isPastThreshold} aria-hidden="true">
                        <img src={c.icon} alt="" />
                      </CategoryIcon>
                      <span>{c.title}</span>
                    </CategoryLeft>
                    <Chevron $isPastThreshold={isPastThreshold} aria-hidden="true">›</Chevron>
                  </CategoryRow>
                ))}
              </CategoryList>
            </MegaMenuLeft>

            <MegaMenuRight>
              <MegaTitle $isPastThreshold={isPastThreshold}>
                {t('products.selectProduct', 'Wybierz produkt')}
              </MegaTitle>
              <ProductList>
                {(activeCategory?.products || []).map((p) => (
                  <ProductLink
                    key={p.slug || p.id}
                    to={getProductDetailPath(lang, activeCategory.key, p.slug || p.id)}
                    $isPastThreshold={isPastThreshold}
                    role="menuitem"
                  >
                    {p.name}
                  </ProductLink>
                ))}
              </ProductList>
            </MegaMenuRight>
          </MegaMenuGrid>
        </MegaMenuInner>
      </MegaMenu>,
      document.body
    );
  };
  
  return (
    <>
      <NavContainer role="navigation" aria-label={t('nav.mainNavigation', 'Main navigation')}>
        {navItems.map((item) => {
          const to = getLocalizedPath(item.path);

          // Products z megamenu (tylko desktop/header)
          if (item.key === 'products' && variant === 'header') {
            return (
              <NavItemWrapper
                key={item.key}
                onMouseEnter={() => {
                  handleMouseEnter();
                  if (!activeCategoryKey && menuCategories?.[0]?.key) {
                    setActiveCategoryKey(menuCategories[0].key);
                  }
                }}
                onMouseLeave={handleMouseLeave}
                onFocus={() => {
                  handleMouseEnter();
                  if (!activeCategoryKey && menuCategories?.[0]?.key) {
                    setActiveCategoryKey(menuCategories[0].key);
                  }
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget)) {
                    handleMouseLeave();
                  }
                }}
              >
                <NavItem
                  $isPastThreshold={isPastThreshold}
                  to={to}
                  className={isActive(item.path) ? 'active' : ''}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  aria-haspopup="true"
                  aria-expanded={isMegaOpen}
                >
                  {t(item.label)}
                </NavItem>
              </NavItemWrapper>
            );
          }

          // Standardowe linki
          return (
            <NavItem
              $isPastThreshold={isPastThreshold}
              to={to}
              key={item.key}
              className={isActive(item.path) ? 'active' : ''}
              aria-current={isActive(item.path) ? 'page' : undefined}
            >
              {t(item.label)}
            </NavItem>
          );
        })}
      </NavContainer>

      {/* MegaMenu renderowane przez Portal - poza HeaderWrapper */}
      {renderMegaMenu()}
    </>
  );
};

export default Navigation;