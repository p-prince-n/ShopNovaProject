import { useState, useEffect, useRef } from "react";
import { useThemeStore } from "../../Store/useThemeStore";
import {
  TruckIcon,
  Mail,
  PhoneCallIcon,
  User,
  Landmark,
  Hash,
  KeySquare,
  Loader,
  Camera,
} from "lucide-react";
import { useUploadStore } from "../../Store/useUploadStore";
import { useDeliveryManStore } from "../../Store/useDeliveryMan";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";

const DeliveryProfile = () => {
  const { theme } = useThemeStore();
  const dropdownRef = useRef(null);
  const { deliveryManProfile, getDeliveryManProfile, updateDeliveryMan, loading } = useDeliveryManStore();
  const { imageUrl, uploadloading, uploadImage, uploaderror } = useUploadStore();

  const [deliveryData, setDeliveryData] = useState({
    vehicleNumber: "",
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

  const [editMode, setEditMode] = useState(false);


  useEffect(() => {
    getDeliveryManProfile();
  }, [getDeliveryManProfile]);


  useEffect(() => {
    if (deliveryManProfile) {
      setDeliveryData({
        vehicleNumber: deliveryManProfile.vehicleNumber || "",
        contactEmail: deliveryManProfile.contactEmail || "",
        contactPhone: deliveryManProfile.contactPhone || "",
        accountInfo: {
          accountHolderName: deliveryManProfile.accountInfo?.accountHolderName || "",
          bankName: deliveryManProfile.accountInfo?.bankName || "",
          accountNumber: deliveryManProfile.accountInfo?.accountNumber || "",
          ifscCode: deliveryManProfile.accountInfo?.ifscCode || "",
          upiId: deliveryManProfile.accountInfo?.upiId || "",
        },
      });
    }
  }, [deliveryManProfile]);


  useEffect(() => {
    if (imageUrl) {
      setDeliveryData((prev) => ({ ...prev, avatar: imageUrl }));
    }
  }, [imageUrl]);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return toast.error("Select a file");
    if (file.size > 2 * 1024 * 1024) return toast.error("File exceeds 2MB");
    await uploadImage(file);
    if (uploaderror) toast.error(uploaderror);
  };

  const handleSaveProfile = async () => {
    await updateDeliveryMan(deliveryData);
    toast.success("Profile Updated");
    setEditMode(false);
  };

  return (
    <div className="border-1 p-3 mt-6 rounded-xl shadow-2xl">
      {/* Top Section: Avatar */}
      

      {/* Vehicle & Contact Info */}
      <div className="mt-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold dark:text-emerald-400">Delivery Info</h2>
          <p
            className={`cursor-pointer ${editMode ? "text-red-600" : "text-blue-700"} hover:underline`}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Cancel" : "Edit"}
          </p>
        </div>

        {/* Vehicle Number */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <TruckIcon className={`size-5 ${theme === "dark" ? "text-green-500" : "text-blue-600"}`} />
          </div>
          <input
            type="text"
            placeholder="Vehicle Number"
            value={deliveryData.vehicleNumber}
            disabled={!editMode}
            onChange={(e) => setDeliveryData({ ...deliveryData, vehicleNumber: e.target.value })}
            className={`w-full pl-10 pr-3 py-2 focus:ring-2 rounded-lg border transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white placeholder-gray-400"
                : "bg-gray-300 border-blue-700 focus:border-blue-500 focus:ring-blue-500 placeholder-black/45"
            }`}
          />
        </div>

        {/* Contact Email */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Mail className={`size-5 ${theme === "dark" ? "text-green-500" : "text-blue-600"}`} />
          </div>
          <input
            type="email"
            placeholder="Email"
            value={deliveryData.contactEmail}
            disabled={!editMode}
            onChange={(e) => setDeliveryData({ ...deliveryData, contactEmail: e.target.value })}
            className={`w-full pl-10 pr-3 py-2 focus:ring-2 rounded-lg border transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white placeholder-gray-400"
                : "bg-gray-300 border-blue-700 focus:border-blue-500 focus:ring-blue-500 placeholder-black/45"
            }`}
          />
        </div>

        {/* Contact Phone */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <PhoneCallIcon className={`size-5 ${theme === "dark" ? "text-green-500" : "text-blue-600"}`} />
          </div>
          <input
            type="text"
            placeholder="Phone"
            value={deliveryData.contactPhone}
            disabled={!editMode}
            onChange={(e) => setDeliveryData({ ...deliveryData, contactPhone: e.target.value })}
            className={`w-full pl-10 pr-3 py-2 focus:ring-2 rounded-lg border transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white placeholder-gray-400"
                : "bg-gray-300 border-blue-700 focus:border-blue-500 focus:ring-blue-500 placeholder-black/45"
            }`}
          />
        </div>

        {/* Bank / Account Info */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold dark:text-emerald-400">Bank Details</h2>

          {["accountHolderName", "bankName", "accountNumber", "ifscCode", "upiId"].map((field) => (
            <div key={field} className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                {field === "accountHolderName" && <User className={`size-5 ${theme === "dark" ? "text-green-500" : "text-blue-600"}`} />}
                {field === "bankName" && <Landmark className={`size-5 ${theme === "dark" ? "text-green-500" : "text-blue-600"}`} />}
                {field === "accountNumber" && <Hash className={`size-5 ${theme === "dark" ? "text-green-500" : "text-blue-600"}`} />}
                {field === "ifscCode" && <KeySquare className={`size-5 ${theme === "dark" ? "text-green-500" : "text-blue-600"}`} />}
              </div>
              <input
                type="text"
                placeholder={field}
                disabled={!editMode}
                value={deliveryData.accountInfo[field] || ""}
                onChange={(e) => setDeliveryData({
                  ...deliveryData,
                  accountInfo: { ...deliveryData.accountInfo, [field]: e.target.value },
                })}
                className={`w-full pl-10 pr-3 py-2 focus:ring-2 rounded-lg border transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white placeholder-gray-400"
                    : "bg-gray-300 border-blue-700 focus:border-blue-500 focus:ring-blue-500 placeholder-black/45"
                }`}
              />
            </div>
          ))}
        </div>

        {editMode && (
          <button
            onClick={handleSaveProfile}
            className="mt-4 px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded-lg w-fit hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        )}
      </div>
    </div>
  );
};

export default DeliveryProfile;
