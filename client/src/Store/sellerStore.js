import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/sellers";

export const useSellerStore = create((set, get) => ({
  unverifiedSellers: [],
  verifiedSellers: [],
  totalSellers: 0,
  lastMonthSellers: 0,
  sellerProfile: null, // ✅ hold logged-in seller profile
  loading: false,
  error: null,

  // ✅ Create Seller Profile
  createSeller: async (sellerData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_URL}/create`, sellerData, {
        withCredentials: true,
      });
      set({ sellerProfile: res.data.seller, loading: false });
      toast.success(res.data.message)
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // ✅ Update Seller Profile
  updateSeller: async (sellerData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API_URL}/update`, sellerData, {
        withCredentials: true,
      });
      set({ sellerProfile: res.data.seller, loading: false });
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // ✅ Get Seller Profile (logged-in seller)
  getSellerProfile: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/profile`, {
        withCredentials: true,
      });
      set({ sellerProfile: res.data.seller, loading: false });
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // ✅ Get Unverified Sellers (admin only)
  getUnverifiedSellers: async (startIndex = 0) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/unverified`, {
        params: { startIndex, limit: 9, sort: "desc" },
        withCredentials: true,
      });
      set({
        unverifiedSellers: res.data.data,
        totalSellers: res.data.totalSellers,
        lastMonthSellers: res.data.lastMonthSellers,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },

  // ✅ Verify Seller (admin only)
  verifySeller: async (sellerId) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(
        `${API_URL}/verify/${sellerId}`,
        {},
        { withCredentials: true }
      );

      // Remove verified seller from state
      const updatedSellers = get().unverifiedSellers.filter(
        (s) => s._id !== sellerId
      );

      set({
        unverifiedSellers: updatedSellers,
        totalSellers: get().totalSellers - 1,
        loading: false,
      });

      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
  getVerifiedSellers: async (startIndex = 0) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/verified`, {
        params: { startIndex, limit: 9, sort: "desc" },
        withCredentials: true,
      });
      set({
        verifiedSellers: res.data.data,
        totalSellers: res.data.totalSellers,
        lastMonthSellers: res.data.lastMonthSellers,
        loading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
    }
  },
}));
