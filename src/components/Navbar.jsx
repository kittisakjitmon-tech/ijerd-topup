import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const { totalItems } = useCart();

  const menuItems = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'ตะกร้า', path: '/cart' },
    { name: 'ชำระเงิน', path: '/checkout' },
    { name: 'โปรไฟล์', path: '/profile' },
  ];

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200 ${
      isActive(path)
        ? 'text-[#F97316] bg-orange-50'
        : 'text-gray-700 hover:text-[#F97316] hover:bg-orange-50'
    }`;

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-[0_2px_8px_rgba(249,115,22,0.1)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link
            to="/"
            className="flex items-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="text-2xl md:text-3xl font-bold">
              <span className="text-[#F97316]">iJerd</span>
              <span className="text-black">Topup</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`${linkClass(item.path)} ${item.path === '/cart' ? 'relative' : ''}`}
              >
                {item.name}
                {item.path === '/cart' && totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1 flex items-center justify-center bg-[#F97316] text-white text-xs font-bold rounded-full">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <span className="text-gray-400 text-sm">กำลังโหลด...</span>
            ) : user ? (
              <>
                <Link
                  to="/profile"
                  className={linkClass('/profile')}
                >
                  โปรไฟล์
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg font-semibold text-sm lg:text-base text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg font-semibold text-sm lg:text-base text-gray-700 hover:text-[#F97316] hover:bg-orange-50 transition-colors duration-200"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="bg-[#F97316] text-white px-5 py-2 rounded-lg font-semibold text-sm lg:text-base hover:bg-[#EA580C] transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`${linkClass(item.path)} ${item.path === '/cart' ? 'relative inline-flex items-center' : ''}`}
                >
                  {item.name}
                  {item.path === '/cart' && totalItems > 0 && (
                    <span className="ml-2 min-w-[1.25rem] h-5 px-1 flex items-center justify-center bg-[#F97316] text-white text-xs font-bold rounded-full">
                      {totalItems > 99 ? '99+' : totalItems}
                    </span>
                  )}
                </Link>
              ))}
              {loading ? (
                <span className="px-4 py-3 text-gray-400 text-sm">กำลังโหลด...</span>
              ) : user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={linkClass('/profile')}
                  >
                    โปรไฟล์
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="px-4 py-3 rounded-lg text-base font-medium text-left text-gray-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                  >
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:text-[#F97316] hover:bg-orange-50 transition-colors"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 mt-2 bg-[#F97316] text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-[#EA580C] transition-colors duration-200 shadow-md"
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
