import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';

const SuccessPage = () => {
  const location = useLocation();
  const orderIds = location.state?.orderIds || [];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-8">
          <svg
            className="w-10 h-10"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          ขอบคุณที่สั่งซื้อ
        </h1>
        <p className="text-gray-600 mb-8">
          เราได้รับคำสั่งซื้อของคุณแล้ว จะดำเนินการให้เร็วที่สุด
        </p>

        {orderIds.length > 0 && (
          <div className="rounded-xl border-2 border-[#F97316] bg-orange-50 p-6 mb-8 text-left">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              เลขที่คำสั่งซื้อ
            </p>
            <ul className="space-y-1">
              {orderIds.map((id) => (
                <li
                  key={id}
                  className="font-mono font-bold text-[#F97316] text-lg"
                >
                  {id}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-3">
              กรุณาเก็บเลขที่สั่งซื้อไว้สำหรับติดตามสถานะ
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-block bg-[#F97316] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#EA580C] transition-colors"
          >
            กลับหน้าแรก
          </Link>
          <Link
            to="/profile"
            className="inline-block border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            ดูโปรไฟล์
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
