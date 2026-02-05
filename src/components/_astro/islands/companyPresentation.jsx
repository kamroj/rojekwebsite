import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import CompanyPresentationSection from '../../sections/home/CompanyPresentationSection.jsx';

export default function CompanyPresentationIsland({ lang = 'pl', resources, viewProps }) {
  return (
    <AstroIslandView
      lang={lang}
      resources={resources}
      View={CompanyPresentationSection}
      viewProps={viewProps || {}}
    />
  );
}
