import { create } from "zustand";
import axios from "axios";

const API_URL = "http://localhost:3000/category";
axios.defaults.withCredentials = true;
export const useCategoryStore = create((set) => ({
  categories: [],
  lastMonthCategories: [],
  loading: false,
  error: null,
  totalCategories: 0,


  fetchCategories: async (startIndex = 0, limit=9) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/getAll?startIndex=${startIndex}&limit=${limit}`);
      if (startIndex === 0) {

        set({
          categories: res.data.data,
          loading: false,
        });
      } else {

        set({
          categories: [...get().categories, ...res.data.data],
          loading: false,
        });
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },


  searchCategory: async (query) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/search/${query}`);
      set({ categories: res.data.data, loading: false });
      return { success: true, data: res.data.data };
    } catch (err) {
      if (err.response?.status === 404) {
        set({ categories: [], loading: false, error: null });
        return { success: true, data: [] };
      }
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },


  createCategory: async (categoryData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_URL}/create`, categoryData);
      set((state) => ({
        categories: [...state.categories, res.data.data],
        totalCategories: state.totalCategories + 1,
        loading: false,
      }));
      return { success: true, data: res.data.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },


  updateCategory: async (id, updatedData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API_URL}/update/${id}`, updatedData);
      set((state) => ({
        categories: state.categories.map((cat) =>
          cat._id === id ? res.data.data : cat
        ),
        loading: false,
      }));
      return { success: true, data: res.data.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },


  deleteCategory: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API_URL}/delete/${id}`);
      set((state) => ({
        categories: state.categories.filter((cat) => cat._id !== id),
        totalCategories: state.totalCategories - 1,
        loading: false,
      }));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
  getCategories: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/getCategories`);
      set({  loading: false, totalCategories: res.data.totalCategories, lastMonthCategories: res.data.lastMonthsCategory });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },
  getRootCategories: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/getRootCategory`);
      set({  loading: false, totalCategories: res.data.count, categories: res.data.categories});
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },
}));


