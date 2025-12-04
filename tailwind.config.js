/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8DA399', // Sage Green
          light: '#AABCB3',
          dark: '#6F857B',
        },
        secondary: {
          DEFAULT: '#F4A261', // Soft Orange
          light: '#F8C499',
          dark: '#E76F51',
        },
        background: '#F9F7F2', // Off-white/Cream
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
