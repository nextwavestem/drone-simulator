import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/drone-simulator/', // This should match your repository name
  plugins: [react()]
});