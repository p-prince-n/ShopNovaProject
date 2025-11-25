import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const SidebarItem = ({ item, selectedTab, onClick, closeDrawer }) => {
  const active = item.link.split("=")[1] === selectedTab;

  return (
    <li
      className={`pl-5 py-2 dark:text-green-400 cursor-pointer flex items-center gap-2 rounded-md ${
        active
          ? "bg-blue-600 text-white font-bold"
          : "hover:bg-blue-200 dark:hover:bg-green-300 hover:text-blue-700 dark:hover:text-white"
      }`}
      onClick={() => {
        onClick(item.link);
        closeDrawer();
      }}
    >
      {item.icon}
      <span className="uppercase">{item.title}</span>
    </li>
  );
};

const SidebarItemGroup = ({ items, selectedTab, onClick, closeDrawer }) => {
  const [open, setOpen] = useState(true);

  return (
    <div className="flex flex-col mb-2">
      <div
        className="flex justify-between items-center cursor-pointer p-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
        onClick={() => setOpen(!open)}
      >
        <span className="font-bold dark:text-green-400">Menu</span>
        <FiChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-1 mt-2"
          >
            {items.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                selectedTab={selectedTab}
                onClick={onClick}
                closeDrawer={closeDrawer}
              />
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function DropdownMenuSliderSeller({ items, selectedTab, onSelect }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden w-full flex flex-col items-center px-5 mb-5 mt-5">
      {/* Hamburger */}
      <div className="flex items-center w-full justify-between bg-white dark:bg-gray-800 px-5 py-2">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`relative w-10 h-10 flex flex-col justify-center items-center gap-1 p-2 rounded-xl transition`}
        >
          <motion.span
            animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
            className="block w-6 h-0.5 bg-current rounded dark:bg-green-500"
          />
          <motion.span
            animate={{ opacity: open ? 0 : 1 }}
            className="block w-6 h-0.5 bg-current rounded dark:bg-green-500"
          />
          <motion.span
            animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
            className="block w-6 h-0.5 bg-current rounded dark:bg-green-500"
          />
        </button>

        <div>
          <h2 className="font-bold dark:text-green-500">
            {items.find((i) => i.link.split("=")[1] === selectedTab)?.title}
          </h2>
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
              className={`fixed top-0 right-0 h-full w-60 z-50 shadow-xl bg-white dark:bg-gray-900`}
            >
              <div className="flex flex-col py-4 px-2 gap-2 mt-4">
                <SidebarItemGroup
                  items={items}
                  selectedTab={selectedTab}
                  onClick={onSelect}
                  closeDrawer={() => setOpen(false)}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
