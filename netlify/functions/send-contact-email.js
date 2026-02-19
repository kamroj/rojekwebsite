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

  const autoReplySubject = 'Potwierdzenie otrzymania wiadomości';
  const autoReplyBody = [
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
  ].join('\n');

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
