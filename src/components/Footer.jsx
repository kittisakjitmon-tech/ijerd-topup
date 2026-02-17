/**
 * Footer – โลโก้ขนาดเล็ก + copyright iJerd TOPUP
 * UI ส้ม #F97316 น่ารัก เหมาะกับ gamer
 */
import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-gradient-to-b from-gray-50 to-orange-50/30 border-t border-orange-100 py-8 px-4 md:px-8 mt-auto scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left">
        <Link to="/" className="flex items-center gap-2 flex-shrink-0">
          <img
            src={logoImg}
            alt="iJerd TOPUP"
            className="h-10 w-10 object-contain"
          />
          <span className="font-bold text-[#F97316] text-lg">iJerd TOPUP</span>
        </Link>
        <p className="text-gray-600 text-sm">
          © 2026 iJerd TOPUP – Game Online Topup Center
        </p>
      </div>
    </footer>
  );
};

export default Footer;
