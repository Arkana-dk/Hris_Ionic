/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Font Family - Modern Mobile App
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        inter: ["Inter", "sans-serif"],
      },
      // Tambahkan blok colors ini
      colors: {
        "gradient-start": "#8360fa", // Warna ungu yang lebih pekat
        "gradient-end": "#60a5fa", // Warna biru yang lebih terang
      },
    },
  },
  plugins: [],
};
