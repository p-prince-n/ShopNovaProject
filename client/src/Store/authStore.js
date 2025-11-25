import { create } from 'zustand'
import axios from 'axios'
import toast from 'react-hot-toast';

const API_URL = 'http://localhost:3000/auth'
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    isCheckingAuth: true,
    message: null,
    unverifiedSellers: [],
    wishlist: [],
    addresses: [],

    signUp: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/signUp`, userData);
            if (res.status === 201 && res.data.user) {
                toast.success(res.data.message)
                set({ user: res.data.user, isAuthenticated: true, error: null, isLoading: false })
            }

        } catch (e) {
            set({ error: e.response?.data.message || 'Error while sign up', isLoading: false })
            throw e;
        }

    },
    emailVerification: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/verifyEmail`, { code });
            if (res.status === 200 && res.data.user) {
                toast.success(res.data.message)
                set({ user: res.data.user, isAuthenticated: true, error: null, isLoading: false })
            }

        } catch (e) {
            set({ error: e.response?.data.message || 'Error while sign up', isLoading: false })
            throw e;
        }
    },
    phoneVerification: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/verifyPhone`, { code });
            if (res.status === 200 && res.data.user) {
                toast.success(res.data.message)
                set({ user: res.data.user, isAuthenticated: true, error: null, isLoading: false })
            }

        } catch (e) {
            set({ error: e.response?.data.message || 'Error while sign up', isLoading: false })
            throw e;
        }
    },
    checkAuth: async () => {
        set({ isLoading: true, error: null, isCheckingAuth: true });
        try {
            const res = await axios.get(`${API_URL}/check-auth`);

            if (res.status === 200 && res.data.user) {
                set({ user: res.data.user, isAuthenticated: true, isLoading: false, isCheckingAuth: false })
            }


        } catch (e) {
            set({ error: null, isLoading: false, isCheckingAuth: false, isAuthenticated: false })
        }
    },
    signIn: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/signIn`, userData);
            if (res.status === 200 && res.data.user) {
                toast.success(res.data.message)
                set({ user: res.data.user, isAuthenticated: true, error: null, isLoading: false })
            }

        } catch (e) {
            set({ error: e.response?.data.message || 'Error while sign up', isLoading: false })
            throw e;
        }

    },
    logout: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/signOut`);
            if (res.status === 200) {
                set({ user: null, isAuthenticated: false, error: null, isLoading: false })
            }

        } catch (e) {
            set({ error: e.response?.data.message || 'Error while sign up', isLoading: false })
            throw e;
        }
    },
    forgotPassword: async (email) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.post(`${API_URL}/forgotPassword`, { email });
            if (res.status === 200) {
                set({ error: null, isLoading: false, message: res.data.message })
            }

        } catch (e) {
            set({ error: e.response?.data.message || 'Error while sign up', isLoading: false })
            throw e;
        }
    },
    resetPassword: async (token, password) => {
        set({ isLoading: true, error: null })
        try {
            const res = await axios.post(`${API_URL}/reset-password/${token}`, { password });
            if (res.status === 200) {
                set({ message: res.data.message, isLoading: false })
            }


        } catch (e) {
            set({ error: e.response?.data.message || 'Error while sign up', isLoading: false })
            throw e;
        }

    },

    updateProfile: async (userData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.patch(`${API_URL}/update-profile`, userData);
            if (res.status === 200 && res.data.user) {
                toast.success(res.data.message);
                set({ user: res.data.user, isAuthenticated: true, error: null, isLoading: false });
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error while updating profile', isLoading: false });
            throw e;
        }
    },


    resendMobileCode: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/resend-mobile-code`);
            if (res.status === 200) {
                toast.success(res.data.message);
                set({ isLoading: false, error: null });
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error while resending mobile code', isLoading: false });
            throw e;
        }
    },


    resendEmailCode: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/resend-email-code`);
            if (res.status === 200) {
                toast.success(res.data.message);
                set({ isLoading: false, error: null });
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error while resending email code', isLoading: false });
            throw e;
        }
    },
    verifySeller: async (sellerId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.put(`${API_URL}/verify/${sellerId}`);
            if (res.status === 200) {
                toast.success(res.data.message);
                set((state) => ({
                    unverifiedSellers: state.unverifiedSellers.filter(s => s._id !== sellerId),
                    isLoading: false
                }));
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error while verifying seller', isLoading: false });
            throw e;
        }
    },


    getUnverifiedSellers: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/unverified`);
            if (res.status === 200) {
                set({ unverifiedSellers: res.data.data, isLoading: false });
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error while fetching unverified sellers', isLoading: false });
            throw e;
        }
    },


    toggleWishlist: async (productId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/wishlist/toggle`, { productId });

            if (res.status === 200 && res.data.wishlist) {
                toast.success(res.data.message);
                set((state) => ({
                    user: {
                        ...state.user,
                        wishlist: res.data.wishlist
                    },
                    isLoading: false
                }));
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error toggling wishlist', isLoading: false });
            toast.error(e.response?.data.message || 'Error toggling wishlist');
            throw e;
        }
    },
    getWishlist: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/wishlist`);
            if (res.status === 200 && res.data.wishlist) {
                set({ wishlist: res.data.wishlist, isLoading: false });
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error fetching wishlist', isLoading: false });
            toast.error(e.response?.data.message || 'Error fetching wishlist');
            throw e;
        }
    },
    getAddresses: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.get(`${API_URL}/addresses`);
            if (res.status === 200) {
                set({ addresses: res.data.addresses, isLoading: false });
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error fetching addresses', isLoading: false });
            toast.error(e.response?.data.message || 'Error fetching addresses');
            throw e;
        }
    },

    addAddress: async (addressData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.post(`${API_URL}/addresses`, addressData);
            if (res.status === 200) {
                toast.success(res.data.message);
                set({ addresses: res.data.addresses, isLoading: false });
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error adding address', isLoading: false });
            toast.error(e.response?.data.message || 'Error adding address');
            throw e;
        }
    },

    updateAddress: async (addressId, updatedData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.put(`${API_URL}/addresses/${addressId}`, updatedData);
            if (res.status === 200) {
                toast.success(res.data.message);

                set((state) => ({
                    addresses: state.addresses.map(addr =>
                        addr._id === addressId ? res.data.address : addr
                    ),
                    isLoading: false
                }));
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error updating address', isLoading: false });
            toast.error(e.response?.data.message || 'Error updating address');
            throw e;
        }
    },

    deleteAddress: async (addressId) => {
        set({ isLoading: true, error: null });
        try {
            const res = await axios.delete(`${API_URL}/addresses/${addressId}`);
            if (res.status === 200) {
                toast.success(res.data.message);
                set({ addresses: res.data.addresses, isLoading: false });
            }
        } catch (e) {
            set({ error: e.response?.data.message || 'Error deleting address', isLoading: false });
            toast.error(e.response?.data.message || 'Error deleting address');
            throw e;
        }
    }

}))