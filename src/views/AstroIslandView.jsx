import React from 'react';
import '../styles/global.css';
import { ResourceCollectorProvider } from '../context/ResourceCollectorContext.jsx';
import I18nBoundary from '../components/_astro/I18nBoundary.jsx';

/**
 * AstroIslandView
 *
 * Wrapper for rendering existing React views as Astro islands.
 * - Sets i18n language for the island.
 * - Provides global styles.
 *
 * NOTE: This is a temporary bridge during migration.
 */
export default function AstroIslandView({ lang = 'pl', resources, View, viewProps }) {
  if (!View) return null;

  return (
    <I18nBoundary lang={lang} resources={resources}>
      <ResourceCollectorProvider>
        {/* Spread `viewProps` so Astro pages can pass props without React Router context. */}
        <View {...(viewProps || {})} />
      </ResourceCollectorProvider>
    </I18nBoundary>
  );
}
