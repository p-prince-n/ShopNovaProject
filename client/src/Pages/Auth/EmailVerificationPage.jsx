import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../Store/authStore";
import toast from "react-hot-toast";
import { useThemeStore } from "../../Store/useThemeStore";
import { useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
  const { emailVerification, resendEmailCode, isLoading } = useAuthStore();
  const { theme } = useThemeStore();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRef = useRef([]);
  const navigate = useNavigate();

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
      await emailVerification(verificationCode);
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await resendEmailCode();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error resending email code");
    }
  };

  return (
    <div className={`max-w-md w-full ${theme === "light" ? "bg-white/90 border-1 shadow-xl drop-shadow-2xl/50" : "bg-gray-800"} rounded-xl overflow-hidden p-6`}>
      <h2 className="text-3xl font-bold mb-4 text-center text-blue-500 dark:text-emerald-400">
        Verify Your Email
      </h2>
      <p className="text-center text-black/60 dark:text-gray-300 mb-6">
        Enter the 6-digit code sent to your email address.
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
          {isLoading ? "Verifying..." : "Verify Email"}
        </motion.button>
      </form>

      <button
        onClick={handleResend}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        Resend Email Code
      </button>
    </div>
  );
};

export default EmailVerificationPage;
