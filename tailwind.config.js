const path = require('path')
const defaultTheme = require('tailwindcss/defaultTheme')
const fromRoot = p => path.join(__dirname, p)

module.exports = {
  darkMode: 'class',
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#fff',
      black: '#000',
      gray: {
        50: '#F9FAFB',
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
        500: '#F59E0B',
      },
      blue: {
        100: '#e8f2ff',
        200: '#bee3f8',
        300: '#93C5FD',
        400: '#60a5fa',
        500: '#4b96ff',
        600: '#2563eb',
        700: '#2b6cb0',
      },
      red: {
        500: '#eb5656',
      },
      green: {
        100: '#ECFDF5',
        500: '#10B981',
        600: '#059669',
      },
      purple: {
        500: '#8B5CF6',
      },
      pink: {
        500: '#EC4899',
      },
    },
    extend: {
      fontFamily: {
        sans: ['IBM Plex Sans', ...defaultTheme.fontFamily.sans],
      },
      maxHeight: {
        '75vh': '75vh',
      },
      spacing: {
        '5vw': '5vw',
      },
      animation: {
        'fade-in-stroke': 'fadeInStroke 0.5s ease-in-out',
      },
      keyframes: theme => ({
        fadeInStroke: {
          '0%': {stroke: theme('colors.transparent')},
          '100%': {stroke: theme('colors.current')},
        },
      }),
      typography: theme => ({
        DEFAULT: {
          css: {
            color: theme('colors.gray.700'),
            a: {
              color: theme('colors.blue.500'),
              '&:hover': {
                color: theme('colors.blue.700'),
              },
              code: {color: theme('colors.blue.400')},
            },
            'h2,h3,h4': {
              'scroll-margin-top': defaultTheme.spacing[32],
            },
            thead: {
              borderBottomColor: theme('colors.gray.200'),
            },
            code: {color: theme('colors.pink.500')},
            'blockquote p:first-of-type::before': false,
            'blockquote p:last-of-type::after': false,
          },
        },
        dark: {
          css: {
            color: theme('colors.gray.200'),
            a: {
              color: theme('colors.blue.400'),
              '&:hover': {
                color: theme('colors.blue.600'),
              },
              code: {color: theme('colors.blue.400')},
            },
            blockquote: {
              borderLeftColor: theme('colors.gray.700'),
              color: theme('colors.gray.300'),
            },
            'h2,h3,h4': {
              color: theme('colors.gray.100'),
              'scroll-margin-top': defaultTheme.spacing[32],
            },
            hr: {borderColor: theme('colors.gray.700')},
            ol: {
              li: {
                '&:before': {color: theme('colors.gray.500')},
              },
            },
            ul: {
              li: {
                '&:before': {backgroundColor: theme('colors.gray.500')},
              },
            },
            strong: {color: theme('colors.gray.100')},
            thead: {
              color: theme('colors.gray.100'),
              borderBottomColor: theme('colors.gray.600'),
            },
            tbody: {
              tr: {
                borderBottomColor: theme('colors.gray.700'),
              },
            },
          },
        },
      }),
    },
  },
  content: [fromRoot('./app/**/*.+(js|ts|tsx|mdx|md)')],
  plugins: [require('@tailwindcss/typography')],
}
