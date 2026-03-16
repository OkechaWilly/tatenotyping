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
        bg: "var(--bg)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        border: "var(--border)",
        "border-strong": "var(--border-strong)",
        ink: "var(--ink)",
        "ink-2": "var(--ink-2)",
        "ink-3": "var(--ink-3)",
        "ink-4": "var(--ink-4)",
        accent: "var(--accent)",
        "accent-light": "var(--accent-light)",
        "accent-mid": "var(--accent-mid)",
        "accent-2": "var(--accent-2)",
        "accent-2-light": "var(--accent-2-light)",
        green: "var(--green)",
        "green-light": "var(--green-light)",
        gold: "var(--gold)",
        "gold-light": "var(--gold-light)",
        blue: "var(--blue)",
        "blue-light": "var(--blue-light)",
        correct: "var(--correct)",
        error: "var(--error)",
        pending: "var(--pending)",
        "cursor-color": "var(--cursor-color)",
        "f-pinky": "var(--f-pinky)",
        "f-ring": "var(--f-ring)",
        "f-middle": "var(--f-middle)",
        "f-index": "var(--f-index)",
        "f-thumb": "var(--f-thumb)",
      },
      fontFamily: {
        mono: ["var(--font-mono)"],
        body: ["var(--font-body)"],
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        DEFAULT: "var(--shadow)",
        md: "var(--shadow-md)",
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
      animation: {
        blink: "blink 1s step-end infinite",
        fadeUp: "fadeUp 0.4s ease both",
        slideUp: "slideUp 0.3s ease",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
