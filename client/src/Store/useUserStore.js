import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const API_URL = `${BASE_URL}/users`;
axios.defaults.withCredentials = true;

export const useUserStore = create((set, get) => ({
  users: [],
  totalUsers: 0,
  loading: false,
  error: null,
  message: null,
  lastMonthUsers: [],


  getAllUsers: async (startIndex = 0, limit=0) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/getUsers?startIndex=${startIndex}&limit=${limit}`);

      if (startIndex === 0) {

        set({
          users: res.data.data,
          totalUsers: res.data.totalUsers,
          lastMonthUsers: res.data.lastMonthUsers,
          loading: false,
        });
      } else {

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


  deleteUser: async (userId) => {
    try {
      set({ loading: true, error: null, message: null });

      const res = await axios.delete(`${API_URL}/delete/${userId}`, { withCredentials: true });


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
  downloadUsersExcel: async () => {
    try {
      const response = await axios.get(`${API_URL}/downloadUsers`, {
        responseType: "blob",
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "users.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
      });
      console.error("Failed to download Excel:", err);
    }
  },
}));
