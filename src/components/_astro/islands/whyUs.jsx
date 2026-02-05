import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import WhyUsSection from '../../sections/home/WhyUsSection.jsx';

export default function WhyUsIsland({ lang = 'pl', resources, viewProps }) {
  return <AstroIslandView lang={lang} resources={resources} View={WhyUsSection} viewProps={viewProps || {}} />;
}
