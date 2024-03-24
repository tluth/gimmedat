/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontSize: {
        custom: "calc(1.1vw + 1.1vh)", // Custom font size
      },
      colors: {
        "custom-green": "rgb(73, 247, 4)", // Custom green color
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
