import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const projectId = env.VITE_SANITY_PROJECT_ID || '6sp9tyie';

  return {
    plugins: [react()],
    server: {
    // Przekieruj wszystkie nieznane ścieżki do index.html
    // To rozwiązuje problem z odświeżaniem strony na podstronach w trybie deweloperskim
    historyApiFallback: true,

    // Proxy Sanity API to avoid CORS in development.
    // Frontend will call `/api/sanity/*` and Vite will forward it to `https://<projectId>.api.sanity.io/*`.
      proxy: {
        '/api/sanity': {
          target: `https://${projectId}.api.sanity.io`,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/sanity/, ''),
          configure: (proxy) => {
            // Some Sanity projects enforce CORS by checking the `Origin` header.
            // When proxying, we remove `Origin` so Sanity treats it like a server-side request.
            proxy.on('proxyReq', (proxyReq) => {
              proxyReq.removeHeader('origin');
            });
          },
        },
      },
    },
    preview: {
      // To samo dla trybu preview
      historyApiFallback: true,
    },
    build: {
      // Upewnij się, że build generuje odpowiednie pliki
      rollupOptions: {
        // Możesz dodać dodatkowe opcje rollup jeśli potrzebne
      }
    }
  }
})
