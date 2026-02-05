import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import HsConfiguratorView from '../../../views/HsConfiguratorView.jsx';

export default function HsConfiguratorIsland({ lang = 'pl', resources, viewProps }) {
  return <AstroIslandView lang={lang} resources={resources} View={HsConfiguratorView} viewProps={viewProps || {}} />;
}
