import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../Store/authStore";
import toast from "react-hot-toast";
import { useThemeStore } from "../../Store/useThemeStore";
import { useOrderStore } from "../../Store/useOrderStore";

const VerifyCodeDelivery = ({ isOpen, setIsOpen, orderId, productId }) => {
  const { loading: isLoading, verifyDeliveryCode } = useOrderStore();
  const { theme } = useThemeStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);

  const handleChange = (index, value) => {
    const newCode = [...code];
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRef.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (!verificationCode) return;

    try {
      await verifyDeliveryCode(orderId, productId, verificationCode);
      toast.success("Order verified successfully ✅");
      setIsOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background Blur */}
          <div
            className="absolute inset-0 bg-black/20 bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup Card */}
          <motion.div
            className={`relative max-w-md w-full rounded-xl overflow-hidden p-6 ${
              theme === "light"
                ? "bg-white shadow-xl"
                : "bg-gray-800 shadow-lg"
            }`}
            initial={{ scale: 0.9, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-500 dark:text-emerald-400">
              Verify Delivery Code
            </h2>
            <p className="text-center text-black/60 dark:text-gray-300 mb-6">
              Enter the 6-digit code shared with the customer to confirm delivery.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-between">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRef.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    className={`w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg ${
                      theme === "dark"
                        ? "bg-gray-700 text-white border-gray-400 focus:border-green-500"
                        : "bg-gray-200 text-black border-gray-500 focus:border-blue-500"
                    } focus:outline-none`}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                  />
                ))}
              </div>

              <motion.button
                disabled={isLoading || code.some((digit) => !digit)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`w-full py-3 px-4 text-white font-bold rounded-lg shadow-lg ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gradient-to-r from-cyan-400 to-blue-800"
                }`}
              >
                {isLoading ? "Verifying..." : "Verify Delivery Order"}
              </motion.button>
            </form>

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VerifyCodeDelivery;
