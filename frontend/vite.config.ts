import { TanStackRouterVite } from "@tanstack/router-vite-plugin"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"
import viteCompression from 'vite-plugin-compression'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(),
    TanStackRouterVite(),
    viteCompression({
      algorithm: 'gzip', // або 'brotliCompress'
      ext: '.gz',         // розширення файлів
      threshold: 10240,   // стискає лише файли >10KB
    })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
