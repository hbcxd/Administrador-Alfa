/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#020617',     // Fondo oscuro (slate-950)
        'brand-surface': '#0f172a', // Tarjetas (slate-900)
        'brand-primary': '#3b82f6', // Azul principal
        'brand-secondary': '#8b5cf6', // Morado de acento
      }
    },
  },
  plugins: [],
}
