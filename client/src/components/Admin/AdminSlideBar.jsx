import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdUpdate, MdIncompleteCircle } from "react-icons/md";
import { FiTrash2 } from "react-icons/fi";
import { Monitor } from "lucide-react";
import { useThemeStore } from "../../Store/useThemeStore";
import { ChevronDown } from "lucide-react";

const siderBarData = [
  {
    id: 0,
    title: "Dashboard",
    items: [],
    tab: "/admin?tab=dashboard",
    icon: <MdIncompleteCircle className="rotate-105" />,
  },
  {
    id: 1,
    title: "Add Data",
    items: [
      { item: "New Category", tab: "/admin?tab=newCategory" },
      { item: "New Product", tab: "/admin?tab=newProduct" },
    ],
    icon: <IoMdAddCircleOutline />,
  },
  {
    id: 2,
    title: "Updates",
    items: [
      { item: "Update Category", tab: "/admin?tab=updateCategory" },
      { item: "Update Product", tab: "/admin?tab=updateProduct" },
    ],
    icon: <MdUpdate />,
  },
  {
    id: 3,
    title: "Delete",
    items: [
      { item: "Delete Category", tab: "/admin?tab=deleteCategory" },
      { item: "Delete Product", tab: "/admin?tab=deleteProduct" },
    ],
    icon: <FiTrash2 />,
  },
  {
    id: 4,
    title: "Display",
    items: [
      { item: "Users", tab: "/admin?tab=users" },
      { item: "Categories", tab: "/admin?tab=categories" },
      { item: "Products", tab: "/admin?tab=products" },
      { item: "Order Items", tab: "/admin?tab=OrderItem", },
       
    ],
    icon: <Monitor className="size-6" />,
  },
];

export default function AdminSidebar({ data }) {
  const [open, setOpen] = useState(false);
  const [activeSections, setActiveSections] = useState([]);
  const [selectedTab, setSelectedTab] = useState("");
  const { theme } = useThemeStore();
  const location = useLocation();

  const toggleSection = (id) => {
    setActiveSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

 useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
        setSelectedTab(tabFromUrl)
      const sectionToOpen = siderBarData.find((section) =>
        section.items.some((item) => item.tab.includes(tabFromUrl))
      );

      if (sectionToOpen) {
        setActiveSections([sectionToOpen.id]);
      } else {
        setActiveSections([]);
      }
    } else {
      setActiveSections([]);
    }
  }, [location.search]);

  const sectionVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="w-full md:hidden px-5 py-1 bg-blue-300 dark:bg-gray-800 mb-5 mt-1 flex items-center justify-between">
      {/* Hamburger / Close Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative w-10 h-10 flex flex-col justify-center items-center gap-1 p-2 rounded-xl transition`}
      >
        <motion.span
          animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
          className="block w-6 h-0.5 bg-current rounded dark:bg-white"
        />
        <motion.span
          animate={{ opacity: open ? 0 : 1 }}
          className="block w-6 h-0.5 bg-current rounded dark:bg-white"
        />
        <motion.span
          animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
          className="block w-6 h-0.5 bg-current rounded dark:bg-white"
        />
      </button>
      {data && (
        <div>
          <h2 className="font-bold  dark:text-green-500">{data}</h2>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40 overflow-y-auto scrollbar-hide"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className={`fixed top-0 right-0 h-full w-60 z-50 shadow-xl 
                ${
                  theme === "dark"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-900"
                } 
              `}
            >
              <motion.div
                className="flex flex-col mt-4 overflow-y-auto h-full scrollbar-hide pb-5"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05 } },
                }}
              >
                {siderBarData.map((section) => (
                  <motion.div
                    key={section.id}
                    className="border-b border-gray-300 dark:border-gray-700"
                    variants={sectionVariants}
                  >
                    {section.items.length === 0 ? (
                      <Link
                        to={section.tab}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition
                          ${
                            selectedTab === section.tab.split("tab=")[1]
                              ? "bg-blue-600 text-white dark:bg-green-800 dark:text-white"
                              : ""
                          }`}
                      >
                        {section.icon}
                        <span>{section.title}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex items-center justify-between w-full px-4 py-3 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                      >
                        <div className="flex items-center gap-3">
                          {section.icon}
                          <span>{section.title}</span>
                        </div>
                        <motion.span
                          animate={{
                            rotate: activeSections.includes(section.id)
                              ? 180
                              : 0,
                          }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <ChevronDown size={18} />
                        </motion.span>
                      </button>
                    )}

                    <AnimatePresence>
                      {activeSections.includes(section.id) &&
                        section.items.length > 0 && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="flex flex-col px-2 py-2 gap-2 overflow-hidden"
                          >
                            {section.items.map((item, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: 20, opacity: 0 }}
                                transition={{
                                  duration: 0.2,
                                  delay: idx * 0.05,
                                }}
                                className={`h-8 flex items-center cursor-pointer text-sm w-full py-1 transition hover:text-blue-500 dark:hover:text-green-300 
                                ${
                                  selectedTab === item.tab.split("tab=")[1]
                                    ? "bg-blue-600 text-white dark:bg-green-800 dark:text-white"
                                    : ""
                                }`}
                              >
                                <Link
                                  className="px-8"
                                  to={item.tab}
                                  onClick={() => setOpen(false)}
                                >
                                  {item.item}
                                </Link>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
