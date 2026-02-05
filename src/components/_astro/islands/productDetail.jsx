import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import { ProductDetailViewAstro } from '../../../views/ProductDetailView.jsx';

export default function ProductDetailIsland({ lang = 'pl', resources, viewProps }) {
  return (
    <AstroIslandView
      lang={lang}
      resources={resources}
      View={ProductDetailViewAstro}
      viewProps={viewProps || {}}
    />
  );
}
