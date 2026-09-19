import { create } from 'zustand';
import api from '../api'; // Tera axios instance

export const useWishlistStore = create((set, get) => ({
  wishlist: [],
  loading: false,

  fetchWishlist: async () => {
    set({ loading: true });
    try {
      // Django API endpoint (apne urls.py ke hisaab se check kar lena)
      const response = await api.get('wishlist/'); 
      set({ wishlist: response.data, loading: false });
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      set({ loading: false });
    }
  },

  toggleWishlist: async (productId) => {
    try {
      // Toggle API call (Add/Remove from DB)
      await api.post('wishlist/toggle/', { product_id: productId });
      // Database update hone ke baad fresh list fetch kar lo
      get().fetchWishlist(); 
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    }
  }
}));