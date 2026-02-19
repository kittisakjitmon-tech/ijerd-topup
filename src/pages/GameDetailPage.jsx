import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { getGameById } from '../data/mockData';
// import { useCart } from '../context/CartContext'; // Keep context for cart if needed, though direct pay is requested

const PAYMENT_METHODS = [
  { id: 'qrcode', name: 'QR PromptPay', icon: '🏦', color: 'bg-blue-600' },
  { id: 'truemoney', name: 'TrueMoney Wallet', icon: '💰', color: 'bg-orange-500' },
];

export default function GameDetailPage() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form States
  const [inputs, setInputs] = useState({});
  const [selectedPack, setSelectedPack] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('qrcode');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        setLoading(true);
        const data = await getGameById(gameId);
        if (!data) throw new Error('ไม่พบเกมนี้');
        setGame(data);
        // Initialize inputs
        if (data.inputFields) {
          const initialInputs = {};
          data.inputFields.forEach(field => initialInputs[field.name] = '');
          setInputs(initialInputs);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchGame();
  }, [gameId]);

  const handleInputChange = (e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePayNow = () => {
    // Validation
    const missingField = game.inputFields.find(f => !inputs[f.name]);
    if (missingField) {
      alert(`กรุณากรอก ${missingField.label}`);
      return;
    }
    if (!selectedPack) {
      alert('กรุณาเลือกแพ็คเกจ');
      return;
    }

    setShowPaymentModal(true);
    setIsProcessing(true);

    // Simulate Payment Process
    setTimeout(() => {
      setIsProcessing(false);
      navigate('/checkout/success');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-[#F97316]" />
        </div>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center flex-col">
          <p className="text-red-500 text-xl font-bold mb-4">{error}</p>
          <Link to="/" className="text-[#F97316] underline">กลับหน้าแรก</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-48 md:h-64 lg:h-80 w-full overflow-hidden">
        <img
          src={game.coverImage || game.image}
          alt={game.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-6 flex items-center gap-4">
            <img src={game.image} alt="Icon" className="w-20 h-20 md:w-24 md:h-24 rounded-2xl shadow-lg border-2 border-white/20" />
            <div>
              <h1 className="text-white text-3xl md:text-4xl font-extrabold drop-shadow-md">{game.name}</h1>
              <p className="text-white/80 text-sm md:text-base">{game.category} • บริการเติมเงินอัตโนมัติ 24 ชม.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Column: Input Section */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="bg-[#F97316] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                ข้อมูลบัญชี
              </h2>
              <div className="space-y-4">
                {game.inputFields.map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">{field.label}</label>
                    <input
                      type={field.type || 'text'}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={inputs[field.name]}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#F97316] focus:ring-4 focus:ring-orange-100 transition-all outline-none"
                    />
                  </div>
                ))}
                <div className="bg-orange-50 text-orange-700 text-xs p-3 rounded-lg">
                  ⚠️ โปรดตรวจสอบข้อมูลให้ถูกต้อง การเติมเงินผิดบัญชีไม่สามารถขอคืนเงินได้
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Packages & Payment */}
          <div className="lg:col-span-8 space-y-8">

            {/* Step 2: Select Package */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-[#F97316] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                เลือกแพ็กเกจ
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {game.packages?.map((pack) => (
                  <button
                    key={pack.id}
                    onClick={() => setSelectedPack(pack)}
                    className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center text-center group ${selectedPack?.id === pack.id
                        ? 'border-[#F97316] bg-orange-50/50 shadow-md transform scale-[1.02]'
                        : 'border-gray-100 hover:border-orange-200 hover:bg-gray-50'
                      }`}
                  >
                    {pack.bonus && (
                      <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-lg">
                        {pack.bonus}
                      </div>
                    )}
                    <div className="text-gray-800 font-bold text-lg mb-1">{pack.name}</div>
                    <div className={`text-xl font-extrabold ${selectedPack?.id === pack.id ? 'text-[#F97316]' : 'text-gray-600'}`}>
                      ฿{pack.price}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="bg-[#F97316] text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
                ช่องทางชำระเงิน
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${paymentMethod === method.id
                        ? 'border-[#F97316] bg-orange-50'
                        : 'border-gray-100 hover:border-gray-200'
                      }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${method.color} text-white`}>
                      {method.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-800">{method.name}</div>
                      <div className="text-xs text-gray-500">ฟรีค่าธรรมเนียม</div>
                    </div>
                    {paymentMethod === method.id && (
                      <div className="ml-auto text-[#F97316]">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Bar */}
            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-gray-400 text-sm">ยอดรวมทั้งสิ้น</div>
                <div className="text-3xl font-bold text-[#F97316]">
                  ฿{selectedPack ? selectedPack.price : '0'}
                </div>
              </div>
              <button
                onClick={handlePayNow}
                disabled={!selectedPack}
                className="w-full md:w-auto px-8 py-4 bg-[#F97316] hover:bg-orange-600 text-white font-bold rounded-xl text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ชำระเงินทันที
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Payment Simulation Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl animate-bounce-in">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">สแกนจ่าย</h3>
            <p className="text-gray-500 mb-6">กรุณาสแกน QR Code เพื่อชำระเงิน</p>

            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 inline-block mb-6 relative">
              {isProcessing ? (
                <div className="w-48 h-48 bg-gray-100 flex items-center justify-center rounded-lg">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-[#F97316]" />
                </div>
              ) : (
                <div className="w-48 h-48 bg-gray-900 rounded-lg flex items-center justify-center text-white">QR Code</div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-[1px]">
                  <p className="font-bold text-[#F97316] animate-pulse">กำลังตรวจสอบยอดเงิน...</p>
                </div>
              )}
            </div>

            <div className="text-left bg-gray-50 p-4 rounded-xl space-y-2 text-sm text-gray-600 mb-6">
              <div className="flex justify-between">
                <span>สินค้า:</span>
                <span className="font-bold text-gray-800">{selectedPack?.name}</span>
              </div>
              <div className="flex justify-between">
                <span>ราคา:</span>
                <span className="font-bold text-[#F97316]">฿{selectedPack?.price}</span>
              </div>
            </div>

            <p className="text-xs text-gray-400">ระบบจะดำเนินการอัตโนมัติเมื่อท่านชำระเงินเสร็จสิ้น</p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
