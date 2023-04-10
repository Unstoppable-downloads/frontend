/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
    "./node_modules/tw-elements/dist/js/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        iexblk: "rgb(13 13 18)",
        iexyellow: "#fcd15a",
        // iexwhite: "#f1f2f0",
        iexwhite: "#f2f1f4",
        nav: "#8c8c90",
        sidebar: "#18181f",
        main: "#10c8e8"
      },
      spacing: {
        xs: "15px",
        s: "30px",
        m: "60px",
        l: "90px",
        xl: "120px",
        "2xl": "240px",
      },
      fontFamily: {
        logo: ["Space Mono"],
      },
      maxWidth: {
        "2/10": "20%",
      },
      borderRadius: {
        lg: "9px",
        xl: "12px",
      },
      height: {
        6: "24px",
        8: "32px",
        "1/10": "10%",
      },
      minHeight: {
        8: "32px",
      },
      fontSize: {
        "base":["1rem", "1.5rem"],
        l: "16px",
        xl: ["20px", "28px"],
        "2xl": ["24px", "32px"],
        "4xl": ["2.25rem", "2.5rem"],
        "7xl": ["4.5rem", "1"],
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin")],
};
