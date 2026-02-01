export async function verifyRecaptcha(token) {
  if (!token) return { ok: false, error: 'missing-token' };

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
      if (res.status === 404) continue;

      if (!res.ok) {
        const text = await res.text().catch(() => '');
        return { ok: false, error: `bad-status:${res.status}`, detail: text };
      }

      const data = await res.json();
      if (data && data.success) {
        return { ok: true, data };
      }
      // Endpoint is present but verification failed - do not try others
      return { ok: false, error: 'verification-failed', data };
    } catch (err) {
      // Network error - try next endpoint, or return error if none left
      if (i === endpoints.length - 1) {
        return { ok: false, error: 'network-error', detail: String(err) };
      }
    }
  }

  return { ok: false, error: 'no-endpoint' };
}
