
import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const API_URL = `${BASE_URL}/orders`;
axios.defaults.withCredentials = true;
export const useOrderStore = create((set, get) => ({
  userOrders: [],
  sellerOrders: [],
  sellerPendingOrders: [],
  sellerShippingPendingOrders: [],
  allOrders: [],
  currentOrder: null,
  loading: false,
  error: null,
  deliveryUnassignedOrders: [],
  deliveryPendingOrders: [],
adminAnalytics: {
  monthlyData: [],
  orderStatus: [],
  revenueBySeller: [],
  topProducts: [],
  dailyOrders: [],
},




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


  cancelOrderItems: async (orderId, productIds) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.post(
        `${API_URL}/cancel`,
        { orderId, productIds },
        { withCredentials: true }
      );


      set((state) => ({
        userOrders: state.userOrders.map((o) =>
          o._id === orderId ? data.order : o
        ),
        currentOrder:
          state.currentOrder && state.currentOrder._id === orderId
            ? data.order
            : state.currentOrder,
      }));

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




  fetchAllOrdersForAdmin: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/admin/allOrders`, {
        withCredentials: true,
      });

      set({ allOrders: data.orderItems || data.orders || [] });
      return data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },
  fetchAdminAnalytics: async () => {
  set({ loading: true, error: null });
  try {
    const { data } = await axios.get(`${API_URL}/admin/analytics`, { withCredentials: true });
    set({ adminAnalytics: data.data });
    return data.data;
  } catch (error) {
    set({ error: error.response?.data?.message || error.message });
    throw error;
  } finally {
    set({ loading: false });
  }
},
downloadOrdersExcel: async () => {
  set({ loading: true, error: null });
  try {
    const response = await axios.get(`${API_URL}/admin/downloadOrderItems`, {
      withCredentials: true,
      responseType: "blob",
    });


    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;


    link.setAttribute("download", `Orders_${new Date().toISOString()}.xlsx`);


    document.body.appendChild(link);
    link.click();


    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);

  } catch (error) {
    set({ error: error.response?.data?.message || error.message });
    console.error("Excel download failed:", error);
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

  fetchDeliveryUnassignedOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/delivery/unassigned-shipped`, {
        withCredentials: true,
      });
      set({ deliveryUnassignedOrders: data.orders });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },





  assignDeliveryMan: async (orderId, productId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(`${API_URL}/delivery/assign/${orderId}`, { productId }, {
        withCredentials: true,
      });


      set((state) => ({
        deliveryUnassignedOrders: state.deliveryUnassignedOrders
          .map((o) =>
            o._id === orderId
              ? {
                ...o,
                items: o.items.filter(item => item.product._id !== productId)
              }
              : o
          )
          .filter(o => o.items.length > 0),
      }));

      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  deliveryManAcceptShippedOrder: async (orderId, productId) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${API_URL}/delivery/accept`,
        { orderId, productId },
        { withCredentials: true }
      );


      set((state) => ({
        deliveryUnassignedOrders: state.deliveryUnassignedOrders
          .map((o) =>
            o._id === orderId
              ? {
                ...o,
                items: o.items.filter(item => item.product._id !== productId)
              }
              : o
          )
          .filter(o => o.items.length > 0),
      }));

      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },


  fetchDeliveryPendingOrders: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${API_URL}/delivery/pending`, {
        withCredentials: true,
      });
      set({ deliveryPendingOrders: data.orders });
    } catch (error) {
      set({ error: error.response?.data?.message || error.message });
    } finally {
      set({ loading: false });
    }
  },
  verifyDeliveryCode: async (orderId, productId, code) => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.put(
        `${API_URL}/delivery/verify`,
        { orderId, productId, code },
        { withCredentials: true }
      );


      set((state) => ({
        deliveryPendingOrders: state.deliveryPendingOrders
          .map((o) =>
            o._id === orderId
              ? {
                ...o,
                items: o.items.filter((item) => item.product._id !== productId),
              }
              : o
          )
          .filter((o) => o.items.length > 0),
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
