import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import logoImg from '@/assets/logo.png';
import { createOrder, updateOrderStatus } from '../services/orderService';
import { initOmisePayment, createToken, createSource } from '../services/omiseService';

const PAYMENT_METHODS = { card: 'บัตรเครดิต/เดบิต', promptpay: 'PromptPay' };

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    inGameUsername: '',
    server: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('promptpay');
  const [card, setCard] = useState({
    number: '',
    expiration_month: '',
    expiration_year: '',
    security_code: '',
    name: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(''); // 'order' | 'payment' | 'done'
  const [error, setError] = useState('');
  const [omiseReady, setOmiseReady] = useState(false);

  const publicKey = import.meta.env.VITE_OMISE_PUBLIC_KEY;

  useEffect(() => {
    if (!publicKey) {
      setOmiseReady(false);
      return;
    }
    initOmisePayment(publicKey)
      .then(() => setOmiseReady(true))
      .catch(() => setOmiseReady(false));
  }, [publicKey]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCard((prev) => ({ ...prev, [name]: value }));
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
    if (!publicKey) {
      setError('ยังไม่ได้ตั้งค่า Omise (VITE_OMISE_PUBLIC_KEY ใน .env)');
      return;
    }
    if (!omiseReady) {
      setError('กำลังโหลด Omise... กรุณารอสักครู่');
      return;
    }
    if (paymentMethod === 'card') {
      const n = card.number.replace(/\s/g, '');
      if (n.length < 13) {
        setError('กรุณากรอกเลขบัตรให้ครบ');
        return;
      }
      if (!card.expiration_month || !card.expiration_year || !card.security_code) {
        setError('กรุณากรอกวันหมดอายุและ CVC');
        return;
      }
    }

    setSubmitting(true);
    try {
      setStep('order');
      const createdOrders = [];
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
        createdOrders.push(order);
      }

      setStep('payment');
      let paymentResult;
      if (paymentMethod === 'card') {
        paymentResult = await createToken({
          number: card.number.replace(/\s/g, ''),
          expiration_month: card.expiration_month,
          expiration_year: card.expiration_year,
          security_code: card.security_code,
          name: card.name || 'Cardholder',
        });
      } else {
        paymentResult = await createSource({
          amount: totalPrice,
          currency: 'THB',
        });
      }

      if (paymentResult?.tokenId || paymentResult?.sourceId) {
        for (const order of createdOrders) {
          await updateOrderStatus(order.id, { status: 'paid' });
        }
        clearCart();
        const orderIds = createdOrders.map((o) => o.orderId);
        navigate('/checkout/success', { state: { orderIds } });
      } else {
        setError('ชำระเงินไม่สำเร็จ');
      }
    } catch (err) {
      setError(err.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ');
    } finally {
      setSubmitting(false);
      setStep('');
    }
  };

  if (items.length === 0 && !submitting) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto px-4 py-16 text-center">
          <p className="text-gray-600 mb-6">ตะกร้าว่าง</p>
          <Link
            to="/cart"
            className="inline-block bg-[#F97316] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#EA580C] transition-colors"
          >
            ไปตะกร้า
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const stepLabel =
    step === 'order'
      ? 'กำลังสร้างคำสั่งซื้อ...'
      : step === 'payment'
        ? 'กำลังชำระเงิน...'
        : '';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 w-full">
        {/* Mascot แมวข้าง heading ชำระเงิน */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <img
            src={logoImg}
            alt="iJerd TOPUP"
            className="mascot-float mascot-hover w-14 h-14 md:w-16 md:h-16 object-contain transition-transform duration-300 flex-shrink-0"
          />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            ชำระเงิน
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="order-2 md:order-1">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
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
                        ฿{subtotal.toFixed(2)}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                <span className="font-bold text-gray-900">ราคารวม</span>
                <span className="text-xl font-bold text-[#F97316]">
                  ฿{totalPrice.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <form
              onSubmit={handleSubmit}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-900">
                ข้อมูลสำหรับแจ้งเติม
              </h2>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="inGameUsername" className="block text-sm font-semibold text-gray-700 mb-1">
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
                  <label htmlFor="server" className="block text-sm font-semibold text-gray-700 mb-1">Server</label>
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
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1">เบอร์โทร (สำหรับแจ้งเติม)</label>
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

              <div>
                <p className="block text-sm font-semibold text-gray-700 mb-2">ช่องทางชำระเงิน</p>
                <div className="flex gap-4">
                  {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
                    <label
                      key={value}
                      className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg border-2 transition-colors ${
                        paymentMethod === value
                          ? 'border-[#F97316] bg-orange-50 text-[#F97316]'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={value}
                        checked={paymentMethod === value}
                        onChange={() => setPaymentMethod(value)}
                        disabled={submitting}
                        className="sr-only"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <p className="text-sm font-semibold text-gray-700">ข้อมูลบัตร (Test: 4242 4242 4242 4242)</p>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">เลขบัตร</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength="19"
                      value={card.number}
                      onChange={(e) => setCard((c) => ({ ...c, number: e.target.value.replace(/\D/g, '') }))}
                      disabled={submitting}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="4242 4242 4242 4242"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">เดือน/ปี (MM/YY)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="MM"
                          maxLength="2"
                          value={card.expiration_month}
                          onChange={handleCardChange}
                          name="expiration_month"
                          disabled={submitting}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316] outline-none"
                        />
                        <input
                          type="text"
                          placeholder="YY"
                          maxLength="2"
                          value={card.expiration_year}
                          onChange={handleCardChange}
                          name="expiration_year"
                          disabled={submitting}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316] outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">CVC</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength="4"
                        value={card.security_code}
                        onChange={handleCardChange}
                        name="security_code"
                        disabled={submitting}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316] outline-none"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">ชื่อบนบัตร</label>
                    <input
                      type="text"
                      value={card.name}
                      onChange={handleCardChange}
                      name="name"
                      disabled={submitting}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F97316] outline-none"
                      placeholder="Cardholder Name"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'promptpay' && (
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200">
                  <p className="text-sm text-gray-700">
                    เลือกชำระด้วย PromptPay ระบบจะสร้าง QR / ลิงก์ชำระ (Test mode ไม่มีการโอนจริง)
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  to="/cart"
                  className="flex-1 text-center py-3 px-4 rounded-lg border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  กลับไปตะกร้า
                </Link>
                <button
                  type="submit"
                  disabled={submitting || !omiseReady}
                  className="flex-1 py-3 px-4 rounded-lg bg-[#F97316] text-white font-semibold hover:bg-[#EA580C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {stepLabel || 'กำลังดำเนินการ...'}
                    </>
                  ) : !omiseReady ? (
                    'กำลังโหลด Omise...'
                  ) : (
                    'ยืนยันสั่งซื้อ'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
