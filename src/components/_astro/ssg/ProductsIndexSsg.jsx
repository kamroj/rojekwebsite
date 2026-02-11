import React from 'react';

import I18nBoundary from '../I18nBoundary.jsx';
import ProductsView from '../../../views/ProductsView.jsx';

export default function ProductsIndexSsg({ lang = 'pl', resources, initialProductCountsByCategory }) {
  return (
    <I18nBoundary lang={lang} resources={resources}>
      <ProductsView initialProductCountsByCategory={initialProductCountsByCategory} />
    </I18nBoundary>
  );
}
