import React, { useEffect, useState } from "react";
import { useOrderStore } from "../../Store/useOrderStore";
import LoaderAnimation from "../../components/LoaderAnimation";
import { motion } from "framer-motion";

import DeliveryProductGrid from "./DeliveryProductGrid";
import DeliveryProductDetailsPage from "./DeliveryProductDetailsPage";// similar to SellerProductDetailsPage
import { ArrowLeftCircle } from "lucide-react";
import { PackageX } from "lucide-react";

const DeliverShipProduct = () => {
  const {
    loading,
    deliveryUnassignedOrders,
    fetchDeliveryUnassignedOrders,
  } = useOrderStore();

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchDeliveryUnassignedOrders();
  }, []);

  const items = deliveryUnassignedOrders.flatMap((order) => order.items);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <LoaderAnimation />
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
      <h1 className="flex w-full items-center justify-center dark:text-blue-400 text-xl md:text-2xl font-bold">
        Ship Orders
      </h1>

      {items.length > 0 ? (
        selectedItem === null ? (
          <div className="flex items-center justify-center gap-5 w-full flex-wrap">
            {deliveryUnassignedOrders.map((order) =>
              order.items.map((item, idx) => (
                <DeliveryProductGrid
                  key={item.product._id || idx}
                  order={order}
                  item={item}
                  selectItem={SelectTheItem}
                  selectOrder={setSelectedOrder}
                />
              ))
            )}
          </div>
        ) : (
          <>
            <button onClick={HandleBackButton}>
              <ArrowLeftCircle className="dark:text-blue-400" />
            </button>
            <div>
              <DeliveryProductDetailsPage
                item={selectedItem}
                order={selectedOrder}
                HandleBackButton={HandleBackButton}
                verify={false}
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
          <motion.div
            className="flex items-center justify-center w-20 h-20 rounded-full
                       bg-gray-100 dark:bg-gray-700 mb-4"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <PackageX className="w-10 h-10 text-gray-500 dark:text-gray-300" />
          </motion.div>

          <motion.h2
            className="text-lg sm:text-xl lg:text-2xl font-semibold
                       text-gray-700 dark:text-gray-200 mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            No Orders to Ship
          </motion.h2>

          <motion.p
            className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-6 max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            There are currently no shipped orders waiting to be picked up. 
            Once sellers ship products, they will appear here.
          </motion.p>

          <motion.button
            onClick={fetchDeliveryUnassignedOrders}
            className="px-4 sm:px-6 py-2 rounded-xl 
                       bg-gradient-to-r from-purple-500 to-pink-500
                       text-white text-sm sm:text-base font-medium 
                       hover:from-purple-600 hover:to-pink-600
                       focus:ring-2 focus:ring-offset-2 focus:ring-purple-400
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

export default DeliverShipProduct;
