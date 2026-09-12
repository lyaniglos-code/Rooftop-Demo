import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Job-site charcoal — the canvas
        coal: {
          950: "#0d0e0f",
          900: "#141618",
          800: "#1d2023",
          700: "#2a2e32",
          600: "#41464c",
        },
        // Warm off-white — the text
        bone: "#eee8de",
        // Copper accent — driven by CSS variables so alpha utilities work
        copper: {
          DEFAULT: "rgb(var(--copper) / <alpha-value>)",
          deep: "rgb(var(--copper-deep) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "1280px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
