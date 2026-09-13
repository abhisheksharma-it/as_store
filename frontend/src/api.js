import axios from 'axios';
import { useAuthStore } from './store/authStore';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Yeh function har API call se pehle chalega aur Token inject karega
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;