import React, { useEffect, useState } from "react";
import { useDeliveryManStore } from "../../../Store/useDeliveryMan";
import { useAuthStore } from "../../../Store/authStore";
import { motion } from "framer-motion";
import { UserCheck, RefreshCw } from "lucide-react";
import LoaderAnimation from "../../LoaderAnimation";

const DeliveryManVerificationPage = () => {
  const {
    verifyDeliveryMan,
    totalDeliveryMen,
    unverifiedDeliveryMen,
    getUnverifiedDeliveryMen,
    loading,
  } = useDeliveryManStore();

  const { user } = useAuthStore();
  const [alertOn, setAlertOn] = useState(false);
  const [selectedDeliveryMan, setSelectedDeliveryMan] = useState(null);

  useEffect(() => {
    if (user.isAdmin) {
      getUnverifiedDeliveryMen();
    }
  }, [getUnverifiedDeliveryMen, user.isAdmin]);

  const handleShowMore = async () => {
    await getUnverifiedDeliveryMen(unverifiedDeliveryMen.length);
  };

  const handleVerification = async (id) => {
    await verifyDeliveryMan(id);
  };

  const handleRefresh = () => {
    getUnverifiedDeliveryMen(0);
  };

  return (
    <div className="w-full flex flex-col px-4 md:px-8 lg:px-10 items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-yellow-500 text-center">
        Delivery Man Verification
      </h1>

      {loading && <LoaderAnimation />}

      {!loading && totalDeliveryMen === 0 && (
        <div className="flex flex-col items-center justify-center text-center mt-8 px-4 sm:px-8 border-[0.5px] w-full py-8 lg:py-16 rounded-md bg-black/10 dark:bg-black/30 shadow-lg">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex items-center justify-center w-20 h-20 rounded-full bg-yellow-100 dark:bg-yellow-900 shadow-lg mb-4"
          >
            <UserCheck className="w-10 h-10 text-yellow-600 dark:text-yellow-300" />
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xl sm:text-2xl font-bold text-yellow-700 dark:text-yellow-400"
          >
            No Delivery Man Requests Yet
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-md sm:max-w-lg"
          >
            Currently, there are no pending delivery men waiting for verification.
            Once a delivery man submits their documents, they will appear here.
          </motion.p>
          <button
            onClick={handleRefresh}
            className="flex mt-6 items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white font-medium shadow-md transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh Requests
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mt-6 w-full">
        {unverifiedDeliveryMen.map((item) => (
          <div
            key={item._id}
            className="border-[0.5px] rounded-xl shadow-lg flex flex-col items-center justify-center px-4 py-5 bg-yellow-50 dark:bg-yellow-900 hover:scale-105 transition-transform duration-200"
          >
            <h2 className="text-lg sm:text-xl font-bold text-yellow-700 dark:text-yellow-300 text-center">
              {item.user?.name || "Unknown"}
            </h2>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 text-center break-words">
              Vehicle: {item.vehicleNumber}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center break-words">
              License: {item.drivingLicense}
            </p>
            <button
              onClick={() => {
                setAlertOn(true);
                setSelectedDeliveryMan(item);
              }}
              className="mt-3 w-full sm:w-auto bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm sm:text-base"
            >
              Verify
            </button>
          </div>
        ))}
      </div>

      {unverifiedDeliveryMen.length < totalDeliveryMen && (
        <button
          onClick={handleShowMore}
          className="mt-6 w-full sm:w-auto text-yellow-600 dark:text-yellow-400 text-sm sm:text-base py-3"
        >
          Show More
        </button>
      )}

      {alertOn && selectedDeliveryMan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-full max-w-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center">
              Confirm Verification
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-center">
              Are you sure you want to verify{" "}
              <b>{selectedDeliveryMan.user?.name}</b> as a delivery man?
            </p>
            <div className="flex flex-col sm:flex-row justify-center sm:justify-end gap-3 mt-5">
              <button
                onClick={() => setAlertOn(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-black dark:text-white w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleVerification(selectedDeliveryMan._id);
                  setAlertOn(false);
                }}
                className="px-4 py-2 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white w-full sm:w-auto"
              >
                Verify
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default DeliveryManVerificationPage;
