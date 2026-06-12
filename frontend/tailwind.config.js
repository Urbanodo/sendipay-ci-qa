/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1D9E75',
        'primary-dark': '#0F6E56',
      }
    }
  },
  plugins: []
}
