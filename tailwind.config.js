const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        // primary: colors.slate,
        slate: { ...colors.slate, 900: "#121827" },
      },
      backgroundImage: {
        check: "url('../../public/check.svg')",
      },
      keyframes: {
        slideDownAndFadeIn: {
          "0%": {
            opacity: 0,
            transform: "translateY(-2px)",
          },
          "100%": {
            opacity: 1,
          },
        },
        modalSlideDownAndFadeIn: {
          "0%": {
            opacity: 0,
            transform: "translate(-50%, -55%)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%, -50%)",
          },
        },
      },
      animation: {
        slideDownAndFadeIn: "slideDownAndFadeIn 0.2s ease",
        modalSlideDownAndFadeIn: "modalSlideDownAndFadeIn 0.2s ease",
      },
    },
  },
  plugins: [],
};
