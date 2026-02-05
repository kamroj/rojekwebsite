import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiMenu, FiX } from 'react-icons/fi';
import { IoIosArrowForward } from 'react-icons/io';
import LanguageSwitcher from './LanguageSwitcher';
import Navigation from './Navigation';
import SwipeHandler from './SwipeHandler';
import { useScrollPosition } from '../../hooks';
import { ROUTES } from '../../constants/index.js';
import { handleKeyboardNavigation } from '../../utils';
import { productCategories } from '../../data/products/index.js';
// NOTE: In Astro, assets from /public should be referenced by URL string.
// Importing from "/images/..." triggers Astro's asset pipeline and can fail.
const logoWhite = '/images/logo.png';
const logoBlack = '/images/logo-black.png';
import MaxWidthContainer from '../ui/MaxWidthContainer.jsx';
import { getProductCategoryPath, getProductDetailPath, getSectionPath } from '../../lib/i18n/routing';
import RouterAgnosticLink from '../_astro/RouterAgnosticLink.jsx';
import styles from './Header.module.css';

const MENU_ANIMATION_MS = 300;

const NAV_ITEMS = [
  { key: 'home', path: ROUTES.HOME, label: 'nav.home' },
  { key: 'products', path: ROUTES.PRODUCTS, label: 'nav.products' },
  { key: 'realizations', path: ROUTES.REALIZATIONS, label: 'nav.realizations' },
  { key: 'about', path: ROUTES.ABOUT, label: 'nav.about' },
  { key: 'hs', path: ROUTES.HS_CONFIGURATOR, label: 'nav.hsConfigurator' },
  { key: 'contact', path: ROUTES.CONTACT, label: 'nav.contact' }
];

const cn = (...classes) => classes.filter(Boolean).join(' ');

function HeaderUI({ pathname = '/' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const [mobileActiveCategoryKey, setMobileActiveCategoryKey] = useState(null);
  const mobileMenuId = 'mobile-menu';
  const restoreOverflowTimeoutRef = useRef(null);
  const lastPathnameRef = useRef(null);

  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const { isPastThreshold } = useScrollPosition(5);

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
      if (path === ROUTES.HOME && pathname === localized) return true;
      return path !== ROUTES.HOME && pathname.startsWith(localized);
    },
    [lang, pathname]
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

  // CSS variable for layout offset
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const gap = 'var(--space-xs)';
    // Header is always visible (no hide-on-scroll) to match pre-migration UX.
    document.documentElement.style.setProperty('--header-offset', `calc(var(--header-height) + ${gap})`);
    return () => {
      document.documentElement.style.setProperty(
        '--header-offset',
        `calc(var(--header-height) + ${gap})`
      );
    };
  }, []);

  // Close menu on route change
  useEffect(() => {
    const prevPathname = lastPathnameRef.current;
    lastPathnameRef.current = pathname;

    if (prevPathname == null) return;

    if (prevPathname !== pathname && isMobileMenuOpen) {
      closeMobileMenu();
    }
  }, [closeMobileMenu, isMobileMenuOpen, pathname]);

  // Lock body scroll while menu is open + close on ESC
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    // If we re-open the menu before the close animation finished,
    // cancel any pending "restore overflow" timeout.
    if (isMobileMenuOpen && restoreOverflowTimeoutRef.current) {
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
      // We delay restoring scroll to match the close animation.
      // IMPORTANT: do NOT cancel this timeout in the next effect run when the menu is closed,
      // otherwise the body may stay locked.
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
    <header
      className={cn(
        styles.wrapper,
        isPastThreshold && styles.pastThreshold
      )}
    >
      <MaxWidthContainer className={styles.inner}>
        <RouterAgnosticLink className={styles.logoLink} to={getSectionPath(lang, 'home')}>
          <img
            src={isPastThreshold ? logoBlack : logoWhite}
            alt={t('nav.logoAlt', 'ROJEK okna i drzwi Logo')}
            width={1110}
            height={331}
            decoding="async"
          />
        </RouterAgnosticLink>

        <div className={styles.desktopNav}>
          <Navigation
            variant="header"
            isPastThreshold={isPastThreshold}
            isHeaderVisible={true}
            pathname={pathname}
          />
        </div>

        <div className={styles.desktopLang}>
          <LanguageSwitcher pathname={pathname} isPastThreshold={isPastThreshold} />
        </div>

        <button
          onClick={toggleMobileMenu}
          onKeyDown={handleMenuButtonKeyDown}
          aria-label={t('nav.toggleMenu', 'Toggle menu')}
          aria-expanded={isMobileMenuOpen}
          aria-controls={mobileMenuId}
          className={cn(
            styles.mobileMenuButton,
            isPastThreshold && styles.mobileMenuButtonPastThreshold,
            isMobileMenuOpen && styles.mobileMenuButtonOpen
          )}
        >
          {isMobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </MaxWidthContainer>

      <div
        className={cn(styles.mobileMenuOverlay, isMobileMenuOpen && styles.mobileMenuOverlayOpen)}
        onClick={closeMobileMenu}
      />

      <div
        id={mobileMenuId}
        className={cn(styles.mobileMenuContainer, isMobileMenuOpen && styles.mobileMenuContainerOpen)}
      >
        <SwipeHandler onSwipeRight={closeMobileMenu} enabled={isMobileMenuOpen}>
          <div className={styles.mobileMenuLogo}>
            <img
              src={logoBlack}
              alt={t('nav.logoAlt', 'ROJEK okna i drzwi Logo')}
              width={1110}
              height={331}
              decoding="async"
            />
          </div>

          <nav className={styles.mobileNavigation} role="navigation" aria-label={t('nav.mobileNavigation', 'Mobile navigation')}>
            {!mobileProductsOpen ? (
              <>
                {navItems.map((item, index) => {
                  if (item.key === 'products') {
                    return (
                      <button
                        key={item.key}
                        onClick={openMobileProducts}
                        aria-haspopup="true"
                        aria-expanded={mobileProductsOpen}
                        className={styles.mobileNavButton}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <span>{t(item.label)}</span>
                        <IoIosArrowForward aria-hidden="true" />
                      </button>
                    );
                  }

                  return (
                    <RouterAgnosticLink
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
                      className={cn(
                        styles.mobileNavItem,
                        isActive(item.path) && styles.mobileNavItemActive
                      )}
                      style={{ animationDelay: `${index * 0.05}s` }}
                      aria-current={isActive(item.path) ? 'page' : undefined}
                    >
                      {t(item.label)}
                    </RouterAgnosticLink>
                  );
                })}
              </>
            ) : (
              <>
                <button className={styles.mobileBackButton} onClick={closeMobileProducts}>
                  {'‹'} {t('buttons.backToHome', 'Wróć')}
                </button>

                {mobileCategories.map((c, idx) => (
                  <React.Fragment key={c.key}>
                    <button
                      onClick={() => setMobileActiveCategoryKey((prev) => (prev === c.key ? null : c.key))}
                      aria-expanded={mobileActiveCategoryKey === c.key}
                      className={styles.mobileNavButton}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <span>{c.title}</span>
                      <IoIosArrowForward
                        aria-hidden="true"
                        style={{
                          transform: mobileActiveCategoryKey === c.key ? 'rotate(90deg)' : 'rotate(0deg)',
                          transition: 'transform 180ms ease',
                        }}
                      />
                    </button>

                    {mobileActiveCategoryKey === c.key && (
                      <div className={styles.mobileSubList}>
                        {(c.products || []).map((p) => (
                          <RouterAgnosticLink
                            key={p.slug || p.id}
                            to={getProductDetailPath(lang, c.key, p.slug || p.id)}
                            onClick={closeMobileMenu}
                            className={styles.mobileNavItem}
                            style={{ animationDelay: '0s' }}
                          >
                            {p.name}
                          </RouterAgnosticLink>
                        ))}
                        <RouterAgnosticLink
                          to={getProductCategoryPath(lang, c.key)}
                          onClick={closeMobileMenu}
                          className={styles.mobileNavItem}
                          style={{ animationDelay: '0s' }}
                        >
                          {t('common.seeAll', 'Zobacz wszystkie')}
                        </RouterAgnosticLink>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </>
            )}
          </nav>

          <div className={styles.mobileLangSwitcher}>
            <LanguageSwitcher pathname={pathname} isMobile={true} isPastThreshold={true} />
          </div>
        </SwipeHandler>
      </div>
    </header>
  );
}

function HeaderInRouter() {
  // React Router was removed (Astro routing). Kept for backwards-compat;
  // the header now always renders in router-less mode.
  return <HeaderNoRouter />;
}

function HeaderNoRouter() {
  // Hydration-safe: do not read window.location during render.
  const [pathname, setPathname] = useState('/');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Sync once after mount.
    setPathname(window.location.pathname || '/');
    const onPop = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  return <HeaderUI pathname={pathname} />;
}

export default function Header({ pathname }) {
  // If a pathname is passed (e.g. from Astro SSR), we can render deterministically.
  if (typeof pathname === 'string') {
    return <HeaderUI pathname={pathname} />;
  }
  return <HeaderNoRouter />;
}