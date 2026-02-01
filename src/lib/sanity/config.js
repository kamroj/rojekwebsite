// src/services/sanity/config.js

export const sanityConfig = {
  projectId: import.meta.env.VITE_SANITY_PROJECT_ID,
  dataset: import.meta.env.VITE_SANITY_DATASET,
  apiVersion: import.meta.env.VITE_SANITY_API_VERSION || '2025-01-01',
  // In development we want instant updates after publish (avoid CDN caching).
  useCdn: !import.meta.env.DEV,
};

export const isSanityConfigured = () => {
  return Boolean(sanityConfig.projectId && sanityConfig.dataset);
};
