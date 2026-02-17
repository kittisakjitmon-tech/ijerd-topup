import { createContext, useContext, useReducer, useEffect } from 'react';

const CART_STORAGE_KEY = 'ijerdtopup_cart';

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD': {
      return Array.isArray(action.payload) ? action.payload : [];
    }
    case 'ADD_ITEM': {
      const { gameId, name, price, image, quantity = 1 } = action.payload;
      const numPrice = Number(price) || 0;
      const existing = state.find((i) => i.gameId === gameId);
      let next;
      if (existing) {
        next = state.map((i) =>
          i.gameId === gameId
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        next = [
          ...state,
          { gameId, name, price: numPrice, image: image || '', quantity },
        ];
      }
      return next;
    }
    case 'REMOVE_ITEM': {
      return state.filter((i) => i.gameId !== action.payload);
    }
    case 'UPDATE_QUANTITY': {
      const { gameId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((i) => i.gameId !== gameId);
      }
      return state.map((i) =>
        i.gameId === gameId ? { ...i, quantity } : i
      );
    }
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
};

const CartContext = createContext(null);

function loadStoredCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], (initial) => {
    if (typeof window === 'undefined') return initial;
    return loadStoredCart();
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (item) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        gameId: item.id || item.gameId,
        name: item.name,
        price: item.price ?? 0,
        image: item.imageUrl || item.image || '',
        quantity: item.quantity ?? 1,
      },
    });
  };

  const removeFromCart = (gameId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: gameId });
  };

  const updateQuantity = (gameId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { gameId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const totalItems = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.price || 0) * (i.quantity || 0), 0);

  const value = {
    items,
    totalItems,
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
