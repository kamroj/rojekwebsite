import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import ReCAPTCHA from 'react-google-recaptcha';
import Page from '../components/common/Page';
import Section from '../components/common/Section';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomePage';
import { verifyRecaptcha } from '../services/recaptcha';

const ContactContainer = styled.div`
  display: flex;
  width: 100%;
  gap: 36px;
  margin-top: 24px;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

const FormWrap = styled.div`
  max-width: 700px;
  width: 100%;
`;

const Form = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.label`
  font-weight: 400;
`;

const Input = styled.input`
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.2s ease;
  &:focus {
    border-color: #94a3b8;
  }
  &::placeholder {
    color: #9ca3afb7;
    font-weight: 100;
  }
`;

const Textarea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 16px;
  font-family: inherit;
  min-height: 140px;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;
  &:focus {
    border-color: #94a3b8;
  }
  &::placeholder {
    color: #9ca3afb7;
    font-weight: 400;
  }
`;

const ErrorText = styled.div`
  color: #a82218;
  font-size: 0.9rem;
`;

const SubmitRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Button = styled.button`
  align-self: flex-start;
  padding: 12px 32px;
  background: #004710;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 400;
  transition: transform 0.06s ease, opacity 0.2s ease;
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  &:active {
    transform: scale(0.98);
  }
`;

const SuccessBox = styled.div`
  background: #ecfdf3;
  border: 1px solid #abefc6;
  color: #067647;
  padding: 12px;
  border-radius: 8px;
`;

const FormInfo = styled.p`
  margin-top: 16px;
  font-size: 0.9rem;
  color: #6b7280;
`;

const DirectCard = styled.div`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  flex: 1;
  background: #fcfcfc;
  border: 1px solid #006326;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.04);
  height: fit-content;

  &::after {
    content: '';
    position: absolute;
    right: 12px;
    bottom: 12px;
    width: 180px;
    height: 180px;
    background: url('/images/phone.png') no-repeat center / contain;
    opacity: 0.5;
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    width: 100%;
    &::after {
      width: 120px;
      height: 120px;
      right: 8px;
      bottom: 8px;
    }
  }
`;

const ContactList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContactItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

const IconWrap = styled.span`
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #003d16;
`;

const ContactDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ContactLabel = styled.span`
  font-size: 12px;
  color: #595f6b;
`;

const ContactLink = styled.a`
  color: #111827;
  text-decoration: none;
  font-weight: 400;
  &:hover {
    text-decoration: underline;
  }
`;

const ContactText = styled.span`
  color: #111827;
`;

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

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
  (import.meta.env.DEV ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : '');

const ContactPage = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', message: '', recaptcha: '' });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);

  const validate = () => {
    const next = { email: '', message: '', recaptcha: '' };
    // Email required
    if (!email.trim()) {
      next.email = t('contactPage.errors.emailRequired');
    } else {
      // Prosta walidacja formatu email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        next.email = t('contactPage.errors.emailInvalid');
      }
    }
    // Message required
    if (!message.trim()) {
      next.message = t('contactPage.errors.messageRequired');
    }
    // reCAPTCHA required (v2 checkbox)
    if (!recaptchaToken) {
      next.recaptcha = t('contactPage.errors.recaptchaRequired');
    }
    setErrors(next);
    return !next.email && !next.message && !next.recaptcha;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSent(false);
    if (!validate()) return;

    // Server-side verify reCAPTCHA before submitting
    const v = await verifyRecaptcha(recaptchaToken);
    if (!v.ok) {
      setErrors((p) => ({ ...p, recaptcha: t('contactPage.errors.recaptchaInvalid', 'Weryfikacja reCAPTCHA nie powiodła się') }));
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setRecaptchaToken(null);
      return;
    }

    setSubmitting(true);
    try {
      // Tu można podpiąć faktyczną wysyłkę (EmailJS lub Twój endpoint API).
      // Na razie symulacja sukcesu:
      await new Promise((res) => setTimeout(res, 600));
      setSent(true);
      // Reset formularza i reCAPTCHA
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setRecaptchaToken(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } catch {
      // Obsłuż ewentualny błąd wysyłki (toast/komunikat)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page imageSrc="/images/company/company-top.jpg" title={t('pageTitle.contact', 'Kontakt')}>
      <Section>
        <HeaderWrap>
          <ProductHeader>{t('contactPage.header.title')}</ProductHeader>
          <ProductHeaderSubtitle>
            {t('contactPage.header.subtitle')}
          </ProductHeaderSubtitle>
        </HeaderWrap>

        <ContactContainer>
          <FormWrap>
            <p>{t('contactPage.form.useForm')}</p>

            <Form onSubmit={onSubmit} noValidate>
              <Field>
                <Label htmlFor="name">{t('contactPage.form.nameLabel')}</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder={t('contactPage.form.namePlaceholder')}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </Field>

              <Field>
                <Label htmlFor="email">{t('contactPage.form.emailLabel')} *</Label>
                <Input
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
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </Field>

              <Field>
                <Label htmlFor="phone">{t('contactPage.form.phoneLabel')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t('contactPage.form.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  inputMode="tel"
                />
              </Field>

              <Field>
                <Label htmlFor="message">{t('contactPage.form.messageLabel')} *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder={t('contactPage.form.messagePlaceholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  aria-invalid={!!errors.message}
                />
                {errors.message && <ErrorText>{errors.message}</ErrorText>}
              </Field>

              <Field>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(token) => {
                    setRecaptchaToken(token);
                    if (errors.recaptcha) setErrors((p) => ({ ...p, recaptcha: '' }));
                  }}
                />
                {errors.recaptcha && <ErrorText>{errors.recaptcha}</ErrorText>}
              </Field>

              <SubmitRow>
                <Button type="submit" disabled={submitting}>
                  {submitting ? t('contactPage.actions.sending') : t('contactPage.actions.send')}
                </Button>
                {sent && <SuccessBox>{t('contactPage.success')}</SuccessBox>}
              </SubmitRow>
            </Form>

            <FormInfo>
              {t('contactPage.gdpr.notice')}
            </FormInfo>
          </FormWrap>
          <DirectCard style={{ marginTop: 24 }}>
            <p>{t('contactPage.direct.header')}</p>

            <ContactList>
              <ContactItem>
                <IconWrap aria-hidden="true"><MailIcon /></IconWrap>
                <ContactDetails>
                  <ContactLabel>{t('contact.email')}</ContactLabel>
                  <ContactLink href={`mailto:${t('contactPage.direct.values.email')}`}>{t('contactPage.direct.values.email')}</ContactLink>
                </ContactDetails>
              </ContactItem>

              <ContactItem>
                <IconWrap aria-hidden="true"><PhoneIcon /></IconWrap>
                <ContactDetails>
                  <ContactLabel>{t('contact.phone')}</ContactLabel>
                  <ContactLink href={`tel:${t('contactPage.direct.values.phone').replace(/\s/g, '')}`}>{t('contactPage.direct.values.phone')}</ContactLink>
                </ContactDetails>
              </ContactItem>

              <ContactItem>
                <IconWrap aria-hidden="true"><LocationIcon /></IconWrap>
                <ContactDetails>
                  <ContactLabel>{t('contact.address')}</ContactLabel>
                  <ContactText>{t('contactPage.direct.values.address')}</ContactText>
                </ContactDetails>
              </ContactItem>

              <ContactItem>
                <IconWrap aria-hidden="true"><IdIcon /></IconWrap>
                <ContactDetails>
                  <ContactLabel>{t('contactPage.direct.labels.registrationData')}</ContactLabel>
                  <ContactText>{t('contactPage.direct.values.nip')}</ContactText>
                  <ContactText>{t('contactPage.direct.values.regon')}</ContactText>
                </ContactDetails>
              </ContactItem>

              <ContactItem>
                <IconWrap aria-hidden="true"><ClockIcon /></IconWrap>
                <ContactDetails>
                  <ContactLabel>{t('contact.hours')}</ContactLabel>
                  <ContactText>{t('contactPage.direct.values.hours')}</ContactText>
                </ContactDetails>
              </ContactItem>
            </ContactList>
          </DirectCard>
        </ContactContainer>
      </Section>
    </Page>
  );
};

export default ContactPage;
