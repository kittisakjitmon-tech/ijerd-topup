import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

/**
 * Order document schema (Firestore):
 * - userId: string (auth.uid - ใช้ใน Security Rules ให้ user อ่านได้เฉพาะของตัวเอง)
 * - orderId: string (generated)
 * - gameName: string
 * - targetId: string (user's Game ID)
 * - amount: number
 * - packageName: string (optional)
 * - status: string (pending, completed, cancelled)
 * - timestamp: Timestamp
 */

const ORDERS_COLLECTION = 'orders';

/**
 * Generates a unique order ID
 * @returns {string} Order ID in format ORD-YYYYMMDD-HHMMSS-XXXX
 */
const generateOrderId = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

/**
 * Creates a new order in Firestore.
 * ต้องล็อกอินก่อน (userId จะถูกใส่จาก auth.currentUser.uid เพื่อให้ Rules อนุญาตและให้ user อ่าน order ของตัวเองได้เท่านั้น)
 *
 * @param {Object} orderData - Order data
 * @param {string} orderData.gameName - Name of the game
 * @param {string} orderData.targetId - User's Game ID
 * @param {number} orderData.amount - Order amount
 * @param {string} [orderData.packageName] - Package name (optional)
 * @param {string} [orderData.server] - Server (optional, for contact)
 * @param {string} [orderData.phone] - Phone number (optional, for contact)
 * @returns {Promise<Object>} Created order
 */
export const createOrder = async (orderData) => {
  try {
    const { gameName, targetId, amount, packageName, server, phone } = orderData;

    if (!gameName || !targetId || amount == null) {
      throw new Error('Game name, target ID, and amount are required');
    }

    const numAmount = Number(amount);
    if (numAmount <= 0 || Number.isNaN(numAmount)) {
      throw new Error('Amount must be greater than 0');
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error('ต้องเข้าสู่ระบบก่อนสร้างคำสั่งซื้อ');
    }

    const orderId = generateOrderId();
    const payload = {
      userId: currentUser.uid,
      orderId,
      gameName: String(gameName),
      targetId: String(targetId),
      amount: numAmount,
      packageName: packageName ?? null,
      server: server ? String(server) : null,
      phone: phone ? String(phone) : null,
      status: 'pending',
      timestamp: serverTimestamp(),
    };

    const orderRef = collection(db, ORDERS_COLLECTION);
    const docRef = await addDoc(orderRef, payload);

    return {
      id: docRef.id,
      orderId: payload.orderId,
      userId: payload.userId,
      gameName: payload.gameName,
      targetId: payload.targetId,
      amount: payload.amount,
      packageName: payload.packageName,
      server: payload.server,
      phone: payload.phone,
      status: payload.status,
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error(error.message || 'Failed to create order');
  }
};

/**
 * Generates a payment QR code data string
 * @param {Object} order - Order object
 * @returns {string} QR code data string
 */
export const generatePaymentQRData = (order) => {
  // You can customize this to match your payment provider's format
  // Example format: payment://order?orderId=ORD-xxx&amount=xxx
  const qrData = {
    orderId: order.orderId,
    amount: order.amount,
    gameName: order.gameName,
    timestamp: new Date().toISOString(),
  };
  
  // Return as JSON string or payment URL format
  // Adjust this based on your payment provider's requirements
  return JSON.stringify(qrData);
  
  // Alternative: Return payment URL if you have a payment gateway
  // return `https://payment.example.com/pay?orderId=${order.orderId}&amount=${order.amount}`;
};
