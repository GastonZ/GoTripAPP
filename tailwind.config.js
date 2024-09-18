/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        primary : ['Poppins', 'sans-serif']
      },
      colors: {
        primary : {
          blue: '#4896DF',
          lightBlue: '#8BC1F2',
          darkBlue: '#0343FD',
          electricBlue: '#02FFFF'
        },
        background: {
          navy: '#E8E3D4',
          white: '#F6F6F6'
        }
      }
    },
  },
  plugins: [],
}