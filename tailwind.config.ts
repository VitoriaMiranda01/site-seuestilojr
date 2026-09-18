import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFFFF",
          100: "#FDFBF8",
          200: "#F8F2EA",
          300: "#F1E9DC",
          400: "#E8DBC6",
        },
        brown: {
          50: "#F6EFE8",
          100: "#E6D3C0",
          200: "#C9A483",
          300: "#A97A57",
          400: "#8C5E3E",
          500: "#6F4A31",
          600: "#5A3A26",
          700: "#48301F",
          800: "#3A2618",
          900: "#2A1B11",
        },
        gold: {
          50: "#FBF6E9",
          100: "#F1E2B4",
          200: "#E4CB86",
          300: "#D4B168",
          400: "#C39A4F",
          500: "#AD8339",
          600: "#8C692D",
        },
        ink: "#2A2119",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(42,27,17,0.12)",
        card: "0 2px 16px -2px rgba(42,27,17,0.08)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        fadeIn: "fadeIn 0.5s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
