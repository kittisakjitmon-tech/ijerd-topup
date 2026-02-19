import { useState, useEffect } from 'react';
import { getGames, getPromotions } from '../data/mockData';
// import { useGames } from '../hooks/useGames';
import GameCard from '../components/GameCard';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  // const { games, loading, error } = useGames();
  const [games, setGames] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [gamesData, promotionsData] = await Promise.all([
          getGames(),
          getPromotions()
        ]);
        setGames(gamesData);
        setPromotions(promotionsData);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      <section id="games" className="py-16 px-4 md:px-8 scroll-mt-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              เกมยอดนิยม <span className="text-primary">🔥</span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              เลือกเกมที่คุณต้องการเติมเงิน สะดวก รวดเร็ว และปลอดภัย
            </p>
          </div>

          {loading && (
            <div className="text-center py-20 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#F97316]" />
              <p className="mt-4 text-[#F97316] font-medium animate-pulse">กำลังโหลดข้อมูลเกม...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16 bg-red-50 rounded-xl border border-red-100 p-8 max-w-2xl mx-auto">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h3 className="text-red-700 font-bold text-xl mb-2">เกิดข้อผิดพลาดในการโหลดข้อมูล</h3>
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          )}

          {!loading && !error && games.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              <div className="text-gray-300 text-6xl mb-4">🎮</div>
              <p className="text-gray-500 text-xl font-medium mb-2">ยังไม่มีรายการเกมในขณะนี้</p>
            </div>
          )}

          {!loading && games.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="promotions" className="py-12 px-4 md:px-8 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              โปรโมชั่น <span className="text-[#F97316]">✨</span>
            </h3>
            <p className="text-gray-600 max-w-xl mx-auto">
              สิทธิพิเศษและส่วนลดมากมายสำหรับสมาชิก
            </p>
          </div>

          {!loading && promotions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promotions.map((promo) => (
                <a key={promo.id} href={promo.link} className="block group overflow-hidden rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-48 md:h-64 overflow-hidden">
                    <img
                      src={promo.image}
                      alt={promo.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                      <p className="text-white font-bold text-lg md:text-xl drop-shadow-md">{promo.title}</p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">ติดตามโปรโมชั่นเร็วๆ นี้</p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
