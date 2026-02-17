import { useCart } from '../context/CartContext';

const GameCard = ({ game, onTopUp }) => {
  const { addToCart } = useCart();
  const imageUrl = game.imageUrl || game.image;
  const price = game.price ?? 0;

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart({
      id: game.id,
      name: game.name,
      price,
      imageUrl,
      image: imageUrl,
      quantity: 1,
    });
  };

  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#F97316] transition-all duration-300 hover:shadow-lg">
      {imageUrl && (
        <div className="aspect-video bg-gray-100 overflow-hidden">
          <img
            src={imageUrl}
            alt={game.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      )}
      <div className="p-4">
        <h4 className="text-xl font-bold text-gray-900 mb-2">{game.name}</h4>
        {game.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>
        )}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {price > 0 && (
            <span className="text-[#F97316] font-bold text-lg">${Number(price).toFixed(2)}</span>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onTopUp(game)}
              className="bg-[#F97316] text-white px-4 py-2 rounded-md hover:bg-[#EA580C] transition-colors duration-200 font-medium text-sm"
            >
              Top Up
            </button>
            <button
              type="button"
              onClick={handleAddToCart}
              className="border-2 border-[#F97316] text-[#F97316] px-4 py-2 rounded-md hover:bg-orange-50 transition-colors duration-200 font-medium text-sm"
            >
              เพิ่มลงตะกร้า
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
