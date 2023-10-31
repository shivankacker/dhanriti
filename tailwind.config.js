/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,svelte}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#EEEEEE",
          300: "#E0E0E0",
          400: "#BDBDBD",
          500: "#9D9D9D",
          600: "#716F6F",
          700: "#5C5C5C",
          800: "#373737",
          900: "#222222",
          950: "#1A1A1A",
        }
      }
    },
  },
  plugins: [],
}

