import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { House, Package, TruckIcon } from "lucide-react";


const sidebarItem = [
  {
    id: 0,
    title: "Profile",
    icon: <House />,
    link: "/delivery-page?tab=profile",
  },
  {
    id: 2,
    title: "Shipments",
    icon: <Package />,
    link: "/delivery-page?tab=shipments",
  },
  {
    id: 4,
    title: "Delivery Tasks",
    icon: <TruckIcon />,
    link: "/delivery-page?tab=tasks",
  },
];

export default function DeliverySidebar() {
  const location = useLocation();
  const navigate = useNavigate();


  const params = new URLSearchParams(location.search);
  const [selectedTab, setSelectedTab] = useState(params.get("tab") || "profile");

  useEffect(() => {
    setSelectedTab(params.get("tab") || "profile");
  }, [location.search]);

  const handleSelect = (link) => {
    navigate(link);
  };


  const [openGroup, setOpenGroup] = useState(true);


  const [openDrawer, setOpenDrawer] = useState(false);

  return (
    <div>
      {/* ✅ Mobile Sidebar */}
      <div className="md:hidden min-w-screen flex flex-col items-center px-5 mb-5 mt-5">
        {/* Hamburger */}
        <div className="flex  items-center w-full justify-between bg-white dark:bg-gray-800 px-5 py-2">
          <button
            onClick={() => setOpenDrawer((prev) => !prev)}
            className={`relative w-10 h-10 flex flex-col justify-center items-center gap-1 p-2 rounded-xl transition`}
          >
            <motion.span
              animate={{ rotate: openDrawer ? 45 : 0, y: openDrawer ? 6 : 0 }}
              className="block w-6 h-0.5 bg-current rounded dark:bg-green-500"
            />
            <motion.span
              animate={{ opacity: openDrawer ? 0 : 1 }}
              className="block w-6 h-0.5 bg-current rounded dark:bg-green-500"
            />
            <motion.span
              animate={{ rotate: openDrawer ? -45 : 0, y: openDrawer ? -6 : 0 }}
              className="block w-6 h-0.5 bg-current rounded dark:bg-green-500"
            />
          </button>

          <div>
            <h2 className="font-bold dark:text-green-500">
              {sidebarItem.find((i) => i.link.split("=")[1] === selectedTab)?.title}
            </h2>
          </div>
        </div>

        {/* Drawer */}
        <AnimatePresence>
          {openDrawer && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black z-40"
                onClick={() => setOpenDrawer(false)}
              />
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.4 }}
                className={`fixed top-0 right-0 h-full w-60 z-50 shadow-xl bg-white dark:bg-gray-900`}
              >
                <div className="flex flex-col py-4 px-2 gap-2 mt-4">
                  {/* Drawer Group */}
                  <div className="flex flex-col mb-2">
                    <div
                      className="flex justify-between items-center cursor-pointer p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                      onClick={() => setOpenGroup(!openGroup)}
                    >
                      <span className="font-bold dark:text-green-400">Menu</span>
                      <FiChevronDown
                        className={`transition-transform dark:text-white ${
                          openGroup ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    <AnimatePresence>
                      {openGroup && (
                        <motion.ul
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col gap-1 mt-2"
                        >
                          {sidebarItem.map((item) => {
                            const active = item.link.split("=")[1] === selectedTab;
                            return (
                              <li
                                key={item.id}
                                className={`pl-5 py-2 cursor-pointer flex  items-center gap-2 rounded-md ${
                                  active
                                    ? "bg-blue-600 dark:bg-green-500 text-white dark:text-black font-bold"
                                    : "hover:bg-blue-200 dark:hover:bg-green-300 dark:text-green-400 hover:text-blue-700 dark:hover:text-white"
                                }`}
                                onClick={() => {
                                  handleSelect(item.link);
                                  setOpenDrawer(false);
                                }}
                              >
                                {item.icon}
                                <span className="uppercase">{item.title}</span>
                              </li>
                            );
                          })}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* ✅ Desktop Sidebar */}
     
    </div>
  );
}
