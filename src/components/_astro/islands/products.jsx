import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import ProductsView from '../../../views/ProductsView.jsx';

export default function ProductsIsland({ lang = 'pl', resources, viewProps }) {
  return <AstroIslandView lang={lang} resources={resources} View={ProductsView} viewProps={viewProps || {}} />;
}
