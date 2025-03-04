/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5E17EB',
          light: '#7B3FF2',
          dark: '#4A12BD',
        },
        secondary: {
          DEFAULT: '#17EBBC',
          light: '#3FF2C9',
          dark: '#12BD98',
        },
        neutral: {
          lightest: '#F8F9FE',
          light: '#E9ECEF',
          medium: '#CED4DA',
          dark: '#6C757D',
          darkest: '#343A40',
        },
      },
      screens: {
        'xs': '480px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'glow': '0 0 15px 2px rgba(94, 23, 235, 0.3)',
      },
    },
  },
  plugins: [],
}
