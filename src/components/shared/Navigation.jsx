import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import RouterAgnosticLink from '../_astro/RouterAgnosticLink.jsx';
import { ROUTES } from '../../constants/index.js';
import { productCategories } from '../../data/products/index.js';
import { getArticlesIndexPath, getProductCategoryPath, getProductDetailPath, getSectionPath } from '../../lib/i18n/routing';
import { isSanityConfigured } from '../../lib/sanity/config';
import { fetchProductsListByCategory, fetchWindowProductsList } from '../../lib/sanity/windows';
import styles from './Navigation.module.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const BaseNavContainer = ({ className, ...props }) => (
  <nav {...props} className={cn(styles.baseNavContainer, className)} />
);

const NavItemWrapper = ({ className, ...props }) => (
  <div {...props} className={cn(styles.navItemWrapper, className)} />
);

const BaseNavItem = ({ $isPastThreshold, className, ...props }) => (
  <RouterAgnosticLink
    {...props}
    className={cn(
      styles.baseNavItem,
      $isPastThreshold ? styles.pastThreshold : styles.beforeThreshold,
      className
    )}
  />
);

export const HeaderNavContainer = ({ className, ...props }) => (
  <BaseNavContainer {...props} className={cn(styles.headerNavContainer, className)} />
);

export const HeaderNavItem = ({ className, ...props }) => (
  <BaseNavItem {...props} className={cn(styles.headerNavItem, className)} />
);

export const IntroNavContainer = ({ className, ...props }) => (
  <BaseNavContainer {...props} className={cn(styles.introNavContainer, className)} />
);

export const IntroNavItem = ({ className, ...props }) => (
  <BaseNavItem {...props} className={cn(styles.introNavItem, className)} />
);

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

const Navigation = ({ variant = 'header', isPastThreshold, isHeaderVisible = true, pathname = '/' }) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Hydration safety:
  // - On the server we can't render portals (no `document`).
  // - If we render a portal on the first client render, React may report hydration mismatch.
  // Therefore we only enable portals AFTER mount.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const { isHovered: isMegaOpen, handleMouseEnter, handleMouseLeave } = useHoverIntent(1);
  const [activeCategoryKey, setActiveCategoryKey] = useState(null);
  const [activeProductKey, setActiveProductKey] = useState(null);

  // Sanity (dynamic list for okna/drzwi)
  const [sanityWindows, setSanityWindows] = useState(null);
  const [sanityWindowsLoaded, setSanityWindowsLoaded] = useState(false);
  const windowsFetchAbortRef = useRef(null);
  const [sanityDoors, setSanityDoors] = useState(null);
  const [sanityDoorsLoaded, setSanityDoorsLoaded] = useState(false);
  const doorsFetchAbortRef = useRef(null);

  // Lazy-load: pobieramy listę okien z Sanity dopiero przy pierwszym otwarciu mega menu.
  useEffect(() => {
    if (variant !== 'header') return;
    if (!isMegaOpen) return;
    if (sanityWindowsLoaded) return;
    if (!isSanityConfigured()) {
      setSanityWindows(null);
      setSanityWindowsLoaded(true);
      return;
    }

    const controller = new AbortController();
    windowsFetchAbortRef.current = controller;

    fetchWindowProductsList(lang, { signal: controller.signal })
      .then((items) => {
        if (controller.signal.aborted) return;
        setSanityWindows(Array.isArray(items) ? items : []);
        setSanityWindowsLoaded(true);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        console.warn('Sanity windows list fetch failed (mega menu)', e);
        setSanityWindows([]);
        setSanityWindowsLoaded(true);
      });

    return () => controller.abort();
  }, [isMegaOpen, lang, sanityWindowsLoaded, variant]);

  // Lazy-load: pobieramy listę drzwi z Sanity dopiero przy pierwszym otwarciu mega menu.
  useEffect(() => {
    if (variant !== 'header') return;
    if (!isMegaOpen) return;
    if (sanityDoorsLoaded) return;
    if (!isSanityConfigured()) {
      setSanityDoors(null);
      setSanityDoorsLoaded(true);
      return;
    }

    const controller = new AbortController();
    doorsFetchAbortRef.current = controller;

    fetchProductsListByCategory('category_drzwi_zewnetrzne', lang, { signal: controller.signal })
      .then((items) => {
        if (controller.signal.aborted) return;
        setSanityDoors(Array.isArray(items) ? items : []);
        setSanityDoorsLoaded(true);
      })
      .catch((e) => {
        if (controller.signal.aborted) return;
        console.warn('Sanity doors list fetch failed (mega menu)', e);
        setSanityDoors([]);
        setSanityDoorsLoaded(true);
      });

    return () => controller.abort();
  }, [isMegaOpen, lang, sanityDoorsLoaded, variant]);

  // Po zmianie języka chcemy odświeżyć listę (bo opisy są lokalizowane)
  useEffect(() => {
    setSanityWindows(null);
    setSanityWindowsLoaded(false);
    if (windowsFetchAbortRef.current) {
      windowsFetchAbortRef.current.abort();
      windowsFetchAbortRef.current = null;
    }
    setSanityDoors(null);
    setSanityDoorsLoaded(false);
    if (doorsFetchAbortRef.current) {
      doorsFetchAbortRef.current.abort();
      doorsFetchAbortRef.current = null;
    }
  }, [lang]);

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
    // Articles exist only in Polish for now.
    ...(lang === 'pl' ? [{ key: 'articles', path: '/artykuly', label: 'nav.articles' }] : []),
    { key: 'realizations', path: ROUTES.REALIZATIONS, label: 'nav.realizations' },
    { key: 'about', path: ROUTES.ABOUT, label: 'nav.about' },
    { key: 'hs', path: ROUTES.HS_CONFIGURATOR, label: 'nav.hsConfigurator' },
    { key: 'contact', path: ROUTES.CONTACT, label: 'nav.contact' }
  ];
  
  const isActive = (path) => {
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

    if (path === ROUTES.HOME && pathname === localized) {
      return true;
    }
    return path !== ROUTES.HOME && pathname.startsWith(localized);
  };

  const menuCategories = useMemo(() => {
    const entries = Object.entries(productCategories || {});

    const iconByKey = {
      okna: '/images/window-icon.png',
      drzwi: '/images/door-icon.png',
      bramy: '/images/icons/tools-icon.png',
      rolety: '/images/icons/tools-icon.png',
    };

    return entries
      .map(([key, c]) => {
        const localProducts = Array.isArray(c?.products) ? c.products : [];

        // Okna: preferuj Sanity (jeśli są dane), inaczej lokalny fallback.
        const products =
          key === 'okna' && Array.isArray(sanityWindows) && sanityWindows.length > 0
            ? sanityWindows
            : key === 'drzwi' && Array.isArray(sanityDoors) && sanityDoors.length > 0
              ? sanityDoors
              : localProducts;

        return ({
        key,
        title: t(`breadcrumbs.categories.${key}`, c?.pageTitle || key),
        icon: iconByKey[key] || '/images/icons/tools-icon.png',
        products,
      });
      })
      .filter((c) => c.products.length > 0);
  }, [sanityDoors, sanityWindows, t]);

  const specItemsForMegaMenu = useMemo(() => ([
    { key: 'profileThickness', label: t('productSpecs.short.profileThickness', 'profil') },
    { key: 'thermalTransmittance', label: t('productSpecs.short.thermalTransmittance', 'uw') },
    { key: 'waterTightness', label: t('productSpecs.short.waterTightness', 'wodoszczelność') },
  ]), [t]);

  const resolvedActiveCategoryKey = useMemo(() => {
    if (activeCategoryKey) return activeCategoryKey;
    return menuCategories?.[0]?.key || null;
  }, [activeCategoryKey, menuCategories]);

  const activeCategory = useMemo(() => {
    if (!resolvedActiveCategoryKey) return null;
    return menuCategories.find((c) => c.key === resolvedActiveCategoryKey) || null;
  }, [menuCategories, resolvedActiveCategoryKey]);

  const resolvedActiveProduct = useMemo(() => {
    const products = activeCategory?.products || [];
    if (!products.length) return null;

    if (activeProductKey) {
      return products.find((p) => (p.slug || p.id) === activeProductKey) || null;
    }
    return products[0] || null;
  }, [activeCategory?.products, activeProductKey]);

  const resolvedActiveProductSpecs = useMemo(() => {
    return resolvedActiveProduct?.specs || null;
  }, [resolvedActiveProduct]);

  const resolvedActiveProductImage = useMemo(() => {
    // W danych lokalnych obrazek siedzi w `image`, czasem bywa też `images[0]`.
    // Dla sanity `image` jest ustawiane jako URL z listImage w fetcherze.
    return resolvedActiveProduct?.image
      || resolvedActiveProduct?.listImage?.asset?.url
      || resolvedActiveProduct?.images?.[0]
      || null;
  }, [resolvedActiveProduct]);

  // Kiedy otwieramy mega menu, ustawiamy domyślny produkt (pierwszy z aktywnej kategorii)
  useEffect(() => {
    if (variant !== 'header') return;
    if (!isMegaOpen) return;
    const products = activeCategory?.products || [];
    const first = products[0];
    if (!first) return;
    const firstKey = first.slug || first.id;
    setActiveProductKey((prev) => prev || firstKey);
  }, [activeCategory?.products, isMegaOpen, variant]);

  // Jeśli zmienimy kategorię, a aktywny produkt nie należy do tej kategorii,
  // to przestawiamy go na pierwszą pozycję (żeby podgląd zawsze miał sens).
  useEffect(() => {
    const products = activeCategory?.products || [];
    if (!products.length) {
      setActiveProductKey(null);
      return;
    }
    const exists = activeProductKey && products.some((p) => (p.slug || p.id) === activeProductKey);
    if (!exists) {
      const first = products[0];
      setActiveProductKey(first?.slug || first?.id || null);
    }
  }, [activeCategory?.products, activeProductKey]);

  const getLocalizedPath = (path) => {
    const pathMap = {
      [ROUTES.HOME]: getSectionPath(lang, 'home'),
      [ROUTES.PRODUCTS]: getSectionPath(lang, 'products'),
      ['/artykuly']: getArticlesIndexPath(lang),
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

    if (!isMounted) return null;

    // SSR/SSG safety: portals require document.
    if (typeof document === 'undefined') return null;

    const isOpen = isMegaOpen && isHeaderVisible;

    const megaMenuInnerClassName = cn(
      styles.megaMenuInner,
      isPastThreshold && styles.megaMenuInnerPastThreshold
    );

    return createPortal(
      <div
        id="megaMenuProducts"
        className={cn(styles.megaMenu, isOpen && styles.megaMenuOpen)}
        role="menu" 
        aria-label={t('nav.products', 'Produkty')}
        aria-hidden={!isOpen}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={megaMenuInnerClassName}>
          <div className={styles.megaMenuGrid}>
            <div className={styles.megaMenuLeft}>
              <div className={styles.categoryList}>
                {menuCategories.map((c) => (
                  <RouterAgnosticLink
                    key={c.key}
                    to={getProductCategoryPath(lang, c.key)}
                    role="menuitem"
                    onMouseEnter={() => setActiveCategoryKey(c.key)}
                    onFocus={() => setActiveCategoryKey(c.key)}
                    className={cn(
                      styles.categoryRow,
                      c.key === resolvedActiveCategoryKey && styles.categoryRowActive
                    )}
                  >
                    <div className={styles.categoryLeft}>
                      <span className={styles.categoryIcon} aria-hidden="true">
                        <img src={c.icon} alt="" />
                      </span>
                      <span>{c.title}</span>
                    </div>
                    <span className={styles.chevron} aria-hidden="true">›</span>
                  </RouterAgnosticLink>
                ))}
              </div>
            </div>

            <div className={styles.megaMenuRight}>
              <div className={styles.megaTitle}>
                {t('products.selectProduct', 'Wybierz produkt')}
              </div>
              <div className={styles.productList}>
                {(activeCategory?.products || []).map((p) => (
                  <RouterAgnosticLink
                    key={p.slug || p.id}
                    to={getProductDetailPath(lang, activeCategory.key, p.slug || p.id)}
                    role="menuitem"
                    onMouseEnter={() => setActiveProductKey(p.slug || p.id)}
                    onFocus={() => setActiveProductKey(p.slug || p.id)}
                    className={styles.productLink}
                  >
                    {p.name}
                  </RouterAgnosticLink>
                ))}
              </div>
            </div>

            <div className={styles.megaMenuImageCol} aria-hidden="true">
              <div className={styles.megaMenuImageWrapper}>
                {resolvedActiveProductImage ? (
                  <img className={styles.megaMenuImage} src={resolvedActiveProductImage} alt="" loading="lazy" />
                ) : null}
              </div>

              {/* SpecItems pod zdjęciem aktywnego produktu */}
              {resolvedActiveProductSpecs ? (
                <div className={styles.productSpecs} aria-hidden="true" style={{ width: '100%' }}>
                  {specItemsForMegaMenu.map((s) => {
                    const value = resolvedActiveProductSpecs?.[s.key];
                    if (!value) return null;
                    return (
                      <span className={styles.specBadge} key={s.key}>
                        <span>{s.label}</span>
                        <span>{value}</span>
                      </span>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>,
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
                  // Domyślne zdjęcie: pierwsza kategoria -> pierwszy produkt
                  const firstCat = menuCategories?.[0];
                  const firstProd = firstCat?.products?.[0];
                  if (!activeProductKey && firstProd) {
                    setActiveProductKey(firstProd.slug || firstProd.id);
                  }
                }}
                onMouseLeave={handleMouseLeave}
                onFocus={() => {
                  handleMouseEnter();
                  if (!activeCategoryKey && menuCategories?.[0]?.key) {
                    setActiveCategoryKey(menuCategories[0].key);
                  }
                  const firstCat = menuCategories?.[0];
                  const firstProd = firstCat?.products?.[0];
                  if (!activeProductKey && firstProd) {
                    setActiveProductKey(firstProd.slug || firstProd.id);
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
                  className={isActive(item.path) ? styles.active : ''}
                  aria-current={isActive(item.path) ? 'page' : undefined}
                  aria-haspopup="menu"
                  aria-controls="megaMenuProducts"
                  aria-expanded={isMegaOpen && isHeaderVisible}
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
              className={isActive(item.path) ? styles.active : ''}
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