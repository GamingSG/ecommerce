// src/context/CartContext.jsx — Shopping cart state
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const initialState = {
  items: [],
  totalPrice: 0,
  loading: false,
  itemCount: 0,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'CART_LOADING':  return { ...state, loading: true };
    case 'SET_CART': {
      const cart = action.payload;
      const itemCount = cart.items?.reduce((a, i) => a + i.quantity, 0) || 0;
      return { ...state, loading: false, items: cart.items || [], totalPrice: cart.totalPrice || 0, itemCount };
    }
    case 'CLEAR_CART':    return { ...initialState };
    case 'CART_DONE':     return { ...state, loading: false };
    default:              return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user } = useAuth();

  // Fetch cart when user logs in
  const fetchCart = useCallback(async () => {
    if (!user) { dispatch({ type: 'CLEAR_CART' }); return; }
    dispatch({ type: 'CART_LOADING' });
    try {
      const { data } = await cartAPI.get();
      dispatch({ type: 'SET_CART', payload: data.data });
    } catch {
      dispatch({ type: 'CART_DONE' });
    }
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await cartAPI.add({ productId, quantity });
      dispatch({ type: 'SET_CART', payload: data.data });
      toast.success('Added to cart! 🛒');
    } catch (err) {
      toast.error(err.message || 'Failed to add to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const { data } = await cartAPI.update(productId, { quantity });
      dispatch({ type: 'SET_CART', payload: data.data });
    } catch (err) {
      toast.error(err.message || 'Failed to update cart');
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartAPI.remove(productId);
      dispatch({ type: 'SET_CART', payload: { items: state.items.filter(i => i.product._id !== productId), totalPrice: 0 } });
      fetchCart(); // re-fetch for accurate total
      toast.success('Item removed');
    } catch (err) {
      toast.error(err.message || 'Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      dispatch({ type: 'CLEAR_CART' });
    } catch { /* silent */ }
  };

  return (
    <CartContext.Provider value={{ ...state, addToCart, updateQuantity, removeFromCart, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
};
