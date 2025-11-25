import { useState, useRef, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { PiShoppingCartThin } from "react-icons/pi";
import { ImCross } from "react-icons/im";
import { House, TruckIcon } from "lucide-react";
import ThemeToggle from "../ThemeToggle.jsx";
import { useAuthStore } from "../../Store/authStore.js";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../Store/useThemeStore.js";
import DropDownMenu from "./DropDownMenu.jsx";
import DropdownMenuSlider from "./DropDownMenuSilder.jsx";
import toast from "react-hot-toast";
import { BsQrCodeScan } from "react-icons/bs";
import { useProductStore } from "../../Store/useProductStore.js";
import { useNavigate, useLocation, Link } from "react-router-dom";


const Header = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialSearch = urlParams.get("name") || "";

  const { user, logout, updateProfile } = useAuthStore();
  const [search, setSearch] = useState(initialSearch);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const { uploadQRCodeFromFile, loading, filters, searchProducts } =
    useProductStore();
  const handleQRCodeFileSelect = () => {
    fileInputRef.current.click();
  };

  const debounceRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);


    if (debounceRef.current) clearTimeout(debounceRef.current);


    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        navigate(`/search?name=${encodeURIComponent(value.trim())}`);
        setSearchOpen(false);
      }
    }, 500);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await uploadQRCodeFromFile(file);
      if (result?.products) {
        toast.success("QR processed successfully!");
        console.log("Products from QR:", result.products);


      } else {
        toast.error("No products found for this QR code");
      }
      navigate("/qrscanproducts", {
        state: { products: result.products || [] },
      });
    } catch (err) {
      toast.error("Failed to process QR code");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-xl shadow-cyan-700 dark:shadow-black dark:bg-gray-900 dark:bg-opacity-50 px-5 ">
        {searchOpen ? (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.5 }}
              className="flex  justify-between min-w-screen py-2 "
            >
              <div className=" relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CiSearch
                    className={`size-5 ${
                      theme === "dark" ? "text-green-500" : "text-blue-600"
                    }`}
                  />
                </div>
                <input
                  className={`w-[90%] pl-10 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                      : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
                  } `}
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={handleSearchChange}
                />
                <div className="absolute inset-y-0 right-15 sm:right-20 flex items-center pl-3 cursor-pointer">
                  <BsQrCodeScan
                    onClick={handleQRCodeFileSelect}
                    className={`size-5 ${
                      theme === "dark" ? "text-green-500" : "text-blue-600"
                    }`}
                  />
                </div>
              </div>
              <div className="mt-3 mr-10">
                <ImCross
                  className="text-md text-black dark:text-white "
                  onClick={() => setSearchOpen(false)}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="container flex justify-evenly items-center gap-1 md:gap-0 py-4 w-full  ">
            <div className="text-md md:text-2xl flex items-center font-bold ">
              {/* Add logo */}
              <Link to="/home" className="flex hover:font-extrabold">
                <p className="text-black dark:text-white">Shop</p>
                <p className="text-emerald-600">Nova</p>
              </Link>
            </div>

            <div className="flex justify-between items-center gap-16 md:gap-4">
              <ThemeToggle />
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <CiSearch
                    className={`size-5 ${
                      theme === "dark" ? "text-green-500" : "text-blue-600"
                    }`}
                  />
                </div>
                <input
                  className={`md:w-md lg:w-xl pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border   transition-all duration-200 ${
                    theme === "dark"
                      ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500   placeholder-gray-400"
                      : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700  placeholder-black/45"
                  } `}
                  type="text"
                  placeholder="Search for Products, Brand and Many More..."
                  value={search}
                  onChange={handleSearchChange}
                />
                <div className="absolute inset-y-0 right-5 flex items-center pl-3 cursor-pointer">
                  <BsQrCodeScan
                    onClick={handleQRCodeFileSelect}
                    className={`size-5 ${
                      theme === "dark" ? "text-green-500" : "text-blue-600"
                    }`}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 md:gap-5">
              <DropDownMenu />
              <button
                className="md:hidden dark:text-white text-xl hover:bg-blue-500 hover:text-black dark:hover:bg-emerald-400 dark:hover:text-green-950 hover:font-bold rounded-full p-2 duration-200 "
                onClick={() => setSearchOpen(true)}
              >
                <CiSearch />
              </button>
              <button
                onClick={() => navigate("/cart")}
                className="dark:text-white text-xl flex gap-2 hover:bg-blue-500 hover:text-black dark:hover:bg-emerald-400 dark:hover:text-green-950 hover:font-bold rounded-full p-2 duration-200 "
              >
                <div>
                  <PiShoppingCartThin className="" />
                </div>
                <div className="hidden lg:block text-sm">Cart</div>
              </button>
              <button
                onClick={(e) => {
                  if (user?.isSeller && !user?.isSellerVerification) {
                    toast.error("fill seller details");
                    navigate("/seller-data");
                  } else if (
                    user?.isSeller &&
                    user?.isSellerVerification &&
                    !user?.seller.isVerifiedSeller
                  ) {
                    toast.error(
                      "Wait until the Admin verify your account first"
                    );
                  } else if (
                    user?.isSeller &&
                    user?.isSellerVerification &&
                    user?.seller.isVerifiedSeller
                  ) {
                    navigate("/seller-page?tab=profile");
                  } else {
                    updateProfile({ isSeller: true });
                    navigate("/seller-data");
                  }
                }}
                className={`${
                  user?.isSeller && user?.isSellerVerification && "hidden"
                } dark:text-white text-xl flex gap-2 hover:bg-blue-500 hover:text-black dark:hover:bg-emerald-400 dark:hover:text-green-950 hover:font-bold rounded-full p-2 duration-200 `}
              >
                <div>
                  <House className="" />
                </div>
                <div className="hidden lg:block text-sm mt-1">
                  Become Seller
                </div>
              </button>
              <button
                onClick={async (e) => {
                  if (user?.isDeliveryMan && !user?.isDeliveryManVerification) {
                    navigate("/delivery-data");
                    toast.error("fill Delivery Man's details");
                  } else if (
                    user?.isDeliveryMan &&
                    user?.isDeliveryManVerification &&
                    !user?.delivery.isVerifiedDelivery
                  ) {
                    toast.error(
                      "Wait until the Admin verify your account first"
                    );
                  } else if (
                    user?.isDeliveryMan &&
                    user?.isDeliveryManVerification &&
                    user?.delivery.isVerifiedDelivery
                  ) {
                    navigate("/delivery-page?tab=profile");
                  } else {
                    await updateProfile({ isDeliveryMan: true });
                    navigate("/delivery-data");
                  }
                }}
                className={`${
                  user?.isDeliveryMan &&
                  user?.isDeliveryManVerification &&
                  "hidden"
                } dark:text-white text-xl flex gap-2 hover:bg-blue-500 hover:text-black dark:hover:bg-emerald-400 dark:hover:text-green-950 hover:font-bold rounded-full p-2 duration-200 `}
              >
                <div>
                  <TruckIcon className="" />
                </div>
                <div className="hidden 2xl:block text-sm mt-1">Delivery</div>
              </button>

              <div className="md:hidden">
                <DropdownMenuSlider />
              </div>
            </div>
          </div>
        )}
      </nav>
      {/* <ResponsiveMenu open={open} /> */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />
    </>
  );
};

export default Header;
