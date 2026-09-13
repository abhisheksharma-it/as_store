import { create } from 'zustand';
import api from '../api'; // Tera Axios interceptor wala API 

export const useCartStore = create((set) => ({
  cart: [],
  isCartOpen: false,
  totalPrice: 0,
  isLoading: false,
  error: null,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  // 1. Backend se Cart Fetch Karna (Page load pe App.jsx se call hota hai)
  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('cart/');
      // Django DRF response format handle kar raha hai
      if (response.data && response.data.cart) {
        set({
          cart: response.data.cart.items || [],
          totalPrice: parseFloat(response.data.cart.cart_total || 0),
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Fetch Cart Error:", error);
      set({ error: "Could not fetch cart from server", isLoading: false });
    }
  },

  // 2. Backend mein Item Add Karna
  addToCart: async (product, quantity = 1, size = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('cart/', {
        product_id: product.id,
        size: size,
        quantity: quantity
      });
      
      // Backend agar success message bhejta hai
      if (response.data.message) {
        set({
          cart: response.data.cart.items || [],
          totalPrice: parseFloat(response.data.cart.cart_total || 0),
          isLoading: false,
          isCartOpen: true // Item add hote hi drawer khol do
        });
      }
    } catch (error) {
      console.error("Add to Cart Error:", error);
      set({ error: "Failed to add item to cart", isLoading: false });
    }
  },

  // 3. Backend se Item Remove Karna (Tere urls.py ke hisaab se)
  removeFromCart: async (productId) => { 
    set({ isLoading: true, error: null });
    try {
      // 🔴 Tera backend endpoint: cart/item/<product_id>/
      const response = await api.delete(`cart/item/${productId}/`); 
      
      if (response.status === 200 || response.status === 204) {
        // Fast UI ke liye frontend state turant update karo
        set((state) => {
            const updatedItems = state.cart.filter(item => item.product.id !== productId);
            return {
                cart: updatedItems,
                isLoading: false
            };
        });

        // Background me fresh DB data mangwa lo taaki total price accurate rahe
        const fetchRes = await api.get('cart/');
        if (fetchRes.data && fetchRes.data.cart) {
             set({
                 cart: fetchRes.data.cart.items || [],
                 totalPrice: parseFloat(fetchRes.data.cart.cart_total || 0),
             });
        }
      }
    } catch (error) {
      console.error("Remove from Cart Error:", error);
      set({ error: "Failed to remove item", isLoading: false });
    }
  },

  // 4. Optional: Clear Cart (Order place hone ke baad use hoga)
  clearCart: () => set({ cart: [], totalPrice: 0 }),
}));