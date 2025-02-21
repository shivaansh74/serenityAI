/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'imessage-blue': '#007AFF',
        'imessage-gray': '#E9E9EB',
        'background-light': '#F8FAFC'
      },
    },
  },
  plugins: [],
}