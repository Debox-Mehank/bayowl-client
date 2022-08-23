const defaultTheme = require('tailwindcss/defaultTheme');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      "fontFamily": {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        blob: "blob 7s infinite",
        tilt: "tilt 10s infinite linear"
      },
      keyframes: {
        blob: {
          "0%": {
            transform: "translate(0px, 0px) scale(1)"
          },
          "33%": {
            transform: "translate(30px, -50px) scale(1.1)"
          },
          "66%": {
            transform: "translate(-20px, 20px) scale(0.9)"
          },
          "100%": {
            transform: "translate(0px, 0px) scale(1)"
          }
        },
        tilt: {
          "0%, 50%, 100%": {
            transform: "rotate(0deg)"
          },
          "25%": {
            transform: "rotate(1deg)"
          },
          "75%": {
            transform: "rotate(-1deg)"
          },
        }
      },
      "colors": {
        // 'primary': "#FBB13C",
        // 'primary': "#FF6B35",
        'primary': "#f07202",
        'accent': "#192b54",
        'darkBlue': "#0B0B1D",
        'blueGradient': ['#1f3b83', '#192A55', '#331265', '#D7263D'],
        'orange1': "#f09402",
        'orange2': "#f07202",
        'orange3': "#ed4731",
        'svgFill': "#f07202"
      }
    },
  },
  linearBorderGradients: ({ theme }) => ({
    colors: {
      'light-blue': [colors.indigo[200], colors.lime[300]],
    },
    background: theme('colors'),
  }),
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('tailwindcss-border-gradient-radius'),
  ],
}
