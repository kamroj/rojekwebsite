// src/services/sanity/client.js
import { createClient } from '@sanity/client';
import { isSanityConfigured, sanityConfig } from './config';

let _client = null;

export const getSanityClient = () => {
  if (_client) return _client;
  if (!isSanityConfigured()) return null;

  // NOTE: Sanity public API does not allow CORS from localhost by default.
  // In the browser (DEV) we proxy requests through Astro/Vite (`/api/sanity`) to keep same-origin.
  // On the server (Astro SSR / build), CORS is not a problem, so we keep the default API host.
  const configForEnv = {
    ...sanityConfig,
    ...(import.meta.env.DEV && typeof window !== 'undefined'
      ? { apiHost: `${window.location.origin}/api/sanity` }
      : null),
  };

  _client = createClient(configForEnv);
  return _client;
};
