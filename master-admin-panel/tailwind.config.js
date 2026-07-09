/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vinculamos los nombres de Tailwind a variables CSS dinámicas
        brand: {
          primary: 'var(--color-primary)',
          secondary: 'var(--color-secondary)',
          bg: 'var(--color-bg)',
          surface: 'var(--color-surface)',
        }
      },
    },
  },
  plugins: [],
}
