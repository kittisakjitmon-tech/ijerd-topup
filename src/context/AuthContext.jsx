import { createContext, useContext } from 'react';
import { useAuthLogic } from '../hooks/useAuth';

const AuthContext = createContext(null);

/**
 * ให้ user state และฟังก์ชัน login/register/logout ทั่วแอป
 * ใช้ onAuthStateChanged ใน useAuthLogic เพื่อ sync สถานะกับ Firebase
 */
export function AuthProvider({ children }) {
  const value = useAuthLogic();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
