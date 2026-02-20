import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import { FiSend } from 'react-icons/fi';
import Page from '../components/ui/Page';
import Section from '../components/ui/Section';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomeView';
import { verifyRecaptcha } from '../services/recaptcha';
import { hasConsent, onConsentChange, openConsentSettings } from '../lib/consent/browser.js';

import styles from './ContactView.module.css';

const MailIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2"></rect>
    <path d="M3 7l9 6 9-6"></path>
  </svg>
);

const PhoneIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92V21a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 1 4.18 2 2 0 0 1 3 2h4a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.45-1.45a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const LocationIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const IdIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="14" rx="2"></rect>
    <circle cx="8.5" cy="11" r="2"></circle>
    <path d="M13 8h5M13 12h5"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9"></circle>
    <path d="M12 7v5l3 3"></path>
  </svg>
);

const DEV_RECAPTCHA_SITE_KEY = '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI';

// NOTE: This view is used in two modes:
// - SPA mode (React Router): rendered as a full page with <Page /> wrapper.
// - SSG mode (Astro): rendered as a small island (just the form), with the outer
//   layout provided by `ContactPageSsg.astro`.
//
// Because Astro islands spread props (`<View {...viewProps} />`), it's easy to
// accidentally pass `ssgMode` at the top-level instead of inside `viewProps`.
// To be resilient, we support BOTH shapes.
const ContactPage = (props = {}) => {
  const { viewProps, ssgMode, hideDirectCard, recaptchaSiteKey } = props;
  const { t, i18n } = useTranslation();

  const envRecaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
  const effectiveRecaptchaSiteKey =
    viewProps?.recaptchaSiteKey ||
    recaptchaSiteKey ||
    envRecaptchaSiteKey ||
    (import.meta.env.DEV ? DEV_RECAPTCHA_SITE_KEY : '');
  const recaptchaEnabled = Boolean(effectiveRecaptchaSiteKey);

  // `react-google-recaptcha` is browser-only (touches `window` / DOM).
  // To keep the Contact page SSR-friendly (SEO), we lazy-load it on the client.
  const [RecaptchaComponent, setRecaptchaComponent] = useState(null);
  const [securityConsent, setSecurityConsent] = useState(false);

  useEffect(() => {
    setSecurityConsent(hasConsent('security'));
    const unsubscribe = onConsentChange((detail) => {
      const next = detail?.consents?.security;
      setSecurityConsent(typeof next === 'boolean' ? next : hasConsent('security'));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!securityConsent) {
      setRecaptchaToken(null);
      setRecaptchaComponent(null);
      return;
    }

    let mounted = true;
    import('react-google-recaptcha')
      .then((m) => {
        if (!mounted) return;
        // Store as component type
        setRecaptchaComponent(() => m.default);
      })
      .catch((e) => {
        console.warn('Failed to load ReCAPTCHA component', e);
      });
    return () => {
      mounted = false;
    };
  }, [securityConsent]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', message: '', recaptcha: '', submit: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const forceSuccessPreview = false;
  const forceErrorPreview = false;

  const validate = () => {
    const next = { name: '', email: '', message: '', recaptcha: '', submit: '' };
    if (!name.trim()) {
      next.name = t('contactPage.errors.nameRequired', 'Imię i nazwisko jest wymagane.');
    }
    if (!email.trim()) {
      next.email = t('contactPage.errors.emailRequired');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        next.email = t('contactPage.errors.emailInvalid');
      }
    }
    if (!message.trim()) {
      next.message = t('contactPage.errors.messageRequired');
    }
    if (!securityConsent) {
      next.recaptcha = t('cookies.placeholders.recaptcha', 'Aby wysłać formularz, zaakceptuj usługę bezpieczeństwa (reCAPTCHA).');
    } else if (!recaptchaEnabled) {
      next.recaptcha = t('contactPage.errors.recaptchaMissing', 'ReCAPTCHA nie jest skonfigurowana.');
    } else if (!RecaptchaComponent) {
      next.recaptcha = t('contactPage.errors.recaptchaLoading', 'Ładowanie reCAPTCHA...');
    } else if (!recaptchaToken) {
      next.recaptcha = t('contactPage.errors.recaptchaRequired');
    }
    setErrors(next);
    return !next.name && !next.email && !next.message && !next.recaptcha;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSent(false);
    if (!validate()) return;

    const v = await verifyRecaptcha(recaptchaToken);
    if (!v.ok) {
      setErrors((p) => ({ ...p, recaptcha: t('contactPage.errors.recaptchaInvalid', 'Weryfikacja reCAPTCHA nie powiodła się') }));
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setRecaptchaToken(null);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/.netlify/functions/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          locale: i18n?.resolvedLanguage || i18n?.language || '',
          pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        }),
      });

      if (!res.ok) {
        throw new Error(`send-failed:${res.status}`);
      }

      const data = await res.json().catch(() => ({}));
      if (!data.success) {
        throw new Error('send-failed');
      }

      setSent(true);
      // Reset formularza i reCAPTCHA
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setRecaptchaToken(null);
      setErrors({ name: '', email: '', message: '', recaptcha: '', submit: '' });
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } catch {
      setErrors((p) => ({
        ...p,
        submit: t('contactPage.errors.sendFailed', 'Nie udało się wysłać wiadomości. Spróbuj ponownie.'),
      }));
    } finally {
      setSubmitting(false);
    }
  };

  const isSsgMode = !!(viewProps?.ssgMode || ssgMode);
  const showDirectCard = !(viewProps?.hideDirectCard || hideDirectCard);

  // In SSG mode (Astro page), the outer layout (header + two-column container)
  // is rendered in `ContactPageSsg.astro`. This React island should render ONLY
  // the form content, otherwise we end up with nested containers/sections and the
  // layout breaks on desktop/mobile.
  const renderForm = () => (
    <>
      <p>{t('contactPage.form.useForm')}</p>

      <form className={styles.form} onSubmit={onSubmit} noValidate>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="name">{t('contactPage.form.nameLabel')}</label>
          <input
            className={styles.input}
            id="name"
            name="name"
            type="text"
            placeholder={t('contactPage.form.namePlaceholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            aria-invalid={!!errors.name}
          />
          {errors.name && <div className={styles.errorText}>{errors.name}</div>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">{t('contactPage.form.emailLabel')} *</label>
          <input
            className={styles.input}
            id="email"
            name="email"
            type="email"
            placeholder={t('contactPage.form.emailPlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            aria-invalid={!!errors.email}
          />
          {errors.email && <div className={styles.errorText}>{errors.email}</div>}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="phone">{t('contactPage.form.phoneLabel')}</label>
          <input
            className={styles.input}
            id="phone"
            name="phone"
            type="tel"
            placeholder={t('contactPage.form.phonePlaceholder')}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            inputMode="tel"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="message">{t('contactPage.form.messageLabel')} *</label>
          <textarea
            className={styles.textarea}
            id="message"
            name="message"
            placeholder={t('contactPage.form.messagePlaceholder')}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            aria-invalid={!!errors.message}
          />
          {errors.message && <div className={styles.errorText}>{errors.message}</div>}
        </div>

        <div className={styles.field}>
          {!securityConsent ? (
            <div className={styles.recaptchaPlaceholder} role="note">
              <p>
                {t(
                  'cookies.placeholders.recaptcha',
                  'Aby wysłać formularz, zaakceptuj usługę bezpieczeństwa (reCAPTCHA).'
                )}
              </p>
              <button
                type="button"
                className={styles.recaptchaConsentButton}
                data-open-consent-settings
                onClick={openConsentSettings}
              >
                {t('cookies.actions.openSettings', 'Ustawienia cookies')}
              </button>
            </div>
          ) : RecaptchaComponent && recaptchaEnabled ? (
            <RecaptchaComponent
              ref={recaptchaRef}
              sitekey={effectiveRecaptchaSiteKey}
              onChange={(token) => {
                setRecaptchaToken(token);
                if (errors.recaptcha) setErrors((p) => ({ ...p, recaptcha: '' }));
              }}
            />
          ) : !recaptchaEnabled ? (
            <div className={styles.recaptchaPlaceholder} role="note">
              {t('contactPage.errors.recaptchaMissing', 'ReCAPTCHA nie jest skonfigurowana.')}
            </div>
          ) : (
            // SSR placeholder – prevents layout shift.
            <div style={{ height: 78 }} aria-hidden="true" />
          )}
          {errors.recaptcha && <div className={styles.errorText}>{errors.recaptcha}</div>}
        </div>

        <div className={styles.submitRow}>
          <button className={styles.button} type="submit" disabled={submitting || !recaptchaEnabled || !securityConsent}>
            <FiSend aria-hidden="true" />
            {submitting ? t('contactPage.actions.sending') : t('contactPage.actions.send')}
          </button>
          {(errors.submit || forceErrorPreview) && (
            <div className={styles.errorBox} role="alert">
              {errors.submit || t('contactPage.errors.sendFailed', 'Nie udało się wysłać wiadomości. Spróbuj ponownie.')}
            </div>
          )}
          {(sent || forceSuccessPreview) && (
            <div className={styles.successBox} role="status">
              {t('contactPage.success')}
            </div>
          )}
        </div>
      </form>

      <p className={styles.formInfo}>
        {t('contactPage.gdpr.notice')}
      </p>
    </>
  );

  return (
    <>
      {!isSsgMode && (
        <Page imageSrc="/images/contactus/top.jpg" title={t('pageTitle.contact', 'Kontakt')}>
      <Section>
        <HeaderWrap>
          <ProductHeader>{t('contactPage.header.title')}</ProductHeader>
          <ProductHeaderSubtitle>
            {t('contactPage.header.subtitle')}
          </ProductHeaderSubtitle>
        </HeaderWrap>

        <div className={styles.contactContainer}>
          <div className={styles.formWrap}>
            {renderForm()}
          </div>
          {showDirectCard && (
            <div className={styles.directCard} style={{ marginTop: 24 }}>
              <p>{t('contactPage.direct.header')}</p>

              <ul className={styles.contactList}>
                <li className={styles.contactItem}>
                  <span className={styles.iconWrap} aria-hidden="true"><MailIcon /></span>
                  <div className={styles.contactDetails}>
                    <span className={styles.contactLabel}>{t('contact.email')}</span>
                    <a className={styles.contactLink} href={`mailto:${t('contactPage.direct.values.email')}`}>{t('contactPage.direct.values.email')}</a>
                  </div>
                </li>

                <li className={styles.contactItem}>
                  <span className={styles.iconWrap} aria-hidden="true"><PhoneIcon /></span>
                  <div className={styles.contactDetails}>
                    <span className={styles.contactLabel}>{t('contact.phone')}</span>
                    <a className={styles.contactLink} href={`tel:${t('contactPage.direct.values.phone').replace(/\s/g, '')}`}>{t('contactPage.direct.values.phone')}</a>
                  </div>
                </li>

                <li className={styles.contactItem}>
                  <span className={styles.iconWrap} aria-hidden="true"><LocationIcon /></span>
                  <div className={styles.contactDetails}>
                    <span className={styles.contactLabel}>{t('contact.address')}</span>
                    <span className={styles.contactText}>{t('contactPage.direct.values.address')}</span>
                  </div>
                </li>

                <li className={styles.contactItem}>
                  <span className={styles.iconWrap} aria-hidden="true"><IdIcon /></span>
                  <div className={styles.contactDetails}>
                    <span className={styles.contactLabel}>{t('contactPage.direct.labels.registrationData')}</span>
                    <span className={styles.contactText}>{t('contactPage.direct.values.nip')}</span>
                    <span className={styles.contactText}>{t('contactPage.direct.values.regon')}</span>
                  </div>
                </li>

                <li className={styles.contactItem}>
                  <span className={styles.iconWrap} aria-hidden="true"><ClockIcon /></span>
                  <div className={styles.contactDetails}>
                    <span className={styles.contactLabel}>{t('contact.hours')}</span>
                    <span className={styles.contactText}>{t('contactPage.direct.values.hours')}</span>
                  </div>
                </li>
              </ul>
            </div>
          )}
        </div>
      </Section>
        </Page>
      )}

      {isSsgMode && (
        <>
          {renderForm()}
        </>
      )}
    </>
  );
};

export default ContactPage;
