import React from 'react';
import { useTranslation } from 'react-i18next';
import { getSectionPath } from '../../../lib/i18n/routing.js';
import styles from './IntroNavigation.module.css';

const IntroNavigation = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <nav className={styles.nav}>
      <a className={styles.item} href={getSectionPath(lang, 'realizations')}>
        {t('nav.realizations')}
      </a>
      <a className={styles.item} href={getSectionPath(lang, 'realizations')}>
        {t('nav.realizations')}
      </a>
      <a className={styles.item} href={getSectionPath(lang, 'about')}>
        {t('nav.about')}
      </a>
      <a className={styles.item} href={getSectionPath(lang, 'contact')}>
        {t('nav.contact')}
      </a>
    </nav>
  );
};

export default IntroNavigation;
