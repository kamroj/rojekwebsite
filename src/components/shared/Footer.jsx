import React from 'react';
import { useTranslation } from 'react-i18next';
import { FiPhone, FiMail } from 'react-icons/fi';
import { COMPANY } from '../../data/company.js';
import styles from './Footer.module.css';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

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
              <iframe
                src={mapSrc}
                title={t('contact.locationTitle')}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        <div className={styles.copyrightSection}>
          <p>{t('footer.copy', { year: currentYear })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


