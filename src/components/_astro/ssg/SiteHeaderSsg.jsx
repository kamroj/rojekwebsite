import React from 'react';

import I18nBoundary from '../I18nBoundary.jsx';
import Header from '../../shared/Header.jsx';

/**
 * SiteHeaderSsg
 *
 * SSR/SSG-rendered Header with i18n context available.
 * Kept separate from Footer so Astro can place it before <main>.
 */
export default function SiteHeaderSsg({ lang = 'pl', resources, pathname = '/' }) {
  return (
    <I18nBoundary lang={lang} resources={resources}>
      <Header pathname={pathname} />
    </I18nBoundary>
  );
}
