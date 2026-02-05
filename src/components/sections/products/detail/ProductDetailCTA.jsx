import React from 'react';
import { FiPhone } from 'react-icons/fi';
import Section from '../../../ui/Section';
import RouterAgnosticLink from '../../../_astro/RouterAgnosticLink.jsx';

import styles from './ProductDetailCTA.module.css';

export default function ProductDetailCTA({ title, description, note, t, contactHref = '/kontakt' }) {
  return (
    <Section>
      <div className={styles.ctaSection}>
        <div className={styles.ctaInner}>
          <h2 className={styles.ctaTitle}>{title}</h2>
          <p className={styles.ctaDescription}>{description}</p>
          <RouterAgnosticLink className={styles.primaryButton} href={contactHref}>
            <FiPhone />
            {t('common.contactUs', 'Skontaktuj się z nami')}
          </RouterAgnosticLink>
          <span className={styles.ctaNote}>{note}</span>
        </div>
      </div>
    </Section>
  );
}
