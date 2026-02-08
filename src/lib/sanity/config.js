// src/services/sanity/config.js

export const sanityConfig = {
  // Fallback defaults keep frontend Sanity-enabled even if env vars
  // are not injected into a given client build/runtime context.
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID || '6sp9tyie',
  dataset: import.meta.env.VITE_SANITY_DATASET || 'production',
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2025-01-01',
  // In development we want instant updates after publish (avoid CDN caching).
  useCdn: !import.meta.env.DEV,
};

export const isSanityConfigured = () => {
  return Boolean(sanityConfig.projectId && sanityConfig.dataset);
};
