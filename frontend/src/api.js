// src/api.js
import axios from 'axios';
import { useAuthStore } from './store/authStore';

const BASE_ORIGIN = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: `${BASE_ORIGIN}/api/`,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    let token = useAuthStore.getState()?.token;

    if (!token) {
      try {
        const localAuth = JSON.parse(localStorage.getItem('auth-store') || '{}');
        token =
          localAuth?.state?.token ||
          localStorage.getItem('access') ||
          localStorage.getItem('access_token') ||
          localStorage.getItem('token');
      } catch {
        token = null;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authState = useAuthStore.getState();
      if (typeof authState?.logout === 'function') {
        authState.logout();
      } else {
        useAuthStore.setState({ token: null, user: null, isAuthenticated: false });
      }
      localStorage.removeItem('auth-store');
      localStorage.removeItem('access');
      localStorage.removeItem('access_token');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;