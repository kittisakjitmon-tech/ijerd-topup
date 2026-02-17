import { useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';

/** แปลง Firebase auth error code เป็นข้อความภาษาไทย */
function authErrorToMessage(code, fallback) {
  const messages = {
    'auth/invalid-email': 'รูปแบบอีเมลไม่ถูกต้อง',
    'auth/user-disabled': 'บัญชีนี้ถูกปิดการใช้งาน',
    'auth/user-not-found': 'ไม่พบผู้ใช้ที่มีอีเมลนี้',
    'auth/wrong-password': 'รหัสผ่านไม่ถูกต้อง',
    'auth/invalid-credential': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'auth/email-already-in-use': 'อีเมลนี้ถูกใช้งานแล้ว',
    'auth/weak-password': 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร',
    'auth/too-many-requests': 'ลองบ่อยเกินไป กรุณารอสักครู่',
    'auth/network-request-failed': 'เชื่อมต่อเครือข่ายไม่ได้',
    'auth/popup-closed-by-user': 'ยกเลิกการเข้าสู่ระบบด้วย Google',
  };
  return messages[code] || fallback;
}

/**
 * useAuthLogic – Firebase Auth logic (ใช้ภายใน AuthProvider เท่านั้น)
 * - onAuthStateChanged: track user state ทั่วแอป
 * - return: user, loading, error, clearError, login, register, logout, signInWithGoogle, googleSignIn
 * ใน component ใช้ useAuth() จาก AuthContext ไม่ต้องเรียก useAuthLogic โดยตรง
 */
export function useAuthLogic() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const clearError = () => setError(null);

  const login = async (email, password) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(authErrorToMessage(err?.code, 'เข้าสู่ระบบไม่สำเร็จ'));
      throw err;
    }
  };

  const register = async (email, password) => {
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError(authErrorToMessage(err?.code, 'สมัครสมาชิกไม่สำเร็จ'));
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err) {
      setError(authErrorToMessage(err?.code, 'ออกจากระบบไม่สำเร็จ'));
      throw err;
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError(authErrorToMessage(err?.code, 'เข้าสู่ระบบด้วย Google ไม่สำเร็จ'));
      throw err;
    }
  };

  return {
    user,
    loading,
    error,
    clearError,
    login,
    register,
    logout,
    signInWithGoogle,
    /** Alias สำหรับ signInWithGoogle */
    googleSignIn: signInWithGoogle,
  };
}
