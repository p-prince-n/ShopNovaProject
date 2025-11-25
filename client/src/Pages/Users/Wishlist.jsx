import { useEffect, useState } from "react";
import { useAuthStore } from "../../Store/authStore";
import LoaderAnimation from "../../components/LoaderAnimation";
import ProductGrid from "../../components/Home/ProductCard";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useThemeStore } from "../../Store/useThemeStore";
import { Heart, Star } from "lucide-react";

const Wishlist = () => {
  const {
    wishlist,
    error,
    isLoading,
    getWishlist,
    user,
    toggleWishlist: toggleWishlistAPI,
  } = useAuthStore();
  const navigate = useNavigate();
  const [wishlistedProducts, setWishlistedProducts] = useState({});
  const { theme } = useThemeStore();


  useEffect(() => {
    getWishlist();
  }, [getWishlist, toggleWishlistAPI]);


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


  const filteredWishlist = wishlist.filter(
    (product) => wishlistedProducts[product._id]
  );

  const headingVariants = {
    hidden: { y: 40, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    hover: { scale: 1.05, rotate: -1 },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.3, duration: 0.9, ease: "easeOut" },
    },
    pulse: {
      opacity: [1, 0.7, 1],
      transition: { duration: 2, repeat: Infinity },
    },
  };

  return (
    <div className="bg-transparent min-w-screen flex flex-col items-center min-h-screen relative overflow-y-scroll scrollbar-hide">
      {isLoading && <LoaderAnimation />}
      <div className="absolute top-25 w-full md:px-5 xl:px-50">
        <h1 className="text-xl md:text-2xl xl:text-3xl text-white dark:text-green-400 font-bold mb-5 flex items-center justify-center">
          Your WishList
        </h1>
        <div
          className={`${
            filteredWishlist.length !== 0 && "hidden"
          } flex flex-col items-center shadow-2xl justify-center min-h-[70vh] py-12 px-4 text-center select-none bg-white dark:bg-[#071022] border border-slate-100 dark:border-slate-800 rounded-xl`}
        >
          {/* Animated Icon (different per theme) */}
          <motion.div
            initial={{ scale: 0, rotate: -180, opacity: 0 }}
            animate={{
              scale: [1, 1.15, 1],
              rotate: 0,
              opacity: 1,
              y: [0, -8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-6"
          >
            {theme === "dark" ? (
              <Star size={100} className="text-yellow-400 drop-shadow-lg" />
            ) : (
              <Heart size={100} className="text-pink-500 drop-shadow-lg" />
            )}
          </motion.div>

          {/* Heading */}
          <motion.h2
            variants={headingVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className={`text-2xl md:text-3xl font-extrabold tracking-wide ${
              theme === "dark" ? "text-green-400" : "text-gray-700"
            }`}
          >
            Your Wishlist is Empty
          </motion.h2>

          {/* Description */}
          <motion.p
            variants={textVariants}
            initial="hidden"
            animate={["visible", "pulse"]}
            className={`mt-4 max-w-md text-sm md:text-base leading-relaxed ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Looks like you haven’t added anything to your wishlist yet. Discover
            amazing products at{" "}
            <motion.span
              animate={{
                color:
                  theme === "dark"
                    ? ["#facc15", "#f59e0b", "#facc15"]
                    : ["#ec4899", "#f472b6", "#ec4899"],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="font-semibold"
            >
              ShopNova
            </motion.span>{" "}
            and save your favorites here!
          </motion.p>

          {/* Call-to-Action Button */}
          <motion.button
            onClick={() => navigate("/home")}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            whileHover={{ scale: 1.08, rotate: -2 }}
            whileTap={{ scale: 0.95, rotate: 2 }}
            className={`mt-10 px-7 py-3 rounded-2xl font-semibold shadow-lg transition-colors duration-300
          ${
            theme === "dark"
              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-500"
              : "bg-pink-500 text-white hover:bg-pink-600"
          }`}
          >
            Explore Products
          </motion.button>
        </div>

        <div className={`${filteredWishlist.length === 0 && "hidden"} w-full`}>
          <ProductGrid
            products={filteredWishlist}
            showHeading={false}
            wishlistedProducts={wishlistedProducts}
            toggleWishlist={toggleWishlist}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
