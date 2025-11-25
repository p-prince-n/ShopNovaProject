import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { BASE_URL } from "../utils/constant";

const API_URL = `${BASE_URL}/delivery`;
axios.defaults.withCredentials = true;

export const useDeliveryManStore = create((set, get) => ({
  unverifiedDeliveryMen: [],
  verifiedDeliveryMen: [],
  totalDeliveryMen: 0,
  lastMonthDeliveryMen: 0,
  deliveryManProfile: null,
  loading: false,
  error: null,


  createDeliveryMan: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_URL}/create`, data, { withCredentials: true });
      set({ deliveryManProfile: res.data.deliveryMan, loading: false });
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      toast.error(error)
    }
  },


  updateDeliveryMan: async (data) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API_URL}/update`, data, { withCredentials: true });
      set({ deliveryManProfile: res.data.deliveryMan, loading: false });
      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },


  getDeliveryManProfile: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/profile`, { withCredentials: true });
      set({ deliveryManProfile: res.data.deliveryMan, loading: false });
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },


  getUnverifiedDeliveryMen: async (startIndex = 0) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/unverified`, {
        params: { startIndex, limit: 9, sort: "desc" },
        withCredentials: true,
      });
      set({
        unverifiedDeliveryMen: res.data.data,
        totalDeliveryMen: res.data.totalDeliveryMen,
        lastMonthDeliveryMen: res.data.lastMonthDeliveryMen,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },


  verifyDeliveryMan: async (deliveryManId) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API_URL}/verify/${deliveryManId}`, {}, { withCredentials: true });


      const updated = get().unverifiedDeliveryMen.filter(d => d._id !== deliveryManId);
      set({
        unverifiedDeliveryMen: updated,
        totalDeliveryMen: get().totalDeliveryMen - 1,
        loading: false,
      });

      toast.success(res.data.message);
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },


  getVerifiedDeliveryMen: async (startIndex = 0) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/verified`, {
        params: { startIndex, limit: 9, sort: "desc" },
        withCredentials: true,
      });
      set({
        verifiedDeliveryMen: res.data.data,
        totalDeliveryMen: res.data.totalDeliveryMen,
        lastMonthDeliveryMen: res.data.lastMonthDeliveryMen,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
  deleteDeliveryMan: async (id) => {
    try {
      set({ loading: true, error: null });


      const res = await axios.get(`${API_URL}/delete/${id}`, { withCredentials: true });


      set({
        unverifiedDeliveryMen: get().unverifiedDeliveryMen.filter(d => d._id !== id),
        verifiedDeliveryMen: get().verifiedDeliveryMen.filter(d => d._id !== id),
        totalDeliveryMen: get().totalDeliveryMen - 1,
        loading: false,
      });

      toast.success(res.data.message || "Delivery man deleted successfully");
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      toast.error(error.response?.data?.message || "Failed to delete delivery man");
    }
  },
}));
