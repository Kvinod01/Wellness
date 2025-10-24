/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'work-blue': '#dcf2ff',
        'break-green': '#dfffea',
        'primary-blue': '#007bff',
        'focus-green': '#00796b',
      }
    },
  },
  plugins: [],
}