import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    inGameUsername: '',
    server: '',
    phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.inGameUsername.trim()) {
      setError('กรุณากรอก In-Game Username');
      return;
    }
    if (items.length === 0) {
      setError('ตะกร้าว่าง');
      return;
    }

    setSubmitting(true);
    try {
      const orderIds = [];
      for (const item of items) {
        const amount = (item.price || 0) * (item.quantity || 1);
        const order = await createOrder({
          gameName: item.name,
          targetId: form.inGameUsername.trim(),
          amount,
          packageName: item.name,
          server: form.server.trim() || undefined,
          phone: form.phone.trim() || undefined,
        });
        orderIds.push(order.orderId);
      }
      clearCart();
      navigate('/checkout/success', { state: { orderIds } });
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 mb-6">ตะกร้าว่าง</p>
          <Link
            to="/cart"
            className="inline-block bg-[#F97316] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#EA580C] transition-colors"
          >
            ไปตะกร้า
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          ชำระเงิน
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* สรุปตะกร้า */}
          <div className="order-2 md:order-1">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-[#F97316]">สรุปตะกร้า</span>
              </h2>
              <ul className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => {
                  const subtotal = (item.price || 0) * (item.quantity || 1);
                  return (
                    <li
                      key={item.gameId}
                      className="flex justify-between items-center text-sm"
                    >
                      <span className="text-gray-700 truncate flex-1 mr-2">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="text-[#F97316] font-semibold whitespace-nowrap">
                        ${subtotal.toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">ราคารวม</span>
                <span className="text-xl font-bold text-[#F97316]">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* ฟอร์ม */}
          <div className="order-1 md:order-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                ข้อมูลสำหรับแจ้งเติม
              </h2>

              {error && (
                <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="inGameUsername"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    In-Game Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="inGameUsername"
                    name="inGameUsername"
                    type="text"
                    value={form.inGameUsername}
                    onChange={handleChange}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none disabled:bg-gray-50"
                    placeholder="ชื่อในเกม"
                  />
                </div>
                <div>
                  <label
                    htmlFor="server"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    Server
                  </label>
                  <input
                    id="server"
                    name="server"
                    type="text"
                    value={form.server}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none disabled:bg-gray-50"
                    placeholder="เช่น Asia, Global"
                  />
                </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-1"
                  >
                    เบอร์โทร (สำหรับแจ้งเติม)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={submitting}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none disabled:bg-gray-50"
                    placeholder="08xxxxxxxx"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Link
                  to="/cart"
                  className="flex-1 text-center py-3 px-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  กลับไปตะกร้า
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 rounded-lg bg-[#F97316] text-white font-semibold hover:bg-[#EA580C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      กำลังสั่งซื้อ...
                    </>
                  ) : (
                    'ยืนยันสั่งซื้อ'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
