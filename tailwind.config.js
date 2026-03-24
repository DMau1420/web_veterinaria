/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'vet-primary': '#2563eb', 
        'vet-bg': '#f0f7ff',      
      },
    },
  },
  plugins: [],
}