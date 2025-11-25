import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X } from "lucide-react";
import { useSpinStore } from "../../Store/useSpinStore";

const SpinCard = ({ value, code, expire, theme, id }) => {
  const { deleteSpin } = useSpinStore();
  const [copied, setCopied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteSpin(id);
      setShowPopup(false);
    } catch (err) {
      console.error("Failed to delete spin:", err);
    } finally {
      setDeleting(false);
    }
  };

  const statusColor = expire
    ? "text-red-500"
    : theme === "dark"
    ? "text-green-400"
    : "text-blue-500";

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        whileHover={{ scale: 1.05, rotate: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 10 }}
        className={`relative w-full sm:w-80 md:w-72 p-5 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col gap-4`}
      >
        {/* Expire / Delete mark */}
        {expire && (
          <button
            onClick={() => setShowPopup(true)}
            disabled={deleting}
            className="absolute top-2 right-2 text-red-500 hover:text-red-600 transition-colors"
            title="Delete Spin"
          >
            <X size={24} />
          </button>
        )}

        {/* Value */}
        <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {value}% Off
        </div>

        {/* Code + Copy */}
        <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
          <span className="font-mono text-sm sm:text-base md:text-lg text-gray-900 dark:text-gray-100">
            {code}
          </span>
          <button
            onClick={handleCopy}
            className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition-colors"
          >
            {copied ? <Check size={20} color="green" /> : <Copy size={20} />}
          </button>
        </div>

        {/* Status */}
        <motion.div
          animate={{ x: [-5, 5, -5], opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`text-sm font-semibold ${statusColor}`}
        >
          {expire ? "Expired" : "Valid"}
        </motion.div>
      </motion.div>

      {/* 🔥 Custom Delete Confirmation Popup */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-80 shadow-xl text-center"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Delete Spin Code?
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete this spin code?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowPopup(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleting}
                  className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 disabled:opacity-70"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SpinCardGrid = ({ theme = "light", spinData = [] }) => {
  return (
    <AnimatePresence>
      <div className="p-5 flex items-center justify-center flex-wrap gap-6">
        {spinData.map((spin) => (
          <SpinCard
            key={spin._id}
            value={spin.value}
            code={spin.code}
            expire={spin.expire}
            id={spin._id}
            theme={theme}
          />
        ))}
      </div>
    </AnimatePresence>
  );
};

export default SpinCardGrid;
