/**
 * Admin config – ใส่ VITE_ADMIN_UID ใน .env
 * เฉพาะ user.uid นี้ถึงเข้า /admin ได้
 */
export const ADMIN_UID = import.meta.env.VITE_ADMIN_UID || 'YOUR_ADMIN_UID_HERE';

export function isAdmin(uid) {
  return !!uid && uid === ADMIN_UID;
}
