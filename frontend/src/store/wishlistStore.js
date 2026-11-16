// src/store/wishlistStore.js
import { create } from 'zustand';
import api from '../api';
import { useAuthStore } from './authStore';

const hasValidToken = () => {
  const storeToken = useAuthStore.getState()?.token;
  if (storeToken) return true;
  try {
    const localAuth = JSON.parse(localStorage.getItem('auth-store') || '{}');
    return Boolean(
      localAuth?.state?.token ||
      localStorage.getItem('access') ||
      localStorage.getItem('access_token') ||
      localStorage.getItem('token')
    );
  } catch {
    return false;
  }
};

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,

  fetchWishlist: async () => {
    if (!hasValidToken()) {
      set({ wishlist: [], loading: false });
      return;
    }

    set({ loading: true });
    try {
      const response = await api.get('wishlist/');
      set({ wishlist: response.data, loading: false });
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error('Failed to fetch wishlist:', error);
      }
      set({ wishlist: [], loading: false });
    }
  },

  toggleWishlist: async (productId) => {
    if (!hasValidToken()) {
      window.location.href = '/login';
      return;
    }

    try {
      await api.post('wishlist/toggle/', { product_id: productId });
      get().fetchWishlist();
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  },
}));