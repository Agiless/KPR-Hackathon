/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}", // scan all JS/TS/JSX/TSX files
  ],
  theme: {
    extend: {}, // you can add custom colors, fonts, etc. here
  },
  plugins: [],
};
