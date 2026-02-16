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
import { getArticlesIndexPath, getProductCategoryPath, getProductDetailPath, getSectionPath } from '../../lib/i18n/routing';
import RouterAgnosticLink from '../_astro/RouterAgnosticLink.jsx';
import styles from './Header.module.css';

const MENU_ANIMATION_MS = 300;

const NAV_ITEMS = [
  { key: 'home', path: ROUTES.HOME, label: 'nav.home' },
  { key: 'products', path: ROUTES.PRODUCTS, label: 'nav.products' },
  // Articles exist only in Polish for now.
  { key: 'articles', path: '/artykuly', label: 'nav.articles', onlyLang: 'pl' },
  { key: 'realizations', path: ROUTES.REALIZATIONS, label: 'nav.realizations' },
  { key: 'about', path: ROUTES.ABOUT, label: 'nav.about' },
  { key: 'hs', path: ROUTES.HS_CONFIGURATOR, label: 'nav.hsConfigurator' },
  { key: 'contact', path: ROUTES.CONTACT, label: 'nav.contact' }
];

const SANITY_MENU_CATEGORY_KEYS = new Set(['okna', 'drzwi']);

const MENU_CATEGORY_ICON_BY_KEY = {
  okna: '/images/icons/ikona-okna-mm.png',
  drzwi: '/images/icons/ikona-drzwi-mm.png',
  oknaDrzwiPrzeciwpozarowe: '/images/icons/ikona-okna-ppoz-mm.png',
  oknaPrzesuwne: '/images/icons/ikona-hs-mm.png',
  bramy: '/images/icons/tools-icon.png',
  rolety: '/images/icons/tools-icon.png',
};

const cn = (...classes) => classes.filter(Boolean).join(' ');

function HeaderUI({ pathname = '/', initialSanityProductsByCategory = {} }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileMenuView, setMobileMenuView] = useState('main');
  const [mobileMenuDirection, setMobileMenuDirection] = useState('forward');
  const [mobileActiveCategoryKey, setMobileActiveCategoryKey] = useState(null);
  const mobileMenuId = 'mobile-menu';
  const restoreOverflowTimeoutRef = useRef(null);
  const bodyOverflowBeforeOpenRef = useRef('');
  const isBodyScrollLockedRef = useRef(false);
  const lastPathnameRef = useRef(null);

  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  // Change header style as soon as the user starts scrolling.
  const { isPastThreshold } = useScrollPosition(0);

  const isActive = useCallback(
    (path) => {
      const routeMap = {
        [ROUTES.HOME]: getSectionPath(lang, 'home'),
        [ROUTES.PRODUCTS]: getSectionPath(lang, 'products'),
        ['/artykuly']: getArticlesIndexPath(lang),
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
    setMobileMenuView('main');
    setMobileActiveCategoryKey(null);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const openMobileProducts = useCallback(() => {
    setMobileMenuDirection('forward');
    setMobileMenuView('products');
    setMobileActiveCategoryKey(null);
  }, []);

  const openMobileCategory = useCallback((categoryKey) => {
    setMobileMenuDirection('forward');
    setMobileActiveCategoryKey(categoryKey);
    setMobileMenuView('category');
  }, []);

  const closeMobileCategory = useCallback(() => {
    setMobileMenuDirection('back');
    setMobileMenuView('products');
  }, []);

  const closeMobileProducts = useCallback(() => {
    setMobileMenuDirection('back');
    setMobileMenuView('main');
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

  // Lock body scroll only on open/close transitions.
  // NOTE: we intentionally don't depend on mobileMenuView here,
  // because view changes inside the open menu (main/products/category)
  // must not overwrite the original body overflow state.
  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    // If we re-open the menu before close animation finished,
    // cancel the pending restore timeout.
    if (isMobileMenuOpen && restoreOverflowTimeoutRef.current) {
      window.clearTimeout(restoreOverflowTimeoutRef.current);
      restoreOverflowTimeoutRef.current = null;
    }

    if (isMobileMenuOpen) {
      // Capture body overflow only once per open cycle.
      if (!isBodyScrollLockedRef.current) {
        bodyOverflowBeforeOpenRef.current = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        isBodyScrollLockedRef.current = true;
      }
      return;
    }

    // Menu closed: restore overflow after close animation.
    if (isBodyScrollLockedRef.current) {
      restoreOverflowTimeoutRef.current = window.setTimeout(() => {
        document.body.style.overflow = bodyOverflowBeforeOpenRef.current;
        bodyOverflowBeforeOpenRef.current = '';
        isBodyScrollLockedRef.current = false;
        restoreOverflowTimeoutRef.current = null;
      }, MENU_ANIMATION_MS);
    }
  }, [isMobileMenuOpen]);

  // Close on ESC
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (!isMobileMenuOpen) return;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (mobileMenuView === 'category') {
          closeMobileCategory();
        } else if (mobileMenuView === 'products') {
          closeMobileProducts();
        } else {
          closeMobileMenu();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [closeMobileCategory, closeMobileMenu, closeMobileProducts, isMobileMenuOpen, mobileMenuView]);

  // Defensive cleanup on unmount.
  useEffect(() => {
    return () => {
      if (restoreOverflowTimeoutRef.current) {
        window.clearTimeout(restoreOverflowTimeoutRef.current);
        restoreOverflowTimeoutRef.current = null;
      }
      if (typeof document !== 'undefined' && isBodyScrollLockedRef.current) {
        document.body.style.overflow = bodyOverflowBeforeOpenRef.current;
      }
      bodyOverflowBeforeOpenRef.current = '';
      isBodyScrollLockedRef.current = false;
    };
  }, []);

  const navItems = useMemo(() => NAV_ITEMS, []);

  const mobileCategories = useMemo(() => {
    const entries = Object.entries(productCategories || {});
    return entries
      .map(([key, c]) => ({
        // Keep mobile menu aligned with desktop mega menu:
        // - for Sanity-driven categories (okna/drzwi) use ONLY build-time payload from Astro/Sanity
        // - for other categories keep local data source
        // We intentionally do not fallback to local data for Sanity categories,
        // so mobile always uses the same source of truth as desktop.
        products: SANITY_MENU_CATEGORY_KEYS.has(key)
          ? (initialSanityProductsByCategory?.[key] || [])
          : (Array.isArray(c?.products) ? c.products : []),
        icon: MENU_CATEGORY_ICON_BY_KEY[key] || '/images/icons/tools-icon.png',
        key,
        title: t(`breadcrumbs.categories.${key}`, c?.pageTitle || key),
      }))
      .filter((c) => c.products.length > 0);
  }, [initialSanityProductsByCategory, t]);

  const activeMobileCategory = useMemo(
    () => mobileCategories.find((c) => c.key === mobileActiveCategoryKey) || null,
    [mobileActiveCategoryKey, mobileCategories]
  );

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
            initialSanityProductsByCategory={initialSanityProductsByCategory}
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
            <RouterAgnosticLink
              to={getSectionPath(lang, 'home')}
              onClick={closeMobileMenu}
              className={styles.mobileLogoLink}
              aria-label={t('nav.home', 'Strona Główna')}
            >
              <img
                src={logoBlack}
                alt={t('nav.logoAlt', 'ROJEK okna i drzwi Logo')}
                width={1110}
                height={331}
                decoding="async"
              />
            </RouterAgnosticLink>
          </div>

          <nav className={styles.mobileNavigation} role="navigation" aria-label={t('nav.mobileNavigation', 'Mobile navigation')}>
            <div
              key={`${mobileMenuView}-${mobileActiveCategoryKey || 'root'}`}
              className={cn(
                styles.mobileMenuPanel,
                mobileMenuDirection === 'forward'
                  ? styles.mobileMenuPanelForward
                  : styles.mobileMenuPanelBack
              )}
            >
              {mobileMenuView === 'main' && (
                <>
                  {navItems.map((item, index) => {
                    if (item.onlyLang && item.onlyLang !== lang) return null;
                    if (item.key === 'products') {
                      return (
                        <button
                          key={item.key}
                          onClick={openMobileProducts}
                          aria-haspopup="true"
                          aria-expanded={mobileMenuView !== 'main'}
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
                              : item.path === '/artykuly'
                                ? getArticlesIndexPath(lang)
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
              )}

              {mobileMenuView === 'products' && (
                <>
                  <button className={styles.mobileBackButton} onClick={closeMobileProducts}>
                    <span aria-hidden="true">‹</span>
                    <span>{t('nav.products', 'Produkty')}</span>
                  </button>

                  <RouterAgnosticLink
                    to={getSectionPath(lang, 'products')}
                    onClick={closeMobileMenu}
                    className={styles.mobileNavItem}
                    style={{ animationDelay: '0s' }}
                  >
                    {t('common.seeAll', 'Zobacz wszystkie')}
                  </RouterAgnosticLink>

                  {mobileCategories.map((c, idx) => (
                    <button
                      key={c.key}
                      onClick={() => openMobileCategory(c.key)}
                      aria-haspopup="true"
                      aria-expanded={mobileMenuView === 'category' && mobileActiveCategoryKey === c.key}
                      className={styles.mobileNavButton}
                      style={{ animationDelay: `${idx * 0.05}s` }}
                    >
                      <span className={styles.mobileNavButtonLabel}>
                        <span className={styles.mobileCategoryIcon} aria-hidden="true">
                          <img src={c.icon} alt="" loading="lazy" />
                        </span>
                        <span>{c.title}</span>
                      </span>
                      <IoIosArrowForward aria-hidden="true" />
                    </button>
                  ))}
                </>
              )}

              {mobileMenuView === 'category' && mobileActiveCategoryKey && (
                <>
                  <button className={styles.mobileBackButton} onClick={closeMobileCategory}>
                    <span aria-hidden="true">‹</span>
                    <span>{activeMobileCategory?.title || t('nav.products', 'Produkty')}</span>
                  </button>

                  <RouterAgnosticLink
                    to={getProductCategoryPath(lang, mobileActiveCategoryKey)}
                    onClick={closeMobileMenu}
                    className={styles.mobileNavItem}
                    style={{ animationDelay: '0s' }}
                  >
                    {t('common.seeAll', 'Zobacz wszystkie')}
                  </RouterAgnosticLink>

                  <div className={styles.mobileSubList}>
                    {(mobileCategories.find((c) => c.key === mobileActiveCategoryKey)?.products || []).map((p) => (
                      <RouterAgnosticLink
                        key={p.slug || p.id}
                        to={getProductDetailPath(lang, mobileActiveCategoryKey, p.slug || p.id)}
                        onClick={closeMobileMenu}
                        className={styles.mobileNavItem}
                        style={{ animationDelay: '0s' }}
                      >
                        {p.name}
                      </RouterAgnosticLink>
                    ))}
                  </div>
                </>
              )}
            </div>
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

function HeaderNoRouter({ initialSanityProductsByCategory = {} }) {
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

  return (
    <HeaderUI
      pathname={pathname}
      initialSanityProductsByCategory={initialSanityProductsByCategory}
    />
  );
}

export default function Header({ pathname, initialSanityProductsByCategory = {} }) {
  // If a pathname is passed (e.g. from Astro SSR), we can render deterministically.
  if (typeof pathname === 'string') {
    return (
      <HeaderUI
        pathname={pathname}
        initialSanityProductsByCategory={initialSanityProductsByCategory}
      />
    );
  }
  return <HeaderNoRouter initialSanityProductsByCategory={initialSanityProductsByCategory} />;
}