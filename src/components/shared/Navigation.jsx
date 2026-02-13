import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import RouterAgnosticLink from '../_astro/RouterAgnosticLink.jsx';
import { ROUTES } from '../../constants/index.js';
import { productCategories } from '../../data/products/index.js';
import { getArticlesIndexPath, getProductCategoryPath, getProductDetailPath, getSectionPath } from '../../lib/i18n/routing';
import { isSanityConfigured } from '../../lib/sanity/config';
import { fetchProductsListByCategory } from '../../lib/sanity/windows';
import styles from './Navigation.module.css';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const SANITY_CATEGORY_IDS_BY_KEY = {
  okna: ['category_okna', 'category_okna_przesuwne'],
  drzwi: ['category_drzwi_zewnetrzne', 'category_ppoz'],
};

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

const Navigation = ({
  variant = 'header',
  isPastThreshold,
  isHeaderVisible = true,
  pathname = '/',
  initialSanityProductsByCategory = {},
}) => {
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

  // Sanity (dynamic lists for supported categories in mega menu)
  const [sanityProductsByCategory, setSanityProductsByCategory] = useState(
    () => initialSanityProductsByCategory || {}
  );
  const [sanityLoadedByCategory, setSanityLoadedByCategory] = useState(() => {
    const initial = initialSanityProductsByCategory || {};
    return Object.keys(initial).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
  });
  const categoryFetchAbortRef = useRef({});
  const didInitLangEffectRef = useRef(false);

  // Lazy-load: fetch category products from Sanity on first mega menu open.
  useEffect(() => {
    if (variant !== 'header') return;
    if (!isMegaOpen) return;
    if (!isSanityConfigured()) {
      setSanityLoadedByCategory((prev) => {
        let changed = false;
        const next = { ...prev };

        Object.keys(SANITY_CATEGORY_IDS_BY_KEY).forEach((key) => {
          if (!next[key]) {
            next[key] = true;
            changed = true;
          }
        });

        // IMPORTANT: when nothing changed, return previous object reference
        // to avoid an infinite re-render loop in this effect.
        return changed ? next : prev;
      });
      return;
    }

    const tasks = Object.entries(SANITY_CATEGORY_IDS_BY_KEY)
      .filter(([key, categoryIds]) => categoryIds.length > 0 && !sanityLoadedByCategory[key]);

    if (!tasks.length) return;

    tasks.forEach(([key]) => {
      if (categoryFetchAbortRef.current[key]) {
        categoryFetchAbortRef.current[key].abort();
      }

      const controller = new AbortController();
      categoryFetchAbortRef.current[key] = controller;

      Promise.allSettled(
        SANITY_CATEGORY_IDS_BY_KEY[key].map((categoryId) =>
          fetchProductsListByCategory(categoryId, lang, { signal: controller.signal })
        )
      )
        .then((results) => {
          if (controller.signal.aborted) return;

          const fulfilledGroups = (results || [])
            .filter((r) => r.status === 'fulfilled')
            .map((r) => r.value || []);

          const rejectedGroups = (results || []).filter((r) => r.status === 'rejected');
          if (rejectedGroups.length > 0) {
            console.warn(`Sanity ${key} partial list fetch failed (mega menu)`, rejectedGroups);
          }

          const merged = fulfilledGroups.flat();
          const deduped = merged.filter((item, index, arr) => {
            const itemKey = item?.slug || item?.id;
            if (!itemKey) return false;
            return arr.findIndex((x) => (x?.slug || x?.id) === itemKey) === index;
          });

          setSanityProductsByCategory((prev) => ({
            ...prev,
            [key]: deduped,
          }));
          setSanityLoadedByCategory((prev) => ({ ...prev, [key]: true }));
        })
        .catch((e) => {
          if (controller.signal.aborted) return;
          console.warn(`Sanity ${key} list fetch failed (mega menu)`, e);
          setSanityProductsByCategory((prev) => ({ ...prev, [key]: [] }));
          setSanityLoadedByCategory((prev) => ({ ...prev, [key]: true }));
        });
    });
  }, [isMegaOpen, lang, sanityLoadedByCategory, variant]);

  // On language change we refresh all localized lists.
  useEffect(() => {
    if (!didInitLangEffectRef.current) {
      didInitLangEffectRef.current = true;
      return;
    }

    Object.values(categoryFetchAbortRef.current).forEach((controller) => controller?.abort());
    categoryFetchAbortRef.current = {};
    setSanityProductsByCategory({});
    setSanityLoadedByCategory({});
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
    // On desktop header we skip "home" because logo links to homepage.
    ...(variant === 'header' ? [] : [{ key: 'home', path: ROUTES.HOME, label: 'nav.home' }]),
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
      okna: '/images/icons/ikona-okna-mm.png',
      drzwi: '/images/icons/ikona-drzwi-mm.png',
      oknaDrzwiPrzeciwpozarowe: '/images/icons/ikona-okna-ppoz-mm.png',
      oknaPrzesuwne: '/images/icons/ikona-hs-mm.png',
      bramy: '/images/icons/tools-icon.png',
      rolety: '/images/icons/tools-icon.png',
    };

    return entries
      .map(([key, c]) => {
        const localProducts = Array.isArray(c?.products) ? c.products : [];
        return ({
          key,
          title: t(`breadcrumbs.categories.${key}`, c?.pageTitle || key),
          icon: iconByKey[key] || '/images/icons/tools-icon.png',
          hasSanitySource: Boolean((SANITY_CATEGORY_IDS_BY_KEY[key] || []).length),
          localProducts,
        });
      })
      .filter((c) => c.hasSanitySource || c.localProducts.length > 0);
  }, [t]);

  const specItemsForMegaMenu = useMemo(() => ([
    { key: 'profileThickness', label: t('productSpecs.short.profileThickness', 'profil') },
    { key: 'thermalTransmittance', label: t('productSpecs.short.thermalTransmittance', 'uw') },
    { key: 'waterTightness', label: t('productSpecs.short.waterTightness', 'wodoszczelność') },
  ]), [t]);

  const resolvedActiveCategoryKey = useMemo(() => {
    if (activeCategoryKey && menuCategories.some((c) => c.key === activeCategoryKey)) {
      return activeCategoryKey;
    }
    return menuCategories?.[0]?.key || null;
  }, [activeCategoryKey, menuCategories]);

  const activeCategory = useMemo(() => {
    if (!resolvedActiveCategoryKey) return null;
    return menuCategories.find((c) => c.key === resolvedActiveCategoryKey) || null;
  }, [menuCategories, resolvedActiveCategoryKey]);

  const activeCategoryProducts = useMemo(() => {
    if (!activeCategory?.key) return [];
    const isSanityMappedCategory = Boolean(SANITY_CATEGORY_IDS_BY_KEY[activeCategory.key]?.length);
    if (isSanityMappedCategory) {
      // For mapped categories we intentionally use only Sanity data.
      return sanityProductsByCategory[activeCategory.key] || [];
    }
    return activeCategory?.localProducts || [];
  }, [activeCategory, sanityProductsByCategory]);

  const isActiveCategorySanityMapped = Boolean(
    activeCategory?.key && (SANITY_CATEGORY_IDS_BY_KEY[activeCategory.key] || []).length
  );

  const isActiveCategoryLoading =
    isActiveCategorySanityMapped && !sanityLoadedByCategory[activeCategory.key];

  const resolvedActiveProduct = useMemo(() => {
    const products = activeCategoryProducts;
    if (!products.length) return null;

    if (activeProductKey) {
      return products.find((p) => (p.slug || p.id) === activeProductKey) || null;
    }
    return products[0] || null;
  }, [activeCategoryProducts, activeProductKey]);

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

  const loadingPreviewImage = useMemo(() => {
    // While Sanity list is still loading, use first local product image as a
    // blurred placeholder so image area doesn't look empty.
    return activeCategory?.localProducts?.[0]?.image || null;
  }, [activeCategory]);

  // Kiedy otwieramy mega menu, ustawiamy domyślny produkt (pierwszy z aktywnej kategorii)
  useEffect(() => {
    if (variant !== 'header') return;
    if (!isMegaOpen) return;
    const products = activeCategoryProducts;
    const first = products[0];
    if (!first) return;
    const firstKey = first.slug || first.id;
    setActiveProductKey((prev) => prev || firstKey);
  }, [activeCategoryProducts, isMegaOpen, variant]);

  // Jeśli zmienimy kategorię, a aktywny produkt nie należy do tej kategorii,
  // to przestawiamy go na pierwszą pozycję (żeby podgląd zawsze miał sens).
  useEffect(() => {
    const products = activeCategoryProducts;
    if (!products.length) {
      setActiveProductKey(null);
      return;
    }
    const exists = activeProductKey && products.some((p) => (p.slug || p.id) === activeProductKey);
    if (!exists) {
      const first = products[0];
      setActiveProductKey(first?.slug || first?.id || null);
    }
  }, [activeCategoryProducts, activeProductKey]);

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
                {isActiveCategoryLoading ? (
                  <span className={styles.productLink}>{t('common.loading', 'Ładowanie...')}</span>
                ) : activeCategoryProducts.length > 0 ? (
                  activeCategoryProducts.map((p) => (
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
                  ))
                ) : (
                  <span className={styles.productLink}>{t('products.noProducts', 'Brak produktów')}</span>
                )}
              </div>
            </div>

            <div className={styles.megaMenuImageCol} aria-hidden="true">
              <div className={styles.megaMenuImageWrapper}>
                {resolvedActiveProductImage ? (
                  <img className={styles.megaMenuImage} src={resolvedActiveProductImage} alt="" loading="lazy" />
                ) : isActiveCategoryLoading && loadingPreviewImage ? (
                  <img
                    className={cn(styles.megaMenuImage, styles.megaMenuImageBlurPlaceholder)}
                    src={loadingPreviewImage}
                    alt=""
                    loading="lazy"
                  />
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
                  const firstProd = activeCategoryProducts?.[0];
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
                  const firstProd = activeCategoryProducts?.[0];
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