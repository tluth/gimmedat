/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "index.html",
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        custom: "calc(1.5vw + 1.5hw)", // Custom font size
      },
      colors: {
        main: {
          100: "#e5efff",
          200: "#b3ceff",
          300: "#80adff",
          400: "#4d8cff",
          DEFAULT: "#3A80FF",
          600: "#0052e6",
          700: "#003fb3",
          800: "#002d80",
          900: "#001b4d",
        },
        night: {
          light: "#2b2626",
          DEFAULT: "#121010"
        },
        offWhite: "#FAEFDD",
        imperialRed: {
          400: "#df6d75",
          DEFAULT: "#D64550",
          600: "#bc2935"
        },
        asparagus: {
          400: "#95bc90",
          DEFAULT: "#659B5E",
          600: "#5d8f57"

        },
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
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
  plugins: [require("tailwindcss-animate")],
}
