import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Przekieruj wszystkie nieznane ścieżki do index.html
    // To rozwiązuje problem z odświeżaniem strony na podstronach w trybie deweloperskim
    historyApiFallback: true,
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
})