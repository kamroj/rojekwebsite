import React from 'react';

/**
 * RouterAgnosticLink
 *
 * The project is Astro-routed (SSG) and does NOT use React Router.
 * This component exists mostly for backwards compatibility with the old codebase
 * where many components used `to` (react-router's <Link>) instead of `href`.
 */
export default function RouterAgnosticLink({ to, href, children, ...rest }) {
  const dest = to || href;
  return (
    <a href={dest} {...rest}>
      {children}
    </a>
  );
}
