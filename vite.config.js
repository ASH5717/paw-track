import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Pre-bundle on startup so a new dep never triggers a mid-session reload
  optimizeDeps: {
    include: ['qrcode.react', 'leaflet']
  },
  server: {
    // Bind dual-stack (::1 + 127.0.0.1). Without this, Vite can listen on
    // IPv6 only, so the browser's parallel IPv4 attempt to "localhost" is
    // refused and logs net::ERR_CONNECTION_REFUSED while the page still loads.
    host: '::',
    port: 5173,
    open: true
  }
});
