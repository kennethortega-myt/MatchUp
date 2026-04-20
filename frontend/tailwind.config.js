/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#e91e8c',
        secondary: '#ff6b35',
      },
    },
  },
  plugins: [],
}
