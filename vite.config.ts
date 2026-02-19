import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['leaflet.markercluster'],
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          query: ['@tanstack/react-query'],
          i18n: ['i18next', 'react-i18next'],
          map: ['leaflet', 'leaflet.markercluster', 'react-leaflet'],
          aws: [
            '@aws-sdk/client-cognito-identity',
            '@aws-sdk/client-s3',
            '@aws-sdk/credential-provider-cognito-identity',
            '@aws-sdk/lib-storage',
          ],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'src/**/*.spec.{ts,tsx}'],
    exclude: ['src/tests/e2e/**'],
  },
})
