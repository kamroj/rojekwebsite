import React from 'react';

import I18nBoundary from '../I18nBoundary.jsx';
import ProductsView from '../../../views/ProductsView.jsx';
import { getProductsIndexPath } from '../../../lib/i18n/routing.js';

export default function ProductsIndexSsg({
  lang = 'pl',
  resources,
  initialProductCountsByCategory,
  productsHeaderImage = null,
  categoryCardImages = {},
  pathname,
}) {
  const breadcrumbPathname = pathname || getProductsIndexPath(lang);

  return (
    <I18nBoundary lang={lang} resources={resources}>
      <ProductsView
        initialProductCountsByCategory={initialProductCountsByCategory}
        productsHeaderImage={productsHeaderImage}
        categoryCardImages={categoryCardImages}
        breadcrumbPathname={breadcrumbPathname}
      />
    </I18nBoundary>
  );
}
