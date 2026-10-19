// src/store/cartStore.js
import { create } from 'zustand';
import api from '../api'; 

export const useCartStore = create((set, get) => ({
  cart: [],
  isCartOpen: false,
  totalPrice: 0,
  isLoading: false,
  error: null,

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  getAuthConfig: () => {
    const token = localStorage.getItem('access') || localStorage.getItem('token') || localStorage.getItem('accessToken'); 
    if (token && token !== 'undefined' && token !== 'null') {
      return { headers: { Authorization: `Bearer ${token}` } };
    }
    return {}; 
  },

  // Helper: Calculate total price for guest cart
  calculateGuestTotal: (cartItems) => {
    return cartItems.reduce((total, item) => {
        // Ensure price is treated as a number
        const price = parseFloat(item.price || item.product?.price || 0);
        return total + (price * item.quantity);
    }, 0);
  },

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    const config = get().getAuthConfig();
    
    // GUEST FLOW: Load from Local Storage
    if (!config.headers) {
        const guestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
        const guestTotal = get().calculateGuestTotal(guestCart);
        set({ cart: guestCart, totalPrice: guestTotal, isLoading: false });
        return; 
    }

    // LOGGED IN FLOW: Fetch from API
    try {
      const response = await api.get('cart/', config);
      let cartItems = [];
      let total = 0;
      
      if (response.data) {
          if (Array.isArray(response.data)) {
              cartItems = response.data;
          } else if (response.data.cart && Array.isArray(response.data.cart.items)) {
              cartItems = response.data.cart.items;
              total = parseFloat(response.data.cart.cart_total || 0);
          } else if (Array.isArray(response.data.items)) {
              cartItems = response.data.items;
              total = parseFloat(response.data.cart_total || 0);
          }
      }

      set({ cart: cartItems, totalPrice: total, isLoading: false });
    } catch (error) {
      set({ cart: [], totalPrice: 0, error: "Could not fetch cart", isLoading: false });
    }
  },

  addToCart: async (product, quantity = 1, size = null) => {
    set({ isLoading: true, error: null });
    const config = get().getAuthConfig();
    
    // GUEST FLOW: Add to Local Storage
    if (!config.headers) {
        let currentGuestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
        
        const existingItemIndex = currentGuestCart.findIndex(
            item => item.product_id === product.id && item.size === size
        );

        if (existingItemIndex > -1) {
            currentGuestCart[existingItemIndex].quantity += quantity;
        } else {
            // Store all necessary product info for UI rendering
            currentGuestCart.push({
                product_id: product.id,
                product: product, // Save nested product details
                size: size,
                quantity: quantity,
                price: product.price
            });
        }

        localStorage.setItem('guest_cart', JSON.stringify(currentGuestCart));
        
        const guestTotal = get().calculateGuestTotal(currentGuestCart);
        set({ cart: currentGuestCart, totalPrice: guestTotal, isCartOpen: true, isLoading: false });
        return;
    }

    // LOGGED IN FLOW: POST to API
    try {
      await api.post('cart/', {
        product_id: product.id,
        size: size,
        quantity: quantity
      }, config);
      
      await get().fetchCart();
      set({ isCartOpen: true });
    } catch (error) {
      alert(error.response?.data?.error || "Failed to add item to cart.");
      set({ error: "Failed to add item", isLoading: false });
    }
  },

  updateQuantity: async (productId, newQuantity, size = null) => {
    if (newQuantity < 1) return; 
    set({ isLoading: true });
    const config = get().getAuthConfig();

    // GUEST FLOW
    if (!config.headers) {
         let currentGuestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
         const itemIndex = currentGuestCart.findIndex(
             item => item.product_id === productId && item.size === size
         );
         
         if (itemIndex > -1) {
             currentGuestCart[itemIndex].quantity = newQuantity;
             localStorage.setItem('guest_cart', JSON.stringify(currentGuestCart));
             
             const guestTotal = get().calculateGuestTotal(currentGuestCart);
             set({ cart: currentGuestCart, totalPrice: guestTotal, isLoading: false });
         } else {
             set({ isLoading: false });
         }
         return;
    }

    // LOGGED IN FLOW
    try {
      await api.put(`cart/item/${productId}/`, {
        product_id: productId,
        quantity: newQuantity,
        size: size 
      }, config);
      await get().fetchCart();
    } catch (error) {
      console.error("Update Quantity Error:", error);
      set({ isLoading: false });
    }
  },

  removeFromCart: async (productId, size = null) => { 
    set({ isLoading: true, error: null });
    const config = get().getAuthConfig();

    // GUEST FLOW
    if (!config.headers) {
        let currentGuestCart = JSON.parse(localStorage.getItem('guest_cart')) || [];
        
        // Remove item matching BOTH ID and Size (important for clothes)
        currentGuestCart = currentGuestCart.filter(
            item => !(item.product_id === productId && item.size === size)
        );
        
        localStorage.setItem('guest_cart', JSON.stringify(currentGuestCart));
        const guestTotal = get().calculateGuestTotal(currentGuestCart);
        set({ cart: currentGuestCart, totalPrice: guestTotal, isLoading: false });
        return;
    }

    // LOGGED IN FLOW
    try {
      await api.delete(`cart/item/${productId}/`, config); 
      await get().fetchCart();
    } catch (error) {
      console.error("Remove Error:", error);
      set({ error: "Failed to remove item", isLoading: false });
      get().fetchCart();
    }
  },

  clearCart: () => {
      localStorage.removeItem('guest_cart');
      set({ cart: [], totalPrice: 0 });
  },
}));