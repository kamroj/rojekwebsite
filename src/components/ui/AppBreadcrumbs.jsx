import React, { useMemo } from 'react';
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from './Breadcrumbs';
import { translatePathname } from '../../lib/i18n/routing';

/**
 * Reads breadcrumbs from react-router route `handle.crumb` definitions.
 * This is a scalable pattern: each route declares its own crumb.
 */
const AppBreadcrumbs = () => {
  const matches = useMatches();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const items = useMemo(() => {
    const crumbs = matches
      .map((m) => {
        const crumbDef = m.handle?.crumb;
        if (!crumbDef) return null;

        const crumb = typeof crumbDef === 'function' ? crumbDef(m) : crumbDef;
        if (!crumb) return null;

        const label = crumb.label ?? t(crumb.labelKey, crumb.defaultLabel);
        // If a route explicitly provides `crumb.to`, treat it as a PL base path and translate it.
        // Otherwise use router's resolved pathname.
        const to = crumb.to ? translatePathname(crumb.to, lang) : m.pathname;

        return { label, to };
      })
      .filter(Boolean);

    return crumbs;
  }, [lang, matches, t]);

  return <Breadcrumbs items={items} />;
};

export default AppBreadcrumbs;
