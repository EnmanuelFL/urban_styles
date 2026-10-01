/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './public/**/*.html',
    './src/**/*.js',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg:      '#f6f4f0',
          surface: '#fbfaf8',
          muted:   '#ebe7df',
          border:  '#dedbd4',
          dark:    '#252321',
          text:    '#77736c',
          subtle:  '#99948b',
          faint:   '#6e6a63',
          accent:  '#a86b42',
          'accent-light': '#f0a978',
          'accent-hover': '#f4ba8e',
          'accent-muted': '#e7d2c0',
          'accent-text':  '#8a5938',
          'accent-warm':  '#b98a69',
          'accent-warm2': '#d5a47f',
          gold:    '#fffaf5',
        },
      },
      fontFamily: {
        sans:  ['DM Sans', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      maxWidth: {
        layout: '1360px',
      },
    },
  },
  plugins: [],
};
