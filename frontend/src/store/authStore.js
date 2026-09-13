import { create } from 'zustand';
import axios from 'axios';
import { jwtDecode } from "jwt-decode"; 

const API_URL = 'http://127.0.0.1:8000/api';

export const useAuthStore = create((set) => ({
  user: localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Login Action
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      // 🔴 FIX: 'username' ki jagah 'email' bhejna hai kyunki backend wahi maang raha hai
      const response = await axios.post(`${API_URL}/token/`, { 
        email: email, 
        password: password 
      });
      
      const { access, refresh } = response.data; 
      
      localStorage.setItem('token', access);
      localStorage.setItem('refreshToken', refresh); 
      
      const decodedUser = jwtDecode(access);

      set({ 
        token: access, 
        user: decodedUser, 
        isAuthenticated: true, 
        isLoading: false 
      });
      
      return true; // Login success
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      set({ 
        error: error.response?.data?.detail || error.response?.data?.email?.[0] || 'Invalid email or password.', 
        isLoading: false 
      });
      return false;
    }
  },

  // Logout Action
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null })
}));