import React from 'react';

import I18nBoundary from '../I18nBoundary.jsx';
import Footer from '../../shared/Footer.jsx';

/**
 * SiteFooterSsg
 *
 * SSR/SSG-rendered Footer with i18n context available.
 * Kept separate from Header so Astro can place it after <main> (sticky footer layout).
 */
export default function SiteFooterSsg({ lang = 'pl', resources }) {
  return (
    <I18nBoundary lang={lang} resources={resources}>
      <Footer />
    </I18nBoundary>
  );
}
