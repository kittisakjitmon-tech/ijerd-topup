import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Order schema:
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
 * Creates a new order in Firestore
 * @param {Object} orderData - Order data object
 * @param {string} orderData.gameName - Name of the game
 * @param {string} orderData.targetId - User's Game ID
 * @param {number} orderData.amount - Order amount
 * @param {string} orderData.packageName - Package name (optional)
 * @returns {Promise<Object>} Created order object with orderId
 */
export const createOrder = async (orderData) => {
  try {
    const { gameName, targetId, amount, packageName } = orderData;
    
    // Validate required fields
    if (!gameName || !targetId || !amount) {
      throw new Error('Game name, target ID, and amount are required');
    }
    
    if (amount <= 0) {
      throw new Error('Amount must be greater than 0');
    }
    
    const orderId = generateOrderId();
    
    const orderRef = collection(db, ORDERS_COLLECTION);
    const docRef = await addDoc(orderRef, {
      orderId,
      gameName,
      targetId,
      amount: Number(amount),
      packageName: packageName || null,
      status: 'pending',
      timestamp: serverTimestamp(),
    });
    
    return {
      id: docRef.id,
      orderId,
      gameName,
      targetId,
      amount: Number(amount),
      packageName: packageName || null,
      status: 'pending',
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw new Error(`Failed to create order: ${error.message}`);
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
