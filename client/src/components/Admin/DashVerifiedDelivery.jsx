import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useDeliveryManStore } from "../../Store/useDeliveryMan";
import { useAuthStore } from "../../Store/authStore";
import LoaderAnimation from "../LoaderAnimation";
import ShowAlertBox from "./ShowAlertBox";

const DashVerifiedDelivery = () => {
  const user = useAuthStore((state) => state.user);
  const {
    verifiedDeliveryMen,
    totalDeliveryMen,
    getVerifiedDeliveryMen,
    deleteDeliveryMan,
    loading,
  } = useDeliveryManStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [deliveryToDelete, setDeliveryToDelete] = useState(null);


  useEffect(() => {
    if (user?.isAdmin) {
      getVerifiedDeliveryMen();
    }
  }, [user?.isAdmin, getVerifiedDeliveryMen]);


  const handleShowMore = async () => {
    await getVerifiedDeliveryMen(verifiedDeliveryMen.length);
  };


  const handleDeleteDelivery = async () => {
    if (deliveryToDelete) {
      await deleteDeliveryMan(deliveryToDelete._id);
      setShowConfirm(false);
    }
  };

  if (loading) return <LoaderAnimation />;

  return (
    <div className="md:px-10 py-5 w-full table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user?.isAdmin && verifiedDeliveryMen.length > 0 ? (
        <>
          <Table hoverable className="shadow-xl">
            <TableHead>
              <TableHeadCell>Date Created</TableHeadCell>
              <TableHeadCell>Vehicle Number</TableHeadCell>
              <TableHeadCell>Driving License</TableHeadCell>
              <TableHeadCell>Contact Phone</TableHeadCell>
              <TableHeadCell>Contact Email</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {verifiedDeliveryMen.map((d) => (
                <TableRow
                  key={d._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-900"
                >
                  <TableCell className="whitespace-nowrap">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{d.vehicleNumber}</TableCell>
                  <TableCell className="whitespace-nowrap">{d.drivingLicense}</TableCell>
                  <TableCell className="whitespace-nowrap">{d.contactPhone}</TableCell>
                  <TableCell className="whitespace-nowrap">{d.contactEmail}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-white font-semibold ${
                        d.status === "active"
                          ? "bg-green-500"
                          : d.status === "inactive"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {d.status || "pending"}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span
                      onClick={() => {
                        setShowConfirm(true);
                        setDeliveryToDelete(d);
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

          {/* Show More */}
          {verifiedDeliveryMen.length < totalDeliveryMen && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show More
            </button>
          )}
        </>
      ) : (
        <p className="flex items-center justify-center w-full dark:text-gray-200">No verified delivery men yet!</p>
      )}

      {/* Confirm Delete Modal */}
      {showConfirm && !loading && (
        <div className="w-full h-full mt-3 md:mt-5 md:px-3 py-2 md:py-10 bg-gray-300 dark:bg-gray-700 rounded-xl dark:border-gray-300 border-gray-600">
          <div className="flex flex-wrap gap-4 justify-start h-full w-full">
            <ShowAlertBox
              data={deliveryToDelete}
              text={"Delivery Man"}
              showConfirm={() => setShowConfirm(false)}
              handleDelete={handleDeleteDelivery}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashVerifiedDelivery;
