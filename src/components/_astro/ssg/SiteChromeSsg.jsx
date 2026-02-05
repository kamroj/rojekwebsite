import React from 'react';

import I18nBoundary from '../I18nBoundary.jsx';
import Header from '../../shared/Header.jsx';
import Footer from '../../shared/Footer.jsx';

/**
 * SiteChromeSsg
 *
 * Renders Header + Footer in SSR/SSG with i18n context available.
 *
 * Note: This component is meant to be used from an `.astro` layout.
 * We still hydrate the interactive parts (menu/lang switcher) via client:*.
 */
export default function SiteChromeSsg({ lang = 'pl', resources, pathname = '/' }) {
  return (
    <I18nBoundary lang={lang} resources={resources}>
      <Header pathname={pathname} />
      <Footer />
    </I18nBoundary>
  );
}
