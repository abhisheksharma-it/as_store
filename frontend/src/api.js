import axios from 'axios';
import { useAuthStore } from './store/authStore';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Yeh function har API call se pehle chalega aur Token inject karega
api.interceptors.request.use(
  (config) => {
    // 1. Zustand se token uthao
    let token = useAuthStore.getState().token;
    
    // 🔥 DEBUG: Console me print karke dekho token sach me hai ya ud gaya
    console.log("👉 Axios Interceptor Bhej Raha Hai Yeh Token:", token);

    // 2. Agar Zustand me token null hai, par tu logged in hai, 
    // toh direct localStorage check karo (Zustand persist aksar isi tarah save karta hai)
    if (!token) {
      try {
        const localAuth = JSON.parse(localStorage.getItem('auth-store') || '{}');
        token = localAuth?.state?.token || localStorage.getItem('access_token') || localStorage.getItem('token');
        console.log("👉 Fallback se token nikala:", token);
      } catch(e) {}
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.error("🚨 ALERT: Token empty hai! Backend 401 reject karega.");
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;