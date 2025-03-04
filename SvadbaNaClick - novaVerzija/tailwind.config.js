/* eslint-disable quote-props */
/** @type {import('tailwindcss').Config} */
const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sncFont1: ['Lato'],
      sncFont2: ['Barlow'],
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white': '#ffffff',
      'black': '#000000',
      'purple': '#3f3cbb',
      'red': '#8B0000',
      'midnight': '#121063',
      'metal': '#565584',
      'tahiti': '#3ab7bf',
      'silver': '#ecebff',
      'bubble-gum': '#ff77e9',
      'bermuda': '#78dcca',
      'snclpink': '#F1B4BB',
      'sncdblue': '#132043',
      'sncpink': '#B4436C',
      'snclbrown': '#EDCBB1',
      'snclblue': '#1F4172',
      'snclgray': '#35393C',
      'sncdbrown': '#B39986',
    },
    extend: {},
  },
  plugins: [],
});
