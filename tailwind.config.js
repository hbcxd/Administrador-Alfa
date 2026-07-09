/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-bg': '#020617',
        'brand-surface': '#0f172a',
        'brand-primary': '#3b82f6',
        'brand-secondary': '#8b5cf6',
      }
    },
  },
  plugins: [],
}
