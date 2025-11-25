import { useState, useEffect, useRef } from "react";
import { useThemeStore } from "../../Store/useThemeStore";
import {
  Store,
  Pencil,
  Camera,
  Mail,
  PhoneCallIcon,
  User,
  Landmark,
  Hash,
  KeySquare,
  CreditCard,
  Loader,
} from "lucide-react";
import { useCategoryStore } from "../../Store/useCategoryStore";
import { AnimatePresence, motion } from "framer-motion";
import { useUploadStore } from "../../Store/useUploadStore";
import { useSellerStore } from "../../Store/sellerStore";
import toast from "react-hot-toast";
import SellProduct from "./SellProduct";
import ShipProduct from "./ShipProduct";

const SellerProfile = ({ seller }) => {
  const { theme } = useThemeStore();
  const dropdownRef = useRef(null);
  const { imageUrl, uploadloading, uploadImage, progress, uploaderror } =
    useUploadStore();
  const { loading, error, updateSeller } = useSellerStore();

  const [selectedTab, setSelectedTab] = useState("");

  const { categories, fetchCategories } = useCategoryStore();
  const [sellerInfo, setSellerInfo] = useState(true);
  const [contactInfo, setContactInfo] = useState(true);
  const [accountIfo, setAccountInfo] = useState(true);
  const [sellerData, setSellerData] = useState({
    shopName: "",
    shopDescription: "",
    logo: "",
    categories: [],
    isVerifiedSeller: false,
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
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setSelectedTab(tabFromUrl);
    }
  }, [location.search]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      toast.error("select the file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error(`File ${file.name} exceeds 2MB`);
      return;
    }
    await uploadImage(file);
    if (uploaderror) toast.error(uploaderror);
  };
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  useEffect(() => {
    if (imageUrl) {
      setSellerData((prev) => ({
        ...prev,
        logo: imageUrl,
      }));
    }
  }, [imageUrl]);

  useEffect(() => {
    if (seller) {
      setSellerData({
        shopName: seller.shopName,
        shopDescription: seller.shopDescription,
        logo: seller.logo,
        categories: seller.categories?.map((c) => c._id),
        isVerifiedSeller: false,
        contactEmail: seller.contactEmail,
        contactPhone: seller.contactPhone,
        accountInfo: {
          accountHolderName: seller.accountInfo?.accountHolderName,
          bankName: seller.accountInfo?.bankName,
          accountNumber: seller.accountInfo?.accountNumber,
          ifscCode: seller.accountInfo?.ifscCode,
          upiId: seller.accountInfo?.upiId,
        },
      });
    }
  }, [seller]);
  console.log(sellerData.categories);

  const handleSaveSellerProfile = async (e) => {
    await updateSeller(sellerData);
    toast.success("Seller Page Updated");
    setSellerInfo(false);
    setContactInfo(false);
    setAccountInfo(false);
  };

  return (
    <div className="border-1 p-3 mt-6 rounded-xl shadow-2xl">
      <form
        onSubmit={(e) => e.preventDefault()}
        className={`${selectedTab !== "profile" && "hidden"} flex flex-col `}
      >
        <div className="flex items-center justify-start gap-5 py-4 ">
          <h1 className="text-xl font-semibold dark:text-emerald-400">
            Seller Info
          </h1>
          <p
            onClick={() => setSellerInfo(!sellerInfo)}
            className={`${
              sellerInfo ? "text-blue-700" : "text-red-600"
            } cursor-pointer hover:underline`}
          >
            {sellerInfo ? "Edit" : "Cancel"}
          </p>
        </div>
        <div className="flex  items-center justify-start py-2 pt-1">
          <div className="relative mb-6 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <Store
                className={`size-5 ${
                  theme === "dark" ? "text-green-500" : "text-blue-600"
                }  `}
              />
            </div>
            <input
              type="text"
              name="name"
              value={sellerData.shopName}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  shopName: e.target.value,
                }));
              }}
              disabled={sellerInfo}
              placeholder="Shop Name"
              className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
              } `}
            />
          </div>
        </div>
        <div className="flex  items-center justify-start py-2 pt-1">
          <div className="relative mb-6 w-full">
            <div className="absolute inset-y-0 left-0 flex  items-start pl-3 pointer-events-none ">
              <Pencil
                className={`size-5 flex mt-5 ${
                  theme === "dark" ? "text-green-500" : "text-blue-600"
                }  `}
              />
            </div>
            <textarea
              type="text"
              rows={5}
              value={sellerData.shopDescription}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  shopDescription: e.target.value,
                }));
              }}
              disabled={sellerInfo}
              placeholder="Shop Name"
              className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
              } `}
            ></textarea>
          </div>
        </div>
        {/* Selected Categories */}
        <div className="flex flex-wrap gap-2 mt-2 ">
          {sellerData.categories.map((catId) => {
            const category = categories.find((c) => c._id === catId);
            if (!category) return null;
            return (
              <div
                key={catId}
                className={`flex items-center gap-1 px-2 py-1 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                    : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
                } rounded-full`}
              >
                <span>{category.name}</span>
                {!sellerInfo && (
                  <button
                    type="button"
                    onClick={() =>
                      setSellerData({
                        ...sellerData,
                        categories: sellerData.categories.filter(
                          (id) => id !== catId
                        ),
                      })
                    }
                    className="font-bold ml-1 text-red-500"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Category Multi-select Dropdown */}
        <div className="my-3 relative">
          <label className="block mb-2 font-semibold dark:text-green-400">
            Categories
          </label>
          <div
            ref={dropdownRef}
            className={` focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
            } p-2 cursor-pointer dark:bg-gray-600 dark:text-white`}
            onClick={() => setDropdownOpen(!dropdownOpen && !sellerInfo)}
          >
            {sellerData.categories.length > 0
              ? categories
                  .filter((c) => sellerData.categories.includes(c._id))
                  .map((c) => c.name)
                  .join(", ")
              : "Select Categories"}
          </div>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`absolute rounded-xl top-full left-0 right-0 bg-white dark:bg-emerald-600 border shadow-lg z-50 max-h-48 overflow-y-auto`}
              >
                {categories.map((cat) => (
                  <li
                    key={cat._id}
                    className="p-2 hover:bg-gray-200 hover:dark:text-gray-600 dark:hover:bg-emerald-300 cursor-pointer"
                    onClick={() => {
                      const alreadySelected = sellerData.categories.includes(
                        cat._id
                      );
                      const updated = alreadySelected
                        ? sellerData.categories.filter((id) => id !== cat._id)
                        : [...sellerData.categories, cat._id];
                      setSellerData({ ...sellerData, categories: updated });
                    }}
                  >
                    {cat.name}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* profile image */}
        <div className="flex items-center justify-center flex-col">
          <div className="relative size-32 ">
            <img
              src={imageUrl || sellerData.logo}
              alt={sellerData.shopName}
              className="size-32 rounded-full object-cover border-4"
            />
            {!sellerInfo && (
              <label
                htmlFor="avatar-upload"
                className={`absolute bottom-0 right-0 bg-base-content hover:scale-105 p-2 rounded-full cursor-pointer dark:bg-green-500 bg-blue-500  transition-all duration-200 ${
                  uploadloading ? "animate-pluse pointer-event-none" : ""
                }`}
              >
                <Camera className="size-5 text-base-200 rounded-full" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={uploadloading}
                />
              </label>
            )}
          </div>
          {!sellerInfo && (
            <p className="texct-sm text-zinc-400">
              {uploadloading
                ? "Uploading..."
                : "Click camera icon to update your profile."}
            </p>
          )}
        </div>

        {!sellerInfo && (
          <button
            onClick={(e) => !sellerInfo && handleSaveSellerProfile(e)}
            className="px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded-lg w-fit hover:bg-green-700 transition"
          >
            Save
          </button>
        )}
      </form>

      <form
        onSubmit={(e) => e.preventDefault()}
        className={`${selectedTab !== "contact" && "hidden"} flex flex-col `}
      >
        <div className="flex items-center justify-start gap-5 py-4 ">
          <h1 className="text-xl font-semibold dark:text-emerald-400">
            Contact Info
          </h1>
          <p
            onClick={() => setContactInfo(!contactInfo)}
            className={`${
              contactInfo ? "text-blue-700" : "text-red-600"
            } cursor-pointer hover:underline`}
          >
            {contactInfo ? "Edit" : "Cancel"}
          </p>
        </div>
        <div className="flex  items-center justify-start py-2 pt-1">
          <div className="relative mb-6 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <Mail
                className={`size-5 ${
                  theme === "dark" ? "text-green-500" : "text-blue-600"
                }  `}
              />
            </div>
            <input
              type="email"
              name="name"
              value={sellerData.contactEmail}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  contactEmail: e.target.value,
                }));
              }}
              disabled={contactInfo}
              placeholder="Email"
              className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
              } `}
            />
          </div>
        </div>
        <div className="flex  items-center justify-start py-2 pt-1">
          <div className="relative mb-6 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <PhoneCallIcon
                className={`size-5 ${
                  theme === "dark" ? "text-green-500" : "text-blue-600"
                }  `}
              />
            </div>
            <input
              type="text"
              name="name"
              value={sellerData.contactPhone}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  contactPhone: e.target.value,
                }));
              }}
              disabled={contactInfo}
              placeholder="Contact"
              className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
              } `}
            />
          </div>
        </div>
        {!contactInfo && (
          <button
            onClick={(e) => !contactInfo && handleSaveSellerProfile(e)}
            className="px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded-lg w-fit hover:bg-green-700 transition"
          >
            Save
          </button>
        )}
      </form>

      <form
        onSubmit={(e) => e.preventDefault()}
        className={`${selectedTab !== "bank" && "hidden"} flex flex-col `}
      >
        <div className="flex items-center justify-start gap-5 py-4 ">
          <h1 className="text-xl font-semibold dark:text-emerald-400">
            Bank Details
          </h1>
          <p
            onClick={() => setAccountInfo(!accountIfo)}
            className={`${
              accountIfo ? "text-blue-700" : "text-red-600"
            } cursor-pointer hover:underline`}
          >
            {accountIfo ? "Edit" : "Cancel"}
          </p>
        </div>
        <div className="flex  items-center justify-start py-2 pt-1">
          <div className="relative mb-6 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <User
                className={`size-5 ${
                  theme === "dark" ? "text-green-500" : "text-blue-600"
                }  `}
              />
            </div>
            <input
              type="text"
              name="name"
              value={sellerData.accountInfo.accountHolderName}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  accountInfo:{
                    ...prev.accountInfo, accountHolderName: e.target.value
                  },
                }));
              }}
              disabled={accountIfo}
              placeholder="Account Holder Name"
              className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
              } `}
            />
          </div>
        </div>
        <div className="flex  items-center justify-start py-2 pt-1">
          <div className="relative mb-6 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <Landmark
                className={`size-5 ${
                  theme === "dark" ? "text-green-500" : "text-blue-600"
                }  `}
              />
            </div>
            <input
              type="text"
              name="name"
              value={sellerData.accountInfo.bankName}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  accountInfo:{
                    ...prev.accountInfo, bankName: e.target.value
                  }
                }));
              }}
              disabled={accountIfo}
              placeholder="Bank Name"
              className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
              } `}
            />
          </div>
        </div>

         <div className="flex  items-center justify-start py-2 pt-1">
          <div className="relative mb-6 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <Hash
                className={`size-5 ${
                  theme === "dark" ? "text-green-500" : "text-blue-600"
                }  `}
              />
            </div>
            <input
              type="text"
              name="name"
              value={sellerData.accountInfo.accountNumber}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  accountInfo:{
                    ...prev.accountInfo, accountNumber: e.target.value
                  }
                }));
              }}
              disabled={accountIfo}
              placeholder="Account Number"
              className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
              } `}
            />
          </div>
        </div>

         <div className="flex  items-center justify-start py-2 pt-1">
          <div className="relative mb-6 w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none ">
              <KeySquare
                className={`size-5 ${
                  theme === "dark" ? "text-green-500" : "text-blue-600"
                }  `}
              />
            </div>
            <input
              type="text"
              name="name"
              value={sellerData.accountInfo.ifscCode}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  accountInfo:{
                    ...prev.accountInfo, ifscCode: e.target.value
                  }
                }));
              }}
              disabled={accountIfo}
              placeholder="IFSC Code"
              className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
              } `}
            />
          </div>
        </div>
        {!accountIfo && (
          <button
            onClick={(e) => !accountIfo && handleSaveSellerProfile(e)}
            className="px-4 py-2 bg-blue-500 dark:bg-green-600 text-white rounded-lg w-fit hover:bg-green-700 transition"
          >
            Save
          </button>
        )}
      </form>

    </div>
  );
};
export default SellerProfile;
