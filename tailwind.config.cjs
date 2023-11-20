/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '370px',
      },
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
        },
        accent: {
          DEFAULT: '#F59E0B',
          50: '#FCE4BB',
          100: '#FBDCA8',
          200: '#FACD81',
          300: '#F8BD59',
          400: '#F7AE32',
          500: '#F59E0B',
          600: '#C07C08',
          700: '#8A5906',
          800: '#543603',
          900: '#1E1401',
          950: '#030200'
        },
        primary: "var(--kui-primary)",
        primaryOpaque: "var(--kui-primaryOpaque)",
        primaryDarkOpaque: "var(--kui-primaryDarkOpaque)",
        secondary: "var(--kui-secondary)",
        secondaryActive: "var(--kui-secondaryActive)",
        secondaryOpaque: "var(--kui-secondaryOpaque)",
        primaryFont: "var(--kui-primaryFont)",
        primaryLightfont: "var(--kui-primaryLightfont)",
        lightOpaque: "var(--kui-lightOpaque)",
        opaque: "var(--kui-opaque)",
        opaqueActive: "var(--kui-opaqueActive)",
      },
    },
  },
  plugins: [],
}
