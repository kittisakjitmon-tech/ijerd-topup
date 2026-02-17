import { Link } from 'react-router-dom';

/**
 * GameCard – แสดงเกมบน Landing, ลิงก์ไปหน้าเกม /games/:gameId เพื่อกรอก UID และเพิ่มลงตะกร้า
 */
const GameCard = ({ game }) => {
  const imageUrl = game.imageUrl || game.image;
  const price = game.price ?? 0;

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
            <span className="text-[#F97316] font-bold text-lg">฿{Number(price).toFixed(0)} ขึ้นไป</span>
          )}
          <Link
            to={`/games/${game.id}`}
            className="bg-[#F97316] text-white px-4 py-2 rounded-md hover:bg-[#EA580C] transition-colors duration-200 font-medium text-sm inline-block text-center"
          >
            เลือกแพ็ค / เติมเกม
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
