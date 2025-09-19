import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  PackageIcon,
  MapPinIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronDownIcon,
} from "lucide-react";
import { useOrderStore } from "../../Store/useOrderStore";
import { useNavigate } from "react-router-dom";

// OrderList.react.jsx
// Responsive Order List with animations

const STATUS_STEPS = [
  { key: "Pending", label: "Placed", icon: ClockIcon },
  { key: "Processing", label: "Processing", icon: PackageIcon },
  { key: "Shipped", label: "Shipped", icon: TruckIcon },
  { key: "Delivered", label: "Delivered", icon: CheckCircleIcon },
];

// ✅ Animation Variants
const cardVariants = {
  hiddenDown: { opacity: 0, y: 60 },
  hiddenUp: { opacity: 0, y: -60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
  exitDown: { opacity: 0, y: 60 },
  exitUp: { opacity: 0, y: -60 },
};

function OrderCard({ order, index }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(
    order.items?.[0]?.product?._id || null
  ); // default to first item

  const [isDark, setIsDark] = useState(
    typeof window !== "undefined" &&
      document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  const formattedDate = new Date(order.createdAt).toLocaleString();

  // Find the selected item
  const selectedItem = order.items.find(
    (it) => it.product._id === selectedItemId
  );

  return (
    <motion.div
      variants={cardVariants}
      initial={index % 2 === 0 ? "hiddenDown" : "hiddenUp"}
      whileInView="visible"
      exit={index % 2 === 0 ? "exitDown" : "exitUp"}
      viewport={{ once: false, amount: 0.2 }}
      className="mb-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-lg md:text-2xl font-semibold text-slate-900 dark:text-green-400">
            Order{" "}
            <span className="text-indigo-500 dark:text-white/90">
              #{order._id.slice(-6)}
            </span>
          </h1>
          <span className="text-sm text-slate-500 dark:text-green-400">
            {formattedDate}
          </span>
        </div>

        <button
          onClick={() => setIsOpen((s) => !s)}
          className="p-2 rounded-lg bg-white/90 dark:bg-white/20 border border-slate-200 dark:border-slate-800 shadow-sm"
        >
          <ChevronDownIcon
            className={`w-4 h-4 transform transition-transform ${
              isOpen ? "rotate-180" : "rotate-0"
            } dark:text-green-400`}
          />
        </button>
      </div>

      {/* Order Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-[#071022] border border-slate-100 dark:border-slate-800"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-6 p-4 md:p-6">
          {/* Items */}
          <div className="md:col-span-2 ">
            {order.items.map((it, idx) => (
              <motion.div
                key={idx}
                onClick={() => setSelectedItemId(it.product._id)}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: 0.05 * idx, duration: 0.4 }}
                className={`flex items-center gap-4 p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-gradient-to-b from-white/50 dark:from-white/5 to-transparent mb-2 cursor-pointer ${
                  selectedItemId === it.product._id
                    ? "ring-2 ring-indigo-500"
                    : ""
                }`}
              >
                <img
                  src={it.product.images?.[0]}
                  alt={it.product.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-medium text-slate-900 dark:text-green-400 text-sm md:text-base line-clamp-2">
                    {it.product.name}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-300 line-clamp-2">
                    <span className="dark:text-green-400">
                      {it.product.description}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">
                    Qty:{" "}
                    <span className="dark:text-green-400">{it.quantity}</span>
                  </p>
                  {it.size && (
                    <p className="text-xs text-slate-500 dark:text-slate-300">
                      Size:{" "}
                      <span className="dark:text-green-400">{it.size}</span>
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-slate-900 dark:text-green-400">
                    ₹{it.discountPrice.toLocaleString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Shipping & Status */}
          <div className="md:col-span-1 flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5 }}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-white/5"
            >
              <MapPinIcon className="w-4 h-4 mb-2 text-slate-600 dark:text-slate-300" />
              <address className="not-italic text-sm text-slate-600 dark:text-green-400">
                {order.shippingAddress.roomNo}, {order.shippingAddress.street},{" "}
                {order.shippingAddress.city}, {order.shippingAddress.state},{" "}
                {order.shippingAddress.pinCode}, {order.shippingAddress.country}
                {order.shippingAddress.landmark
                  ? `, Landmark: ${order.shippingAddress.landmark}`
                  : ""}
              </address>
            </motion.div>

            {/* ✅ Status Steps for selected item only */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white/50 dark:bg-white/5"
            >
              <CreditCardIcon className="w-4 h-4 mb-2 text-slate-600 dark:text-slate-300" />
              <div className="relative pl-6">
                {STATUS_STEPS.map((s, idx) => {
                  const currentIndex = STATUS_STEPS.findIndex(
                    (x) => x.key === selectedItem?.orderStatus
                  );
                  const isCompleted = idx <= currentIndex;
                  return (
                    <motion.div
                      key={s.key}
                      initial={{ opacity: 0, x: 15 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.08 * idx }}
                      className="flex items-start relative"
                    >
                      {idx !== STATUS_STEPS.length - 1 && (
                        <div
                          className={`absolute left-[12px] top-6 w-[2px] h-full ${
                            isCompleted
                              ? "bg-indigo-600"
                              : "bg-gray-300 dark:bg-gray-600"
                          }`}
                        />
                      )}
                      <div
                        className={`flex items-center justify-center w-6 h-6 rounded-full z-10 ${
                          isCompleted
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <s.icon className="w-3 h-3" />
                      </div>
                      <div className="ml-3 mb-6">
                        <span
                          className={`text-sm font-medium ${
                            isCompleted
                              ? "text-indigo-600"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {s.label}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Expandable Payment Info */}
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="border-t border-slate-100 dark:border-slate-800 p-4 md:p-6"
          >
            <div className="text-sm text-slate-700 dark:text-green-400">
              Payment Method: {order.paymentMethod}
            </div>
            <div className="text-sm text-slate-700 dark:text-green-400">
              Payment Status: {order.paymentStatus}
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function OrderList() {
  const { fetchUserOrders, userOrders } = useOrderStore();

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  return (
    <div className="min-h-screen relative w-11/12 md:w-2/3 overflow-y-scroll scrollbar-hide">
      <div className="absolute top-30 left-0 w-full px-5 py-5 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full">
          {userOrders.map((order, idx) => (
            <OrderCard key={order._id} order={order} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
