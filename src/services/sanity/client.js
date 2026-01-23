// src/services/sanity/client.js
import { createClient } from '@sanity/client';
import { isSanityConfigured, sanityConfig } from './config';

let _client = null;

export const getSanityClient = () => {
  if (_client) return _client;
  if (!isSanityConfigured()) return null;

  // NOTE: Sanity public API does not allow CORS from localhost by default.
  // In dev we proxy requests through Vite (`/api/sanity`) to keep same-origin.
  const configForEnv = {
    ...sanityConfig,
    ...(import.meta.env.DEV
      ? {
          apiHost:
            typeof window !== 'undefined'
              ? `${window.location.origin}/api/sanity`
              : 'http://localhost:5173/api/sanity',
        }
      : null),
  };

  _client = createClient(configForEnv);
  return _client;
};
