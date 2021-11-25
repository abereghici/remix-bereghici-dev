const path = require('path')
const defaultTheme = require('tailwindcss/defaultTheme')
const fromRoot = p => path.join(__dirname, p)

module.exports = {
  mode: 'jit',
  darkMode: 'class',
  variants: {},
  theme: {
    colors: {
      // color scheme is defined in /app.css
      transparent: 'transparent',
      current: 'currentColor',
      white: '#fff',
      black: '#000',
      gray: {
        100: '#fafafa',
        200: '#eaeaea',
        300: ' #999999',
        400: '#888888',
        500: '#666666',
        600: '#444444',
        700: '#333333',
        800: '#222222',
        900: '#111111',
      },
      yellow: {
        500: '#ffd644',
      },
      blue: {
        100: '#e8f2ff',
        500: '#4b96ff',
      },
      red: {
        500: '#eb5656',
      },
      green: {
        100: '#e7f9ed',
        500: '#30c85e',
        600: '#68d94a',
      },
    },
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  purge: [fromRoot('./app/**/*.+(js|ts|tsx|mdx|md)')],
  plugins: [],
}
