import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../Store/useThemeStore";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ImUser } from "react-icons/im";
import { FaWallet } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { FiChevronDown } from "react-icons/fi";
import { useAuthStore } from "../../Store/authStore";


const siderBarData = [
  {
    id: 1,
    title: "Account Settings",
    items: [
      { name: "Profile Information", tab: "profile" },
      { name: "Manage Address", tab: "address" },
    ],
    icon: ImUser,
  },
  {
    id: 2,
    title: "Payments",
    items: [
      { name: "Saved UPI", tab: "savedUPI" },
      { name: "Saved Cards", tab: "saveCard" },
    ],
    icon: FaWallet,
  },
  {
    id: 3,
    title: "My Stuff",
    items: [
      { name: "My Review & Ratings", tab: "reviewrating" },
      { name: "All Notifications", tab: "notification" },
      { name: "My WishList", tab: "wishlist" },
    ],
    icon: FaClipboardUser,
  },
];

const SidebarItem = ({ item, currTab, closeDrawer }) => {
  const navigate = useNavigate();
  const { user } =useAuthStore();

  const handleClick = (tab) => {
    navigate(`/data/${user._id}/?tab=${tab}`);
    closeDrawer();
  };

  return (
    <li
      className={`pl-8 flex items-center cursor-pointer h-10 ${
        currTab === item.tab
          ? "bg-blue-500 text-white dark:text-black font-bold dark:bg-green-600"
          : ""
      }`}
      onClick={() => handleClick(item.tab)}
    >
      {item.name}
    </li>
  );
};

const SidebarItemGroup = ({ item, currTab,closeDrawer  }) => {
  const [open, setOpen] = useState(false);
  const Icon = item.icon;

  return (
    <div className="flex flex-col">
      <div
        className="flex justify-between items-center cursor-pointer p-3 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center gap-3 font-bold dark:text-green-400">
          <Icon /> {item.title}
        </span>
        <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-2 flex flex-col gap-1 text-sm w-full"
          >
            {item.items.map((sub) => (
              <SidebarItem key={sub.tab} item={sub} currTab={currTab} closeDrawer={closeDrawer} />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
      <p className="h-[0.5px] w-full dark:bg-gray-600"></p>
    </div>
  );
};

export default function DropdownMenuSlider() {
  const [open, setOpen] = useState(false);
  const { theme } = useThemeStore();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const currTab = queryParams.get("tab") || "profile";
  

  return (
    <div className="md:hidden w-full flex items-center justify-center pr-5">
      {/* Hamburger */}
      <div className="flex items-center w-80 justify-between bg-white dark:bg-gray-800 px-5">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`relative w-10 h-10 flex flex-col justify-center items-center gap-1 p-2 rounded-xl ${
            theme !== "dark" ? "text-black" : "text-gray-400"
          } transition`}
        >
          <motion.span animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }} className="block w-6 h-0.5 bg-current rounded" />
          <motion.span animate={{ opacity: open ? 0 : 1 }} className="block w-6 h-0.5 bg-current rounded" />
          <motion.span animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }} className="block w-6 h-0.5 bg-current rounded" />
        </button>
        <div>
          <h2 className="font-bold dark:text-green-500">{siderBarData.flatMap(g => g.items).find(i => i.tab === currTab)?.name}</h2>
        </div>
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className={`fixed top-0 right-0 h-full w-60 z-50 shadow-xl ${
                theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex flex-col py-4 px-2 gap-2 mt-4">
                {siderBarData.map((item) => (
                  <SidebarItemGroup key={item.id} item={item} currTab={currTab} closeDrawer={()=>setOpen(false)} />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
