/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        custom: "calc(1.1vw + 1.1vh)", // Custom font size
      },
      colors: {
        "blue": {
          100: '#e5efff',
          200: '#b3ceff',
          300: '#80adff',
          400: '#4d8cff',
          DEFAULT: '#3A80FF',
          600: '#0052e6',
          700: '#003fb3',
          800: '#002d80',
          900: '#001b4d',
        },
        "dark": "#121010",
        "white": "#FAEFDD",
        "red": "D64550",
        "green": "659B5E"
      },
      fontFamily: {
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ], // Ensure monospace is defined
      },
    },
  },
  plugins: [],
};
