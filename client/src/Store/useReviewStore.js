// src/Store/useReviewStore.js
import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";



const API_URL = "https://shopnovaproject.onrender.com/review";
export const useReviewStore = create((set, get) => ({
  reviews: [],
  loading: false,
  error: null,

  // ✅ Get reviews for a product
  getReviews: async (productId) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.get(`${API_URL}/${productId}`);
      set({ reviews: data.reviews, loading: false });
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || error.message });
      toast.error(error.response?.data?.message || "Failed to fetch reviews");
    }
  },

  // ✅ Create a review
  createReview: async (productId, comment) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.post(
        `${API_URL}`,
        { productId, comment },
        { withCredentials: true } // important since you use JWT cookie
      );
      set((state) => ({ reviews: [data.review, ...state.reviews], loading: false }));
      toast.success("Review added successfully");
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || error.message });
      toast.error(error.response?.data?.message || "Failed to add review");
    }
  },

  // ✅ Update a review
  updateReview: async (reviewId, comment) => {
    try {
      set({ loading: true, error: null });
      const { data } = await axios.put(
        `${API_URL}/${reviewId}`,
        { comment },
        { withCredentials: true }
      );
      set((state) => ({
        reviews: state.reviews.map((r) => (r._id === reviewId ? data.review : r)),
        loading: false,
      }));
      toast.success("Review updated successfully");
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || error.message });
      toast.error(error.response?.data?.message || "Failed to update review");
    }
  },

  // ✅ Delete a review
  deleteReview: async (reviewId) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API_URL}/${reviewId}`, { withCredentials: true });
      set((state) => ({
        reviews: state.reviews.filter((r) => r._id !== reviewId),
        loading: false,
      }));
      toast.success("Review deleted successfully");
    } catch (error) {
      set({ loading: false, error: error.response?.data?.message || error.message });
      toast.error(error.response?.data?.message || "Failed to delete review");
    }
  },
  toggleLike: async (reviewId) => {
  try {
    set({ loading: true, error: null });
    const { data } = await axios.put(
      `${API_URL}/${reviewId}/like`,
      {},
      { withCredentials: true }
    );
    set((state) => ({
      reviews: state.reviews.map((r) => (r._id === reviewId ? data.review : r)),
      loading: false,
    }));
  } catch (error) {
    set({ loading: false, error: error.response?.data?.message || error.message });
    toast.error(error.response?.data?.message || "Failed to like review");
  }
},
}));
