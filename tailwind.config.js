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
          DEFAULT: '#FF8C00', // สีส้ม iJerdTopup
          dark: '#E67E00',    // ปรับเฉดเข้มขึ้นเล็กน้อยสำหรับ hover
          light: '#FFA333',   // ปรับเฉดอ่อนลงเล็กน้อย
        },
        white: '#FFFFFF',
      },
    },
  },
  plugins: [],
}
