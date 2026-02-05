import React from 'react';
import AstroIslandView from '../../../views/AstroIslandView.jsx';
import ContactView from '../../../views/ContactView.jsx';

/**
 * Contact form island.
 * We reuse ContactView but hide the direct-contact card via a small viewProp,
 * because that part will be rendered as static HTML for SEO.
 */
export default function ContactFormIsland({ lang = 'pl', resources, viewProps }) {
  return (
    <AstroIslandView
      lang={lang}
      resources={resources}
      View={ContactView}
      // IMPORTANT:
      // `AstroIslandView` spreads `viewProps` into the React View as plain props.
      // `ContactView` expects a *single* prop called `viewProps`.
      // If we pass `{ ssgMode: true }` at top-level, ContactView won't see it and will
      // render the full page layout again (duplicating header + hero + directCard).
      viewProps={{
        viewProps: { ...(viewProps || {}), ssgMode: true, hideDirectCard: true },
      }}
    />
  );
}
