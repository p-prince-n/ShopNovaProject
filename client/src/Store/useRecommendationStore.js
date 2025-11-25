import { create } from "zustand";
import axios from "axios";
axios.defaults.withCredentials = true;
export const useRecommendationStore = create((set) => ({
  recommendedProducts: [],
  loading: false,
  error: null,


  fetchPurchaseBasedRecommendations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("http://localhost:3000/recommand/purchase-based", {
        withCredentials: true,
      });
      set({ recommendedProducts: response.data.recommendedProducts, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },


  clearRecommendations: () => set({ recommendedProducts: [], error: null }),
}));
