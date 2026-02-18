import React from 'react';
import '../../styles/global.css';

import Header from '../shared/Header';
import Footer from '../shared/Footer';

/**
 * AstroAppShell
 *
 * Temporary bridge layout rendered as a React island.
 * This keeps the existing UI 1:1 (Header/Footer).
 *
 * NOTE: React Router has been removed. Header/Footer are router-agnostic.
 */
export default function AstroAppShell({ children, lang = 'pl' }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer lang={lang} />
    </>
  );
}
