/**
 * Admin Dashboard – route /admin (เฉพาะ admin: user.uid === VITE_ADMIN_UID)
 * Real-time orders (onSnapshot), table, filter status, ปุ่ม "เติมแล้ว", stats
 */
import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { updateOrderStatus } from '../services/orderService';
import { ADMIN_UID, isAdmin } from '../config/admin';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import logoImg from '@/assets/logo.png';

const ORDERS_COLLECTION = 'orders';
const STATUS_OPTIONS = [
  { value: '', label: 'ทั้งหมด' },
  { value: 'pending', label: 'รอเติม' },
  { value: 'paid', label: 'ชำระแล้ว' },
  { value: 'completed', label: 'เติมแล้ว' },
];

function formatDate(timestamp) {
  if (!timestamp?.toDate) return '–';
  const d = timestamp.toDate();
  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('pending');
  const [updatingId, setUpdatingId] = useState(null);

  const isAdminUser = useMemo(() => user && isAdmin(user.uid), [user]);

  useEffect(() => {
    if (!user) return;
    if (!isAdminUser) {
      navigate('/admin/login', { replace: true });
      return;
    }
  }, [user, isAdminUser, navigate]);

  useEffect(() => {
    if (!isAdminUser) return;
    setLoading(true);
    setError(null);
    const ordersRef = collection(db, ORDERS_COLLECTION);
    const q = query(ordersRef, orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp,
        }));
        setOrders(list);
        setError(null);
        setLoading(false);
      },
      (err) => {
        console.error('Orders snapshot error:', err);
        setError(err.message || 'โหลด orders ไม่สำเร็จ');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [isAdminUser]);

  const filteredOrders = useMemo(() => {
    if (!statusFilter) return orders;
    return orders.filter((o) => (o.status || 'pending') === statusFilter);
  }, [orders, statusFilter]);

  const stats = useMemo(() => {
    const todayStart = startOfToday();
    let todayTotal = 0;
    let grandTotal = 0;
    orders.forEach((o) => {
      const amount = Number(o.amount) || 0;
      const isPaidOrCompleted = o.status === 'paid' || o.status === 'completed';
      if (isPaidOrCompleted) grandTotal += amount;
      if (isPaidOrCompleted && o.timestamp?.toDate && o.timestamp.toDate() >= todayStart) {
        todayTotal += amount;
      }
    });
    return { todayTotal, grandTotal };
  }, [orders]);

  const handleMarkCompleted = async (docId) => {
    try {
      setUpdatingId(docId);
      await updateOrderStatus(docId, { status: 'completed' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'อัปเดตสถานะไม่สำเร็จ');
    } finally {
      setUpdatingId(null);
    }
  };

  if (authLoading || (user && !isAdminUser)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#F97316] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header + Mascot */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
          <img
            src={logoImg}
            alt="iJerd TOPUP"
            className="mascot-float w-16 h-16 sm:w-20 sm:h-20 object-contain flex-shrink-0"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              จัดการคำสั่งเติมเกม real-time
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="rounded-xl bg-[#F97316] text-white p-5 shadow-lg">
            <p className="text-orange-100 text-sm font-medium">ยอดวันนี้</p>
            <p className="text-2xl md:text-3xl font-bold">฿{stats.todayTotal.toFixed(0)}</p>
          </div>
          <div className="rounded-xl bg-orange-600 text-white p-5 shadow-lg">
            <p className="text-orange-100 text-sm font-medium">ยอดรวม (ชำระแล้ว/เติมแล้ว)</p>
            <p className="text-2xl md:text-3xl font-bold">฿{stats.grandTotal.toFixed(0)}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Filter */}
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <label className="text-sm font-semibold text-gray-700">สถานะ:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || 'all'} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-2 border-[#F97316] border-t-transparent" />
              <p className="mt-4 text-gray-600">กำลังโหลด orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="py-16 text-center text-gray-500">
              <p>ไม่มีคำสั่งซื้อในสถานะนี้</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-[#F97316] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">User</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Game</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold">Amount</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">UID / Server</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold w-28">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const status = order.status || 'pending';
                    const canComplete = status === 'paid' || status === 'pending';
                    return (
                      <tr key={order.id} className="bg-white hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 text-sm font-mono text-gray-900">
                          {order.orderId || order.id}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {order.userId ? `${order.userId.slice(0, 8)}…` : '–'}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {order.gameName || '–'}
                        </td>
                        <td className="px-4 py-3 text-sm text-right font-semibold text-[#F97316]">
                          ฿{Number(order.amount || 0).toFixed(0)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <span className="font-mono">{order.targetId || '–'}</span>
                          {order.server && (
                            <span className="text-gray-500 ml-1"> · {order.server}</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                              status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : status === 'paid'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {status === 'completed' ? 'เติมแล้ว' : status === 'paid' ? 'ชำระแล้ว' : 'รอเติม'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {formatDate(order.timestamp)}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {canComplete && (
                            <button
                              type="button"
                              onClick={() => handleMarkCompleted(order.id)}
                              disabled={updatingId === order.id}
                              className="px-3 py-1.5 rounded-lg bg-[#F97316] text-white text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-colors"
                            >
                              {updatingId === order.id ? '...' : 'เติมแล้ว'}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-gray-500">
          ตั้งค่า Admin UID ใน .env: <code className="bg-gray-100 px-1 rounded">VITE_ADMIN_UID=your-firebase-uid</code>
          {ADMIN_UID === 'YOUR_ADMIN_UID_HERE' && (
            <span className="text-amber-600 ml-2">(ยังไม่ได้ตั้ง – ใส่ใน .env)</span>
          )}
        </p>
      </div>
      <Footer />
    </div>
  );
}
