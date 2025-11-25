import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  PackageIcon,
  MapPinIcon,
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  ClockIcon,
  ChevronDownIcon,
  XIcon,
} from "lucide-react";
import { useOrderStore } from "../../Store/useOrderStore";
import { useNavigate } from "react-router-dom";
import { Checkbox } from "flowbite-react";
import { FiPackage, FiHome } from "react-icons/fi";




const STATUS_STEPS = [
  { key: "Pending", label: "Placed", icon: ClockIcon },
  { key: "Processing", label: "Processing", icon: PackageIcon },
  { key: "Shipped", label: "Shipped", icon: TruckIcon },
  { key: "Delivered", label: "Delivered", icon: CheckCircleIcon },
  { key: "Cancelled", label: "Cancelled", icon: XIcon },
];


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

function OrderCard({ order, index, selectedOrderId, setSelectedOrderId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(
    order.items?.[0]?.product?._id || null
  );
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const { cancelOrderItems } = useOrderStore.getState();

  const toggleSelection = (id) => {
    setSelectedProductIds((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };
  const formattedDate = new Date(order.createdAt).toLocaleString();


  const selectedItem = order.items.find(
    (it) => it.product._id === selectedItemId
  );
  const isActiveOrder = selectedOrderId === order._id;
  console.log({ selectedProductIds });

  const cancelItems = async () => {
    await cancelOrderItems(selectedOrderId, selectedProductIds);
  };

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
          <span className="text-sm md:text-lg text-slate-500 dark:text-green-400 flex gap-2 items-center justify-center">
            <Checkbox
              checked={isActiveOrder}
              onChange={(e) => {
                const checked = e.target.checked;
                setSelectedOrderId(checked ? order._id : null);
                if (!checked) setSelectedProductIds([]);
              }}
            />
            <span
              className={`${
                isActiveOrder
                  ? "text-slate-500 dark:text-green-400"
                  : "text-red-500"
              }`}
            >
              {isActiveOrder ? "Hide" : "Select"}
            </span>
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
                }  ${
                  it.orderStatus === "Cancelled"
                    ? "bg-red-300 dark:bg-red-900/40 border-red-400 text-red-700 dark:text-red-300"
                    : "border-slate-100 dark:border-slate-800 bg-gradient-to-b from-white/50 dark:from-white/5 to-transparent"
                }`}
              >
                <div className="relative">
                  <img
                    src={it.product.images?.[0]}
                    alt={it.product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  {isActiveOrder &&
                    it.orderStatus !== "Shipped" &&
                    it.orderStatus !== "Delivered" &&
                    it.orderStatus !== "Cancelled" && (
                      <div className="absolute top-0 right-0 rounded p-1 shadow">
                        <Checkbox
                          checked={selectedProductIds.includes(it.product._id)}
                          onChange={() => toggleSelection(it.product._id)}
                        />
                      </div>
                    )}
                </div>
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
                  <div className={`text-sm font-medium  ${it.orderStatus === "Cancelled" ? "line-through text-red-600 dark:text-red-600": "text-slate-900 dark:text-green-400" }`}>
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

            <AnimatePresence mode="wait">
              {isActiveOrder && selectedProductIds.length > 0 && (
                <motion.button
                  onClick={() => setShowConfirm(true)}
                  key="cancel-btn"
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.5 }}
                  className="p-3 rounded-xl border bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800"
                >
                  Cancel Order
                </motion.button>
              )}
            </AnimatePresence>
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
            <div className="text-sm text-slate-700 dark:text-green-400">
              Total Price: ₹{order.totalPrice}
            </div>
          </motion.div>
        )}
      </motion.div>
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-[#071022] rounded-xl p-6 max-w-md w-full shadow-lg"
            >
              <h2 className="text-lg font-semibold text-slate-900 dark:text-green-400 mb-3">
                Confirm Cancellation
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">
                Are you sure you want to cancel these products?
              </p>
              <ul className="mb-4 list-disc list-inside text-sm text-slate-800 dark:text-green-400">
                {order.items
                  .filter((it) => selectedProductIds.includes(it.product._id))
                  .map((it) => (
                    <li key={it.product._id}>{it.product.name}</li>
                  ))}
              </ul>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded-lg text-gray-900 dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    cancelItems();
                    setShowConfirm(false);
                    setSelectedProductIds([]);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg"
                >
                  Yes, Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OrderList() {
  const { fetchUserOrders, userOrders } = useOrderStore();
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showUserOrders, setShowUserOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserOrders();
  }, [fetchUserOrders]);

  useEffect(() => {
    if (userOrders?.length > 0) {
      setShowUserOrders(userOrders.slice(0, 2));
    }
  }, [userOrders]);

  const ShowMore = () => {
    setShowUserOrders(userOrders.slice(0, showUserOrders.length + 2));
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, duration: 0.6 },
    },
    exit: { opacity: 0, y: 20, transition: { duration: 0.4 } },
  };


  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 120 },
    },
    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
  };
  console.log({ userOrders });

  return (
    <div className="min-h-screen relative w-11/12 md:w-2/3 overflow-y-scroll scrollbar-hide">
      <div className="absolute top-30 left-0 w-full px-5 py-5 rounded-lg bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="w-full">
          {showUserOrders?.map((order, idx) => (
            <OrderCard
              key={order._id}
              order={order}
              index={idx}
              selectedOrderId={selectedOrderId}
              setSelectedOrderId={setSelectedOrderId}
            />
          ))}
        </div>

        {showUserOrders.length < userOrders.length && (
          <div className="w-full my-5 flex items-center justify-center">
            <button
              onClick={ShowMore}
              className="text-black/60 dark:text-green-400 hover:underline hover:text-lg md:hover:text-xl hover:font-bold text-sm md:text-lg"
            >
              Show more
            </button>
          </div>
        )}
        <AnimatePresence>
          {userOrders?.length === 0 && (
            <motion.div
              className="flex flex-col items-center justify-center my-20 text-gray-500 dark:text-gray-400 gap-3"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <motion.div
                variants={itemVariants}
                className="text-green-500 dark:text-green-400"
                whileHover={{ scale: 1.2, rotate: [0, 10, -10, 0] }}
              >
                <FiPackage className="w-16 h-16 md:w-20 md:h-20" />
              </motion.div>

              <motion.span
                variants={itemVariants}
                className="text-lg md:text-xl font-semibold"
              >
                No orders found
              </motion.span>

              <motion.p
                variants={itemVariants}
                className="text-sm md:text-base text-center max-w-xs"
              >
                You haven’t placed any orders yet.
              </motion.p>

              <motion.button
                onClick={() => navigate("/home")}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-4 px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md transition-colors duration-300 flex items-center gap-2"
              >
                <FiHome className="w-5 h-5" /> Go Home
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
