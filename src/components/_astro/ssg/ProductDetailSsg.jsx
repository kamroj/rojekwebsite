import React from 'react';

import I18nBoundary from '../I18nBoundary.jsx';
import { ProductDetailViewAstro } from '../../../views/ProductDetailView.jsx';

/**
 * ProductDetailSsg
 *
 * Same rationale as ProductCategorySsg: keep providers + view in one React tree.
 */
export default function ProductDetailSsg({ lang = 'pl', resources, category, productId, initialSanityProduct }) {
  return (
    <I18nBoundary lang={lang} resources={resources}>
      <ProductDetailViewAstro
        category={category}
        productId={productId}
        initialSanityProduct={initialSanityProduct}
      />
    </I18nBoundary>
  );
}
