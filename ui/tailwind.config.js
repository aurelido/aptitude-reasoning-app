/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,scss}',
    './src/index.html',
    './index.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#7C3AED',
        accent: '#3B82F6',
        surface: '#F8FAFF'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(2,6,23,0.06)',
        card: '0 24px 60px rgba(79,70,229,0.12)'
      },
      borderRadius: {
        xl: '1.25rem',
        '2xl': '1.5rem'
      },
      fontFamily: {
        sans: [
          'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI',
          'Roboto', 'Helvetica Neue', 'Arial', 'Noto Sans', 'Apple Color Emoji',
          'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'
        ]
      }
    }
  },
  plugins: []
};
