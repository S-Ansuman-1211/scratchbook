import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium e-commerce palette: rich near-black ink, a refined indigo
        // accent (brand), warm amber for ratings/prices (gold), on clean
        // cool-neutral surfaces. Few hues, lots of tonal depth.
        ink: {
          DEFAULT: "#16151d", // rich near-black for text & headings
          soft: "#3d3b48",
        },
        brand: {
          DEFAULT: "#4f46e5", // indigo-600 — primary accent (buttons, links)
          dark: "#4338ca",
          light: "#c7d2fe",
          tint: "#eef2ff", // very light indigo wash for backgrounds
        },
        gold: {
          DEFAULT: "#d97706", // amber-600 — prices, star ratings
          light: "#f59e0b",
        },
        cream: "#f3f3f8", // cool paper for alternating sections
        paper: "#f8f8fb", // page background
        line: "#e8e7f0", // hairline borders
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(22,21,29,0.04), 0 12px 28px -14px rgba(22,21,29,0.14)",
        lift: "0 2px 4px rgba(22,21,29,0.04), 0 20px 40px -16px rgba(79,70,229,0.22)",
      },
      borderRadius: {
        xl: "0.9rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
