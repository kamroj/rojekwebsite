import React from 'react';

import I18nBoundary from '../I18nBoundary.jsx';
import { ProductDetailViewAstro } from '../../../views/ProductDetailView.jsx';
import { ResourceCollectorProvider } from '../../../context/ResourceCollectorContext.jsx';
import ErrorBoundary from '../ErrorBoundary.jsx';

/**
 * ProductDetailSsg
 *
 * Same rationale as ProductCategorySsg: keep providers + view in one React tree.
 */
export default function ProductDetailSsg({ lang = 'pl', resources, category, productId, initialSanityProduct }) {
  return (
    <I18nBoundary lang={lang} resources={resources}>
      <ResourceCollectorProvider>
        <ErrorBoundary
          // In dev we want details on screen to quickly identify the crash source.
          showDetails={import.meta.env?.DEV}
        >
          <ProductDetailViewAstro
            category={category}
            productId={productId}
            initialSanityProduct={initialSanityProduct}
          />
        </ErrorBoundary>
      </ResourceCollectorProvider>
    </I18nBoundary>
  );
}
