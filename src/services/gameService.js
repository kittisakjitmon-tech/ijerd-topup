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
 * Game schema:
 * - name: string
 * - imageUrl: string
 * - category: string
 * - active: boolean
 * - priority: number
 */

const GAMES_COLLECTION = 'games';

/**
 * Fetches all active games ordered by priority
 * @returns {Promise<Array>} Array of game objects with id, name, imageUrl, category, active, priority
 */
export const fetchActiveGames = async () => {
  try {
    const gamesRef = collection(db, GAMES_COLLECTION);
    
    // Query: active === true, ordered by priority (ascending)
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
 * Fetches all games (active and inactive)
 * @returns {Promise<Array>} Array of all game objects
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
 * Fetches a single game by ID
 * @param {string} gameId - The document ID of the game
 * @returns {Promise<Object>} Game object or null if not found
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
 * Fetches games by category
 * @param {string} category - The category to filter by
 * @returns {Promise<Array>} Array of game objects in the specified category
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
 * Creates a new game document
 * @param {Object} gameData - Game data object
 * @param {string} gameData.name - Game name
 * @param {string} gameData.imageUrl - Game image URL
 * @param {string} gameData.category - Game category
 * @param {boolean} gameData.active - Whether the game is active
 * @param {number} gameData.priority - Priority for ordering
 * @returns {Promise<string>} The ID of the newly created document
 */
export const createGame = async (gameData) => {
  try {
    const { name, imageUrl, category, active, priority } = gameData;
    
    // Validate required fields
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
 * Updates an existing game document
 * @param {string} gameId - The document ID of the game to update
 * @param {Object} updates - Partial game data to update
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
 * Deletes a game document
 * @param {string} gameId - The document ID of the game to delete
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
