import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';

// Netlify provides these environment variables:
// - URL: the primary site URL (production)
// - DEPLOY_PRIME_URL: deploy-preview / branch deploy URL
// - DEPLOY_URL: alias in some contexts
// We use them to set `site`, so Astro can generate absolute canonical/hreflang URLs.
const resolveSite = () => {
  const raw = process.env.URL || process.env.DEPLOY_PRIME_URL || process.env.DEPLOY_URL;
  if (raw) return raw;
  // Local fallback for dev/build outside Netlify
  return 'http://localhost:4321';
};

export default defineConfig({
  output: 'static',
  site: resolveSite(),
  image: {
    // Allow Astro's built-in image service to fetch/transform remote Sanity CDN images.
    // NOTE: Sanity image URLs are under https://cdn.sanity.io/images/<projectId>/<dataset>/...
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  // IMPORTANT:
  // - In local dev we DO NOT want Netlify's Vite middleware emulation, because it can serve
  //   built HTML from /dist (with /_astro asset links) and cause confusing 404s.
  // - On Netlify CI (process.env.NETLIFY === 'true') we enable the adapter.
  adapter: process.env.NETLIFY ? netlify() : undefined,
  integrations: [react(), sitemap()],

  // Dev proxy for Sanity API to avoid CORS when running locally.
  // Matches the previous Vite SPA setup (calls to `/api/sanity/*`).
  vite: {
    // In Astro dev we SSR-evaluate React islands in Node.
    // react-router-dom provides both CJS and ESM entries via `exports`.
    // We must ensure Vite picks the ESM entry (otherwise named imports like `useLocation`
    // can fail, or the CJS bundle may get evaluated as ESM and crash with `module is not defined`).
    resolve: {
      // Prefer ESM/browser conditions.
      // `module-sync` is important for packages (like react-router-dom) that ship
      // an ESM entry under `node.module-sync`, otherwise Vite SSR can fall back
      // to the CJS `node.default` entry and crash.
      conditions: ['module-sync', 'import', 'module', 'browser', 'default'],
    },
    ssr: {
      // Keep router packages bundled for SSR so Vite can normalize any remaining CJS interop.
      noExternal: ['react-router', 'react-router-dom'],
    },
    build: {
      // `three` is a large dependency even after code-splitting.
      // We keep the warning threshold slightly higher to avoid noisy build logs.
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        // Vite/Rollup can emit EMPTY_BUNDLE when a route results in a CSS-only entry.
        // This is harmless but noisy; we filter it out to keep CI logs clean.
        onwarn(warning, warn) {
          if (warning?.code === 'EMPTY_BUNDLE') return;
          warn(warning);
        },
        output: {
          // Improve chunking for the heavy HS configurator dependencies.
          // This reduces the likelihood of one gigantic chunk and improves browser caching.
          manualChunks(id) {
            if (!id) return;
            if (id.includes('node_modules')) {
              if (id.includes('node_modules/three')) return 'three';
              if (id.includes('node_modules/@react-three/fiber')) return 'r3f';
              if (id.includes('node_modules/@react-three/drei')) return 'drei';
            }
          },
        },
      },
    },
    server: {
      proxy: {
        '/api/sanity': {
          target: `https://${process.env.VITE_SANITY_PROJECT_ID || '6sp9tyie'}.api.sanity.io`,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/sanity/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
            });
          },
        },
      },
    },
  },
});
