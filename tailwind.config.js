/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d"
        }
      },
      fontFamily: {
        sans: ["'Inter Variable'", "'Inter'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glass: "0 24px 80px -40px rgba(6, 78, 59, 0.45)"
      }
    }
  },
  plugins: []
};
