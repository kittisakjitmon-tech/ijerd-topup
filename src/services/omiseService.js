/**
 * Omise Payment Gateway (Test Mode)
 *
 * Setup Omise account:
 * 1. สมัครที่ https://dashboard.omise.co/
 * 2. เปิด Test mode (สลับที่ dashboard)
 * 3. ที่ Keys > Public key คัดลอก pkey_test_xxx ไปใส่ใน .env เป็น VITE_OMISE_PUBLIC_KEY
 * 4. (Production) Secret key skey_xxx ใช้เฉพาะที่ backend เพื่อสร้าง charge จาก token/source
 *
 * Test card: 4242 4242 4242 4242 |  expiry อนาคต | security 123
 * PromptPay ใน test mode จะได้ source id กลับมา (ยังไม่มีการโอนจริง)
 */

const OMISE_SCRIPT_URL = 'https://cdn.omise.co/omise.js';

let scriptLoaded = false;

/**
 * โหลด Omise.js script จาก CDN (โหลดครั้งเดียว)
 * @returns {Promise<void>}
 */
export function loadOmiseScript() {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Omise runs in browser only'));
  }
  if (window.Omise) {
    return Promise.resolve();
  }
  if (scriptLoaded) {
    return new Promise((resolve) => {
      const check = () => {
        if (window.Omise) resolve();
        else setTimeout(check, 50);
      };
      check();
    });
  }
  scriptLoaded = true;
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = OMISE_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('โหลด Omise script ไม่สำเร็จ'));
    document.head.appendChild(script);
  });
}

/**
 * ตั้งค่า Public Key (เรียกหลัง loadOmiseScript)
 * @param {string} publicKey - VITE_OMISE_PUBLIC_KEY (pkey_test_xxx หรือ pkey_xxx)
 */
export function initOmise(publicKey) {
  if (!publicKey) throw new Error('Omise public key is required');
  if (!window.Omise) throw new Error('Omise script not loaded. Call loadOmiseScript() first.');
  window.Omise.setPublicKey(publicKey);
}

/**
 * สร้าง card token จาก Omise (ไม่ส่งข้อมูลบัตรไปที่ server ของเรา)
 * @param {Object} cardData - ข้อมูลบัตร
 * @param {string} cardData.number - เลขบัตร (ไม่มีช่องว่าง)
 * @param {number|string} cardData.expiration_month - เดือน (1-12)
 * @param {number|string} cardData.expiration_year - ปี (ค.ศ. เช่น 2030)
 * @param {string} cardData.security_code - CVC
 * @param {string} cardData.name - ชื่อบนบัตร
 * @returns {Promise<{ tokenId: string }>}
 */
export function createToken(cardData) {
  return new Promise((resolve, reject) => {
    if (!window.Omise) {
      reject(new Error('Omise script not loaded'));
      return;
    }
    const params = {
      number: String(cardData.number).replace(/\s/g, ''),
      expiration_month: parseInt(cardData.expiration_month, 10),
      expiration_year: parseInt(cardData.expiration_year, 10),
      security_code: String(cardData.security_code),
      name: String(cardData.name || 'Cardholder'),
    };
    window.Omise.createToken('card', params, (statusCode, response) => {
      if (statusCode === 200 && response.id) {
        resolve({ tokenId: response.id });
      } else {
        const msg = response?.message || response?.failure_message || 'สร้าง token ไม่สำเร็จ';
        reject(new Error(msg));
      }
    });
  });
}

/**
 * สร้าง Source สำหรับ PromptPay (QR / mobile banking)
 * จำนวนเงินเป็น satang (1 THB = 100 satang)
 * @param {Object} sourceData
 * @param {number} sourceData.amount - จำนวนเงิน (บาท) จะถูกแปลงเป็น satang
 * @param {string} [sourceData.currency='THB']
 * @returns {Promise<{ sourceId: string }>}
 */
export function createSource(sourceData) {
  const amountSatang = Math.round(Number(sourceData.amount) * 100) || 0;
  if (amountSatang < 100) {
    return Promise.reject(new Error('จำนวนเงินต้องอย่างน้อย 1 บาท'));
  }
  return new Promise((resolve, reject) => {
    if (!window.Omise) {
      reject(new Error('Omise script not loaded'));
      return;
    }
    const params = {
      amount: amountSatang,
      currency: sourceData.currency || 'THB',
    };
    window.Omise.createSource('promptpay', params, (statusCode, response) => {
      if (statusCode === 200 && response.id) {
        resolve({ sourceId: response.id });
      } else {
        const msg = response?.message || response?.failure_message || 'สร้าง PromptPay source ไม่สำเร็จ';
        reject(new Error(msg));
      }
    });
  });
}

/**
 * โหลด script + ตั้งค่า key (ใช้ก่อน createToken/createSource)
 * @param {string} publicKey - จาก import.meta.env.VITE_OMISE_PUBLIC_KEY
 */
export async function initOmisePayment(publicKey) {
  await loadOmiseScript();
  initOmise(publicKey);
}
