/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sand: '#F2EFE7',
        sky: '#9ACBD0',
        teal: '#48A6A7',
        deepteal: '#006A71',
      },
    },
  },
  plugins: [],
};
