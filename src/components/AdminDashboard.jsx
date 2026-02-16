import { useState, useEffect } from 'react';
import { 
  fetchAllGames, 
  createGame, 
  updateGame, 
  deleteGame 
} from '../services/gameService';

const AdminDashboard = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    imageUrl: '',
    priority: 0,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Fetch all games on component mount
  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const allGames = await fetchAllGames();
      // Sort by priority for display
      const sortedGames = allGames.sort((a, b) => a.priority - b.priority);
      setGames(sortedGames);
    } catch (err) {
      console.error('Error loading games:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'priority' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.imageUrl) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await createGame({
        name: formData.name,
        category: formData.category,
        imageUrl: formData.imageUrl,
        priority: formData.priority || 0,
        active: true,
      });
      
      // Reset form and reload games
      setFormData({
        name: '',
        category: '',
        imageUrl: '',
        priority: 0,
      });
      setShowForm(false);
      await loadGames();
    } catch (err) {
      console.error('Error creating game:', err);
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (gameId, currentActive) => {
    try {
      setError(null);
      await updateGame(gameId, { active: !currentActive });
      await loadGames();
    } catch (err) {
      console.error('Error updating game:', err);
      setError(err.message);
    }
  };

  const handleDelete = async (gameId) => {
    try {
      setError(null);
      await deleteGame(gameId);
      setDeleteConfirm(null);
      await loadGames();
    } catch (err) {
      console.error('Error deleting game:', err);
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#F97316] text-white py-6 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold">iJerdTopup Admin</h1>
          <p className="text-orange-100 mt-2 text-sm md:text-base">
            Manage your game catalog
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add New Game Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Games Management
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#F97316] text-white px-6 py-2 rounded-lg hover:bg-[#EA580C] transition-colors duration-200 font-medium"
          >
            {showForm ? 'Cancel' : '+ Add New Game'}
          </button>
        </div>

        {/* Add Game Form */}
        {showForm && (
          <div className="mb-8 bg-white border-2 border-[#F97316] rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Add New Game</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Game Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                    placeholder="Enter game name"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                    placeholder="e.g., Mobile, PC, Console"
                  />
                </div>

                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <input
                    type="number"
                    id="priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setFormData({ name: '', category: '', imageUrl: '', priority: 0 });
                    setError(null);
                  }}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Adding...' : 'Add Game'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Games Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
            <p className="mt-4 text-gray-600">Loading games...</p>
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 mb-2">No games found</p>
            <p className="text-gray-500 text-sm">Add your first game using the form above</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F97316] text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Image</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Priority</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {games.map((game) => (
                    <tr key={game.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        {game.imageUrl ? (
                          <img
                            src={game.imageUrl}
                            alt={game.name}
                            className="w-16 h-16 object-cover rounded"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="64" height="64"%3E%3Crect fill="%23e5e7eb" width="64" height="64"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{game.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {game.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{game.priority || 0}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(game.id, game.active)}
                          className={`px-4 py-1 rounded-full text-sm font-medium transition-colors ${
                            game.active
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {game.active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          {deleteConfirm === game.id ? (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleDelete(game.id)}
                                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirm(null)}
                                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(game.id)}
                              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Footer */}
        {!loading && games.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-600">
            Total Games: <span className="font-semibold text-[#F97316]">{games.length}</span> | 
            Active: <span className="font-semibold text-green-600">
              {games.filter(g => g.active).length}
            </span> | 
            Inactive: <span className="font-semibold text-gray-600">
              {games.filter(g => !g.active).length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
