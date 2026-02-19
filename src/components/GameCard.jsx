import { Link } from 'react-router-dom';

/**
 * GameCard – แสดงเกมบน Landing, ลิงก์ไปหน้าเกม /games/:gameId เพื่อกรอก UID และเพิ่มลงตะกร้า
 */
const GameCard = ({ game }) => {
  const imageUrl = game.imageUrl || game.image;
  // ใช้ราคาเริ่มต้น 0 ถ้าไม่มีข้อมูล
  const price = game.price ?? 0;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/20 flex flex-col h-full">
      {/* ส่วนรูปภาพ (Image Section) */}
      <div className="relative aspect-video bg-gray-50 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={game.name}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}

        {/* Badge ราคาเริ่มต้น (Price Badge) */}
        {price > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-md">
            เริ่ม {Number(price).toFixed(0)}฿
          </div>
        )}
      </div>

      {/* ส่วนเนื้อหา (Content Section) */}
      <div className="p-4 flex flex-col flex-grow">
        <h4 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-primary transition-colors line-clamp-1">
          {game.name}
        </h4>

        {game.description && (
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {game.description}
          </p>
        )}

        <div className="mt-auto pt-2">
          <Link
            to={`/games/${game.id}`}
            className="w-full block bg-primary text-white text-center py-2.5 rounded-lg font-semibold shadow-md shadow-primary/20 hover:bg-primary-dark hover:shadow-lg hover:shadow-primary/30 active:scale-95 transition-all duration-200"
          >
            เติมเงิน
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;
