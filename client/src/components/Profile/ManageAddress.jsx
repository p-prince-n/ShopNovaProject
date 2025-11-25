import React, { useEffect, useState } from "react";
import { useAuthStore } from "../../Store/authStore";
import { useThemeStore } from "../../Store/useThemeStore";
import LoaderAnimation from "../LoaderAnimation";
import { Button, Checkbox, Select } from "flowbite-react";
import { motion } from "framer-motion";
import { Delete, Locate, LocateFixed, MapIcon, Navigation, Pencil, Trash2 } from "lucide-react";
import {
  Bed,
  Route,
  Building,
  Map,
  Mail,
  Globe,
  Home,
} from "lucide-react";
import Input from "../Input";
import toast from "react-hot-toast";
const ManageAddress = () => {
  const {
    addresses,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    isLoading,
    error,
    user,
  } = useAuthStore();
  const { theme } = useThemeStore();
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [showDeleteAddress, setShowDeleteAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showUpdateAddress, setShowUpdateAddress] = useState(false);
  const [mapAddress, setMapAddress]=useState(null);
  const [address, setAddress] = useState({
    roomNo: "",
    street: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    landmark: "",
    addressType: "Home",
    isDefault: false,
  });
  useEffect(() => {
    if (user) getAddresses();
  }, [user]);

  if (isLoading)
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <LoaderAnimation />
      </div>
    );
  const validateAddress = () => {
    const requiredFields = [
      "roomNo",
      "street",
      "city",
      "state",
      "pinCode",
      "country",
      "landmark",
    ];

    for (let field of requiredFields) {
      if (!address[field].trim()) {
        return { valid: false, message: `${field} is required` };
      }
    }

    return { valid: true };
  };
  const HandleSubmitAddress = async () => {
    const validation = validateAddress();

    if (!validation.valid) {
      toast.error(validation.message);
      return;
    }
    

    if (showUpdateAddress) {
       await updateAddress(selectedAddress._id, address);
      setShowUpdateAddress(false);
      setSelectedAddress(null);
      setShowAddAddress(false);
    } else {
      await addAddress(address);
      setShowAddAddress(false);

    }
    setAddress({
      roomNo: "",
      street: "",
      city: "",
      state: "",
      pinCode: "",
      country: "",
      landmark: "",
      addressType: "Home",
      isDefault: false,
    });
  };

  const formatAddress = (address) => {
    let parts = [];

    if (address?.roomNo) parts.push(address?.roomNo);
    if (address?.street) parts.push(address?.street);
    if (address?.city) parts.push(address?.city);
    if (address?.state) parts.push(address?.state);
    if (address?.pinCode) parts.push(`- ${address?.pinCode}`);
    if (address?.country) parts.push(address?.country);

    let formatted = parts.join(", ");

    if (address?.landmark) {
      formatted += `. Landmark: ${address?.landmark}`;
    }

    if (address?.addressType) {
      formatted += ` (${address?.addressType})`;
    }

    return formatted;
  };

  const HandleDeleteAddress = async () => {
    if (!selectedAddress) {
      return toast.error("can not delete this address");
    }
    await deleteAddress(selectedAddress._id);
    setSelectedAddress(null);
    setShowDeleteAddress(false);
  };

  const handleEditClick = (addr) => {
    setSelectedAddress(addr);
    setAddress({
      roomNo: addr.roomNo || "",
      street: addr.street || "",
      city: addr.city || "",
      state: addr.state || "",
      pinCode: addr.pinCode || "",
      country: addr.country || "",
      landmark: addr.landmark || "",
      addressType: addr.addressType || "Home",
      isDefault: addr.isDefault || false,
    });
    setShowUpdateAddress(true);
    setShowAddAddress(true);
  };


  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();
          console.log({data});

          if (data && data.address) {
            const addr = data.address;
            
            
            setAddress((prev) => ({
              ...prev,
              street: addr.road || "",
              city: addr.city || addr.town || addr.village || "",
              state: addr.state || "",
              pinCode: addr.postcode || "",
              country: addr.country || "",
              landmark: addr.neighbourhood || addr.suburb || "",
            }));
            toast.success("Address autofilled from location!");
          }
        } catch (err) {
          toast.error("Failed to fetch address from location");
        }
      },
      (err) => {
        toast.error("Unable to get your location");
      }
    );
  };
  

  return (
    <div className="h-full w-full px-5 py-3 bg-black/20 dark:bg-black/35 rounded-md">
      <h1 className="flex items-center justify-center dark:text-green-500 text-xl md:text-2xl font-bold ">
        Your Address
      </h1>
      {addresses.length < 1 && (
        <div className="text-md dark:text-green-500 font-semibold flex items-center justify-center mt-5">
          No Address added yet!!
        </div>
      )}

      {addresses.length > 0 &&
        addresses.map((item, idx) => (
          <div
            key={idx}
            className={`w-full mt-5 flex items-center justify-start md:px-5 py-2 md:py-3 ${
              item?.isDefault
                ? "bg-white/60 dark:bg-black/70 border-[2.5px]"
                : "bg-white/90 dark:bg-black/20 border-[0.5px]"
            } rounded-md  border-black/30 dark:border-green-400 shadow-md dark:text-gray-300`}
          >
            <div className="w-full flex-4/5 sm:flex-3/4 px-3 ">
              {formatAddress(item)}
            </div>
            <div className="flex-1/5 sm:flex-1/4 flex  flex-wrap items-center md:justify-end  gap-6">
              <div>
                <Pencil
                  className="size-5 text-green-400"
                  onClick={() => handleEditClick(item)}
                />
              </div>
              <div>
                <Trash2
                  className="size-5 text-red-500"
                  onClick={() => {
                    setShowDeleteAddress(true);
                    setSelectedAddress(item);
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      <Button
        onClick={() => setShowAddAddress(true)}
        className={`${
          theme === "dark"
            ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:bg-gradient-to-br focus:ring-green-300 dark:focus:ring-green-800"
            : "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white hover:bg-gradient-to-br focus:ring-blue-300 dark:focus:ring-blue-800"
        } mt-5`}
      >
        Add Address
      </Button>

      {showAddAddress && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 overflow-y-scroll scrollbar-hide">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md"
          >
            {/* <p className="text-gray-600 dark:text-gray-300 mt-2"></p> */}
            <div className="flex flex-col px-5 md:px-10  items-center justify-center w-full dark:bg-black/30 bg-black/10 py-5 rounded-md ">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center justify-center">
                {showUpdateAddress ? "Update" : "Add"} Address
              </h2>
              <div className="mt-5 w-full">
                <Input
                  icon={Bed}
                  type="text"
                  placeholder="Room No."
                  value={address.roomNo}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, roomNo: e.target.value }));
                  }}
                />
              </div>
              <div className="w-full">
                <Input
                  icon={Route}
                  type="text"
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, street: e.target.value }));
                  }}
                />
              </div>
              <div className="w-full">
                <Input
                  icon={Building}
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, city: e.target.value }));
                  }}
                />
              </div>
              <div className="w-full">
                <Input
                  icon={Map}
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => {
                    setAddress((prev) => ({ ...prev, state: e.target.value }));
                  }}
                />
              </div>
              <div className="w-full">
                <Input
                  icon={Mail}
                  type="text"
                  placeholder="PinCode"
                  value={address.pinCode}
                  onChange={(e) => {
                    setAddress((prev) => ({
                      ...prev,
                      pinCode: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="w-full">
                <Input
                  icon={Globe}
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => {
                    setAddress((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }));
                  }}
                />
              </div>
              <div className="w-full">
                <Input
                  icon={Route}
                  type="text"
                  placeholder="Landmark"
                  value={address.landmark}
                  onChange={(e) => {
                    setAddress((prev) => ({
                      ...prev,
                      landmark: e.target.value,
                    }));
                  }}
                />
              </div>

              <div className="w-full  relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Home
                    className={`size-5 ${
                      theme === "dark" ? "text-green-500" : "text-blue-600"
                    }`}
                  />
                </div>
                <select
                  value={address.addressType}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      addressType: e.target.value,
                    }))
                  }
                  id="underline_select"
                  className={`block w-full pl-10 py-2 text-sm border rounded-md focus:ring-2 transition-all duration-200
      ${
        theme === "dark"
          ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white"
          : "bg-gray-300 border-blue-700 focus:ring-blue-500 text-black/80"
      }`}
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="flex w-full justify-center gap-3 mt-5">
                <div>
                  <Checkbox
                    checked={address.isDefault}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                  />
                </div>
                <div className="mt-1">
                  <p className="text-sm dark:text-green-400 font-bold">
                    Make this my default address
                  </p>
                </div>
              </div>
              <div>
                <Button
                  onClick={handleUseCurrentLocation}
                  className="bg-gradient-to-r mt-2 from-cyan-500 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-cyan-300 dark:focus:ring-cyan-800 flex gap-2"
                >
                 <LocateFixed/><span>Use Current Location</span>
                </Button>
              </div>

              <div className="flex w-full justify-between gap-3 mt-5">
                <button
                  onClick={() => {
                    setShowAddAddress(false);
                    setShowUpdateAddress(false);
                    setSelectedAddress(null);
                    setAddress({
                      roomNo: "",
                      street: "",
                      city: "",
                      state: "",
                      pinCode: "",
                      country: "",
                      landmark: "",
                      addressType: "Home",
                      isDefault: false,
                    });
                  }}
                  className="px-4 py-2 flex-1/2 rounded-xl bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-black dark:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={HandleSubmitAddress}
                  className="relative flex-1/2 flex items-center justify-center p-0.5  me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800"
                >
                  <span className="relative w-full px-5 py-2 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-transparent group-hover:dark:bg-transparent ">
                    {showUpdateAddress ? "Update" : "Add"}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {showDeleteAddress && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Confirm Delete
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Are you sure you want to delete{" "}
              <b>{formatAddress(selectedAddress)}</b> this Address?
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setShowDeleteAddress(false);
                  setSelectedAddress(null);
                }}
                className="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-black dark:text-white"
              >
                Cancel
              </button>
              <button
                onClick={HandleDeleteAddress}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ManageAddress;
