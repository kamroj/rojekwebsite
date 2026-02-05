// src/services/sanity/image.js
// NOTE: This file must be safe to run both during SSR (Astro build/dev)
// and in the browser (React hydration).
//
// We intentionally DO NOT depend on `getSanityClient()` here.
// `getSanityClient()` has environment-dependent config (dev proxy via apiHost),
// and if the client is not configured yet during hydration it can return null.
// That led to hydration mismatches where SSR generated `srcSet/sizes` but the client
// fell back to raw `asset.url` without `srcSet`.
//
// The Sanity image URL builder only needs `{projectId, dataset}` to generate CDN URLs,
// so we build it directly from sanityConfig to keep it deterministic.

import { createImageUrlBuilder } from '@sanity/image-url';
import { isSanityConfigured, sanityConfig } from './config';

let _builder = null;

/**
 * Fallback for client-side bundles where `import.meta.env.VITE_SANITY_*` may be undefined.
 * In Astro, only `PUBLIC_*` env vars are guaranteed to be available in browser code.
 *
 * We can still build correct transform URLs if we can derive `{projectId, dataset}`
 * from an existing asset URL:
 *   https://cdn.sanity.io/images/<projectId>/<dataset>/<filename>...jpg
 */
const getProjectAndDatasetFromAssetUrl = (url) => {
  if (!url || typeof url !== 'string') return null;
  const m = url.match(/^https?:\/\/cdn\.sanity\.io\/images\/([^/]+)\/([^/]+)\//);
  if (!m) return null;
  return { projectId: m[1], dataset: m[2] };
};

const getBuilderOptionsFromSource = (source) => {
  // Prefer explicit env config (SSR/build time, and dev server).
  if (isSanityConfigured()) {
    return { projectId: sanityConfig.projectId, dataset: sanityConfig.dataset };
  }

  // Fallback: parse from asset url.
  const assetUrl = source?.asset?.url;
  return getProjectAndDatasetFromAssetUrl(assetUrl);
};

const getBuilder = () => {
  if (_builder) return _builder;

  const opts = getBuilderOptionsFromSource(null);
  if (!opts?.projectId || !opts?.dataset) return null;

  _builder = createImageUrlBuilder(opts);

  return _builder;
};

export const urlForImage = (source) => {
  if (!source) return null;
  // Important: in the browser, env vars might be missing; build a per-source builder.
  // We still keep a global cached builder for the normal (configured) case.
  const cached = getBuilder();
  if (cached) return cached.image(source);

  const opts = getBuilderOptionsFromSource(source);
  if (!opts?.projectId || !opts?.dataset) return null;

  return createImageUrlBuilder(opts).image(source);
};




