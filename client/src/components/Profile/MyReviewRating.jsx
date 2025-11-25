import { useEffect, useState } from "react";
import { useProductStore } from "../../Store/useProductStore";
import { useThemeStore } from "../../Store/useThemeStore";
import ProductGrid from "../Home/ProductCard";
import { useAuthStore } from "../../Store/authStore";
import { useNavigate } from "react-router-dom";
import LoaderAnimation from "../LoaderAnimation";
import { motion } from "framer-motion";
import { Star, MessageSquare } from "lucide-react";

const MyReviewRating = () => {
  const {
    products,
    loading,
    fetchProductsRatedByMe,
    reviewedProducts,
    fetchProductsReviewedByMe,
  } = useProductStore();
  const navigate = useNavigate();
  const { theme } = useThemeStore();
  const { user, toggleWishlist: toggleWishlistAPI } = useAuthStore();
  const [wishlistedProducts, setWishlistedProducts] = useState({});
  const [showProducts, setShowProducts] = useState([]);
  const [showReviewdProducts, setShowReviewdProducts] = useState([]);
  useEffect(() => {
    fetchProductsRatedByMe();
  }, [fetchProductsRatedByMe]);

  useEffect(() => {
    fetchProductsReviewedByMe();
  }, [fetchProductsReviewedByMe]);

  useEffect(() => {
    if (user?.wishlist) {
      const initialWishlist = {};
      user.wishlist.forEach((id) => (initialWishlist[id] = true));
      setWishlistedProducts(initialWishlist);
    }
  }, [user]);

  const toggleWishlist = async (id) => {
    if (!user) {
      navigate("/sign-in");
      return;
    }


    setWishlistedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    try {
      await toggleWishlistAPI(id);
    } catch (error) {

      setWishlistedProducts((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };
  useEffect(() => {
    if (products.length > 0) setShowProducts(products.slice(0, 5));
  }, [products]);
  useEffect(() => {
    if (reviewedProducts.length > 0)
      setShowReviewdProducts(reviewedProducts.slice(0, 5));
  }, [reviewedProducts]);
  const handleShowMoreClick = () => {
    setShowProducts((prev) => [
      ...prev,
      ...products.slice(prev.length, prev.length + 5),
    ]);
  };
  const handleShowReviewesMoreClick = () => {
    setShowReviewdProducts((prev) => [
      ...prev,
      ...reviewedProducts.slice(prev.length, prev.length + 5),
    ]);
  };
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center">
        <LoaderAnimation />
      </div>
    );
  }
  return (
    <div className="w-full px-2 mt-2 flex flex-col gap-5 ">
      {/* your Ratings */}
      <div className="flex flex-col gap-10">
        {/* My Ratings Section */}
        <div className="border-[0.5px] rounded-4xl p-4">
          {showProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: 0,
                  opacity: 1,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="mb-6"
              >
                <Star
                  size={90}
                  className={`drop-shadow-lg ${
                    theme === "dark" ? "text-yellow-400" : "text-yellow-500"
                  }`}
                />
              </motion.div>

              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className={`text-xl md:text-2xl font-bold ${
                  theme === "dark" ? "text-yellow-300" : "text-gray-700"
                }`}
              >
                You haven’t rated any product yet
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 1 }}
                className={`mt-3 max-w-md text-sm md:text-base ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Start sharing your opinions on products you love at{" "}
                <motion.span
                  animate={{
                    color:
                      theme === "dark"
                        ? ["#facc15", "#f59e0b", "#facc15"]
                        : ["#eab308", "#facc15", "#eab308"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="font-semibold"
                >
                  ShopNova
                </motion.span>{" "}
                to help others discover quality items!
              </motion.p>
            </div>
          ) : (
            <ProductGrid
              products={showProducts}
              title="My Ratings"
              wishlistedProducts={wishlistedProducts}
              toggleWishlist={toggleWishlist}
              showClickMore={handleShowMoreClick}
              allProducts={products}
            />
          )}
        </div>

        {/* My Reviews Section */}
        <div className="border-[0.5px] rounded-4xl p-4">
          {showReviewdProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: [0, 1, 0.8, 1], y: 0 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="mb-6"
              >
                <MessageSquare
                  size={90}
                  className={`drop-shadow-lg ${
                    theme === "dark" ? "text-blue-400" : "text-blue-500"
                  }`}
                />
              </motion.div>

              <motion.h2
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                className={`text-xl md:text-2xl font-bold ${
                  theme === "dark" ? "text-blue-300" : "text-gray-700"
                }`}
              >
                You haven’t written any reviews yet
              </motion.h2>

              <motion.p
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className={`mt-3 max-w-md text-sm md:text-base ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Share your thoughts and experiences with products on{" "}
                <motion.span
                  animate={{
                    color:
                      theme === "dark"
                        ? ["#60a5fa", "#3b82f6", "#60a5fa"]
                        : ["#2563eb", "#3b82f6", "#2563eb"],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="font-semibold"
                >
                  ShopNova
                </motion.span>{" "}
                and guide other shoppers with your valuable insights!
              </motion.p>
            </div>
          ) : (
            <ProductGrid
              products={showReviewdProducts}
              title="My Reviews"
              wishlistedProducts={wishlistedProducts}
              toggleWishlist={toggleWishlist}
              showClickMore={handleShowReviewesMoreClick}
              allProducts={reviewedProducts}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReviewRating;
