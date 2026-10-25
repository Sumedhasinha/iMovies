// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { storage, STORAGE_KEYS } from '../utils/storage';
import * as api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.get(STORAGE_KEYS.AUTH_USER, null));
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function verifySession() {
      const storedToken = storage.get(STORAGE_KEYS.AUTH_TOKEN, null);
      if (storedToken) {
        const res = await api.getMe();
        if (res.success && res.data) {
          setUser(res.data);
          return;
        }
      }
      const stored = storage.get(STORAGE_KEYS.AUTH_USER, null);
      if (stored) {
        setUser(stored);
      }
    }
    verifySession();
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      if (res.success) {
        setUser(res.data);
        toast.success(`Welcome back, ${res.data.name}!`);
        return { success: true };
      } else {
        toast.error(res.error || 'Login failed');
        return { success: false, error: res.error };
      }
    } catch (err) {
      toast.error('An unexpected error occurred during login');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.signup({ name, email, password });
      if (res.success) {
        setUser(res.data);
        toast.success(`Welcome to IMovies VIP, ${res.data.name}!`);
        return { success: true };
      } else {
        toast.error(res.error || 'Signup failed');
        return { success: false, error: res.error };
      }
    } catch (err) {
      toast.error('An unexpected error occurred during signup');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
    toast.info('You have been signed out.');
  };

  // Quick Demo Login helper for easy testing
  const quickDemoLogin = async () => {
    return login('alex.morgan@imovies.vip', 'CinemaPass2026!');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        signup,
        logout,
        quickDemoLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
