import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import RealizationsGallery from '../../sections/realizations/RealizationsGallery.jsx';

export default function RealizationsGalleryIsland({ lang = 'pl', resources, viewProps }) {
  return <AstroIslandView lang={lang} resources={resources} View={RealizationsGallery} viewProps={viewProps || {}} />;
}
