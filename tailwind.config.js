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
          50: "#f1f5ff",
          100: "#e2ebff",
          200: "#bfd0ff",
          300: "#95b1ff",
          400: "#5c8aff",
          500: "#2f66ff",
          600: "#1f4ee6",
          700: "#183db4",
          800: "#142f8a",
          900: "#11266d"
        }
      },
      fontFamily: {
        sans: ["'Inter Variable'", "'Inter'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glass: "0 24px 80px -40px rgba(23, 40, 89, 0.45)"
      }
    }
  },
  plugins: []
};
