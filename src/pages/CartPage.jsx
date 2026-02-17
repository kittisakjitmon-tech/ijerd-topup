import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { items, totalItems, totalPrice, removeFromCart, updateQuantity, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 text-[#F97316] mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">ตะกร้าว่าง</h1>
          <p className="text-gray-600 mb-8">ยังไม่มีสินค้าในตะกร้า</p>
          <Link
            to="/"
            className="inline-block bg-[#F97316] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#EA580C] transition-colors"
          >
            ไปเลือกเกม
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            ตะกร้าสินค้า <span className="text-[#F97316]">({totalItems} ชิ้น)</span>
          </h1>
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-700 font-medium"
          >
            ล้างตะกร้า
          </button>
        </div>

        {/* Desktop: table */}
        <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full">
            <thead className="bg-[#F97316] text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold rounded-tl-xl">สินค้า</th>
                <th className="px-4 py-3 text-left text-sm font-semibold">ราคา</th>
                <th className="px-4 py-3 text-center text-sm font-semibold">จำนวน</th>
                <th className="px-4 py-3 text-right text-sm font-semibold">รวม</th>
                <th className="px-4 py-3 text-center text-sm font-semibold rounded-tr-xl w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => {
                const subtotal = (item.price || 0) * (item.quantity || 0);
                const lineId = item.cartLineId || item.gameId;
                return (
                  <tr key={lineId} className="bg-white hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">ไม่มีรูป</div>
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">{item.name}</span>
                          {(item.uid || item.server) && (
                            <p className="text-xs text-gray-500 mt-0.5">
                              UID: {item.uid || '–'} {item.server ? ` · ${item.server}` : ''}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">฿{Number(item.price).toFixed(0)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(lineId, Math.max(0, (item.quantity || 1) - 1))}
                          className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium"
                        >
                          −
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(lineId, (item.quantity || 0) + 1)}
                          className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right font-semibold text-[#F97316]">
                      ฿{subtotal.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        type="button"
                        onClick={() => removeFromCart(lineId)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="ลบออก"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile: cards */}
        <div className="md:hidden space-y-4">
          {items.map((item) => {
            const subtotal = (item.price || 0) * (item.quantity || 0);
            const lineId = item.cartLineId || item.gameId;
            return (
              <div
                key={lineId}
                className="flex gap-4 p-4 rounded-xl border border-gray-200 bg-white shadow-sm"
              >
                <div className="w-20 h-20 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">ไม่มีรูป</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">{item.name}</h3>
                  {(item.uid || item.server) && (
                    <p className="text-xs text-gray-500 mt-0.5">UID: {item.uid || '–'} {item.server ? ` · ${item.server}` : ''}</p>
                  )}
                  <p className="text-[#F97316] font-bold mt-1">฿{Number(item.price).toFixed(0)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(lineId, Math.max(0, (item.quantity || 1) - 1))}
                      className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(lineId, (item.quantity || 0) + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 font-medium"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between">
                  <p className="font-semibold text-[#F97316]">฿{subtotal.toFixed(2)}</p>
                  <button
                    type="button"
                    onClick={() => removeFromCart(lineId)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg self-end"
                    aria-label="ลบออก"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-6 rounded-xl bg-gray-50 border border-gray-200">
          <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-4">
            <span>ราคารวม</span>
            <span className="text-[#F97316] text-2xl">฿{totalPrice.toFixed(2)}</span>
          </div>
          <Link
            to="/checkout"
            className="block w-full md:w-auto md:max-w-xs text-center bg-[#F97316] text-white py-3 px-6 rounded-lg font-semibold hover:bg-[#EA580C] transition-colors"
          >
            ไปชำระเงิน
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CartPage;
