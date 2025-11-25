import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { motion } from "framer-motion";
import { useUserStore } from "../../Store/useUserStore";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useAuthStore } from "../../Store/authStore";
import ShowAlertBox from "./ShowAlertBox";
import LoaderAnimation from "../LoaderAnimation";
import { useSellerStore } from "../../Store/sellerStore";

const DashVerifiedSeller = () => {
  const user = useAuthStore((state) => state.user);
  const { verifiedSellers, totalSellers, loading, error, getVerifiedSellers, downloadSellersExcel, deleteSeller } =
    useSellerStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);


  useEffect(() => {
    if (user?.isAdmin) {
      getVerifiedSellers();
    }
  }, [user?.isAdmin, getVerifiedSellers]);


  const handleShowMore = async () => {
    await getVerifiedSellers(verifiedSellers.length);
  };


  const HandleDeleteUser = async () => {
    if (userToDelete) {
      await deleteSeller(userToDelete._id);
      setShowConfirm(false);
    }
  };

  if (loading) return <LoaderAnimation />;

  return (
    <div className="md:px-10 py-5 w-full table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user?.isAdmin && verifiedSellers.length > 0 ? (
        
        <div className="flex flex-col gap-5 items-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={downloadSellersExcel}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors text-sm md:text-base self-center md:self-auto md:w-1/2"
                  >
                    Download Excel
                  </motion.button>
          <Table hoverable className="shadow-xl">
            <TableHead>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Shop Name</TableHeadCell>
              <TableHeadCell>Logo</TableHeadCell>
              <TableHeadCell>Mobile</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {verifiedSellers.map((u) => (
                <TableRow
                  key={u._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-900"
                >
                  <TableCell className="whitespace-nowrap">
                    {new Date(u.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {u.shopName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <img
                      src={u.logo}
                      alt={u.shopName}
                      className="size-10 rounded-full object-cover bg-gray-500"
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {u.contactPhone}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{u.contactEmail}</TableCell>
                 
                  <TableCell className="whitespace-nowrap">
                    <span
                      onClick={() => {
                        setShowConfirm(true);
                        setUserToDelete(u);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
         

          {/* ✅ Show More button only if there are more users */}
          {verifiedSellers.length < totalSellers && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </div>
      ) : (
        <p>You have no verified sellers yet!</p>
      )}

      {/* ✅ Confirm Delete Modal */}
      {showConfirm && !loading && (
        <div className="w-full h-full mt-3 md:mt-5 md:px-3 py-2 md:py-10 bg-gray-300 dark:bg-gray-700 rounded-xl dark:border-gray-300 border-gray-600">
          <div className="flex flex-wrap gap-4 justify-start h-full w-full">
            <ShowAlertBox
              data={userToDelete}
              text={"User"}
              showConfirm={() => setShowConfirm(false)}
              handleDelete={HandleDeleteUser}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashVerifiedSeller;
