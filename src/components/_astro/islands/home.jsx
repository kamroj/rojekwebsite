import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import HomeView from '../../../views/HomeView.jsx';

export default function HomeIsland({ lang = 'pl', resources, viewProps }) {
  return <AstroIslandView lang={lang} resources={resources} View={HomeView} viewProps={viewProps || {}} />;
}
