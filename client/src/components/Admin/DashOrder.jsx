import { Table,TableHeadCell, TableBody, TableHead, TableCell } from "flowbite-react";
import { motion, AnimatePresence } from "framer-motion";
import moment from "moment";

import {useOrderStore} from '../../Store/useOrderStore'
import LoaderAnimation from "../LoaderAnimation";
import { useEffect, useState } from "react";

const DashOrder = () => {
      const {allOrders, fetchAllOrdersForAdmin, loading, error, downloadOrdersExcel }=useOrderStore();
  useEffect(()=>{
    fetchAllOrdersForAdmin()
  },[])
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 9;


  const startIdx = (currentPage - 1) * ordersPerPage;
  const endIdx = startIdx + ordersPerPage;
  const currentOrders = allOrders.slice(startIdx, endIdx);
  const totalPages = Math.ceil(allOrders.length / ordersPerPage);
  const getStatusClasses = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-indigo-100 text-indigo-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
      case "canceled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
console.log(allOrders);

  return (
    <div className=" py-6 w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-400 scrollbar-track-slate-100 dark:scrollbar-thumb-slate-600 dark:scrollbar-track-slate-800">
      {loading && <LoaderAnimation />}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!loading && allOrders.length > 0 ? (
        <AnimatePresence>
          <motion.div
            key="ordersTable"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100 }}
            className="bg-white dark:bg-gray-900 shadow-2xl rounded-xl p-3 md:p-6"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
              <h2 className="text-lg md:text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center md:text-left">
                All Orders ({allOrders.length})
              </h2>

              {/* Download Excel Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadOrdersExcel}
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors text-sm md:text-base self-center md:self-auto"
              >
                Download Excel
              </motion.button>
            </div>

            <div className="overflow-x-auto scrollbar-none">
              <Table hoverable className="min-w-[800px]">
                <TableHead>
                    <TableHeadCell>Order Time</TableHeadCell>
                  <TableHeadCell>Order ID</TableHeadCell>
                  <TableHeadCell>User</TableHeadCell>
                  <TableHeadCell>Product</TableHeadCell>
                  <TableHeadCell>Seller</TableHeadCell>
                  <TableHeadCell>Delivery</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Price</TableHeadCell>
                </TableHead>

                <TableBody className="divide-y">
                  {currentOrders.map((item) => (
                    <motion.tr
                      key={`${item._id}`}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
                    >
                        <TableCell className="whitespace-nowrap font-medium text-gray-700 dark:text-gray-200">
                         {moment(item.createdAt).format("DD MMM YYYY, h:mm A")}
                      </TableCell>
                      {/* 🆔 Order ID */}
                      <TableCell className="whitespace-nowrap font-medium text-gray-700 dark:text-gray-200">
                        #{item.orderId?.slice(-6)}
                      </TableCell>

                      {/* 👤 User */}
                      <TableCell className="whitespace-nowrap text-sm">
                        {item.user?.name || "Unknown"}
                      </TableCell>

                      {/* 📦 Product */}
                      <TableCell className="whitespace-nowrap text-sm">
                        {item.product?.name || "—"}
                      </TableCell>

                      {/* 🏪 Seller */}
                      <TableCell className="whitespace-nowrap text-sm">
                        {item.seller?.shopName ? (
                          item.seller.shopName
                        ) : (
                          <span className="text-red-500 font-medium">
                            Not Accepted
                          </span>
                        )}
                      </TableCell>

                      {/* 🚚 Delivery */}
                      <TableCell className="whitespace-nowrap text-sm">
                        {item.deliveryMan?.vehicleNumber ? (
                          <span className="text-green-500">
                            {item.deliveryMan.vehicleNumber}
                          </span>
                        ) : (
                          <span className="text-yellow-500 font-medium">
                            Not Assigned
                          </span>
                        )}
                      </TableCell>

                      {/* 🔁 Status */}
                      <TableCell className="whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-semibold capitalize ${getStatusClasses(
                            item.orderStatus
                          )}`}
                        >
                          {item.orderStatus || "Pending"}
                        </span>
                      </TableCell>

                      {/* 💰 Price */}
                      <TableCell className="whitespace-nowrap text-sm font-semibold">
                        ₹{item.discountPrice || 0}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* ✅ Pagination Controls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-wrap justify-center items-center gap-3 mt-6"
            >
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  currentPage === 1
                    ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
              >
                Prev
              </button>

              <span className="text-gray-700 dark:text-gray-300 text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  currentPage === totalPages
                    ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-teal-500 text-white hover:bg-teal-600"
                }`}
              >
                Next
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      ) : (
        !loading && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-gray-500 dark:text-gray-300 py-8"
          >
            No orders found.
          </motion.p>
        )
      )}
    </div>
  );
}

export default DashOrder