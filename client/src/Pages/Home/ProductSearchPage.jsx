import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProductStore } from "../../Store/useProductStore";
import { motion } from "framer-motion";
import { Star, Heart } from "lucide-react";
import { useThemeStore } from "../../Store/useThemeStore";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function ProductSearchPage() {
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const [wishlist, setWishlist] = useState([]);
  const location = useLocation();
  const { headerSearchProducts, products, loading, filters } = useProductStore();

  const [localFilters, setLocalFilters] = useState({
    name: "",
    categoryId: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setLocalFilters({
      name: params.get("name") || "",
      categoryId: params.get("categoryId") || "",
    });
  }, [location.search]);

  useEffect(() => {
    headerSearchProducts({
      categoryId: localFilters.categoryId,
      name: localFilters.name,
    });
  }, [localFilters.categoryId, localFilters.name]);

  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center min-h-screen mb-5 w-full overflow-y-scroll scrollbar-hide"
    >
      <div
        className={`absolute  top-30 min-w-screen px-10 lg:px-20 xl:px-30 ${
          theme === "dark" ? "dark" : ""
        }`}
      >
        <div className="bg-gray-100 dark:bg-gray-900 transition-colors duration-500 flex flex-col lg:flex-row">
          {/* Main Content */}
          <main className="flex-1">
            {/* Header */}
            <motion.div
              initial={{ y: -60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
              className="flex w-full items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10"
            >
              <h1 className="text-lg font-bold dark:text-white">
                Showing {products?.length || 0} results for{" "}
                <span className="text-blue-600">"{localFilters.name}"</span>
              </h1>
            </motion.div>

            {/* Products */}
            <div className="p-6 h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide space-y-4">
              {products?.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="flex flex-col items-center justify-center mt-20 w-full"
                >
                  <div className="w-40 h-40 md:w-60 md:h-60">
                    {/* SVG or illustration */}
                    <img
                      src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                      alt="No Products Found"
                      className="w-full h-full object-contain animate-bounce"
                    />
                  </div>
                  <h2 className="mt-6 text-xl md:text-2xl font-semibold dark:text-white text-gray-700 text-center">
                    No products found
                  </h2>
                  <p className="mt-2 text-gray-500 dark:text-gray-300 text-center">
                    Try adjusting your search or filter to find what you're
                    looking for.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/home")}
                    className="mt-6 px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Go Back Home
                  </motion.button>
                </motion.div>
              )}

              {products.length > 0 &&
                products.map((p) => (
                  <motion.div
                    onClick={() => navigate(`/productdetail/${p._id}`)}
                    key={p._id}
                    className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-sm relative cursor-pointer"
                    initial={{ opacity: 0, y: 80 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{
                      scale: 1.02,
                      rotateX: 1,
                      rotateY: -1,
                      boxShadow: "0px 12px 30px rgba(0,0,0,0.2)",
                    }}
                  >
                    {/* Image + Wishlist */}
                    <div className="relative w-full sm:w-28 h-48 sm:h-28 flex-shrink-0 mx-auto sm:mx-0">
                      <motion.img
                        src={p.images?.[0]}
                        alt={p.name}
                        className="w-full h-full object-contain"
                      />
                      <motion.button
                        whileTap={{ scale: 0.7 }}
                        whileHover={{ scale: 1.2 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(p._id);
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md"
                      >
                        <Heart
                          className={`w-5 h-5 sm:w-4 sm:h-4 ${
                            wishlist.includes(p._id)
                              ? "fill-red-500 text-red-500"
                              : "text-gray-500"
                          }`}
                        />
                      </motion.button>
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="font-semibold text-base sm:text-lg md:text-xl dark:text-white">
                          {p.name}
                        </h2>
                        <div className="flex items-center gap-2 text-xs sm:text-sm mt-1">
                          <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-medium">
                            <Star size={14} /> {p.ratings || 0}
                          </span>
                          <span className="text-gray-500 dark:text-gray-400">
                            ({p.reviewsCount} Reviews)
                          </span>
                        </div>
                        <ul className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-2 space-y-1">
                          {p.attributes?.slice(0, 5).map((attr, idx) => {
                            if (!attr.key) {
                              const key = Object.keys(attr)[0];
                              return (
                                <li key={idx}>
                                  • {key}: {attr[key]}
                                </li>
                              );
                            }
                            return (
                              <li key={idx}>
                                • {attr.key}: {attr.value}
                              </li>
                            );
                          })}
                        </ul>
                      </div>

                      {/* Price */}
                      <div className="text-right mt-4 sm:mt-0 flex flex-col justify-between items-end">
                        <span className="text-base sm:text-lg md:text-xl font-bold dark:text-white">
                          ₹
                          {(
                            p.price -
                            (p.price * (p.discount || 0)) / 100
                          ).toFixed(2)}
                        </span>
                        {p.discount > 0 && (
                          <div className="flex gap-2 items-center">
                            <span className="text-xs sm:text-sm line-through text-red-500 font-bold">
                              ₹{p.price}
                            </span>
                            <span className="text-xs sm:text-sm text-yellow-400 dark:text-yellow-300">
                              {p.discount}% off
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  );
}
