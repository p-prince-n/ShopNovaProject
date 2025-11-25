import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserCircle, FaGift, FaHeart } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../../Store/authStore";
import ListItem from "./ListItem";
import { House, TruckElectricIcon } from "lucide-react";
import { MdOutlineLocalOffer } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { RiCouponLine } from "react-icons/ri";

import { MdAdminPanelSettings } from "react-icons/md";
import toast from "react-hot-toast";

export const DropDownItemList = (user) => {
  const items = [
    {
      id: 1,
      title: "My Profile",
      icon: FaUserCircle,
      link: `/data/${user?._id}/?tab=profile`,
    },
    {
      id: 2,
      title: "ShopNova Plus Zone",
      icon: MdOutlineLocalOffer,
      link: "/plus-zone",
    },
    { id: 3, title: "Orders", icon: BsBoxSeam, link: "/orders" },
    { id: 4, title: "Wishlist", icon: FaHeart, link: "/wishlist" },
    { id: 5, title: "Rewards", icon: RiCouponLine, link: "/rewards" },
  ];



  if (user?.isSeller ) {
    items.unshift({
      id: -1,
      title: "Seller ",
      icon: House,
      link: `/seller-page?tab=profile`,
    });
  }
  if (user?.isDeliveryMan ) {
    items.unshift({
      id: -1,
      title: "Delivery ",
      icon: TruckElectricIcon,
      link: `/delivery-page?tab=profile`,
    });
  }
  


  if (user?.isAdmin) {
    items.unshift({
      id: 0,
      title: "Admin",
      icon: MdAdminPanelSettings,
      link: `/admin?tab=dashboard`,
    });
  }

  return items;

};

export default function DropDownMenu() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    toast.success("log out successfully");
    navigate("/sign-in");
  };

  const handleLoginClick = () => {
    navigate("/sign-in");
  };
  const  DropDownItem= DropDownItemList(user)

  return (
    <div
      className="hidden md:relative md:inline-block text-left"
      onDoubleClick={() => setIsOpen(true)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Login Button */}
      <button
        onClick={user ? handleLogout : handleLoginClick}
        className={`flex flex-row items-center text-white gap-1 px-4 py-2 
                   bg-gradient-to-r ${
                     !user
                       ? "from-green-400 via-green-500 to-green-600  focus:ring-green-300 dark:focus:ring-green-800"
                       : "from-red-400 via-red-500 to-red-600  hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800"
                   } rounded-full md:rounded-md transition hover:bg-gradient-to-br 
                   focus:ring `}
      >
        <FaUserCircle className="size-4 md:size-6" />
        <span className="hidden md:block">{!user ? "Login" : "Logout"}</span>

        {/* Animated Arrow */}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="ml-1"
        >
          <FiChevronDown className="size-4 md:size-6" />
        </motion.span>
      </button>

      {/* Dropdown with Animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className={`absolute right-0 mt-2 w-65 bg-white  shadow-cyan-700  dark:shadow-black dark:bg-gray-900  px-5 border-gray-200 dark:border-green-400 rounded-lg shadow-lg z-50 border-1`}
          >
            {/* Header */}
            {!user && (
              <div className="flex w-full justify-evenly items-center gap-2 px-1 py-2 border-b">
                <span className="text-sm dark:text-white">New customer?</span>
                <button
                  onClick={() => navigate("/sign-up")}
                  className="text-blue-600 dark:text-green-300 text-sm font-medium hover:underline"
                >
                  Sign Up
                </button>
              </div>
            )}

            {/* Menu Items */}
            <ul className="py-2 text-gray-700 ">
              {DropDownItem.map((item) => (
                <ListItem
                  key={item.id}
                  icon={item.icon}
                  text={item.title}
                  link={item.link}
                />
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
