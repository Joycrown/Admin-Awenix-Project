/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        default: {
          100: "#000000", // black
          200: "#1F1A17", // black
          300: "#2F2E30", // grey
          400: "#D9261F", // red
          500: "#0092DF", // blue
          600: "#2A166F", // purple
          700: "#B0B0B0", // light grey
          800: "#FBFBFB", // lighter grey
        },
      },
      screens: {
        xs: "330px",
      },
      theme: {},
    },
  },
  plugins: [],
};
