module.exports = {
  content: [
    "./src/**/*.{astro,js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sen', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};