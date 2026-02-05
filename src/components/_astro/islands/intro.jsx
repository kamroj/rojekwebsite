import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import IntroSection from '../../sections/home/IntroSection.jsx';

export default function IntroIsland({ lang = 'pl', resources, viewProps }) {
  return <AstroIslandView lang={lang} resources={resources} View={IntroSection} viewProps={viewProps || {}} />;
}
