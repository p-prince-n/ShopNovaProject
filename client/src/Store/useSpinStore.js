
import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const API_URL = `${BASE_URL}/spin`;
axios.defaults.withCredentials = true;

export const useSpinStore = create((set, get) => ({
  spins: [],
  loading: false,
  error: null,
  message: null,
  nextSpin: null,
  verifiedValue: null,


  getUserSpins: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}`);
      set({ spins: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },


  createSpin: async (spinData) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await axios.post(`${API_URL}`, spinData);
      set({
        spins: [res.data.spin, ...get().spins],
        loading: false,
        message: res.data.message || "Spin created successfully",
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        message: null,
      });
    }
  },


  deleteSpin: async (spinId) => {
    try {
      set({ loading: true, error: null, message: null });
      const res = await axios.delete(`${API_URL}/${spinId}`);
      set({
        spins: get().spins.filter((spin) => spin._id !== spinId),
        loading: false,
        message: res.data.message || "Spin deleted successfully",
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        message: null,
      });
    }
  },


  getNextSpinTime: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/next`);
      set({ nextSpin: res.data, loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
      return null;
    }
  },



verifySpinCode: async (code) => {
  try {
    set({ loading: true, error: null, verifiedValue: null });
    const res = await axios.post(`${API_URL}/verify`, { code });

    set({
      verifiedValue: res.data.value,
      message: res.data.message,
      loading: false,
    });

    return { success: true, value: res.data.value, message: res.data.message };
  } catch (err) {
    set({
      error: err.response?.data?.message || err.message,
      loading: false,
      verifiedValue: null,
    });

    return { success: false, message: err.response?.data?.message || err.message };
  }
},

}));
