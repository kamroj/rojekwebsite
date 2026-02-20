const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

const getCorsHeaders = () => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
});

const isValidEmail = (value = '') => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalize = (value, fallback = '') => {
  if (typeof value !== 'string') return fallback;
  return value.trim();
};

const detectLocale = ({ locale, pageUrl }) => {
  const normalizedLocale = normalize(locale).toLowerCase();
  if (normalizedLocale.startsWith('de')) return 'de';
  if (normalizedLocale.startsWith('en')) return 'en';
  if (normalizedLocale.startsWith('pl')) return 'pl';

  const normalizedPageUrl = normalize(pageUrl).toLowerCase();
  if (normalizedPageUrl.includes('/de/')) return 'de';
  if (normalizedPageUrl.includes('/en/')) return 'en';

  return 'pl';
};

const getAutoReplyTemplate = (locale) => {
  const templates = {
    pl: {
      subject: 'Potwierdzenie otrzymania wiadomości',
      body: [
        'Szanowni Państwo,',
        '',
        'dziękujemy za kontakt z firmą ROJEK Okna i Drzwi.',
        '',
        'Potwierdzamy otrzymanie Państwa wiadomości. Odpowiemy na nią najszybciej, jak to możliwe, zwykle w ciągu jednego dnia roboczego.',
        '',
        'Prosimy nie odpowiadać na tę wiadomość, ponieważ została wygenerowana automatycznie.',
        '',
        'W przypadku pilnych spraw zachęcamy do kontaktu telefonicznego. Numer telefonu znajdą Państwo na stronie: www.rojekokna.pl/kontakt',
        '',
        'Z poważaniem,',
        'ROJEK Okna i Drzwi',
        'www.rojekokna.pl',
      ].join('\n'),
    },
    en: {
      subject: 'Confirmation of receiving your message',
      body: [
        'Dear Sir or Madam,',
        '',
        'thank you for contacting ROJEK Okna i Drzwi.',
        '',
        'We confirm that we have received your message. We will reply as soon as possible, usually within one business day.',
        '',
        'Please do not reply to this message, as it was generated automatically.',
        '',
        'For urgent matters, we encourage you to contact us by phone. You can find our phone number at: www.rojekokna.pl/en/contact',
        '',
        'Best regards,',
        'ROJEK Okna i Drzwi',
        'www.rojekokna.pl',
      ].join('\n'),
    },
    de: {
      subject: 'Bestätigung des Eingangs Ihrer Nachricht',
      body: [
        'Sehr geehrte Damen und Herren,',
        '',
        'vielen Dank für Ihre Kontaktaufnahme mit ROJEK Okna i Drzwi.',
        '',
        'Wir bestätigen den Eingang Ihrer Nachricht. Wir werden Ihnen so schnell wie möglich antworten, in der Regel innerhalb eines Werktages.',
        '',
        'Bitte antworten Sie nicht auf diese Nachricht, da sie automatisch erstellt wurde.',
        '',
        'In dringenden Fällen empfehlen wir Ihnen, uns telefonisch zu kontaktieren. Unsere Telefonnummer finden Sie unter: www.rojekokna.pl/de/kontakt',
        '',
        'Mit freundlichen Grüßen,',
        'ROJEK Okna i Drzwi',
        'www.rojekokna.pl',
      ].join('\n'),
    },
  };

  return templates[locale] || templates.pl;
};

const stripHeaderBreaks = (value = '') => value.replace(/[\r\n]+/g, ' ').trim();

const sendViaResend = async ({ apiKey, from, to, subject, text, replyTo }) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      text,
      reply_to: replyTo,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Resend error: ${res.status} ${detail}`.trim());
  }

  return res.json().catch(() => ({}));
};

exports.handler = async (event) => {
  const corsHeaders = getCorsHeaders();

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'method-not-allowed' }),
    };
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const contactFromEmail = process.env.CONTACT_FROM_EMAIL;
  const contactToEmail = process.env.CONTACT_TO_EMAIL;

  if (!resendApiKey || !contactFromEmail || !contactToEmail) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'missing-email-config' }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'invalid-json' }),
    };
  }

  const name = normalize(payload.name);
  const email = normalize(payload.email).toLowerCase();
  const phone = normalize(payload.phone, 'brak');
  const message = normalize(payload.message);
  const locale = detectLocale({ locale: payload.locale, pageUrl: payload.pageUrl });

  if (!name || !email || !message) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'missing-required-fields' }),
    };
  }

  if (!isValidEmail(email)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'invalid-email' }),
    };
  }

  const safeName = stripHeaderBreaks(name);

  const leadSubject = `[rojekokna.pl] Nowe zapytanie kontaktowe – ${safeName}`;
  const leadBody = [
    'Nowe zapytanie z formularza kontaktowego.',
    '',
    `Imię i nazwisko: ${name}`,
    `E-mail: ${email}`,
    `Telefon: ${phone || 'brak'}`,
    '',
    'Wiadomość:',
    message,
  ].join('\n');

  const autoReplyTemplate = getAutoReplyTemplate(locale);
  const autoReplySubject = autoReplyTemplate.subject;
  const autoReplyBody = autoReplyTemplate.body;

  try {
    const leadResult = await sendViaResend({
      apiKey: resendApiKey,
      from: contactFromEmail,
      to: contactToEmail,
      subject: leadSubject,
      text: leadBody,
      replyTo: email,
    });

    let autoReplySent = true;
    try {
      await sendViaResend({
        apiKey: resendApiKey,
        from: contactFromEmail,
        to: email,
        subject: autoReplySubject,
        text: autoReplyBody,
        replyTo: contactToEmail,
      });
    } catch (autoReplyError) {
      autoReplySent = false;
      console.warn('Auto-reply send failed:', autoReplyError);
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        leadId: leadResult?.id,
        autoReplySent,
      }),
    };
  } catch (error) {
    console.error('Contact email send failed:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'send-failed' }),
    };
  }
};
