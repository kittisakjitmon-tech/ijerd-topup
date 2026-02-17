import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../config/firebase';

/**
 * @param {React.ReactNode} children
 * @param {string} [redirectTo='/login'] - Where to redirect when not authenticated
 */
const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthenticated(true);
      } else {
        navigate(redirectTo);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate, redirectTo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#F97316]"></div>
          <p className="mt-4 text-gray-600">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  return authenticated ? children : null;
};

export default ProtectedRoute;
