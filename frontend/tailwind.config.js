/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'duo-green': '#58CC02',
        'duo-blue': '#1CB0F6',
        'duo-gray': '#E5E5E5',
      }
    },
  },
  plugins: [],
}