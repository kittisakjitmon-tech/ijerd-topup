/**
 * GameDetailPage – route /games/:gameId
 * ดึง game จาก Firestore, form UID/Server/Username, เลือกแพ็ค/amount, ปุ่มเพิ่มลงตะกร้า
 * Validate UID, responsive, สี #F97316
 */
import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useGame } from '../hooks/useGame';
import { useCart } from '../context/CartContext';

const DEFAULT_PACKS = [
  { name: 'Starter', amount: 99 },
  { name: 'Standard', amount: 199 },
  { name: 'Premium', amount: 499 },
  { name: 'Ultimate', amount: 999 },
];

function validateUid(uid) {
  const u = (uid ?? '').toString().trim();
  if (!u) return 'กรุณากรอก UID / Game ID';
  if (u.length < 3) return 'UID ต้องมีอย่างน้อย 3 ตัวอักษร';
  if (u.length > 64) return 'UID ยาวเกินไป';
  return null;
}

export default function GameDetailPage() {
  const { gameId } = useParams();
  const { game, loading, error } = useGame(gameId);
  const { addToCart } = useCart();

  const [uid, setUid] = useState('');
  const [server, setServer] = useState('');
  const [username, setUsername] = useState('');
  const [selectedPack, setSelectedPack] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [formError, setFormError] = useState('');
  const [added, setAdded] = useState(false);

  const packs = useMemo(() => {
    if (game?.packages && Array.isArray(game.packages) && game.packages.length > 0) {
      return game.packages.map((p) => ({
        name: p.name ?? p.label ?? String(p.amount ?? p.price),
        amount: Number(p.amount ?? p.price ?? 0),
      })).filter((p) => p.amount > 0);
    }
    return DEFAULT_PACKS;
  }, [game]);

  const servers = useMemo(() => {
    if (game?.servers && Array.isArray(game.servers) && game.servers.length > 0) {
      return game.servers;
    }
    return null;
  }, [game]);

  const amount = useMemo(() => {
    if (selectedPack != null && packs[selectedPack]) {
      return packs[selectedPack].amount;
    }
    const n = parseFloat(customAmount);
    return Number.isFinite(n) && n > 0 ? n : 0;
  }, [selectedPack, packs, customAmount]);

  const priceLabel = amount > 0 ? `฿${amount.toFixed(0)}` : 'เลือกจำนวน';

  const handleAddToCart = (e) => {
    e.preventDefault();
    setFormError('');
    const uidError = validateUid(uid);
    if (uidError) {
      setFormError(uidError);
      return;
    }
    if (amount <= 0) {
      setFormError('กรุณาเลือกแพ็คหรือกรอกจำนวน');
      return;
    }
    addToCart({
      id: game.id,
      gameId: game.id,
      name: game.name,
      price: amount,
      imageUrl: game.imageUrl ?? game.image,
      image: game.imageUrl ?? game.image,
      quantity: 1,
      uid: uid.trim(),
      server: server.trim() || null,
      username: username.trim() || null,
      packageName: selectedPack != null && packs[selectedPack] ? packs[selectedPack].name : null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="text-center">
            <div className="inline-block w-12 h-12 border-2 border-[#F97316] border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-600">กำลังโหลดเกม...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 max-w-lg mx-auto px-4 py-16 text-center">
          <p className="text-red-600 mb-4">{error || 'ไม่พบเกมนี้'}</p>
          <Link to="/" className="text-[#F97316] font-semibold hover:underline">
            กลับหน้าแรก
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const imageUrl = game.imageUrl ?? game.image;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        <Link to="/" className="inline-flex items-center gap-1 text-gray-600 hover:text-[#F97316] text-sm mb-6">
          ← กลับหน้าแรก
        </Link>

        <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm mb-8">
          {imageUrl && (
            <div className="aspect-video bg-gray-100">
              <img
                src={imageUrl}
                alt={game.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
          <div className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{game.name}</h1>
            {game.description && (
              <p className="text-gray-600 text-sm mb-4">{game.description}</p>
            )}
          </div>
        </div>

        <form onSubmit={handleAddToCart} className="space-y-5">
          {/* UID */}
          <div>
            <label htmlFor="uid" className="block text-sm font-semibold text-gray-700 mb-1">
              UID / Game ID <span className="text-red-500">*</span>
            </label>
            <input
              id="uid"
              type="text"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="เช่น 123456789"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
              maxLength={64}
            />
            <p className="text-xs text-gray-500 mt-1">ตรวจสอบ UID ในเกมให้ถูกต้อง (ผิดแล้วเติมไม่เข้า)</p>
          </div>

          {/* Server / Zone */}
          <div>
            <label htmlFor="server" className="block text-sm font-semibold text-gray-700 mb-1">
              Server / Zone
            </label>
            {servers ? (
              <select
                id="server"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
              >
                <option value="">-- เลือก Server --</option>
                {servers.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            ) : (
              <input
                id="server"
                type="text"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                placeholder="เช่น Asia, Global (ถ้ามี)"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
              />
            )}
          </div>

          {/* Username (optional) */}
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-1">
              Username ในเกม (ถ้าต้องการ)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ไม่บังคับ"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
            />
          </div>

          {/* แพ็ค / จำนวน */}
          <div>
            <p className="block text-sm font-semibold text-gray-700 mb-2">เลือกแพ็ค / จำนวน</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {packs.map((p, idx) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => { setSelectedPack(idx); setCustomAmount(''); }}
                  className={`px-4 py-2 rounded-xl border-2 font-medium transition-colors ${
                    selectedPack === idx
                      ? 'border-[#F97316] bg-orange-50 text-[#F97316]'
                      : 'border-gray-200 text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {p.name} – ฿{p.amount.toFixed(0)}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                step="1"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedPack(null); }}
                placeholder="หรือกรอกจำนวน (บาท)"
                className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:ring-2 focus:ring-[#F97316] outline-none"
              />
              <span className="text-gray-500 text-sm">บาท</span>
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {formError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="submit"
              disabled={amount <= 0}
              className="flex-1 py-4 px-6 rounded-xl bg-[#F97316] text-white font-bold text-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg"
            >
              {added ? '✓ เพิ่มลงตะกร้าแล้ว!' : `เพิ่มลงตะกร้า – ${priceLabel}`}
            </button>
            <Link
              to="/cart"
              className="flex-1 py-4 px-6 rounded-xl border-2 border-[#F97316] text-[#F97316] font-bold text-center hover:bg-orange-50 transition-colors"
            >
              ไปตะกร้า
            </Link>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}
