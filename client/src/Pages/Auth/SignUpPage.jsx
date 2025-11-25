import { motion } from "framer-motion";
import Input from "../../components/Input";
import { User, Mail, Eye, EyeOff, Lock, Loader, PhoneCallIcon } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../../components/PasswordStrengthMeter";
import { useAuthStore } from "../../Store/authStore";
import toast from "react-hot-toast";
import {useThemeStore} from '../../Store/useThemeStore';

const SignUpPage = () => {
  const { signUp, error, isLoading } = useAuthStore();
  const navigate=useNavigate();
  const {theme}=useThemeStore();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    mobileNumber: "",
  });

  const [lock, setLock] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if (
      userData.name !== "" &&
      userData.email !== "" &&
      userData.password !== "" &&
      userData.mobileNumber !== ""
    ) {
      await signUp(userData);
   
      navigate('/verify-phone')
    }else{
      toast.error('All field are required')
    }
    }catch(e){
      console.log(e);
      
      toast.error(e.response.data.message)
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
          Create Account
        </h2>
        <form onSubmit={handleSubmit}>
          <Input
            icon={User}
            type="text"
            placeholder="Full Name"
            value={userData.name}
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, name: e.target.value }));
            }}
          />
          <Input
            icon={PhoneCallIcon}
            type="text"
            placeholder="Phone no."
            value={userData.mobileNumber}
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, mobileNumber: e.target.value }));
            }}
          />
          <Input
            icon={Mail}
            type="email"
            placeholder="Email Address"
            value={userData.email}
            onChange={(e) => {
              setUserData((prev) => ({ ...prev, email: e.target.value }));
            }}
          />
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <Lock className={`size-5 ${theme==='dark' ? 'text-green-500': 'text-blue-600'}`} />
            </div>
            <input
             className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${theme==='dark'?'bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400': 'bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45'} `}
              type={lock ? "password" : "text"}
              placeholder={lock ? "••••••" : "password"}
              value={userData.password}
              onChange={(e) => {
                setUserData((prev) => ({ ...prev, password: e.target.value }));
              }}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-4 flex items-center pl-3"
              onClick={() => setLock((prev) => !prev)}
            >
              {!lock ? (
                <Eye  className={`size-5 ${theme==='dark' ? 'text-green-500': 'text-blue-600'}`} />
              ) : (
                <EyeOff className={`size-5 ${theme==='dark' ? 'text-green-500': 'text-blue-600'}`} />
              )}
            </button>
          </div>
          <PasswordStrengthMeter password={userData.password} />
          <motion.button
            className={`mt-5 w-full py-3 px-4 text-center bg-gradient-to-r ${theme==='dark' ? 'from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500': 'from-cyan-400 to-blue-800 hover:from-cyan-400 hover:to-blue-600 focus:ring-cyan-900'} text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-200 transition-all duration-200`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={isLoading}
          >
           {isLoading ? <Loader className="animate-spin mx-auto" size={24} />: ' Sign Up'}
          </motion.button>
        </form>
      </div>
      <div className="px-8 py-4 bg-cyan-900 dark:bg-gray-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-white dark:text-gray-400">
          Already have an account ?{" "}
          <Link to={"/sign-in"}  className="text-cyan-200 dark:text-green-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default SignUpPage;
