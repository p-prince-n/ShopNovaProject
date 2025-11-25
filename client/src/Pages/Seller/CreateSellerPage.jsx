import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../Store/useThemeStore";
import { useCategoryStore } from "../../Store/useCategoryStore";
import { useState, useEffect, useRef } from "react";
import { useSellerStore } from "../../Store/sellerStore";
import { useUploadStore } from "../../Store/useUploadStore";
import { Label, FileInput } from "flowbite-react";

import Input from "../../components/Input";
import {
  Store,
  Pencil,
  Mail,
  PhoneCallIcon,
  User,
  Landmark,
  Hash,
  KeySquare,
  CreditCard,
  Loader,
} from "lucide-react";
import { useAuthStore } from "../../Store/authStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateSellerPage = () => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { imageUrl, uploadloading, uploaderror, progress, uploadImage } =
    useUploadStore();
  const { loading, createSeller, error } = useSellerStore();
  const { updateProfile } = useAuthStore();
  const [currentPage, setCurrentPage] = useState(0);
  const { categories, fetchCategories } = useCategoryStore();
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
    fetchCategories();
  }, [fetchCategories]);
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
  useEffect(() => {
    if (imageUrl && sellerData.shopName !== "") {
      setSellerData((prev) => ({ ...prev, logo: imageUrl }));
    }
  }, [imageUrl]);
  const handleUploadImage = async (file) => {
    const filesize = file.size;
    if (filesize > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    await uploadImage(file);

    if (uploaderror) {
      toast.error(uploaderror);
      return;
    }
  };
  const GoNextPage = () => {
    if (currentPage === 0) {
      if (!sellerData.shopName.trim() || !sellerData.shopDescription.trim()) {
        toast.error("Shop name and description are required");
        return;
      }
      if (!sellerData.logo) {
        toast.error("Please upload a shop logo");
        return;
      }
      if (sellerData.categories.length === 0) {
        toast.error("Please select at least one category");
        return;
      }
    }

    if (currentPage === 1) {
      if (!sellerData.contactEmail.trim() || !sellerData.contactPhone.trim()) {
        toast.error("Contact email and phone are required");
        return;
      }
    }

    setCurrentPage((prev) => prev + 1);
  };

  const GoPreviosPage = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const isSellerDataValid = () => {

    const {
      shopName,
      shopDescription,
      categories,
      contactEmail,
      contactPhone,
      accountInfo,
    } = sellerData;


    const accountFilled = Object.values(accountInfo).every(
      (val) => val && val.trim() !== ""
    );

    return (
      shopName.trim() !== "" &&
      shopDescription.trim() !== "" &&
      categories.length > 0 &&
      contactEmail.trim() !== "" &&
      contactPhone.trim() !== "" &&
      accountFilled
    );
  };
  console.log(sellerData);

  const SubmitData = async () => {
    if (!isSellerDataValid()) {
      toast.error("All fields are required");
      return;
    }
    await createSeller(sellerData);
    updateProfile({ isSellerVerification: true });
    toast.success("Your Seller Account Successfully.");
    setSellerData({
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
    navigate("/home");
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
      }   bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl  overflow-hidden ${
        currentPage === 0 && "mt-15"
      }`}
    >
      {error && toast.error(error)}
      <div className="p-8 ">
        <form onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-400 text-blue-500 dark:text-transparent bg-clip-text">
            {currentPage === 0
              ? "Shop Details"
              : currentPage === 1
              ? "Contact Info"
              : "Account Info"}
          </h2>
          <div className={`${currentPage !== 0 && "hidden"}`}>
            <Input
              icon={Store}
              type="text"
              placeholder="Shop Name"
              value={sellerData.shopName}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  shopName: e.target.value,
                }));
              }}
            />
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-start mt-3 pl-3 pointer-events-none ">
                <Pencil
                  className={`size-5 ${
                    theme === "dark" ? "text-green-500" : "text-blue-600"
                  }  `}
                />
              </div>

              <textarea
                placeholder="Shop Description"
                rows={4}
                value={sellerData.shopDescription}
                onChange={(e) =>
                  setSellerData({
                    ...sellerData,
                    shopDescription: e.target.value,
                  })
                }
                className={`w-full pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                  theme === "dark"
                    ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                    : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
                } `}
              ></textarea>
            </div>
            {/* Display Uploaded Image */}
            {sellerData.logo !== "" && (
              <div className="flex items-center justify-center w-full py-5 px-10">
                <img className="w-1/5" src={sellerData.logo} alt="Logo" />
              </div>
            )}

            {/* File Upload */}
            <div className="flex items-center justify-start py-5 ">
              <div className="flex w-full items-center justify-center">
                <Label
                  htmlFor="dropzone-file"
                  className="flex h-34 md:h-44 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                >
                  <div className="flex flex-col items-center justify-center pb-6 pt-5 px-2">
                    <svg
                      className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 ">
                      SVG, PNG, JPG or GIF (MAX. 800x400px) for category
                    </p>
                  </div>
                  <FileInput
                    disabled={uploadloading || loading}
                    id="dropzone-file"
                    className="hidden"
                    onChange={(e) => handleUploadImage(e.target.files[0])}
                  />
                </Label>
              </div>
            </div>

            {/* Upload Progress */}
            {progress > 0 && uploadloading && (
              <div className="w-full bg-gray-200 rounded h-2 mb-3">
                <div
                  className="bg-blue-500 h-2 rounded transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            )}

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
                  </div>
                );
              })}
            </div>
            {/* Category Multi-select Dropdown */}
            <div className=" my-3 relative">
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
                onClick={() => setDropdownOpen(!dropdownOpen)}
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
                          const alreadySelected =
                            sellerData.categories.includes(cat._id);
                          const updated = alreadySelected
                            ? sellerData.categories.filter(
                                (id) => id !== cat._id
                              )
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
          </div>
          <div className={`${currentPage !== 1 && "hidden"}`}>
            <Input
              icon={Mail}
              type="email"
              placeholder="Shop Email"
              value={sellerData.contactEmail}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  contactEmail: e.target.value,
                }));
              }}
            />
            <Input
              icon={PhoneCallIcon}
              type="text"
              placeholder="Shop Phone"
              value={sellerData.contactPhone}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  contactPhone: e.target.value,
                }));
              }}
            />
          </div>
          <div className={`${currentPage !== 2 && "hidden"}`}>
            <Input
              icon={User}
              type="text"
              placeholder="Account Holder Name"
              value={sellerData.accountInfo.accountHolderName}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  accountInfo: {
                    ...prev.accountInfo,
                    accountHolderName: e.target.value,
                  },
                }));
              }}
            />
            <Input
              icon={Landmark}
              type="text"
              placeholder="Bank Name"
              value={sellerData.accountInfo.bankName}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  accountInfo: {
                    ...prev.accountInfo,
                    bankName: e.target.value,
                  },
                }));
              }}
            />
            <Input
              icon={Hash}
              type="text"
              placeholder="Account Number"
              value={sellerData.accountInfo.accountNumber}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  accountInfo: {
                    ...prev.accountInfo,
                    accountNumber: e.target.value,
                  },
                }));
              }}
            />
            <Input
              icon={KeySquare}
              type="text"
              placeholder="IFSC Code"
              value={sellerData.accountInfo.ifscCode}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  accountInfo: {
                    ...prev.accountInfo,
                    ifscCode: e.target.value,
                  },
                }));
              }}
            />
            <Input
              icon={CreditCard}
              type="text"
              placeholder="UPI ID"
              value={sellerData.accountInfo.upiId}
              onChange={(e) => {
                setSellerData((prev) => ({
                  ...prev,
                  accountInfo: {
                    ...prev.accountInfo,
                    upiId: e.target.value,
                  },
                }));
              }}
            />
          </div>
          <div className="flex gap-5 md:gap-10">
            <motion.button
              className={` mt-5 w-full py-3 px-4 text-center bg-gradient-to-r
                
                  from-gray-500 to-gray-700 hover:from-black-600 hover:to-emerald-700 focus:ring-green-500
                  
               text-white font-bold rounded-lg shadow-lg  focus:outline-none focus:ring-2  focus:ring-offset-2 focus:ring-offset-gray-200 transition-all duration-200 ${
                 currentPage === 0 && "hidden"
               }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={GoPreviosPage}
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
              {loading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                "Verified"
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateSellerPage;
