import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Fetch single game by id from Firestore.
 * Returns { game, loading, error }.
 * Game may include: name, imageUrl, price, description, category, packages[], servers[]
 */
export function useGame(gameId) {
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!gameId) {
      setGame(null);
      setLoading(false);
      setError(null);
      return;
    }
    let cancelled = false;
    const fetchGame = async () => {
      try {
        setLoading(true);
        setError(null);
        const ref = doc(db, 'games', gameId);
        const snap = await getDoc(ref);
        if (cancelled) return;
        if (!snap.exists()) {
          setGame(null);
          return;
        }
        setGame({ id: snap.id, ...snap.data() });
      } catch (err) {
        if (!cancelled) {
          console.error('Error fetching game:', err);
          setError(err.message || 'โหลดเกมไม่สำเร็จ');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchGame();
    return () => { cancelled = true; };
  }, [gameId]);

  return { game, loading, error };
}
