// src/Store/useOrderStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL = "https://shopnovaproject.onrender.com/orders"; // your base URL
axios.defaults.withCredentials = true;
export const useOrderStore = create((set, get) => ({
  userOrders: [],
  sellerOrders: [],
  sellerPendingOrders: [],   //  new state for pending orders
  sellerShippingPendingOrders: [],
  allOrders: [],
  currentOrder: null,
  loading: false,
  error: null,

  // ----------------------------
  // User Actions
  // ----------------------------
  createOrder: async (orderData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(`${API_URL}/create`, orderData, {
        withCredentials: true,
      });
      set((state) => ({ userOrders: [data.order, ...state.userOrders] }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchUserOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/my-orders`, {
        withCredentials: true,
      });
      set({ userOrders: data.orders });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchOrderById: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/my-orders/${orderId}`, {
        withCredentials: true,
      });
      set({ currentOrder: data.order });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },

  cancelOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${API_URL}/my-orders/cancel/${orderId}`,
        {},
        { withCredentials: true }
      );
      set((state) => ({
        userOrders: state.userOrders.map((o) =>
          o._id === orderId ? { ...o, orderStatus: "Cancelled" } : o
        ),
      }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ----------------------------
  // Seller Actions
  // ----------------------------
  fetchSellerOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/seller-orders`, {
        withCredentials: true,
      });
      set({ sellerOrders: data.orders });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },

  // fetchSellerPendingOrders: async () => {   // ✅ new action
  //   set({ loading: true, error: null });
  //   try {
  //     const { data } = await axios.get(`${API_URL}/seller-orders/pending`, {
  //       withCredentials: true,
  //     });
  //     set({ sellerPendingOrders: data.orders });
  //   } catch (error) {
  //     set({ error: error.response?.data?.message || error.message });
  //   } finally {
  //     set({ loading: false });
  //   }
  // },
  // fetchSellerShippingPendingOrders: async () => {   // ✅ new action
  //   set({ loading: true, error: null });
  //   try {
  //     const { data } = await axios.get(`${API_URL}/seller-orders/shipping/pending`, {
  //       withCredentials: true,
  //     });
  //     set({ sellerShippingPendingOrders: data.orders });
  //   } catch (error) {
  //     set({ error: error.response?.data?.message || error.message });
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

  // sellerAcceptOrder: async (orderId) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const { data } = await axios.put(
  //       `${API_URL}/seller-orders/accept/${orderId}`,
  //       {},
  //       { withCredentials: true }
  //     );
  //     set((state) => ({
  //       sellerOrders: state.sellerOrders.map((o) =>
  //         o._id === orderId ? data.order : o
  //       ),
  //       sellerPendingOrders: state.sellerPendingOrders.filter(
  //         (o) => o._id !== orderId
  //       ), // ✅ remove from pending after accept
  //     }));
  //     return data;
  //   } catch (error) {
  //     set({ error: error.response?.data?.message || error.message });
  //     throw error;
  //   } finally {
  //     set({ loading: false });
  //   }
  // },
  // sellerShipOrder: async (orderId) => {
  //   set({ loading: true, error: null });
  //   try {
  //     const { data } = await axios.put(
  //       `${API_URL}/seller-orders/ship/${orderId}`,
  //       {},
  //       { withCredentials: true }
  //     );
  //     set((state) => ({
  //       sellerOrders: state.sellerOrders.map((o) =>
  //         o._id === orderId ? data.order : o
  //       ),
  //       sellerShippingPendingOrders: state.sellerShippingPendingOrders.filter(
  //         (o) => o._id !== orderId
  //       ), // ✅ remove from pending after accept
  //     }));
  //     return data;
  //   } catch (error) {
  //     set({ error: error.response?.data?.message || error.message });
  //     throw error;
  //   } finally {
  //     set({ loading: false });
  //   }
  // },



  fetchSellerPendingOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/seller-orders/pending`, {
        withCredentials: true,
      });
      set({ sellerPendingOrders: data.orders });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchSellerShippingPendingOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/seller-orders/shipping/pending`, {
        withCredentials: true,
      });
      set({ sellerShippingPendingOrders: data.orders });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },

  sellerAcceptOrder: async (orderId, productId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${API_URL}/seller-orders/accept/${orderId}`,
        { productId },
        { withCredentials: true }
      );

      set((state) => {
        const updateOrderList = (orders) =>
          orders
            .map((o) =>
              o._id === orderId
                ? {
                  ...o,
                  items: o.items.map((item) =>
                    item.product._id === productId ? data.order.items.find(i => i.product._id === productId) : item
                  ),
                }
                : o
            )
            .filter(
              (o) => o.items.some((item) => item.orderStatus === "Pending")
            );

        return {
          sellerOrders: state.sellerOrders.map((o) =>
            o._id === orderId ? data.order : o
          ),
          sellerPendingOrders: updateOrderList(state.sellerPendingOrders),
        };
      });

      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  sellerShipOrder: async (orderId, productId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${API_URL}/seller-orders/ship/${orderId}`,
        { productId },
        { withCredentials: true }
      );

      set((state) => {
        const updateOrderList = (orders) =>
          orders
            .map((o) =>
              o._id === orderId
                ? {
                  ...o,
                  items: o.items.map((item) =>
                    item.product._id === productId ? data.order.items.find(i => i.product._id === productId) : item
                  ),
                }
                : o
            )
            .filter(
              (o) => o.items.some((item) => item.orderStatus === "Processing")
            );

        return {
          sellerOrders: state.sellerOrders.map((o) =>
            o._id === orderId ? data.order : o
          ),
          sellerShippingPendingOrders: updateOrderList(
            state.sellerShippingPendingOrders
          ),
        };
      });

      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  // ----------------------------
  // Admin Actions
  // ----------------------------
  fetchAllOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/all`, {
        withCredentials: true,
      });
      set({ allOrders: data.orders });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId, statusData) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${API_URL}/update-status/${orderId}`,
        statusData,
        { withCredentials: true }
      );
      set((state) => ({
        allOrders: state.allOrders.map((o) =>
          o._id === orderId ? data.order : o
        ),
      }));
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
}));
