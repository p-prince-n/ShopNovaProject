import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";


const cardVariants = {
  hiddenDown: { opacity: 0, y: 60 },
  hiddenUp: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exitDown: { opacity: 0, y: 60 },
  exitUp: { opacity: 0, y: -60 },
};


const ProductCard = ({ product, wishlisted, toggleWishlist, index }) => {
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const intervalRef = useRef(null);

  const price = product.price;
  const discount = product.discount;
  const discountPrice = (price - (price * discount) / 100).toFixed(0);

  return (
    <motion.div
      onClick={() => navigate(`/productdetail/${product._id}`)}
      variants={cardVariants}
      initial={index % 2 === 0 ? "hiddenDown" : "hiddenUp"}
      whileInView="visible"
      exit={index % 2 === 0 ? "exitDown" : "exitUp"}
      viewport={{ once: false, amount: 0.2 }}
      whileHover={{
        y: -8,
        scale: 1.05,
        rotate: [0, 0.5, -0.5, 0],
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      onHoverStart={() => {
        if (product.images.length > 1) {
          intervalRef.current = setInterval(() => {
            setImgIdx((prev) => (prev + 1) % product.images.length);
          }, 700);
        }
      }}
      onHoverEnd={() => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setImgIdx(0);
      }}
      className="relative w-45 flex-col rounded-2xl bg-white dark:bg-gray-900 shadow-2xl shadow-black overflow-hidden cursor-pointer hidden md:flex mt-5"
    >
      <div className="relative flex items-center justify-center overflow-hidden py-3 rounded-2xl">
        <motion.img
          src={product.images[imgIdx]}
          alt={product.name}
          className="w-37 h-40 object-contain rounded-xl"
          whileHover={{ scale: 1.1 }}
          transition={{ duration: 0.6 }}
        />

        {/* Wishlist */}
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product._id);
          }}
          whileTap={{ scale: 0.7 }}
          animate={wishlisted ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.4 }}
          className="absolute top-4 right-4 z-20 p-1 rounded-full shadow-md"
        >
          <Heart
            className={`w-5 h-5 transition-colors duration-300 ${
              wishlisted ? "text-red-500 dark:text-green-500" : "text-gray-500"
            }`}
            stroke="currentColor"
            fill={wishlisted ? "currentColor" : "none"}
          />
        </motion.button>
      </div>

      <div className="py-2 px-1 flex flex-col justify-between flex-1">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
          {product.name}
        </h3>
        <div className="flex items-center justify-between mt-3 px-2">
          <span className="text-md font-bold line-through text-red-600 dark:text-red-600">
            ₹{price}
          </span>
          <span className="text-md font-bold text-teal-600 dark:text-teal-400">
            ₹{discountPrice}
          </span>
        </div>
      </div>

      <div className="w-full px-2 mb-2 flex items-center">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ backgroundColor: "#0d9488", color: "#fff" }}
          className="px-4 py-2 w-full text-sm rounded-xl bg-teal-500 text-white shadow-md"
        >
          Buy Now
        </motion.button>
      </div>

      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-400/20 via-cyan-400/20 to-blue-500/20 opacity-0"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};


const ProductCardMobile = ({ product, wishlisted, toggleWishlist, index }) => {
  const navigate = useNavigate();
  const price = product.price;
  const discount = product.discount;
  const discountPrice = (price - (price * discount) / 100).toFixed(0);

  return (
    <motion.div
      onClick={() => navigate(`/productdetail/${product._id}`)}
      variants={cardVariants}
      initial={index % 2 === 0 ? "hiddenDown" : "hiddenUp"}
      whileInView="visible"
      exit={index % 2 === 0 ? "exitDown" : "exitUp"}
      viewport={{ once: false, amount: 0.2 }}
      className="flex items-center justify-between gap-5 bg-white dark:bg-gray-800 p-2 rounded-lg cursor-pointer shadow-sm pr-5 md:hidden"
      whileHover={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div className="flex items-center gap-2 flex-7/8 ">
        <motion.img
          src={product.images[0]}
          alt={product.name}
          className="h-16 w-16 object-contain rounded"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <div className="flex flex-col w-full">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-5">
            <p className="text-sm text-red-500 font-semibold line-through">
              ₹{price}
            </p>
            <p className="text-sm text-teal-600 font-semibold">
              ₹{discountPrice}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Wishlist */}
      <motion.button
        onClick={() => toggleWishlist(product._id)}
        whileTap={{ scale: 0.7 }}
        className="p-1 rounded-full shadow-md"
      >
        <Heart
          className={`w-5 h-5 transition-colors duration-300 ${
            wishlisted ? "text-red-500 dark:text-green-500" : "text-gray-500"
          }`}
          stroke="currentColor"
          fill={wishlisted ? "currentColor" : "none"}
        />
      </motion.button>

      <span className="text-gray-400 dark:text-gray-300 text-xl flex-1/8">
        ›
      </span>
    </motion.div>
  );
};


const ProductGrid = ({
  title = "Latest Products",
  products,
  allProducts,
  showClickMore = () => {},
  showHeading = true,
  wishlistedProducts,
  toggleWishlist,
}) => {
  return (
    <motion.div
      className="py-5 bg-white/5 rounded-4xl shadow-2xl shadow-black"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      {showHeading && (
        <motion.h2
          className="text-3xl font-bold text-center dark:text-green-400 text-white"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          viewport={{ once: false }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {title}
        </motion.h2>
      )}

      {/* Desktop */}
      <div className="hidden md:grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 px-5">
        {products.map((product, index) => (
          <ProductCard
            key={product._id}
            product={product}
            wishlisted={!!wishlistedProducts[product._id]}
            toggleWishlist={toggleWishlist}
            index={index}
          />
        ))}
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-2 md:hidden px-5 mt-5">
        {products.map((product, index) => (
          <ProductCardMobile
            key={product._id}
            product={product}
            wishlisted={!!wishlistedProducts[product._id]}
            toggleWishlist={toggleWishlist}
            index={index}
          />
        ))}
      </div>

      {/* Show More */}
      <div className="mt-5">
        {allProducts && products.length < allProducts.length && (
          <button
            onClick={showClickMore}
            className="w-full text-white dark:text-teal-500 self-center text-sm py-7 font-bold"
          >
            Show More
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default ProductGrid;
