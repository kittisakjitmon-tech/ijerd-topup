/**
 * Hero Section – full width min-h-screen, hero-banner.jpg (object-cover, object-center)
 * Overlay: linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))
 * ตรงกลาง: ข้อความขาว + mascot แมวลอย + ปุ่ม "เริ่มเติมเกมเลย!" | ด้านล่าง: ช่องทางติดต่อ
 */
import heroBanner from '@/assets/hero-banner.jpg';
import logoImg from '@/assets/logo.png';

const HeroSection = () => {
  const scrollToGames = () => {
    document.getElementById('games')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* Background: hero-banner.jpg full width, object-cover center */}
      <div className="absolute inset-0" aria-hidden>
        <img
          src={heroBanner}
          alt=""
          className="w-full h-full object-cover object-center"
          fetchPriority="high"
        />
      </div>
      {/* Dark overlay: ด้านบน 40%, ด้านล่าง 80% */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))',
        }}
        aria-hidden
      />
      {/* Content ตรงกลาง + mascot ลอยด้านบน text */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-20 md:py-28 text-center">
        <div className="mb-4 md:mb-6">
          <img
            src={logoImg}
            alt="มาสคอต iJerd TOPUP"
            className="mascot-float mascot-hover w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain drop-shadow-lg transition-transform duration-300"
          />
        </div>
        <h1 className="text-white font-bold drop-shadow-lg mb-2 text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          เติมกับเจิด ปลอดภัย
        </h1>
        <p className="text-white font-bold drop-shadow-lg text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-8 md:mb-10">
          ไม่มีรีฟันด์แน่นอน
        </p>
        <button
          type="button"
          onClick={scrollToGames}
          className="rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg md:text-xl px-10 py-5 shadow-lg hover:scale-105 active:scale-100 transition-all duration-200"
        >
          เริ่มเติมเกมเลย!
        </button>
      </div>
      {/* ด้านล่าง banner: Facebook: iJerd - ไอเจิดรับเติมเกม | Line: @ijerdtopup */}
      <div className="relative z-10 bg-black/70 text-white py-4 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 md:gap-6 text-sm md:text-base">
          <a
            href="https://facebook.com/ijerd"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-orange-400 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span>Facebook: iJerd - ไอเจิดรับเติมเกม</span>
          </a>
          <span className="text-white/60 hidden sm:inline">|</span>
          <a
            href="https://line.me/ti/p/~@ijerdtopup"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-orange-400 transition-colors"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            <span>Line: @ijerdtopup</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
