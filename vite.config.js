import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Điều này tương đương với "baseUrl": "src" trong jsconfig.json
      components: path.resolve(__dirname, './src/components'),
      contexts: path.resolve(__dirname, './src/contexts'),
      hooks: path.resolve(__dirname, './src/hooks'),
      assests: path.resolve(__dirname, './src/assests'),
      pages: path.resolve(__dirname, './src/pages'),
      config: path.resolve(__dirname, './src/config'),
      services: path.resolve(__dirname, './src/services'),
      styles: path.resolve(__dirname, './src/styles'),
      utils: path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 8080 // <-- Thêm mục này
  },
});