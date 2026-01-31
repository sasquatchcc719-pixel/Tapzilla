import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Electric Teal
        primary: {
          50: "#edfffe",
          100: "#c1fffc",
          200: "#83fffb",
          300: "#3dfff9",
          400: "#00f5ef",
          500: "#00d9d5",
          600: "#00afaf",
          700: "#008a8c",
          800: "#006d70",
          900: "#045a5c",
          950: "#00383a",
        },
        // Accent - Electric Orange
        accent: {
          50: "#fff8ec",
          100: "#ffefd3",
          200: "#ffdba5",
          300: "#ffc16d",
          400: "#ff9c32",
          500: "#ff7f0a",
          600: "#f56300",
          700: "#cc4902",
          800: "#a1390b",
          900: "#82310c",
          950: "#461604",
        },
        // Neutral - Slate tones
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
          950: "#020617",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-slow": "pulse 3s infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
