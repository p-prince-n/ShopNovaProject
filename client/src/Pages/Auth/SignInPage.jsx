import { motion } from "framer-motion";
import Input from "../../components/Input";
import { Mail, Eye, EyeOff, Lock, Loader, PhoneCallIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import toast from "react-hot-toast";
import { Radio, Label } from "flowbite-react";
import {useThemeStore} from '../../Store/useThemeStore';

const SignInPage = () => {
  const { signIn, error, isLoading } = useAuthStore();
  const {theme}=useThemeStore();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    identifier: "",
    password: "",
  });

  const [lock, setLock] = useState(false);
  const [contactType, setContactType] = useState("Email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (
        (contactType === "Email" && userData.identifier !== "") ||
        (contactType === "Phone" && userData.identifier !== "")
      ) {
        await signIn(userData);
        navigate("/");
      } else {
        toast.error("All fields are required");
      }
    } catch (e) {
      toast.error(e.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}

      className={`max-w-md w-full ${theme==='light' ? 'bg-white/90 border-1 shadow-xl drop-shadow-2xl/50': 'bg-gray-800'}   bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl  overflow-hidden  `}
    >
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-400 text-blue-500 dark:text-transparent bg-clip-text">
          Welcome Back
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Contact selection */}
          <div className="flex max-w-md justify-between gap-4 mb-5 mx-10">
            <div className="flex items-center gap-2">
              <Radio
                id="email-option"
                name="contactInfo"
                value="Email"
                checked={contactType === "Email"}
                onChange={() => {
                  setContactType("Email");
                  setUserData((prev) => ({ ...prev, identifier: "" }));
                }}
              />
              <Label htmlFor="email-option" className="text-black dark:text-white">Email</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="phone-option"
                name="contactInfo"
                value="Phone"
                checked={contactType === "Phone"}
                onChange={() => {
                  setContactType("Phone");
                  setUserData((prev) => ({ ...prev, identifier: "" }));
                }}
              />
              <Label htmlFor="phone-option" className="text-black dark:text-white">Phone No.</Label>
            </div>
          </div>

          {/* Conditional input */}
          {contactType === "Email" ? (
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={userData.identifier}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, identifier: e.target.value }))
              }
            />
          ) : (
            <Input
              icon={PhoneCallIcon}
              type="text"
              placeholder="Phone Number"
              value={userData.identifier}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, identifier: e.target.value }))
              }
            />
          )}

          {/* Password */}
          <div className="relative mb-6 mt-4">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Lock className={`size-5 ${theme==='dark' ? 'text-green-500': 'text-blue-600'}`} />
            </div>
            <input
              className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${theme==='dark'?'bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400': 'bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45'} `}
              type={lock ? "password" : "text"}
              placeholder={lock ? "••••••" : "password"}
              value={userData.password}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, password: e.target.value }))
              }
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center"
              onClick={() => setLock((prev) => !prev)}
            >
              {!lock ? (
                <Eye className={`size-5 ${theme==='dark' ? 'text-green-500': 'text-blue-600'}`} />
              ) : (
                <EyeOff className={`size-5 ${theme==='dark' ? 'text-green-500': 'text-blue-600'}`} />
              )}
            </button>
          </div>

          <div className="flex items-center mb-2">
            <Link
              to={"/forgot-password"}
              className="text-sm text-blue-700 font-semibold dark:text-green-400 hover:underline"
            >
              forgot password
            </Link>
          </div>

          {/* Submit button */}
          <motion.button
            className={`mt-5 w-full py-3 px-4 text-center bg-gradient-to-r ${theme==='dark' ? 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500': 'from-cyan-400 to-blue-800 hover:from-cyan-400 hover:to-blue-600 focus:ring-cyan-900'} text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-200 transition-all duration-200`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader className="animate-spin mx-auto" size={24} />
            ) : (
              "Login"
            )}
          </motion.button>
        </form>
      </div>

      <div className="px-8 py-4 bg-cyan-900 dark:bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-white dark:text-gray-400">
          Don't have an account?{" "}
          <Link to={"/sign-up"} className="text-cyan-200 dark:text-green-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignInPage;
