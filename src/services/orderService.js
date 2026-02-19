import { collection, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

/**
 * โครงสร้างข้อมูลคำสั่งซื้อ (Order document schema):
 * - userId: string (auth.uid - ใช้ใน Security Rules ให้ user อ่านได้เฉพาะของตัวเอง)
 * - orderId: string (สร้างอัตโนมัติ)
 * - gameName: string (ชื่อเกม)
 * - targetId: string (Game ID ของผู้ใช้)
 * - amount: number (จำนวนเงิน)
 * - packageName: string (ชื่อแพ็คเกจ - ไม่บังคับ)
 * - status: string (สถานะ: pending, completed, cancelled)
 * - timestamp: Timestamp (เวลาที่สร้าง)
 */

const ORDERS_COLLECTION = 'orders';

/**
 * สร้างรหัสคำสั่งซื้อที่ไม่ซ้ำกัน (Order ID)
 * @returns {string} Order ID ในรูปแบบ ORD-YYYYMMDD-HHMMSS-XXXX
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
 * สร้างคำสั่งซื้อใหม่ใน Firestore
 * ต้องล็อกอินก่อน (userId จะถูกใส่จาก auth.currentUser.uid เพื่อให้ Rules อนุญาตและให้ user อ่าน order ของตัวเองได้เท่านั้น)
 *
 * @param {Object} orderData - ข้อมูลคำสั่งซื้อ
 * @param {string} orderData.gameName - ชื่อเกม
 * @param {string} orderData.targetId - Game ID ของผู้ใช้
 * @param {number} orderData.amount - จำนวนเงิน
 * @param {string} [orderData.packageName] - ชื่อแพ็คเกจ (ไม่บังคับ)
 * @param {string} [orderData.server] - เซิร์ฟเวอร์ (ไม่บังคับ, สำหรับติดต่อ)
 * @param {string} [orderData.phone] - เบอร์โทรศัพท์ (ไม่บังคับ, สำหรับติดต่อ)
 * @returns {Promise<Object>} คำสั่งซื้อที่สร้างขึ้น
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
 * อัปเดตสถานะ order (เช่น เป็น paid หลังชำระผ่าน Omise)
 * @param {string} orderDocId - Firestore document id ของ order
 * @param {Object} updates - ฟิลด์ที่ต้องการอัปเดต เช่น { status: 'paid' }
 */
export const updateOrderStatus = async (orderDocId, updates) => {
  try {
    const orderRef = doc(db, ORDERS_COLLECTION, orderDocId);
    await updateDoc(orderRef, updates);
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error(error.message || 'Failed to update order');
  }
};

/**
 * สร้างข้อมูล QR Code สำหรับชำระเงิน
 * @param {Object} order - วัตถุข้อมูลคำสั่งซื้อ
 * @returns {string} ข้อมูล QR Code หรือลิงก์ชำระเงิน
 */
export const generatePaymentQRData = (order) => {
  // สามารถปรับแต่งรูปแบบตามผู้ให้บริการชำระเงินของคุณ
  // ตัวอย่าง: payment://order?orderId=ORD-xxx&amount=xxx
  const qrData = {
    orderId: order.orderId,
    amount: order.amount,
    gameName: order.gameName,
    timestamp: new Date().toISOString(),
  };

  // ส่งคืนเป็น JSON string หรือ URL ชำระเงิน
  return JSON.stringify(qrData);

  // ทางเลือก: ส่งคืน URL ชำระเงินถ้ามี payment gateway
  // return `https://payment.example.com/pay?orderId=${order.orderId}&amount=${order.amount}`;
};
