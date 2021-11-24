const path = require('path')
const defaultTheme = require('tailwindcss/defaultTheme')
const fromRoot = p => path.join(__dirname, p)

module.exports = {
  // the NODE_ENV thing is for https://github.com/Acidic9/prettier-plugin-tailwind/issues/29
  mode: process.env.NODE_ENV ? 'jit' : undefined,
  darkMode: 'class',
  variants: {
    typography: ['dark'],
  },
  theme: {
    colors: {
      // color scheme is defined in /app.css
      transparent: 'transparent',
      current: 'currentColor',
      white: 'var(--color-white)',
      black: 'var(--color-black)',
      gray: {
        100: 'var(--color-gray-100)',
        200: 'var(--color-gray-200)',
        300: 'var(--color-gray-300)',
        400: 'var(--color-gray-400)',
        500: 'var(--color-gray-500)',
        600: 'var(--color-gray-600)',
        700: 'var(--color-gray-700)',
        800: 'var(--color-gray-800)',
        900: 'var(--color-gray-900)',
      },
      yellow: {
        500: 'var(--color-yellow-500)',
      },
      blue: {
        100: 'var(--color-blue-100)',
        500: 'var(--color-blue-500)',
      },
      red: {
        500: 'var(--color-red-500)',
      },
      green: {
        100: 'var(--color-green-100)',
        500: 'var(--color-green-500)',
        600: 'var(--color-green-600)',
      },
    },
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
      },
      typography: theme => {
        // some fontSizes return [size, props], others just size :/
        const fontSize = size => {
          const result = theme(`fontSize.${size}`)
          return Array.isArray(result) ? result[0] : result
        }

        return {
          // DEFAULT only holds shared stuff and not the things that change
          // between light/dark
          DEFAULT: {
            a: {
              textDecoration: 'none',
            },
            'a:hover,a:focus': {
              textDecoration: 'underline',
              outline: 'none',
            },
            hr: {
              marginTop: theme('spacing.8'),
              marginBottom: theme('spacing.16'),
            },
            'h1, h2, h3, h4, h5, h6': {
              marginTop: 0,
              marginBottom: 0,
              fontWeight: theme('fontWeight.normal'),

              [`@media (min-width: ${theme('screens.lg')})`]: {
                fontWeight: theme('fontWeight.medium'),
              },
            },
            // tailwind doesn't stick to this property order, so we can't make 'h3' overrule 'h2, h3, h4'
            'h1, h2': {
              fontSize: fontSize('2xl'),
              marginTop: theme('spacing.20'),
              marginBottom: theme('spacing.10'),
              [`@media (min-width: ${theme('screens.lg')})`]: {
                fontSize: fontSize('3xl'),
              },
            },
            h3: {
              fontSize: fontSize('xl'),
              marginTop: theme('spacing.16'),
              marginBottom: theme('spacing.10'),
              [`@media (min-width: ${theme('screens.lg')})`]: {
                fontSize: fontSize('2xl'),
              },
            },
            'h4, h5, h6': {
              fontSize: fontSize('lg'),
              [`@media (min-width: ${theme('screens.lg')})`]: {
                fontSize: fontSize('xl'),
              },
            },
          },
          light: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.blue.500'),
              code: {color: theme('colors.blue.500')},
            },
            strong: {
              color: theme('colors.black'),
            },
            hr: {
              borderColor: theme('colors.gray.200'),
            },
            code: {
              color: theme('colors.gray.800'),
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.black'),
            },
          },
          dark: {
            color: theme('colors.gray.200'),
            a: {
              color: theme('colors.blue.100'),
              code: {color: theme('colors.blue.100')},
            },
            strong: {
              color: theme('colors.white'),
            },
            hr: {
              borderColor: theme('colors.gray.600'),
            },
            code: {
              color: theme('colors.gray.100'),
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.white'),
            },
          },
        }
      },
    },
  },
  purge: {
    mode: 'layers',
    enabled: process.env.NODE_ENV === 'production',
    content: [fromRoot('./app/**/*.+(js|ts|tsx|mdx|md)')],
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}
