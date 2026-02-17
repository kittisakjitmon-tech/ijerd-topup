import { useState } from 'react';
import { useGames } from '../hooks/useGames';
import OrderForm from '../components/OrderForm';
import GameCard from '../components/GameCard';
import Navbar from '../components/Navbar';

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

      <section className="bg-[#F97316] text-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-4">
            Game Top-Up Made Easy
          </h2>
          <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto">
            Fast, secure, and reliable game credits for your favorite titles
          </p>
        </div>
      </section>

      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Available Games
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

      <footer className="bg-gray-50 border-t border-gray-200 py-8 px-4 md:px-8 mt-16">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 mb-2">
            <span className="font-bold text-[#F97316]">iJerdTopup</span> - Your trusted game top-up partner
          </p>
          <p className="text-gray-500 text-sm">
            © 2026 iJerdTopup. All rights reserved.
          </p>
        </div>
      </footer>

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
