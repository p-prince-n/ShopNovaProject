import React, { useEffect, useState } from "react";
import { useSellerStore } from "../../../Store/sellerStore";
import { useAuthStore } from "../../../Store/authStore";
import { motion } from "framer-motion";
import { UserCheck } from "lucide-react";
import LoaderAnimation from "../../LoaderAnimation";

const SellerVerificationPage = () => {
  const {
    verifySeller,
    totalSellers,
    unverifiedSellers,
    getUnverifiedSellers,
    loading,
    error,
  } = useSellerStore();
  const { user } = useAuthStore();
  const [alertOn, setAlertOn] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState(null);
  console.log(unverifiedSellers);

  useEffect(() => {
    if (user.isAdmin) {
      getUnverifiedSellers();
    }
  }, [getUnverifiedSellers]);
  const handleShowMore = async () => {
    await getUnverifiedSellers(unverifiedSellers.length);
  };

  const HandleVerification = async (id) => {
    await verifySeller(id);
  };

  return (
    <>
      <div div className="w-full flex flex-col md:px-10 md:items-center ">
        <h1 className="text-2xl text-green-400 font-bold">
          Seller Verification page
        </h1>
        {loading && <LoaderAnimation />}
        {!loading && unverifiedSellers.length === 0 && (
          <div className="flex flex-col items-center justify-center text-center mt-8 px-4 border-[0.5px] w-full py-5 lg:py-20 rounded-md bg-black/10 dark:bg-black/30 shadow-xl">
            {/* Animated Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex items-center justify-center w-20 h-20 rounded-full 
                   bg-blue-100 dark:bg-blue-900 shadow-lg mb-4"
            >
              <UserCheck className="w-10 h-10 text-blue-600 dark:text-blue-300" />
            </motion.div>

            {/* Main Title */}
            <motion.h2
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xl sm:text-2xl font-bold 
                   text-blue-700 dark:text-blue-400"
            >
              No Seller Verification Requests Yet
            </motion.h2>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-lg"
            >
              Currently, there are no pending sellers waiting for verification.
              As soon as a seller submits their documents, they will appear here
              for your review. Keep an eye out to approve genuine sellers and
              grow the platform securely.
            </motion.p>

            {/* Call to Action Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 px-6 py-2 rounded-lg font-medium 
                   bg-gradient-to-r from-blue-500 to-indigo-600 
                   text-white shadow-md 
                   hover:from-blue-600 hover:to-indigo-700 
                   focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 
                   dark:focus:ring-offset-gray-900"
            >
              Refresh Requests
            </motion.button>
          </div>
        )}
        <div className="flex flex-wrap w-full">
          {unverifiedSellers.map((item, idx) => (
            <div
              key={idx}
              className="border-[0.5px] rounded-md shadow-xl flex flex-col items-center justify-center px-2 py-4 dark:bg-black/35"
            >
              <div className="size-27">
                <img
                  src={item.logo}
                  className="size-25 rounded-full border-[0.5px]"
                  alt=""
                />
              </div>
              <h2 className="text-blue-500 text-xl font-bold  dark:text-green-500  rounded-xl">
                {item.shopName}
              </h2>
              <button
                onClick={() => {
                  setAlertOn(true);
                  setSelectedSeller(item);
                }}
                className="bg-blue-500 dark:bg-green-500 text-white px-2 py-1 mt-2 rounded-md w-full"
              >
                Verified
              </button>
            </div>
          ))}
        </div>
        {unverifiedSellers.length < totalSellers && (
          <button
            onClick={handleShowMore}
            className="w-full text-teal-500 self-center text-sm py-7"
          >
            Show More
          </button>
        )}
        {alertOn && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm"
            >
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Confirm SellerVerification
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Are you sure you want to Verify <b>{selectedSeller.shopName}</b>{" "}
                Shop ?
              </p>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => setAlertOn(false)}
                  className="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-black dark:text-white"
                >
                  Cancel
                </button>
                <button

                  onClick={() => {
                    HandleVerification(selectedSeller._id);
                    setAlertOn(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white"
                >
                  verify
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </>
  );
};

export default SellerVerificationPage;
