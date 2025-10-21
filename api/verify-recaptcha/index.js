const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || '*';

module.exports = async function (context, req) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST,OPTIONS',
  };

  if (req.method === 'OPTIONS') {
    context.res = {
      status: 200,
      headers: corsHeaders,
    };
    return;
  }

  if (req.method !== 'POST') {
    context.res = {
      status: 405,
      headers: corsHeaders,
      body: { success: false, error: 'method-not-allowed' },
    };
    return;
  }

  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: { success: false, error: 'missing-secret' },
    };
    return;
  }

  const token = (req.body && req.body.token) || null;
  if (!token) {
    context.res = {
      status: 400,
      headers: corsHeaders,
      body: { success: false, error: 'missing-token' },
    };
    return;
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const fwd =
      (req.headers &&
        (req.headers['x-forwarded-for'] ||
          req.headers['x-client-ip'] ||
          req.headers['client-ip'])) ||
      '';
    const remoteip = String(fwd).split(',')[0].trim();
    if (remoteip) params.append('remoteip', remoteip);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      body: params,
    });

    const data = await res.json();
    context.res = {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body: { ...data, success: !!data.success },
    };
  } catch (err) {
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: { success: false, error: 'verify-error', detail: String(err) },
    };
  }
};
