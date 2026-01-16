import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  root: path.resolve(__dirname),
  server: {
    port: 4200,
    proxy: {
      '/api': {
        target: 'http://localhost:4201',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist/web',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
