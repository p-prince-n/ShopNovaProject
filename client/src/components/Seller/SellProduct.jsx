import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../Store/useOrderStore";
import LoaderAnimation from "../../components/LoaderAnimation";
import { useSellerStore } from "../../Store/sellerStore";
import { motion } from "framer-motion";
import SellerProductGrid from "./SellerProductGrid";
import SellerProductDetailsPage from "./SellerProductDetalsPage";
import { ArrowLeftCircle } from "lucide-react";
import { PackageX } from "lucide-react";

const SellProduct = () => {
  const {
    loading: sellerLoding,
    sellerPendingOrders,
    fetchSellerPendingOrders,
  } = useOrderStore();
  const { sellerProfile } = useSellerStore();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  useEffect(() => {
    fetchSellerPendingOrders();
  }, []);
  useEffect(() => {
    fetchSellerPendingOrders();
  }, []);
  const items = sellerPendingOrders.flatMap((order) => order.items);
  if (sellerLoding) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoaderAnimation />
      </div>
    );
  }
  if (!sellerProfile?.isVerifiedSeller) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 py-10">
        {/* Card */}
        <motion.div
          className="max-w-xl w-full rounded-2xl shadow-lg p-8 border 
        bg-white text-gray-800 
        dark:bg-gray-900 dark:text-gray-100 
        border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* Main Alert */}
          <motion.h1
            className="font-extrabold text-2xl md:text-3xl underline 
          text-red-600 dark:text-red-400"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            🚨 First Verify by Admin 🚨
          </motion.h1>

          {/* Sub Text */}
          <motion.p
            className="mt-4 max-w-lg mx-auto text-sm md:text-base 
          text-gray-700 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Your account is currently under review. Once verified by our admin
            team, you’ll be able to add products, manage your store, and accept
            orders.
          </motion.p>

          {/* Steps */}
          <motion.ul
            className="mt-6 space-y-2 text-sm md:text-base 
          text-gray-600 dark:text-gray-400 text-left"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <li>✅ Submit all required documents</li>
            <li>✅ Wait for admin approval</li>
            <li>✅ Start selling once verified</li>
          </motion.ul>

          {/* Animated Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="mt-8 px-6 py-2 rounded-xl font-semibold shadow-md 
          bg-red-600 text-white hover:bg-red-700
          dark:bg-red-500 dark:hover:bg-red-600"
          >
            Contact Support
          </motion.button>

          {/* Pulsing Lock Icon */}
          <motion.div
            className="mt-10 text-4xl text-red-600 dark:text-red-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            🔒
          </motion.div>
        </motion.div>
      </div>
    );
  }

  const SelectTheItem = (item) => {
    setSelectedItem(item);
  };
  const HandleBackButton = () => {
    setSelectedItem(null);
    setSelectedOrder(null);
  };

  return (
    <div className="w-full h-full px-2 md:px-10 py-3 md:py-5">
      <h1 className="flex w-full items-center justify-center dark:text-green-400 text-xl md:text-2xl font-bold">
        Sell Products
      </h1>
      {items.length > 0 ? (
        selectedItem === null ? (
          <div className="flex items-center justify-start gap-5 w-full flex-wrap">
            {sellerPendingOrders.map((order) =>
              order.items.map((item, idx) => (
                <SellerProductGrid
                  key={item.product._id || idx}
                  order={order}
                  item={item}
                  selecteItem={SelectTheItem}
                  selecteOrder={setSelectedOrder}
                />
              ))
            )}
          </div>
        ) : (
          <>
            <button onClick={HandleBackButton}>
              <ArrowLeftCircle className="dark:text-green-400" />
            </button>
            <div>
              <SellerProductDetailsPage
                item={selectedItem}
                order={selectedOrder}
                HandleBackButton={HandleBackButton}
              />
            </div>
          </>
        )
      ) : (
         <motion.div
      className="flex flex-col items-center justify-center text-center py-10 px-4
                 sm:px-6 lg:px-8
                 bg-white dark:bg-gray-800 rounded-2xl shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Icon */}
      <motion.div
        className="flex items-center justify-center w-20 h-20 rounded-full
                   bg-gray-100 dark:bg-gray-700 mb-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <PackageX className="w-10 h-10 text-gray-500 dark:text-gray-300" />
      </motion.div>

      {/* Title */}
      <motion.h2
        className="text-lg sm:text-xl lg:text-2xl font-semibold
                   text-gray-700 dark:text-gray-200 mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        No Pending Orders
      </motion.h2>

      {/* Subtitle */}
      <motion.p
        className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        You don’t have any pending orders right now.  
        New orders will appear here once customers place them.
      </motion.p>

      {/* Suggestion button */}
      <motion.button onClick={fetchSellerPendingOrders}
        className="px-4 sm:px-6 py-2 rounded-xl 
                   bg-gradient-to-r from-cyan-500 to-blue-600 
                   text-white text-sm sm:text-base font-medium 
                   hover:from-cyan-600 hover:to-blue-700 
                   focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400
                   dark:focus:ring-offset-gray-800"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        Refresh Orders
      </motion.button>
    </motion.div>
      )}
    </div>
  );
};

export default SellProduct;
