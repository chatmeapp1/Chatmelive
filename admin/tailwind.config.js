/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        dark: '#0f0f0f',
        darkBg: '#1a1a1a',
        darkCard: '#2d2d2d',
      }
    },
  },
  plugins: [],
}