import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from './Breadcrumbs';
import {
  getCategoryKeyFromSlug,
  getProductCategoryPath,
  getProductDetailPath,
  getProductsIndexPath,
  getSectionPath,
  normalizeLang,
  SECTION_SLUGS_INV,
  stripLangPrefix,
} from '../../lib/i18n/routing';
import { productCategories, productDetailsByType } from '../../data/products/index.js';

function AppBreadcrumbsNoRouter({ pathname: pathnameProp }) {
  const { t, i18n } = useTranslation();
  const lang = normalizeLang(i18n.language);

  // Hydration-safe: do not read `window.location` during render.
  const [pathname, setPathname] = useState(() => pathnameProp || '/');

  useEffect(() => {
    if (pathnameProp) {
      setPathname(pathnameProp);
      return;
    }
    if (typeof window === 'undefined') return;

    // Sync once after mount.
    setPathname(window.location.pathname || '/');

    const onPop = () => setPathname(window.location.pathname || '/');
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [pathnameProp]);

  const items = useMemo(() => {
    const itemsOut = [];

    // Always start with Home to match SPA crumbs behavior.
    itemsOut.push({
      label: t('breadcrumbs.home', 'Home'),
      to: getSectionPath(lang, 'home'),
    });

    const base = stripLangPrefix(pathname);
    const parts = base.replace(/^\/+/, '').split('/').filter(Boolean);
    if (parts.length === 0) return itemsOut;

    const sectionKey = SECTION_SLUGS_INV?.[lang]?.[parts[0]];
    if (!sectionKey) return itemsOut;

    if (sectionKey !== 'products') {
      itemsOut.push({
        label: t(`breadcrumbs.${sectionKey}`, sectionKey),
        to: getSectionPath(lang, sectionKey),
      });
      return itemsOut;
    }

    // Products
    itemsOut.push({
      label: t('breadcrumbs.products', 'Products'),
      to: getProductsIndexPath(lang),
    });

    const categorySlug = parts[1];
    if (!categorySlug) return itemsOut;

    const categoryKey = getCategoryKeyFromSlug(lang, categorySlug) || categorySlug;
    const c = productCategories?.[categoryKey];

    itemsOut.push({
      label: t(`breadcrumbs.categories.${categoryKey}`, c?.pageTitle || categoryKey),
      to: getProductCategoryPath(lang, categoryKey),
    });

    const productId = parts[2];
    if (!productId) return itemsOut;

    // Match SPA: try to resolve a human label from local detail maps.
    const detailType = c?.detailType;
    const p = detailType ? productDetailsByType?.[detailType]?.[productId] : undefined;

    itemsOut.push({
      label: p?.name || productId,
      to: getProductDetailPath(lang, categoryKey, productId),
    });

    return itemsOut;
  }, [lang, pathname, t]);

  return <Breadcrumbs items={items} />;
}

export default function AppBreadcrumbs(props) {
  return <AppBreadcrumbsNoRouter {...props} />;
}
