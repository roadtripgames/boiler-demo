const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        slate: { ...colors.slate, 900: "#121827" },
      },
      backgroundImage: {
        check: "url('../../public/check.svg')",
      },
      keyframes: {
        slideDownAndFade: {
          "0%": {
            opacity: 0,
            transform: "translateY(-2px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        slideDownAndFade: "slideDownAndFade 0.2s ease-in-out",
      },
    },
  },
  plugins: [],
};
