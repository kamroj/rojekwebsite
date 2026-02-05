import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import PartnersSection from '../../sections/home/PartnersSection.jsx';

export default function PartnersIsland({ lang = 'pl', resources, viewProps }) {
  return <AstroIslandView lang={lang} resources={resources} View={PartnersSection} viewProps={viewProps || {}} />;
}
