// tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary — calm blue-green, conveys trust and clarity
        primary: {
          50: "#f0f9f6",
          100: "#d9f0e8",
          500: "#2d9e7a",
          600: "#237d61",
          700: "#1a5e49",
        },
        // Neutral — warm grays, not clinical
        neutral: {
          50: "#f8f7f5",
          100: "#f0ede8",
          200: "#e0dbd4",
          400: "#a09890",
          600: "#5c5550",
          800: "#2e2a26",
          900: "#1a1714",
        },
        // Semantic
        warning: "#d97706",
        success: "#2d9e7a",
        muted: "#a09890",
      },
      fontFamily: {
        sans: [
          "Inter",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      fontSize: {
        body: ["1rem", { lineHeight: "1.6" }],
        large: ["1.125rem", { lineHeight: "1.6" }],
        heading: ["1.5rem", { lineHeight: "1.3" }],
        display: ["2rem", { lineHeight: "1.2" }],
      },
      borderRadius: {
        soft: "0.75rem",
        card: "1rem",
      },
      transitionDuration: {
        fast: "150ms",
        medium: "300ms",
        slow: "500ms",
      },
      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
