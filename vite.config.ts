import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      assets: path.resolve(__dirname, './src/assets'),
      const: path.resolve(__dirname, './src/const'),
      components: path.resolve(__dirname, './src/components'),
      pages: path.resolve(__dirname, './src/pages'),
      'app-router': path.resolve(__dirname, './src/app-router'),
      'layout': path.resolve(__dirname, './src/layout'),
    }
  }
});
