import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react({
    include: "**/*.{jsx,tsx}",
  })],
  base: '/endlessrpg/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    open: true,
    port: 3000
  }
});