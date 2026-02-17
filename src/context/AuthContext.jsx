import { createContext, useContext } from 'react';
import { useAuthLogic } from '../hooks/useAuth';

const AuthContext = createContext(null);

/**
 * AuthContext – provide user และฟังก์ชัน auth ทั่วแอป
 * - ใช้ onAuthStateChanged (ใน useAuthLogic) เพื่อ sync สถานะกับ Firebase
 * - ค่าใน context: user, loading, error, clearError, login, register, logout, signInWithGoogle, googleSignIn
 * ต้องห่อแอปด้วย <AuthProvider> (ใน main.jsx)
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
