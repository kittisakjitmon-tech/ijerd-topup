import { useState } from 'react';
import { useGames } from '../hooks/useGames';
import OrderForm from '../components/OrderForm';
import GameCard from '../components/GameCard';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  const { games, loading, error } = useGames();
  const [selectedGame, setSelectedGame] = useState(null);

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  const handleCloseOrderForm = () => {
    setSelectedGame(null);
  };

  const handleOrderSuccess = (order) => {
    console.log('Order created successfully:', order);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />

      <section id="games" className="py-12 px-4 md:px-8 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            เกมที่รองรับ
          </h3>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]" />
              <p className="mt-4 text-gray-600">Loading games...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading games: {error}</p>
              <p className="text-gray-600 text-sm">
                Please check your Firebase configuration
              </p>
            </div>
          )}

          {!loading && !error && games.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No games available yet</p>
              <p className="text-gray-500 text-sm">
                Add games to your Firestore &apos;games&apos; collection to see them here
              </p>
            </div>
          )}

          {!loading && games.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onTopUp={handleGameClick}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="promotions" className="py-12 px-4 md:px-8 bg-gray-50 scroll-mt-20">
        <div className="max-w-7xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            โปรโมชั่น
          </h3>
          <p className="text-gray-600 max-w-xl mx-auto">
            ติดตามโปรโมชั่นและส่วนลดได้ที่ Facebook และ Line ของเรา
          </p>
        </div>
      </section>

      <Footer />

      {selectedGame && (
        <OrderForm
          game={selectedGame}
          onClose={handleCloseOrderForm}
          onSuccess={handleOrderSuccess}
        />
      )}
    </div>
  );
};

export default LandingPage;
