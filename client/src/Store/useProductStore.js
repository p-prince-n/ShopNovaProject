
import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "../utils/constant";

const API_URL = `${BASE_URL}/product`;
axios.defaults.withCredentials = true;
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
  filters:null,

  productsByWeather: [],
  productsByCity: [],


  fetchProducts: async (startIndex = 0, limit = 0) => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/getAll?startIndex=${startIndex}&limit=${limit}`);

      if (startIndex === 0) {

        set({
          totalProducts: res.data.totalProducts,
          products: res.data.data,
          loading: false,
        });
      } else {

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
  downloadProductsExcel: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${API_URL}/downloadInExcelProduct`, {
        responseType: "blob",
      });


      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Products_${new Date().toISOString()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      set({ loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || err.message,
        loading: false,
      });
    }
  },

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
  },
  fetchDiscountProductsByCategory: async (categoryId, categoryName) => {
    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/category/discount/${categoryId}`);


      set((state) => ({
        categoryDiscountProducts: {
          ...state.categoryDiscountProducts,
          [categoryName]: res.data.data,
        },
        loading: false,
      }));

      return res.data.data;
    } catch (err) {
      if (err.response?.status === 404) {
        set((state) => ({
          categoryDiscountProducts: {
            ...state.categoryDiscountProducts,
            [categoryName]: [],
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

    try {
      set({ loading: true, error: null });

      const res = await axios.get(`${API_URL}/getRandomProducts`);


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


      const res = await axios.put(`${API_URL}/rate/${id}`, { rating });


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
        products: res.data.data,
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
        reviewedProducts: res.data.data,
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
      return response.data;
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
        productsByCategories: res.data.products,
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


  headerSearchProducts: async ({ name, categoryId, minPrice, maxPrice, brands, sortBy }) => {
    try {
      set({ loading: true, error: null });

      const params = new URLSearchParams();

      if (name) params.append("name", name);
      if (categoryId) params.append("categoryId", categoryId);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (brands && brands.length) params.append("brands", brands.join(","));
      if (sortBy) params.append("sortBy", sortBy);

      const res = await axios.get(`${API_URL}/search?${params.toString()}`);

      set({
        products: res.data.products,
        filters: res.data.filters,
        loading: false,
      });


    } catch (err) {
      const message = err.response?.data?.message || err.message;
      set({ error: message, loading: false, products: [] });
      return { success: false, error: message };
    }
  },

}));
