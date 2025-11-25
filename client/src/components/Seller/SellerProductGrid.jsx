import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

const SellerProductGrid = ({  item, selecteItem, order, selecteOrder, shipProduct=false}) => {

  return (
    <>
      

      <div className="hidden  md:w-1/2 lg:w-2/7 2xl:w-1/6 md:flex gap-3 mt-5">
        <ProductCard item={item} selectedItem={selecteItem} order={order} selecteOrder={selecteOrder} shipProduct={shipProduct} />
      </div>
      <div className="flex flex-col items-center justify-center gap-2 md:hidden px-1 mt-5">
        <ProductSellerCardMobile item={item} selectedItem={selecteItem} order={order} selecteOrder={selecteOrder} shipProduct={shipProduct} />
      </div>
    </>
  );
};

const ProductSellerCardMobile = ({ item, selectedItem, order, selecteOrder, shipProduct }) => {
  return (
    <motion.div
    onClick={()=>{selectedItem(item); selecteOrder(order)}}
      className="flex border-[0.5px] w-[60vw] items-center justify-between gap-5 bg-white dark:bg-gray-800 p-2 rounded-lg cursor-pointer shadow-sm  md:hidden"
      whileHover={{
        scale: 1.03,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <motion.div className="flex items-center gap-2 flex-7/8 ">
        <motion.img
          src={item.product.images[0]}
          alt={item.product.name}
          className="h-16 w-16 object-contain rounded"
          whileHover={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
        <div className="flex flex-col w-full">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2 ">
            {item.product.name}
          </h3>
          <h3 className="text-sm mb-2 text-gray-800 dark:text-gray-200 line-clamp-2 ">
            {item.product.description}
          </h3>
          <div className="flex items-center justify-between gap-5">
            <p className="text-sm text-red-500 font-semibold line-through">
              ₹{item.product.price}
            </p>
            <p className="text-sm text-teal-600 font-semibold">
              ₹{item.discountPrice}
            </p>
          </div>
        </div>
      </motion.div>

      <span className="text-gray-400 dark:text-gray-300 text-xl flex-1/8">
        ›
      </span>
    </motion.div>
  );
};


const ProductCard = ({ item, selectedItem, order, selecteOrder, shipProduct }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const intervalRef = useRef(null);

  return (
    <motion.div
   
      className="rounded-lg w-full   shadow-sm overflow-hidden border 
        bg-white dark:bg-gray-900 
        border-gray-200 dark:border-gray-700 flex flex-col cursor-pointer"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      onHoverStart={() => {
        if (item.product.images.length > 1) {
          intervalRef.current = setInterval(() => {
            setImgIdx((prev) => (prev + 1) % item.product.images.length);
          }, 700);
        }
      }}
      onHoverEnd={() => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setImgIdx(0);
      }}
    >
      {/* Product Image */}
      <div className="relative w-full h-28 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
        {item.product.images && item.product.images.length > 0 ? (
          <motion.img
            src={item.product.images[imgIdx]}
            alt={item.product.name}
            className="w-full h-full object-contain"
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            No Image
          </span>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col p-2 flex-1">
        <h3 className="font-medium text-gray-800 dark:text-gray-100 text-sm truncate">
          {item.product.name}
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 md:line-clamp-1 lg:line-clamp-2">
          {item.product.description || "No description"}
        </p>
        

        <div className="mt-auto">
          <p className="font-semibold text-green-600 dark:text-green-400 text-sm flex-col">
            <div>Total : ₹{item.discountPrice}</div>
            <div className="flex justify-between">
                <div>Qty: {item.quantity}</div>
             <div className="text-yellow-400 dark:text-yellow-300">{item.product.discount}% off</div>
            </div>
          </p>
          <motion.button
           onClick={()=>{selectedItem(item); selecteOrder(order)}}
            whileTap={{ scale: 0.95 }}
            className="mt-1 w-full px-2 py-1 rounded-md font-medium text-xs
              bg-green-600 text-white hover:bg-green-700 
              dark:bg-green-500 dark:hover:bg-green-600"
          >
            {shipProduct ? 'Ship' : 'Sell'} Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SellerProductGrid;
