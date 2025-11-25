import React from "react";
import { motion } from "framer-motion";

const ShowAlertBox = ({
  data = null,
  showConfirm = () => {},
  text = null,
  product = false,
  handleDelete = () => {},
}) => {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm"
      >
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Confirm Delete
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Are you sure you want to delete <b>{data?.name}</b>{" "}
          {!text && (product ? `Product` : `Category`)}{text && text}?
        </p>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={showConfirm}
            className="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-black dark:text-white"
          >
            Cancel
          </button>
          <button

            onClick={() => handleDelete(data?._id)}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ShowAlertBox;
