import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FiPhone, FiMail } from 'react-icons/fi';
import { COMPANY } from '../../data/company.js';
import { hasConsent, onConsentChange, openConsentSettings } from '../../lib/consent/browser.js';
import { getSectionPath } from '../../lib/i18n/routing.js';
import styles from './Footer.module.css';

const Footer = ({ lang = 'pl' }) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [mapConsent, setMapConsent] = useState(false);
  const activeLang = ['pl', 'en', 'de'].includes(lang) ? lang : 'pl';

  const privacyPolicyPath = getSectionPath(activeLang, 'privacyPolicy');
  const cookiePolicyPath = getSectionPath(activeLang, 'cookiePolicy');
  const sitemapPath = '/sitemap.xml';
  const privacyPolicyFallbackByLang = {
    pl: 'Polityka prywatności',
    en: 'Privacy policy',
    de: 'Datenschutzerklärung',
  };
  const cookiePolicyFallbackByLang = {
    pl: 'Polityka cookies',
    en: 'Cookies policy',
    de: 'Cookie-Richtlinie',
  };
  const sitemapFallbackByLang = {
    pl: 'Mapa strony',
    en: 'Sitemap',
    de: 'Sitemap',
  };

  const contactData = [
    {
      role: t('contact.roles.quotes', 'Wyceny, zapytania'),
      people: COMPANY.contacts.quotes,
    },
    {
      role: t('contact.roles.distribution', 'Dystrybucja, marketing, produkcja'),
      people: COMPANY.contacts.distribution,
    },
  ];

  const mapSrc = COMPANY.map.embedUrl;

  useEffect(() => {
    setMapConsent(hasConsent('externalMedia'));
    const unsubscribe = onConsentChange((detail) => {
      const next = detail?.consents?.externalMedia;
      setMapConsent(typeof next === 'boolean' ? next : hasConsent('externalMedia'));
    });
    return unsubscribe;
  }, []);

  return (
    <footer className={styles.footerWrapper}>
      <div className={styles.footerContent}>
        <div className={styles.footerMainContent}>
          <div className={styles.contactSection}>
            <h3>{t('contact.contactTitle')}</h3>
            
            {contactData.map((group, groupIndex) => (
              <div className={styles.contactGroup} key={groupIndex}>
                <div className={styles.contactRole}>{group.role}</div>
                {group.people.map((person, personIndex) => (
                  <div key={personIndex}>
                    <div className={styles.contactName}>{person.name}</div>
                    <div className={styles.contactInfo}>
                      <a 
                        href={`tel:${person.phone.replace(/\s/g, '')}`}
                        aria-label={`${t('contact.phone')}: ${person.phone}`}
                      >
                        <span className={styles.contactIcon}><FiPhone /></span>
                        <span className={styles.contactText}>{person.phone}</span>
                      </a>
                    </div>
                    {person.emails.map((email, emailIndex) => (
                      <div className={styles.contactInfo} key={emailIndex}>
                        <a 
                          href={`mailto:${email}`}
                          aria-label={`${t('contact.email')}: ${email}`}
                        >
                          <span className={styles.contactIcon}><FiMail /></span>
                          <span className={styles.contactText}>{email}</span>
                        </a>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className={styles.mapSection}>
            <h3>{t('contact.locationTitle')}</h3>
            <div className={styles.mapContainer}>
              {mapConsent ? (
                <iframe
                  src={mapSrc}
                  title={t('contact.locationTitle')}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <div className={styles.mapPlaceholder}>
                  <p>
                    {t(
                      'cookies.placeholders.map',
                      'Aby wyświetlić mapę, zaakceptuj treści zewnętrzne (Google Maps).'
                    )}
                  </p>
                  <button
                    type="button"
                    className={styles.mapConsentButton}
                    data-open-consent-settings
                    onClick={openConsentSettings}
                  >
                    {t('cookies.actions.openSettings', 'Ustawienia cookies')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={styles.copyrightSection}>
          <p>{t('footer.copy', { year: currentYear })}</p>
          <div className={styles.footerActions}>
            <a
              href="#"
              className={styles.policyLink}
              data-open-consent-settings
              onClick={(event) => {
                event.preventDefault();
                openConsentSettings();
              }}
            >
              {t('cookies.actions.openSettings', 'Ustawienia cookies')}
            </a>
            <span className={styles.actionSeparator} aria-hidden="true">|</span>
            <a href={privacyPolicyPath} className={styles.policyLink}>
              {t('cookies.actions.privacyPolicy', privacyPolicyFallbackByLang[activeLang])}
            </a>
            <span className={styles.actionSeparator} aria-hidden="true">|</span>
            <a href={cookiePolicyPath} className={styles.policyLink}>
              {t('cookies.actions.cookiePolicy', cookiePolicyFallbackByLang[activeLang])}
            </a>
            <span className={styles.actionSeparator} aria-hidden="true">|</span>
            <a href={sitemapPath} className={styles.policyLink}>
              {t('cookies.actions.sitemap', sitemapFallbackByLang[activeLang])}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;












