import React, { useMemo } from 'react';
import { useMatches } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Breadcrumbs from './Breadcrumbs';

/**
 * Reads breadcrumbs from react-router route `handle.crumb` definitions.
 * This is a scalable pattern: each route declares its own crumb.
 */
const AppBreadcrumbs = () => {
  const matches = useMatches();
  const { t } = useTranslation();

  const items = useMemo(() => {
    const crumbs = matches
      .map((m) => {
        const crumbDef = m.handle?.crumb;
        if (!crumbDef) return null;

        const crumb = typeof crumbDef === 'function' ? crumbDef(m) : crumbDef;
        if (!crumb) return null;

        const label = crumb.label ?? t(crumb.labelKey, crumb.defaultLabel);
        const to = crumb.to ?? m.pathname;

        return { label, to };
      })
      .filter(Boolean);

    return crumbs;
  }, [matches, t]);

  return <Breadcrumbs items={items} />;
};

export default AppBreadcrumbs;

