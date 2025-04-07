/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Nyght Serif', 'Georgia', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
