import { createContext, useContext, useReducer, useEffect } from 'react';

const CART_STORAGE_KEY = 'ijerdtopup_cart';

/**
 * Cart item shape:
 * - cartLineId: string (unique per line, for remove/update)
 * - gameId, name, price, image, quantity
 * - uid: string (player UID/Game ID)
 * - server: string (optional)
 * - username: string (optional, in-game name)
 * - packageName: string (optional)
 */
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD': {
      return Array.isArray(action.payload) ? action.payload : [];
    }
    case 'ADD_ITEM': {
      const payload = action.payload;
      const gameId = payload.gameId ?? payload.id;
      const name = payload.name ?? '';
      const price = Number(payload.price) ?? 0;
      const image = payload.image ?? payload.imageUrl ?? '';
      const quantity = payload.quantity ?? 1;
      const uid = (payload.uid ?? '').toString().trim();
      const server = (payload.server ?? '').toString().trim();
      const username = (payload.username ?? '').toString().trim();
      const packageName = (payload.packageName ?? '').toString().trim() || null;

      const cartLineId = payload.cartLineId ?? `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      const sameLine = (i) =>
        i.gameId === gameId &&
        (i.uid ?? '') === uid &&
        (i.server ?? '') === server &&
        (i.packageName ?? '') === (packageName ?? '');

      const existing = state.find(sameLine);
      let next;
      if (existing) {
        next = state.map((i) =>
          sameLine(i)
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      } else {
        next = [
          ...state,
          {
            cartLineId,
            gameId,
            name,
            price,
            image,
            quantity,
            uid,
            server: server || null,
            username: username || null,
            packageName,
          },
        ];
      }
      return next;
    }
    case 'REMOVE_ITEM': {
      const key = action.payload;
      return state.filter((i) => i.cartLineId !== key && i.gameId !== key);
    }
    case 'UPDATE_QUANTITY': {
      const { cartLineId, quantity } = action.payload;
      if (quantity <= 0) {
        return state.filter((i) => i.cartLineId !== cartLineId);
      }
      return state.map((i) =>
        i.cartLineId === cartLineId ? { ...i, quantity } : i
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
    const list = Array.isArray(parsed) ? parsed : [];
    return list.map((i, idx) => ({
      ...i,
      cartLineId: i.cartLineId || `legacy-${i.gameId}-${idx}-${Date.now()}`,
      uid: i.uid ?? '',
      server: i.server ?? null,
      username: i.username ?? null,
      packageName: i.packageName ?? null,
    }));
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
    const cartLineId = `cart-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        cartLineId,
        gameId: item.id ?? item.gameId,
        name: item.name,
        price: item.price ?? 0,
        image: item.imageUrl ?? item.image ?? '',
        quantity: item.quantity ?? 1,
        uid: (item.uid ?? '').toString().trim(),
        server: (item.server ?? '').toString().trim() || null,
        username: (item.username ?? '').toString().trim() || null,
        packageName: item.packageName ?? null,
      },
    });
  };

  const removeFromCart = (cartLineIdOrGameId) => {
    dispatch({ type: 'REMOVE_ITEM', payload: cartLineIdOrGameId });
  };

  const updateQuantity = (cartLineId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartLineId, quantity } });
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
