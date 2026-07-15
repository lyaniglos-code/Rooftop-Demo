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
        // Warm near-black — now the TEXT color on the paper canvas
        ink: {
          950: "#1c1a17",
          900: "#26231f",
          800: "#33302a",
          700: "#423e37",
          600: "#565149",
        },
        // Warm paper canvas — morning light over a rooftop
        paper: {
          50: "#fbf9f5",
          100: "#f6f3ee",
          200: "#efeae1",
          300: "#e5ded1",
        },
        // Copper accent — driven by CSS variables so alpha utilities work
        copper: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          soft: "rgb(var(--accent-soft) / <alpha-value>)",
          deep: "rgb(var(--accent-deep) / <alpha-value>)",
          glow: "rgb(var(--accent) / 0.2)",
        },
        // Secondary — cool sky teal for small counterpoints
        sky2: {
          DEFAULT: "rgb(var(--sky) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.045em",
      },
      maxWidth: {
        page: "1200px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "drift-a": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1)" },
          "50%": { transform: "translate3d(5%, -3%, 0) scale(1.06)" },
        },
        "drift-b": {
          "0%, 100%": { transform: "translate3d(0,0,0) scale(1.04)" },
          "50%": { transform: "translate3d(-4%, 4%, 0) scale(1)" },
        },
      },
      animation: {
        marquee: "marquee 36s linear infinite",
        "drift-a": "drift-a 20s ease-in-out infinite",
        "drift-b": "drift-b 26s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
