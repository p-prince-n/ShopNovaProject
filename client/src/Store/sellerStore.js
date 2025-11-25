import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = "http://localhost:3000/sellers";
axios.defaults.withCredentials = true;

export const useSellerStore = create((set, get) => ({
  unverifiedSellers: [],
  verifiedSellers: [],
  totalSellers: 0,
  lastMonthSellers: 0,
  sellerProfile: null,
  loading: false,
  error: null,


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


  verifySeller: async (sellerId) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(
        `${API_URL}/verify/${sellerId}`,
        {},
        { withCredentials: true }
      );


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
  downloadSellersExcel: async () => {
    try {
      set({ loading: true });
      const res = await axios.get(`${API_URL}/downloadSellerData`, {
        responseType: "blob",
        withCredentials: true,
      });


      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "sellers.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      set({ loading: false });
      toast.success("Sellers Excel downloaded successfully!");
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, loading: false });
      toast.error("Failed to download sellers Excel.");
    }
  },
  deleteSeller: async (sellerId) => {
    try {
      set({ loading: true, error: null });


      const res = await axios.get(`${API_URL}/delete/${sellerId}`, {
        withCredentials: true,
      });


      set({
        unverifiedSellers: get().unverifiedSellers.filter(s => s._id !== sellerId),
        verifiedSellers: get().verifiedSellers.filter(s => s._id !== sellerId),
        totalSellers: get().totalSellers - 1,
        loading: false,
      });

      toast.success(res.data.message || "Seller deleted successfully");
      return res.data;

    } catch (error) {
      set({
        error: error.response?.data?.message || error.message,
        loading: false,
      });
      toast.error(error.response?.data?.message || "Failed to delete seller");
    }
  },
}));
