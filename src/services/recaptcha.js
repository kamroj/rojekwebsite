export async function verifyRecaptcha(token) {
  const maskToken = (value) => {
    if (!value) return '';
    if (value.length <= 16) return `${value.slice(0, 4)}...`;
    return `${value.slice(0, 8)}...${value.slice(-6)}`;
  };

  if (!token) return { ok: false, error: 'missing-token' };

  console.info('[reCAPTCHA debug][service] verifyRecaptcha called', {
    hasToken: Boolean(token),
    tokenMasked: maskToken(token),
  });

  const payload = { token };
  // Netlify Functions
  const endpoints = ['/.netlify/functions/verify-recaptcha'];

  for (let i = 0; i < endpoints.length; i += 1) {
    const url = endpoints[i];
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
      });

      // If this endpoint isn&#39;t present in this hosting setup, continue to next
      if (res.status === 404) {
        console.warn('[reCAPTCHA debug][service] endpoint not found', { url, status: res.status });
        continue;
      }

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        console.warn('[reCAPTCHA debug][service] endpoint returned non-ok', {
          url,
          status: res.status,
          detail: text,
        });
        return { ok: false, error: `bad-status:${res.status}`, detail: text };
      }

      const data = await res.json();
      console.info('[reCAPTCHA debug][service] endpoint response', {
        url,
        success: Boolean(data && data.success),
        errorCodes: data?.['error-codes'] || null,
      });
      if (data && data.success) {
        return { ok: true, data };
      }
      // Endpoint is present but verification failed - do not try others
      return { ok: false, error: 'verification-failed', data };
    } catch (err) {
      console.warn('[reCAPTCHA debug][service] network error', {
        url,
        error: String(err),
      });
      // Network error - try next endpoint, or return error if none left
      if (i === endpoints.length - 1) {
        return { ok: false, error: 'network-error', detail: String(err) };
      }
    }
  }

  console.warn('[reCAPTCHA debug][service] no endpoint available');
  return { ok: false, error: 'no-endpoint' };
}
