import { useState } from 'react';
import { useGames } from '../hooks/useGames';
import OrderForm from './OrderForm';
import Navbar from './Navbar';

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
    // You can add additional logic here, like showing a toast notification
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
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

      {/* Games Grid Section */}
      <section className="py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8 text-center">
            Available Games
          </h3>

          {loading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
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
                Add games to your Firestore 'games' collection to see them here
              </p>
            </div>
          )}

          {!loading && games.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#F97316] transition-all duration-300 hover:shadow-lg"
                >
                  {(game.imageUrl || game.image) && (
                    <div className="aspect-video bg-gray-100 overflow-hidden">
                      <img
                        src={game.imageUrl || game.image}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {game.name}
                    </h4>
                    {game.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {game.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      {game.price && (
                        <span className="text-[#F97316] font-bold text-lg">
                          ${game.price}
                        </span>
                      )}
                      <button 
                        onClick={() => handleGameClick(game)}
                        className="bg-[#F97316] text-white px-4 py-2 rounded-md hover:bg-[#EA580C] transition-colors duration-200 font-medium"
                      >
                        Top Up
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
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

      {/* Order Form Modal */}
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
