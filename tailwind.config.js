/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#111827",
        },
      },
      boxShadow: {
        soft: "0 18px 50px -28px rgb(15 23 42 / 0.55)",
      },
    },
  },
  plugins: [],
};
