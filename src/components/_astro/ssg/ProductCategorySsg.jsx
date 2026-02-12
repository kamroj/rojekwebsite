import React from 'react';

import I18nBoundary from '../I18nBoundary.jsx';
import { ProductCategoryViewAstro } from '../../../views/ProductCategoryView.jsx';
import { getCategoryKeyFromSlug, getProductCategoryPath } from '../../../lib/i18n/routing.js';

/**
 * ProductCategorySsg
 *
 * IMPORTANT: In Astro, composing multiple React components directly in a `.astro`
 * file does NOT guarantee a single React tree. Context providers may not reach children.
 *
 * We wrap everything in one React component to ensure react-i18next context works.
 */
export default function ProductCategorySsg({
  lang = 'pl',
  resources,
  category,
  initialSanityProducts,
  categoryHeaderImage = null,
  pathname,
}) {
  const categoryKey = getCategoryKeyFromSlug(lang, category) || category;
  const breadcrumbPathname = pathname || getProductCategoryPath(lang, categoryKey);

  return (
    <I18nBoundary lang={lang} resources={resources}>
      <ProductCategoryViewAstro
        category={category}
        initialSanityProducts={initialSanityProducts}
        categoryHeaderImage={categoryHeaderImage}
        breadcrumbPathname={breadcrumbPathname}
      />
    </I18nBoundary>
  );
}
