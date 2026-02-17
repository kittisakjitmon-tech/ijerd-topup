/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // สีหลักแบรนด์ iJerd TOPUP – ใช้ผ่าน text-primary, bg-primary, etc.
      colors: {
        primary: {
          DEFAULT: '#F97316',
          dark: '#EA580C',
          light: '#FB923C',
        },
      },
    },
  },
  plugins: [],
}
