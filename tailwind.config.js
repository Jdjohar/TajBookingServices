/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6eeff',
          100: '#c1d4ff',
          200: '#94b3ff',
          300: '#6691ff',
          400: '#3970ff',
          500: '#0F52BA', // primary blue
          600: '#0041c5',
          700: '#002f9e',
          800: '#001e77',
          900: '#000e51',
        },
        accent: {
          50: '#fffce6',
          100: '#fff7b8',
          200: '#fff28a',
          300: '#ffec5c',
          400: '#ffe72e',
          500: '#FFD700', // gold accent
          600: '#d6ad00',
          700: '#a88400',
          800: '#7a5d00',
          900: '#4c3500',
        },
        success: {
          500: '#10b981',
        },
        warning: {
          500: '#f59e0b',
        },
        danger: {
          500: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};