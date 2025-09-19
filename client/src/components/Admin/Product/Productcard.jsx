import { motion } from "framer-motion";
import { useProductStore } from "../../../Store/useProductStore";
import { useState } from "react";
import ShowAlertBox from "../ShowAlertBox";

export default function ProductCard({
  update = false,
  product,
  updateOn = () => {},
}) {
  const { deleteProduct } = useProductStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setShowConfirm(false);
  };

  const displayProduct = product;

  return (
    <>
      <motion.div
        className="hidden md:block bg-white dark:bg-gray-600 rounded-lg shadow-xl  p-2 w-40 "
        whileHover={{ scale: 1.05, boxShadow: "0px 4px 16px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.img
          src={displayProduct.images[0]}
          alt={displayProduct.name}
          className="rounded-md h-36 w-full object-cover mb-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        />

        <h2 className="text-sm font-semibold mb-1 truncate dark:text-green-300">
          {displayProduct.name}
        </h2>

        <div className="flex items-center justify-between gap-2 mb-1">
          {displayProduct.discount && (
            <div className="text-red-700 font-bold line-through text-xs max-w-[45%] truncate">
              ₹{displayProduct.price}
            </div>
          )}

          <div className="text-sm font-bold text-green-600 dark:text-green-400 max-w-[55%] truncate text-right">
            ₹
            {displayProduct.discount
              ? displayProduct.price -
                (displayProduct.price * displayProduct.discount) / 100
              : displayProduct.price}
          </div>
        </div>

        {update ? (
          <motion.button
            className="w-full rounded-md bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white hover:bg-gradient-to-br focus:ring-cyan-300 dark:focus:ring-cyan-800 py-1 text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateOn(product)}
          >
            Update
          </motion.button>
        ) : (
          <motion.button
            onClick={() => setShowConfirm(true)}
            className="w-full rounded-md bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800 py-1 text-xs"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        )}
      </motion.div>
      {/* small devices */}

      <motion.div
        className="md:hidden  bg-white dark:bg-gray-600 rounded-lg shadow-xl  p-1 w-20  "
        whileHover={{ scale: 1.05, boxShadow: "0px 4px 16px rgba(0,0,0,0.2)" }}
        whileTap={{ scale: 0.97 }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.img
          src={displayProduct.images[0]}
          alt={displayProduct.name}
          className="rounded-md h-22 w-full object-cover mb-2"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
        />

        <h2 className="text-[0.575rem] font-semibold mb-1 truncate dark:text-green-300">
          {displayProduct.name}
        </h2>

        <div className="flex flex-col text-[0.65rem] items-center justify-start mb-1">
          {displayProduct.discount && (
            <div className="text-red-700 font-bold line-through text-XS">
              ₹{displayProduct.price}
            </div>
          )}
          <div className=" text-green-600 dark:text-green-400">
            ₹
            {displayProduct.discount
              ? displayProduct.price -
                (displayProduct.price * displayProduct.discount) / 100
              : displayProduct.price}
          </div>
        </div>
        {update ? (
          <motion.button
            className="w-full rounded-md bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white hover:bg-gradient-to-br focus:ring-cyan-300 dark:focus:ring-cyan-800 py-[0.15rem] text-[0.5rem]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => updateOn(product)}
          >
            Update
          </motion.button>
        ) : (
          <motion.button
            onClick={() => setShowConfirm(true)}
            className="w-full rounded-md bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800 py-[0.15rem] text-[0.5rem]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Delete
          </motion.button>
        )}
      </motion.div>
      {showConfirm && (
        <ShowAlertBox
          data={product}
          product={true}
          showConfirm={() => setShowConfirm(false)}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
}
