export default {
  content: ["./src/**/*.{js,jsx}"],
  theme: { extend: {} },
  plugins: [
    require('@tailwindcss/typography'),
    require('tailwind-scrollbar-hide'),
  ],
}