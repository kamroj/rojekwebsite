import React from 'react';
import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';

/**
 * I18nBoundary
 *
 * A small SSR-safe i18n provider for Astro pages.
 *
 * Why this exists:
 * - `src/i18n.js` is browser-focused (language detector + http backend).
 * - In SSG/SSR we want deterministic language and inlined resources.
 * - Works for BOTH SSR-only React renders and hydrated islands.
 */
export default function I18nBoundary({ lang = 'pl', resources, children }) {
  // NOTE:
  // - We intentionally create a fresh i18n instance per boundary to avoid language leakage between pages during build.
  // - `initImmediate: false` keeps init synchronous (important for SSR).
  const i18n = React.useMemo(() => {
    const instance = i18next.createInstance();
    instance
      .use(initReactI18next)
      .init({
        lng: lang,
        fallbackLng: 'pl',
        supportedLngs: ['pl', 'en', 'de', 'fr'],
        resources,
        initImmediate: false,
        interpolation: { escapeValue: false },
      });
    return instance;
  }, [lang, resources]);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
