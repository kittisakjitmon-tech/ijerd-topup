import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * โครงสร้างข้อมูลเกม (Game schema):
 * - name: string (ชื่อเกม)
 * - imageUrl: string (ลิงก์รูปภาพ)
 * - category: string (หมวดหมู่)
 * - active: boolean (สถานะการใช้งาน)
 * - priority: number (ลำดับความสำคัญ)
 */

const GAMES_COLLECTION = 'games';

/**
 * ดึงข้อมูลเกมที่เปิดใช้งานอยู่ เรียงตามลำดับความสำคัญ
 * @returns {Promise<Array>} อาร์เรย์ของวัตถุเกมที่มี id, name, imageUrl, category, active, priority
 */
export const fetchActiveGames = async () => {
  try {
    const gamesRef = collection(db, GAMES_COLLECTION);

    // Query: active === true, เรียงตาม priority (น้อยไปมาก)
    const q = query(
      gamesRef,
      where('active', '==', true),
      orderBy('priority', 'asc')
    );

    const querySnapshot = await getDocs(q);

    const games = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      imageUrl: doc.data().imageUrl,
      category: doc.data().category,
      active: doc.data().active,
      priority: doc.data().priority,
    }));

    return games;
  } catch (error) {
    console.error('Error fetching active games:', error);
    throw new Error(`Failed to fetch active games: ${error.message}`);
  }
};

/**
 * ดึงข้อมูลเกมทั้งหมด (ทั้งที่เปิดและปิดใช้งาน)
 * @returns {Promise<Array>} อาร์เรย์ของวัตถุเกมทั้งหมด
 */
export const fetchAllGames = async () => {
  try {
    const gamesRef = collection(db, GAMES_COLLECTION);
    const querySnapshot = await getDocs(gamesRef);

    const games = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      imageUrl: doc.data().imageUrl,
      category: doc.data().category,
      active: doc.data().active,
      priority: doc.data().priority,
    }));

    return games;
  } catch (error) {
    console.error('Error fetching all games:', error);
    throw new Error(`Failed to fetch all games: ${error.message}`);
  }
};

/**
 * ดึงข้อมูลเกมตาม ID
 * @param {string} gameId - รหัสเอกสารของเกม
 * @returns {Promise<Object>} วัตถุเกม หรือ null หากไม่พบ
 */
export const fetchGameById = async (gameId) => {
  try {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    const gameSnap = await getDoc(gameRef);

    if (!gameSnap.exists()) {
      return null;
    }

    return {
      id: gameSnap.id,
      name: gameSnap.data().name,
      imageUrl: gameSnap.data().imageUrl,
      category: gameSnap.data().category,
      active: gameSnap.data().active,
      priority: gameSnap.data().priority,
    };
  } catch (error) {
    console.error('Error fetching game by ID:', error);
    throw new Error(`Failed to fetch game: ${error.message}`);
  }
};

/**
 * ดึงข้อมูลเกมตามหมวดหมู่
 * @param {string} category - หมวดหมู่ที่ต้องการกรอง
 * @returns {Promise<Array>} อาร์เรย์ของวัตถุเกมในหมวดหมู่ที่ระบุ
 */
export const fetchGamesByCategory = async (category) => {
  try {
    const gamesRef = collection(db, GAMES_COLLECTION);
    const q = query(
      gamesRef,
      where('category', '==', category),
      where('active', '==', true),
      orderBy('priority', 'asc')
    );

    const querySnapshot = await getDocs(q);

    const games = querySnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      imageUrl: doc.data().imageUrl,
      category: doc.data().category,
      active: doc.data().active,
      priority: doc.data().priority,
    }));

    return games;
  } catch (error) {
    console.error('Error fetching games by category:', error);
    throw new Error(`Failed to fetch games by category: ${error.message}`);
  }
};

/**
 * สร้างเอกสารเกมใหม่
 * @param {Object} gameData - ข้อมูลเกม
 * @param {string} gameData.name - ชื่อเกม
 * @param {string} gameData.imageUrl - ลิงก์รูปภาพ
 * @param {string} gameData.category - หมวดหมู่
 * @param {boolean} gameData.active - สถานะการใช้งาน
 * @param {number} gameData.priority - ลำดับความสำคัญ
 * @returns {Promise<string>} รหัสของเอกสารที่สร้างใหม่
 */
export const createGame = async (gameData) => {
  try {
    const { name, imageUrl, category, active, priority } = gameData;

    // ตรวจสอบฟิลด์ที่จำเป็น
    if (!name || !imageUrl || !category) {
      throw new Error('Name, imageUrl, and category are required');
    }

    const gamesRef = collection(db, GAMES_COLLECTION);
    const docRef = await addDoc(gamesRef, {
      name,
      imageUrl,
      category,
      active: active !== undefined ? active : true,
      priority: priority !== undefined ? priority : 0,
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating game:', error);
    throw new Error(`Failed to create game: ${error.message}`);
  }
};

/**
 * อัปเดตข้อมูลเกม
 * @param {string} gameId - รหัสเอกสารของเกมที่จะอัปเดต
 * @param {Object} updates - ข้อมูลบางส่วนที่จะอัปเดต
 * @returns {Promise<void>}
 */
export const updateGame = async (gameId, updates) => {
  try {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    await updateDoc(gameRef, updates);
  } catch (error) {
    console.error('Error updating game:', error);
    throw new Error(`Failed to update game: ${error.message}`);
  }
};

/**
 * ลบข้อมูลเกม
 * @param {string} gameId - รหัสเอกสารของเกมที่จะลบ
 * @returns {Promise<void>}
 */
export const deleteGame = async (gameId) => {
  try {
    const gameRef = doc(db, GAMES_COLLECTION, gameId);
    await deleteDoc(gameRef);
  } catch (error) {
    console.error('Error deleting game:', error);
    throw new Error(`Failed to delete game: ${error.message}`);
  }
};
