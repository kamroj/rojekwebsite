import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import { resolveSiteUrl } from './scripts/resolve-site-url.js';

const command = process.env.npm_lifecycle_event?.startsWith('dev') ? 'dev' : 'build';
const site = resolveSiteUrl({ command });

export default defineConfig({
  output: 'static',
  site,
  image: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
    ],
  },
  adapter: process.env.NETLIFY ? netlify() : undefined,
  integrations: [react()],

  vite: {
    optimizeDeps: {
      // Stabilize dev prebundle for HS configurator (three.js stack)
      include: ['three', '@react-three/fiber', '@react-three/drei'],
      // Prevent stale optimized chunks for heavy 3D deps in long-running dev sessions
      exclude: ['@react-three/drei'],
    },
    resolve: {
      conditions: ['module-sync', 'import', 'module', 'browser', 'default'],
    },
    ssr: {
      noExternal: [
        'react-router',
        'react-router-dom',
        '@react-three/fiber',
        '@react-three/drei',
        'three',
      ],
    },
    build: {
      chunkSizeWarningLimit: 900,
      rollupOptions: {
        onwarn(warning, warn) {
          if (warning?.code === 'EMPTY_BUNDLE') return;
          warn(warning);
        },
        output: {
          manualChunks(id) {
            if (!id) return;
            if (id.includes('node_modules')) {
              // WAŻNE: Wszystkie pakiety Three.js MUSZĄ być w jednym CHUNCK
              // żeby uniknąć problemów z kolejnością inicjalizacji (TDZ errors)
              if (
                id.includes('node_modules/three') ||
                id.includes('node_modules/@react-three/fiber') ||
                id.includes('node_modules/@react-three/drei')
              ) {
                return 'three-vendor';
              }
            }
            // Nie zwracaj nic dla innych modułów - pozwól Vite je zoptymalizować automatycznie
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