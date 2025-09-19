import React from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Info, AlertTriangle, XCircle } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "success",
    icon: <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />,
    bg: "bg-green-100 dark:bg-green-800/30",
    text: "🎉 Your order #4523 has been confirmed! Sit back and relax while we prepare it for delivery.",
  },
  {
    id: 2,
    type: "info",
    icon: <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    bg: "bg-blue-100 dark:bg-blue-800/30",
    text: "🛍️ ShopNova Mega Sale starts tomorrow! Get up to 50% off across all categories.",
  },
  {
    id: 3,
    type: "warning",
    icon: <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />,
    bg: "bg-yellow-100 dark:bg-yellow-800/30",
    text: "⚠️ Update your address to avoid delays in your next delivery.",
  },
  {
    id: 4,
    type: "alert",
    icon: <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />,
    bg: "bg-red-100 dark:bg-red-800/30",
    text: "🚨 Payment for your last order failed. Please retry within 24 hours to keep your order active.",
  },
];

const Notification = () => {
  return (
    <div className=" md:px-10 lg:px-30">
      <div className="w-full  mx-auto mt-10 p-6 rounded-2xl shadow-xl 
                    bg-white dark:bg-gray-900 transition-all duration-500">
      {/* Header */}
      <motion.div
        className="flex items-center gap-3 mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Bell className="w-7 h-7 text-blue-500 dark:text-blue-400 animate-bounce" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          Latest Notifications
        </h2>
      </motion.div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((note, index) => (
          <motion.div
            key={note.id}
            className={`flex items-start gap-3 p-4 rounded-xl shadow-md ${note.bg}`}
            initial={{ x: index % 2 === 0 ? -40 : 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.3, duration: 0.6 }}
            whileHover={{ scale: 1.03 }}
          >
            {note.icon}
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed">
              {note.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Notification;
