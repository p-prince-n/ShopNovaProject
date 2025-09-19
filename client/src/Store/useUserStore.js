import { create } from "zustand";
import axios from "axios";

const API_URL = "https://shopnovaproject.onrender.com/users";

export const useUserStore = create((set, get) => ({
  users: [],
  totalUsers: 0,
  loading: false,
  error: null,
  message: null,
  lastMonthUsers: [],

  // ✅ Fetch paginated users
  getAllUsers: async (startIndex = 0, limit=0) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/getUsers?startIndex=${startIndex}&limit=${limit}`);

      if (startIndex === 0) {
        // first fetch → replace
        set({
          users: res.data.data,
          totalUsers: res.data.totalUsers,
          lastMonthUsers: res.data.lastMonthUsers,
          loading: false,
        });
      } else {
        // show more → append
        set({
          users: [...get().users, ...res.data.data],
          totalUsers: res.data.totalUsers,
          lastMonthUsers: res.data.lastMonthUsers,
          loading: false,
        });
      }
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

  // ✅ Delete user
  deleteUser: async (userId) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axios.delete(`${API_URL}/${userId}`, { withCredentials: true });

      // remove from local state
      const updatedUsers = get().users.filter((u) => u._id !== userId);

      set({
        users: updatedUsers,
        loading: false,
        message: res.data.message || "User deleted successfully",
      });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        message: null,
      });
    }
  },
}));
