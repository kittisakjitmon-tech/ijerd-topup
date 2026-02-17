/**
 * Footer – bg-orange-700 (เข้มกว่า navbar), โลโก้เล็กซ้าย + copyright
 * กลาง: ช่องทางติดต่อซ้ำ (Facebook | Line) – brand consistency
 */
import { Link } from 'react-router-dom';
import logoImg from '@/assets/logo.png';

const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-orange-700 text-white py-8 px-4 md:px-8 mt-auto scroll-mt-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* แถวบน: โลโก้ + copyright | กลาง: ช่องทางติดต่อ */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* ซ้าย: logo ขนาดเล็ก + copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img
                src={logoImg}
                alt="iJerd TOPUP"
                className="h-10 w-10 object-contain"
              />
              <span className="font-bold text-white text-lg">iJerd TOPUP</span>
            </Link>
            <p className="text-white/90 text-sm text-center sm:text-left">
              © 2026 iJerd TOPUP – Game Online Topup Center
            </p>
          </div>
          {/* กลาง: ช่องทางติดต่อซ้ำ */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 md:gap-6 text-sm">
            <a
              href="https://facebook.com/ijerd"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-orange-200 transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook: iJerd - ไอเจิดรับเติมเกม</span>
            </a>
            <span className="text-white/60 hidden sm:inline">|</span>
            <a
              href="https://line.me/ti/p/~@ijerdtopup"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-orange-200 transition-colors"
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
              </svg>
              <span>Line: @ijerdtopup</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
