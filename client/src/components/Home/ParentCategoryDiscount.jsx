import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export const DiscountproductCard = ({ product }) => {
  const navigate = useNavigate();
  const [imgIdx, setImgIdx] = useState(0);
  const intervalRef = useRef(null);

  return (
    <motion.div
      onClick={() => navigate(`/productdetail/${product._id}`)}
      className="p-2 rounded-lg flex flex-col items-center text-center cursor-pointer shadow-md dark:bg-black/35"
      whileHover={{
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
      }}
      transition={{ type: "spring", stiffness: 200, damping: 20 , duration: 0.6, ease: "easeOut" }}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 60 }}
      viewport={{ once: false, amount: 0.2 }}
    >
      <motion.img
        onHoverStart={() => {
          intervalRef.current = setInterval(() => {
            setImgIdx((prev) => (prev + 1) % product.images.length);
          }, 800);
        }}
        onHoverEnd={() => {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setImgIdx(0);
        }}
        src={product.images[imgIdx] || ""}
        alt={product.name}
        className="size-32 object-contain mb-2"
        whileHover={{ scale: 1.1 }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
      />
      <h3 className="font-medium text-gray-200 truncate w-40 overflow-ellipsis">
        {product.name}
      </h3>
      <p className="text-sm text-red-500 font-semibold mt-1 mb-2">
        {product.discount > 0 ? `${product.discount}% Off` : ""}
      </p>
    </motion.div>
  );
};

const ProductCategoryDiscount = ({ categoryName, products, discount = true }) => {
  const navigate = useNavigate();


  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };


  const cardVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 60 },
  };

  return (
    <motion.div
      className="border-[0.5px] bg-white/10 shadow-3xl shadow-black rounded-md px-5 md:px-10 py-5"
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 80 }}
      viewport={{ once: false, amount: 0.15 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    >
      <motion.h2
        className="text-xl md:text-2xl font-bold mb-6 text-white dark:text-green-400"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {discount && "Discount on "} {categoryName}
      </motion.h2>

      {/* Desktop / Grid layout */}
      <motion.div
        className="hidden md:flex items-center justify-center flex-wrap gap-7"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        exit="hidden"
        viewport={{ once: false, amount: 0.2 }}
      >
        {products.map((product) => (
          <motion.div key={product._id} variants={cardVariants}>
            <DiscountproductCard product={product} />
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile / List layout */}
      <div className="md:hidden flex flex-col gap-3">
        {products.map((product, idx) => (
          <motion.div
            key={product._id}
            onClick={() => navigate(`/productdetail/${product._id}`)}
            className="flex items-center justify-between gap-5 bg-white dark:bg-gray-800 p-3 rounded-lg cursor-pointer shadow-sm pr-5"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
            }}
            initial={{ opacity: 0, y: 50, x: 40 }}
            whileInView={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 50, x: 40 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, delay: idx * 0.1 }}
          >
            <motion.div className="flex items-center gap-3">
              <motion.img
                src={product.images[0] || ""}
                alt={product.name}
                className="h-16 w-16 object-contain rounded"
                whileHover={{ scale: 1.08 }}
                transition={{ type: "spring", stiffness: 220, damping: 18 }}
              />
              <div>
                <h3 className="font-medium text-gray-800 dark:text-gray-200">
                  {product.name}
                </h3>
                {product.discount > 0 && (
                  <p className="text-sm text-red-500 font-semibold">
                    {product.discount}% Off
                  </p>
                )}
              </div>
            </motion.div>
            <span className="text-gray-400 dark:text-gray-300 text-xl">›</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductCategoryDiscount;
