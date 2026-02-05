import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import { ProductCategoryViewAstro } from '../../../views/ProductCategoryView.jsx';

export default function ProductCategoryIsland({ lang = 'pl', resources, viewProps }) {
  return (
    <AstroIslandView
      lang={lang}
      resources={resources}
      View={ProductCategoryViewAstro}
      viewProps={viewProps || {}}
    />
  );
}
