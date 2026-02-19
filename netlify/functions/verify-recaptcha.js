const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'method-not-allowed' }),
    };
  }

  const secret = process.env.RECAPTCHA_SECRET;
  console.info('[reCAPTCHA debug][function] invoke', {
    method: event.httpMethod,
    hasSecret: Boolean(secret),
    hasBody: Boolean(event.body),
  });

  if (!secret) {
    console.warn('[reCAPTCHA debug][function] missing RECAPTCHA_SECRET');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'missing-secret' }),
    };
  }

  let token;
  try {
    const body = JSON.parse(event.body || '{}');
    token = body.token;
    console.info('[reCAPTCHA debug][function] parsed body', {
      hasToken: Boolean(token),
    });
  } catch {
    console.warn('[reCAPTCHA debug][function] invalid JSON body');
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'invalid-json' }),
    };
  }

  if (!token) {
    console.warn('[reCAPTCHA debug][function] missing token in request');
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'missing-token' }),
    };
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const fwd = event.headers['x-forwarded-for'] || event.headers['client-ip'] || '';
    const remoteip = fwd.split(',')[0].trim();
    if (remoteip) params.append('remoteip', remoteip);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params,
    });

    const data = await res.json();
    console.info('[reCAPTCHA debug][function] google verify response', {
      success: Boolean(data?.success),
      errorCodes: data?.['error-codes'] || null,
      hostname: data?.hostname || null,
    });
    // Always return 200, but indicate success in body
    return {
      statusCode: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, success: !!data.success }),
    };
  } catch (err) {
    console.error('[reCAPTCHA debug][function] verify error', String(err));
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'verify-error', detail: String(err) }),
    };
  }
};
