/**
 * Navbar – sticky top, gradient from-orange-600 to-orange-400
 * ซ้าย: logo h-14/h-20 + "iJerd TOPUP" สีขาว | ขวา: เมนู + cart badge | Mobile: hamburger
 */
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { isAdmin } from '../config/admin';
import logoImg from '@/assets/logo.png';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();
  const { totalItems } = useCart();

  // เมนูหลัก (Home, Games, Promotions, Contact) + ระบบเดิม (ตะกร้า, โปรไฟล์, ล็อกอิน)
  const mainMenu = [
    { name: 'Home', path: '/' },
    { name: 'เกมยอดนิยม', path: '/#games' },
    { name: 'โปรโมชั่น', path: '/#promotions' },
    { name: 'ประวัติการเติม', path: '/profile' },
    { name: 'ติดต่อเรา', path: '/#contact' },
  ];

  const isActive = (path) => location.pathname === path || (path === '/' && location.pathname === '/');

  const linkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200 ${
      isActive(path) ? 'text-white bg-white/20' : 'text-white/95 hover:bg-white/15'
    }`;

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-orange-600 to-orange-400 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo + Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 md:gap-3"
            onClick={() => setMobileMenuOpen(false)}
          >
            <img
              src={logoImg}
              alt="iJerd TOPUP"
              className="h-14 w-14 md:h-20 md:w-20 object-contain flex-shrink-0"
            />
            <span className="text-white font-bold text-xl md:text-2xl drop-shadow-sm">
              iJerd TOPUP
            </span>
          </Link>

          {/* Desktop: เมนูหลัก + Cart + Auth */}
          <div className="hidden md:flex items-center gap-1 lg:gap-2">
            {mainMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={linkClass(item.path)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/cart"
              className={`${linkClass('/cart')} relative`}
            >
              ตะกร้า
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[1.25rem] h-5 px-1 flex items-center justify-center bg-white text-primary text-xs font-bold rounded-full">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>
            {user && isAdmin(user.uid) && (
              <Link to="/admin" className={linkClass('/admin')}>
                Admin
              </Link>
            )}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {loading ? (
              <span className="text-white/70 text-sm">กำลังโหลด...</span>
            ) : user ? (
              <>
                <Link to="/profile" className={linkClass('/profile')}>
                  โปรไฟล์
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white/95 hover:bg-white/15 transition-colors"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClass('/login')}>
                  เข้าสู่ระบบ
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-primary px-4 py-2 rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors shadow"
                >
                  สมัครสมาชิก
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/15 transition-colors"
            aria-label="เมนู"
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

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <div className="flex flex-col gap-1">
              {mainMenu.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-white font-medium hover:bg-white/15"
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-lg text-white font-medium hover:bg-white/15 flex items-center gap-2"
              >
                ตะกร้า
                {totalItems > 0 && (
                  <span className="bg-white text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </Link>
              {user && isAdmin(user.uid) && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-white font-medium hover:bg-white/15">
                  Admin
                </Link>
              )}
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-white font-medium hover:bg-white/15">
                    โปรไฟล์
                  </Link>
                  <button type="button" onClick={handleLogout} className="px-4 py-3 text-left text-white font-medium hover:bg-white/15 rounded-lg">
                    ออกจากระบบ
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-lg text-white font-medium hover:bg-white/15">
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mx-4 mt-2 bg-white text-primary py-3 rounded-lg font-semibold text-center"
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
