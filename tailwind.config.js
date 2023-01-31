const colors = require("tailwindcss/colors");
const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        primary: ["var(--inter-font)", ...fontFamily.sans],
      },
      colors: {
        primary: colors.indigo,
        slate: { ...colors.slate, 900: "#121827" },
      },
      backgroundImage: {
        check: "url('../../public/check.svg')",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: 0,
          },
          "100%": {
            // empty on purpose; use the opacity of the component
          },
        },
        slideDownAndFadeIn: {
          "0%": {
            opacity: 0,
            transform: "translateY(-2px) scale(0.9)",
          },
          "100%": {
            opacity: 1,
          },
        },
        modalFadeIn: {
          "0%": {
            opacity: 0,
            transform: "translate(-50%, -55%) scale(0.9)",
          },
          "100%": {
            opacity: 1,
            transform: "translate(-50%, -50%)",
          },
        },
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.2s ease",
        slideDownAndFadeIn: "slideDownAndFadeIn 0.2s ease",
        modalFadeIn: "modalFadeIn 0.2s ease",
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
