import { create } from "zustand";
import axios from "axios";
axios.defaults.withCredentials = true;
export const useRecommendationStore = create((set) => ({
  recommendedProducts: [],
  loading: false,
  error: null,

  // Fetch purchase-based recommendations from API
  fetchPurchaseBasedRecommendations: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get("https://shopnovaproject.onrender.com/recommand/purchase-based", {
        withCredentials: true, // to send cookies if JWT is stored there
      });
      set({ recommendedProducts: response.data.recommendedProducts, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // Clear recommendations (optional)
  clearRecommendations: () => set({ recommendedProducts: [], error: null }),
}));
