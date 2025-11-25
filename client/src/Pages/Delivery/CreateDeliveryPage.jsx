import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../Store/useThemeStore";
import { useUploadStore } from "../../Store/useUploadStore";
import { useState, useEffect, useRef } from "react";
import { useDeliveryManStore } from "../../Store/useDeliveryMan";
import { useAuthStore } from "../../Store/authStore";
import Input from "../../components/Input";
import {
  TruckElectricIcon,
  KeySquare,
  Mail,
  PhoneCallIcon,
  User,
  Landmark,
  Hash,
  Loader,
} from "lucide-react";
import { Label, FileInput } from "flowbite-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateDeliveryPage = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const { createDeliveryMan, loading } = useDeliveryManStore();
  const { updateProfile } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(0);

  const [deliveryData, setDeliveryData] = useState({
    vehicleNumber: "",
    drivingLicense: "",
    contactEmail: "",
    contactPhone: "",
    accountInfo: {
      accountHolderName: "",
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      upiId: "",
    },
  });


 

  const GoPrevPage = () => setCurrentPage((prev) => prev - 1);

  const isDeliveryDataValid = () => {
    const { vehicleNumber, drivingLicense, contactEmail, contactPhone, accountInfo } = deliveryData;
    const accountFilled = Object.values(accountInfo).every((val) => val && val.trim() !== "");
    return (
      vehicleNumber.trim() !== "" &&
      drivingLicense.trim() !== "" &&
      contactEmail.trim() !== "" &&
      contactPhone.trim() !== "" &&
      accountFilled
    );
  };

  const SubmitData = async () => {
    if (!isDeliveryDataValid()) {
      toast.error("All fields are required");
      return;
    }
    await createDeliveryMan(deliveryData);
    updateProfile({ isDeliveryManVerification: true });
    toast.success("Delivery man profile created successfully.");
    setDeliveryData({
      vehicleNumber: "",
      drivingLicense: "",
      contactEmail: "",
      contactPhone: "",
      accountInfo: {
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        ifscCode: "",
        upiId: "",
      },
    });
    navigate("/home");
  };

  const GoNextPage = () => {
  if (currentPage === 0) {
    if (!deliveryData.vehicleNumber.trim() || !deliveryData.drivingLicense.trim()) {
      toast.error("Please fill vehicle number and driving license");
      return;
    }
  }

  if (currentPage === 1) {
    if (!deliveryData.contactEmail.trim() || !deliveryData.contactPhone.trim()) {
      toast.error("Please fill email and phone number");
      return;
    }
  }


  setCurrentPage((prev) => prev + 1);
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`max-w-md w-full ${
        theme === "light"
          ? "bg-white/90 border-1 shadow-xl drop-shadow-2xl/50"
          : "bg-gray-800"
      } bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl overflow-hidden ${currentPage === 0 && 'mt-15'}`}
    >
      <div className="p-8">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-400 text-blue-500 dark:text-transparent bg-clip-text">
            {currentPage === 0
              ? "Vehicle & Docs"
              : currentPage === 1
              ? "Contact Info"
              : "Account Info"}
          </h2>

          {/* Page 0 - Vehicle Info */}
          <div className={`${currentPage !== 0 && "hidden"}`}>
            <Input
              icon={TruckElectricIcon}
              type="text"
              placeholder="Vehicle Number"
              value={deliveryData.vehicleNumber}
              onChange={(e) =>
                setDeliveryData({ ...deliveryData, vehicleNumber: e.target.value })
              }
            />
            <Input
              icon={KeySquare}
              type="text"
              placeholder="Driving License"
              value={deliveryData.drivingLicense}
              onChange={(e) =>
                setDeliveryData({ ...deliveryData, drivingLicense: e.target.value })
              }
            />
            {/* File Upload */}
           

          </div>

          {/* Page 1 - Contact Info */}
          <div className={`${currentPage !== 1 && "hidden"}`}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Email"
              value={deliveryData.contactEmail}
              onChange={(e) => setDeliveryData({ ...deliveryData, contactEmail: e.target.value })}
            />
            <Input
              icon={PhoneCallIcon}
              type="text"
              placeholder="Phone"
              value={deliveryData.contactPhone}
              onChange={(e) => setDeliveryData({ ...deliveryData, contactPhone: e.target.value })}
            />
          </div>

          {/* Page 2 - Account Info */}
          <div className={`${currentPage !== 2 && "hidden"}`}>
            <Input
              icon={User}
              type="text"
              placeholder="Account Holder Name"
              value={deliveryData.accountInfo.accountHolderName}
              onChange={(e) =>
                setDeliveryData({
                  ...deliveryData,
                  accountInfo: { ...deliveryData.accountInfo, accountHolderName: e.target.value },
                })
              }
            />
            <Input
              icon={Landmark}
              type="text"
              placeholder="Bank Name"
              value={deliveryData.accountInfo.bankName}
              onChange={(e) =>
                setDeliveryData({
                  ...deliveryData,
                  accountInfo: { ...deliveryData.accountInfo, bankName: e.target.value },
                })
              }
            />
            <Input
              icon={Hash}
              type="text"
              placeholder="Account Number"
              value={deliveryData.accountInfo.accountNumber}
              onChange={(e) =>
                setDeliveryData({
                  ...deliveryData,
                  accountInfo: { ...deliveryData.accountInfo, accountNumber: e.target.value },
                })
              }
            />
            <Input
              icon={KeySquare}
              type="text"
              placeholder="IFSC Code"
              value={deliveryData.accountInfo.ifscCode}
              onChange={(e) =>
                setDeliveryData({
                  ...deliveryData,
                  accountInfo: { ...deliveryData.accountInfo, ifscCode: e.target.value },
                })
              }
            />
            <Input
              icon={KeySquare}
              type="text"
              placeholder="UPI ID"
              value={deliveryData.accountInfo.upiId}
              onChange={(e) =>
                setDeliveryData({
                  ...deliveryData,
                  accountInfo: { ...deliveryData.accountInfo, upiId: e.target.value },
                })
              }
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-5 md:gap-10">
            <motion.button
              className={` mt-5 w-full py-3 px-4 text-center bg-gradient-to-r
                  from-gray-500 to-gray-700 hover:from-black-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-200 transition-all duration-200 ${
                    currentPage === 0 && "hidden"
                  }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={GoPrevPage}
            >
              Prev
            </motion.button>

            <motion.button
              className={`mt-5 w-full py-3 px-4 text-center bg-gradient-to-r ${
                theme === "dark"
                  ? "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500"
                  : "from-cyan-400 to-blue-800 hover:from-cyan-400 hover:to-blue-600 focus:ring-cyan-900"
              } text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-200 transition-all duration-200 ${
                currentPage === 2 && "hidden"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={GoNextPage}
            >
              Next
            </motion.button>

            <motion.button
              className={`mt-5 w-full py-3 px-4 text-center bg-gradient-to-r ${
                theme === "dark"
                  ? "from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 focus:ring-green-500"
                  : "from-cyan-400 to-blue-800 hover:from-cyan-400 hover:to-blue-600 focus:ring-cyan-900"
              } text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-200 transition-all duration-200 ${
                currentPage !== 2 && "hidden"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              onClick={SubmitData}
            >
              {loading ? <Loader className="animate-spin mx-auto" size={24} /> : "Verify"}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateDeliveryPage;
