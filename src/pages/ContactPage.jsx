import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import styled from 'styled-components';
import ReCAPTCHA from 'react-google-recaptcha';
import Page from '../components/common/Page';
import Section from '../components/common/Section';
import { HeaderWrap, ProductHeader, ProductHeaderSubtitle } from './HomePage';

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
  padding: 12px 18px;
  background: #111827;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
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

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
  (import.meta.env.DEV ? '6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI' : '');

const ContactPage = () => {
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
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
      next.email = 'Adres email jest wymagany.';
    } else {
      // Prosta walidacja formatu email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        next.email = 'Podaj poprawny adres email.';
      }
    }
    // Message required
    if (!message.trim()) {
      next.message = 'Wiadomość jest wymagana.';
    }
    // reCAPTCHA required (v2 checkbox)
    if (!recaptchaToken) {
      next.recaptcha = 'Potwierdź reCAPTCHA.';
    }
    setErrors(next);
    return !next.email && !next.message && !next.recaptcha;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSent(false);
    if (!validate()) return;

    setSubmitting(true);
    try {
      // Tu można podpiąć faktyczną wysyłkę (EmailJS lub Twój endpoint API).
      // Na razie symulacja sukcesu:
      await new Promise((res) => setTimeout(res, 600));
      setSent(true);
      // Reset formularza i reCAPTCHA
      setName('');
      setEmail('');
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
          <ProductHeader>INFORMACJE KONTAKTOWE</ProductHeader>
          <ProductHeaderSubtitle>
            Masz jakieś pytania? Jesteśmy do twojej dyspozycji!
          </ProductHeaderSubtitle>
        </HeaderWrap>

        <ContactContainer>
          <FormWrap>
            <p>Skorzystaj z naszego formularza</p>

            <Form onSubmit={onSubmit} noValidate>
              <Field>
                <Label htmlFor="name">Imię</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </Field>

              <Field>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jan.kowalski@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  aria-invalid={!!errors.email}
                />
                {errors.email && <ErrorText>{errors.email}</ErrorText>}
              </Field>

              <Field>
                <Label htmlFor="message">Wiadomość *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Treść wiadomości..."
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
                  {submitting ? 'Wysyłanie...' : 'Wyślij'}
                </Button>
                {sent && <SuccessBox>Dziękujemy! Wiadomość została wysłana.</SuccessBox>}
              </SubmitRow>
            </Form>
          </FormWrap>
          <div style={{ marginTop: 24 }}>
            <p>Skontaktuj się z nami bezpośrednio</p>
            biuro@rojekoid.pl<br />
            +48 601 789 888<br />
            Kryspinów 399, 32-060 Kryspinów<br />
            NIP: 679-104-25-29<br />
            REGON: 356780524<br />
            Godziny otwarcia: Pon-Pt 8:00-16:00
          </div>
        </ContactContainer>
      </Section>
    </Page>
  );
};

export default ContactPage;
