// src/context/AuthContext.jsx — Global authentication state
import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

const initialState = {
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
};

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_START':     return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':   return { ...state, loading: false, user: action.payload, error: null };
    case 'AUTH_FAILURE':   return { ...state, loading: false, error: action.payload };
    case 'UPDATE_USER':    return { ...state, user: { ...state.user, ...action.payload } };
    case 'LOGOUT':         return { ...state, user: null, error: null };
    default:               return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Persist user to localStorage on change
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
  }, [state.user]);

  const register = async (formData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data } = await authAPI.register(formData);
      dispatch({ type: 'AUTH_SUCCESS', payload: data.data });
      toast.success('Account created successfully! Welcome 🎉');
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Registration failed';
      dispatch({ type: 'AUTH_FAILURE', payload: msg });
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const login = async (credentials) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const { data } = await authAPI.login(credentials);
      dispatch({ type: 'AUTH_SUCCESS', payload: data.data });
      toast.success(`Welcome back, ${data.data.name}! 👋`);
      return { success: true, user: data.data };
    } catch (err) {
      const msg = err.message || 'Login failed';
      dispatch({ type: 'AUTH_FAILURE', payload: msg });
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    toast.success('Logged out successfully');
  };

  const updateProfile = async (formData) => {
    try {
      const { data } = await authAPI.updateProfile(formData);
      dispatch({ type: 'AUTH_SUCCESS', payload: data.data });
      toast.success('Profile updated!');
      return { success: true };
    } catch (err) {
      toast.error(err.message || 'Update failed');
      return { success: false };
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
