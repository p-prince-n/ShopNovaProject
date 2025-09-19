import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/cart";

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,
  message: null,

  // ✅ Get Cart
  getCart: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}`, { withCredentials: true });

      set({
        cart: res.data.cart,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // ✅ Add Item to Cart
  addToCart: async (productId, size, quantity = 1) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axios.post(
        `${API_URL}/add`,
        { productId, size, quantity },
        { withCredentials: true }
      );

      set({
        cart: res.data.cart,
        loading: false,
        message: res.data.message || "Item added to cart",
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        message: null,
      });
    }
  },

  // ✅ Update Quantity
  updateQuantity: async (productId, size, quantity) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axios.put(
        `${API_URL}/update`,
        { productId, size, quantity },
        { withCredentials: true }
      );

      set({
        cart: res.data.cart,
        loading: false,
        message: res.data.message || "Quantity updated",
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        message: null,
      });
    }
  },

  // ✅ Remove Item
  removeFromCart: async (productId, size) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axios.delete(`${API_URL}/remove`, {
        data: { productId, size },
        withCredentials: true,
      });

      set({
        cart: res.data.cart,
        loading: false,
        message: res.data.message || "Item removed from cart",
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        message: null,
      });
    }
  },

  // ✅ Clear Cart
  clearCart: async () => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axios.delete(`${API_URL}/clear`, {
        withCredentials: true,
      });

      set({
        cart: res.data.cart,
        loading: false,
        message: res.data.message || "Cart cleared",
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        message: null,
      });
    }
  },
  // ✅ Remove Multiple Items
  removeMultipleFromCart: async (items) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axios.delete(`${API_URL}/remove-multiple`, {
        data: { items }, // [{ productId, size }, ...]
        withCredentials: true,
      });

      set({
        cart: res.data.cart,
        loading: false,
        message: res.data.message || "Selected items removed from cart",
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        message: null,
      });
    }
  },

}));
