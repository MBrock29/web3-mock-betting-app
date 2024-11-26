// tailwind.config.js
module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    screens: {
      xs: '900px',
      sm: '1500px',
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
