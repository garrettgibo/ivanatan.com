import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // serve/build from the src folder where index.html lives
  root: path.resolve(__dirname, 'src'),

  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    cors: true,
  },
  build: {
    target: 'esnext',
    // place the final dist at the repository root
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      // use a real path alias instead of '/src'
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // ensure Vite serves the public/ directory from the repo root
  publicDir: path.resolve(__dirname, 'public'),
});