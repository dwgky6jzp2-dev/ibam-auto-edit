import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const apiBase = process.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
  },
  define: {
    'process.env.VITE_API_BASE_URL': JSON.stringify(apiBase),
  },
});
