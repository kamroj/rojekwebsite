const LOCAL_SITE_URL = 'http://localhost:4321';
const PROD_SITE_URL = 'https://rojekokna.pl';

function normalizeSiteUrl(value) {
  if (!value || typeof value !== 'string') return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    parsed.pathname = '/';
    parsed.search = '';
    parsed.hash = '';
    return parsed.toString().replace(/\/$/, '');
  } catch {
    return null;
  }
}

export function resolveSiteUrl({ command } = {}) {
  const fromEnv = normalizeSiteUrl(process.env.SITE_URL);
  if (fromEnv) return fromEnv;

  const isNetlify = Boolean(process.env.NETLIFY);
  const netlifyContext = process.env.CONTEXT;

  if (isNetlify) {
    if (netlifyContext === 'production') {
      return PROD_SITE_URL;
    }

    const previewHost =
      normalizeSiteUrl(process.env.DEPLOY_PRIME_URL) ||
      normalizeSiteUrl(process.env.DEPLOY_URL) ||
      normalizeSiteUrl(process.env.URL);

    if (previewHost) return previewHost;
  }

  if (command === 'dev' || process.env.NODE_ENV === 'development') {
    return LOCAL_SITE_URL;
  }

  return PROD_SITE_URL;
}
