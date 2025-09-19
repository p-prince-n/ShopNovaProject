import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useThemeStore } from "../../Store/useThemeStore";
import { Link } from "react-router-dom";
import { DropDownItemList } from "./DropDownMenu";
import { useAuthStore } from "../../Store/authStore";



export default function DropdownMenuSlider() {
    const {user}=useAuthStore();
  const [open, setOpen] = useState(false);
  const { theme } = useThemeStore();
  const items = DropDownItemList(user);
  

  return (
    <div>
      {/* Hamburger/X Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`relative w-10 h-10 flex flex-col justify-center items-center gap-1 p-2 rounded-xl shadow-md
          ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-800"} 
          hover:shadow-lg transition`}
      >
        {/* Top Line */}
        <motion.span
          animate={{ rotate: open ? 45 : 0, y: open ? 6 : 0 }}
          className="block w-6 h-0.5 bg-current rounded"
        />
        {/* Middle Line */}
        <motion.span
          animate={{ opacity: open ? 0 : 1 }}
          className="block w-6 h-0.5 bg-current rounded"
        />
        {/* Bottom Line */}
        <motion.span
          animate={{ rotate: open ? -45 : 0, y: open ? -6 : 0 }}
          className="block w-6 h-0.5 bg-current rounded"
        />
      </button>

      {/* Overlay + Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Background overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.4 }}
              className={`fixed top-18 right-0 h-full w-80 z-50 shadow-xl 
                ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}
              `}
            >
              {/* Menu Items */}
              <div className="flex flex-col p-4 gap-2 mt-4">
                {items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.id}
                      to={item.link}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                      <Icon className="text-xl" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
