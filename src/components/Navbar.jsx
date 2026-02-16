import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: 'หน้าแรก', path: '/' },
    { name: 'เช็คสถานะ', path: '/status' },
    { name: 'บทความ', path: '/articles' },
    { name: 'ติดต่อเรา', path: '/contact' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-[0_2px_8px_rgba(249,115,22,0.1)] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo - Left Side */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
            onClick={closeMobileMenu}
          >
            <span className="text-2xl md:text-3xl font-bold">
              <span className="text-[#F97316]">iJerd</span>
              <span className="text-black">Topup</span>
            </span>
          </Link>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm lg:text-base font-medium transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-[#F97316] bg-orange-50'
                    : 'text-gray-700 hover:text-[#F97316] hover:bg-orange-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Login Button - Right Side */}
          <div className="hidden md:flex items-center">
            <Link
              to="/login"
              className="bg-[#F97316] text-white px-6 py-2 rounded-lg font-semibold text-sm lg:text-base hover:bg-[#EA580C] transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              เข้าสู่ระบบ
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#F97316] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-[#F97316] bg-orange-50'
                      : 'text-gray-700 hover:text-[#F97316] hover:bg-orange-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="mx-4 mt-4 bg-[#F97316] text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-[#EA580C] transition-colors duration-200 shadow-md"
              >
                เข้าสู่ระบบ
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
