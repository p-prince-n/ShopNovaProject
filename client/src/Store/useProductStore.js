// store/useProductStore.js
import { create } from "zustand";
import axios from "axios";

const API_URL = "https://shopnovaproject.onrender.com/product";

export const useProductStore = create((set, get) => ({
  product: null,
  products: [],
  lastMonthProducts: [],
  loading: false,
  error: null,
  totalProducts: 0,
  categoryDiscountProducts: {},
  mensDiscount: [],
  womansDiscount: [],
  productsByCategories: [],
  reviewedProducts: [],
  cityloading: false,

  productsByWeather: [], // ⭐ store products fetched by current weather
  productsByCity: [], // ⭐ store products fetched by city

  // Fetch all products
  fetchProducts: async (startIndex = 0, limit = 0) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/getAll?startIndex=${startIndex}&limit=${limit}`);

      if (startIndex === 0) {
        // first fetch → replace
        set({
          totalProducts: res.data.totalProducts,
          products: res.data.data,
          loading: false,
        });
      } else {
        // show more → append
        set({
          totalProducts: res.data.totalProducts,
          products: [...get().products, ...res.data.data],
          loading: false,
        });
      }
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // Get single product
  fetchProductById: async (id) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/getOne/${id}`);
      set({ loading: false, product: res.data.data });
      return res.data.data;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // Create new product
  createProduct: async (productData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.post(`${API_URL}/create`, productData);
      set((state) => ({
        products: [...state.products, res.data.data],
        totalProducts: state.totalProducts + 1,
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // Update product
  updateProduct: async (id, updatedData) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.put(`${API_URL}/update/${id}`, updatedData);
      set((state) => ({
        products: state.products.map((prod) =>
          prod._id === id ? res.data.data : prod
        ),
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // Delete product
  deleteProduct: async (id) => {
    try {
      set({ loading: true, error: null });
      await axios.delete(`${API_URL}/delete/${id}`);
      set((state) => ({
        products: state.products.filter((prod) => prod._id !== id),
        totalProducts: state.totalProducts - 1,
        loading: false,
      }));
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  },

  // Search products by term (route param)
  searchProducts: async (term) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/search/${term}`);
      set({ products: res.data.data, loading: false });
    } catch (err) {
      if (err.response?.status === 404) {
        set({ products: [], loading: false, error: null });
        return { success: true, data: [] };
      }
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
  getProducts: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/getProducts`);
      set({ loading: false, totalProducts: res.data.totalProducts, lastMonthProducts: res.data.lastMonthsProduct });
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false });
    }
  }, // 🔥 Fetch top 6 discounted products by category (update if exists, add if new)
  fetchDiscountProductsByCategory: async (categoryId, categoryName) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/category/discount/${categoryId}`);

      // categoryName is used as key in state
      set((state) => ({
        categoryDiscountProducts: {
          ...state.categoryDiscountProducts,
          [categoryName]: res.data.data, // overwrite if exists, add if not
        },
        loading: false,
      }));

      return res.data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        set((state) => ({
          categoryDiscountProducts: {
            ...state.categoryDiscountProducts,
            [categoryName]: [], // empty list for not found
          },
          loading: false,
          error: null,
        }));
        return [];
      }

      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return [];
    }
  },
  fetchDiscountProductsforMens: async (limit) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/category/discount/68b9c24718d901e16524b230?limit=${limit}`);

      // categoryName is used as key in state
      set({
        loading: false,
        mensDiscount: res.data.data
      });

      return res.data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        set({
          loading: false,
          mensDiscount: [],
        });
        return [];
      }

      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return [];
    }
  },

  fetchDiscountProductsforWomens: async (limit) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/category/discount/68b9c29d18d901e16524b235?limit=${limit}`);

      // categoryName is used as key in state
      set({
        loading: false,
        womansDiscount: res.data.data
      });

      return res.data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        set({
          loading: false,
          womansDiscount: [],
        });
        return [];
      }

      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return [];
    }
  },
  fetchAllRandomProducts: async () => {
    // /getRandomProducts
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/getRandomProducts`);

      // categoryName is used as key in state
      set({
        loading: false,
        products: res.data.products,
        totalProducts: res.data.totalProducts
      });

      return res.data.products;
    } catch (err) {
      set({ error: err.response?.data?.message || err.message, loading: false, products: [] });
    }
  },
  rateProduct: async (id, rating) => {
    try {
      set({ loading: true, error: null });

      // Send PUT request to rate the product
      const res = await axios.put(`${API_URL}/rate/${id}`, { rating });

      // Update the product in state if it matches current selected product
      set((state) => ({
        product: state.product?._id === id ? { ...state.product, ...res.data } : state.product,
        products: state.products.map((prod) =>
          prod._id === id ? { ...prod, ...res.data } : prod
        ),
        loading: false,
      }));

      return { success: true, data: res.data };
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false });
      return { success: false, error: message };
    }
  },
  fetchProductsByCategories: async (categoryIds) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.post(`${API_URL}/by-categories`, {
        categories: categoryIds,
      });

      const currentProduct = get().product;

      let filteredProducts = res.data.products;

      // Remove products that match the current product's _id
      if (currentProduct?._id) {
        filteredProducts = filteredProducts.filter(
          (item) => item._id !== currentProduct._id
        );
      }


      set({
        productsByCategories: filteredProducts,
        loading: false,
      });

      return filteredProducts;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false, productsByCategories: [] });
      return [];
    }
  },

  fetchProductsRatedByMe: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/rated-by-me`);

      set({
        loading: false,
        products: res.data.data, // store returned products in products array
        totalProducts: res.data.total,
      });

      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false, products: [] });
      return [];
    }
  },

  fetchProductsReviewedByMe: async () => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/reviewed-by-me`);

      set({
        loading: false,
        reviewedProducts: res.data.data, // store products reviewed by user
      });

      return res.data.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false, products: [] });
      return [];
    }
  },
  uploadQRCodeFromFile: async (file) => {
    try {
      if (!file) throw new Error("No file provided");

      set({ loading: true });

      const formData = new FormData();
      formData.append("qrFile", file);

      const response = await axios.post(`${API_URL}/upload-qr`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      set({ loading: false });
      return response.data; // server returns product info
    } catch (err) {
      set({ loading: false, error: err.response?.data?.message || err.message });
      return { success: false, error: err.response?.data?.message || err.message };
    }
  },

  getProductByCategoriesId: async (categoryId) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/category/${categoryId}`);

      set({
        loading: false,
        productsByCategories: res.data.products, // since controller returns products array
      });

      return res.data.products;
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false, productsByCategories: [] });
      return [];
    }
  },
  fetchProductsByWeather: async (city) => {
    try {
      if (!city) throw new Error("City is required");

      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/by-weather/${city}`);

      set({
        productsByWeather: res.data.products || [],
        loading: false,
      });

      return res.data.products || [];
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
        productsByWeather: [],
      });
      return [];
    }
  },

  // Fetch products by city
  fetchProductsByCity: async (city) => {
    try {
      set({ cityloading: true, error: null });
      const res = await axios.get(`${API_URL}/by-city/${city}`);
      set({
        productsByCity: res.data.data || res.data.products || [],
        cityloading: false,
      });
      return res.data.data || res.data.products || [];
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        cityloading: false,
        productsByCity: [],
      });
      return [];
    }
  },

}));
