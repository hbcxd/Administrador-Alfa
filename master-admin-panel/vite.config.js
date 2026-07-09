import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Define el puerto local de desarrollo
    host: true  // Te permite abrir el panel desde tu teléfono si estás en la misma red Wi-Fi
  }
});
