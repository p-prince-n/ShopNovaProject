
import { motion, AnimatePresence } from "framer-motion";
import { useOrderStore } from "../../Store/useOrderStore";
import { useState, useMemo, useEffect } from "react";
import { useAuthStore } from "../../Store/authStore";
import {
  Bed,
  Route,
  Building,
  Map,
  Mail,
  Globe,
  Home,
  LocateFixed,
} from "lucide-react";
import { Checkbox, Button } from "flowbite-react";
import Input from "../../components/Input";
import { useThemeStore } from "../../Store/useThemeStore";
import { useCartStore } from "../../Store/useCartStore";
import toast from "react-hot-toast";
import { useSpinStore } from "../../Store/useSpinStore";

const CheckoutModal = ({ isOpen, onClose, selectedItems }) => {
  const [couponCode, setCouponCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const { removeMultipleFromCart, cart } = useCartStore();
  const { theme } = useThemeStore();
  const [showSuccess, setShowSuccess] = useState(false);

  const { addresses, getAddresses, addAddress, user } = useAuthStore();
  const { verifiedValue, message, error, verifySpinCode } = useSpinStore();

  const { createOrder, loading } = useOrderStore();

  const [selectedAddress, setSelectedAddress] = useState(null);

  useEffect(() => {
    if (addresses?.length > 0) {
      setSelectedAddress(
        addresses.find((a) => a.isDefault) || addresses[0] || null
      );
    }
  }, [addresses]);

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [step, setStep] = useState(1);
  const [showAddAddress, setShowAddAddress] = useState(false);
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


  const totals = useMemo(() => {
    const totalItems = selectedItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalDiscount = selectedItems.reduce(
      (sum, item) =>
        sum +
        (item.product.price * item.quantity -
          item.discountPrice * item.quantity),
      0
    );
    const totalPrice = selectedItems.reduce(
      (sum, item) => sum + item.discountPrice * item.quantity,
      0
    );
    return { totalItems, totalDiscount, totalPrice };
  }, [selectedItems]);


  const handlePlaceOrder = async () => {
    if (!selectedAddress)
      return toast.error("Please select a shipping address");

    const payload = {
      items: selectedItems.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size || null,
      })),
      shippingAddress: selectedAddress,
      paymentMethod,
      code: couponCode,
    };

    createOrder(payload);

    setShowSuccess(true);
  };

  const handleSuccess = () => {
    removeMultipleFromCart(
      selectedItems.map((item) => ({
        productId: item.product._id,
        size: item.size || null,
      }))
    );
    setShowSuccess(false);
    onClose();
  };


  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await res.json();
        if (data?.address) {
          const addr = data.address;
          setAddress((prev) => ({
            ...prev,
            street: addr.road || "",
            city: addr.city || addr.town || addr.village || "",
            state: addr.state || "",
            pinCode: addr.postcode || "",
            country: addr.country || "",
            landmark: addr.neighbourhood || "",
          }));
        }
      } catch (err) {
        alert("Failed to fetch address from location");
      }
    });
  };

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
      if (!address[field]?.trim())
        return { valid: false, message: `${field} is required` };
    }
    return { valid: true };
  };

  const handleSubmitAddress = async () => {
    const validation = validateAddress();
    if (!validation.valid) return alert(validation.message);
    await addAddress(address);
    setShowAddAddress(false);
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

  useEffect(() => {
    if (!couponCode.trim()) return;

    setIsVerifying(true);
    const timer = setTimeout(async () => {
      const result = await verifySpinCode(couponCode);

      if (result.success) {
        toast.success(`You get ${result.value}% discount `);
      } else {
        toast.error(result.message);
      }

      setIsVerifying(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [couponCode, verifySpinCode]);


  const HandleCoupon = (e) => {
    setCouponCode(e.target.value);
  };

  return (
    <>
      {/* Main Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 flex justify-center items-center z-50 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={onClose}
            ></div>
            <motion.div
              className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-lg text-gray-800 dark:text-gray-200 
                   max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 "
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>

              {/* Title */}
              <h2 className="text-xl font-bold mb-4 dark:text-green-400 text-center">
                {step === 1 ? "Order Summary" : "Payment Options"}
              </h2>

              {/* Step 1: Summary */}
              {step === 1 && (
                <>
                  <div className="max-h-60 overflow-y-auto mb-4">
                    {selectedItems.map((item) => (
                      <div
                        key={item.product._id}
                        className="flex justify-between items-center py-2 border-b dark:border-gray-700"
                      >
                        <div>
                          <p className="font-semibold">{item.product.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty:{" "}
                            <span className="dark:text-green-500 font-bold">
                              {item.quantity}
                            </span>{" "}
                            {item.size && (
                              <>
                                {"| Size :"}{" "}
                                <span className="dark:text-green-400 font-bold">
                                  {item.size}
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold dark:text-green-400">
                            ₹{(item.discountPrice * item.quantity).toFixed(2)}
                          </p>
                          {item.discount > 0 && (
                            <p className="text-sm line-through text-red-700 dark:text-red-500">
                              ₹{(item.price * item.quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t dark:border-gray-700 pt-3 mb-4 space-y-1">
                    <p>
                      Items:{" "}
                      <span className="font-semibold">{totals.totalItems}</span>
                    </p>
                    <p>
                      Discount:{" "}
                      <span className="text-red-500 font-semibold">
                        -₹{totals.totalDiscount.toFixed(2)}
                      </span>
                    </p>
                    <p>
                      Total:{" "}
                      <span className="font-bold dark:text-green-500">
                        ₹{totals.totalPrice.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <div className="relative mt-2">
                    <input
                      value={couponCode}
                      onChange={HandleCoupon}
                      placeholder="Enter Coupon Code"
                      className={`w-full pl-5 pr-10 py-2 focus:ring-2 bg-opacity-50 rounded-lg border transition-all duration-200 ${
                        theme === "dark"
                          ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                          : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
                      }`}
                    />
                    {/* Loader on typing */}
                    {isVerifying && (
                      <span className="absolute right-3 top-2.5 text-sm text-gray-500 animate-pulse">
                        Checking...
                      </span>
                    )}
                    {/* Success or Error */}
                    {!isVerifying && couponCode && (
                      <span
                        className={`absolute right-3 top-2.5 text-sm font-bold ${
                          verifiedValue
                            ? "text-green-500"
                            : error
                            ? "text-red-500"
                            : "text-gray-500"
                        }`}
                      >
                        {verifiedValue ? "✔ Valid" : error ? "❌ Invalid" : ""}
                      </span>
                    )}
                  </div>

                  {/* Addresses */}
                  <div className="mb-4  md:mt-5">
                    <h3 className="font-semibold mb-2">Choose Address</h3>
                    {addresses?.map((addr) => (
                      <label
                        key={addr._id || addr.roomNo}
                        className={`block border rounded-md p-2 mb-2 cursor-pointer ${
                          selectedAddress?._id === addr._id ||
                          selectedAddress?.roomNo === addr.roomNo
                            ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={
                            selectedAddress?._id === addr._id ||
                            selectedAddress?.roomNo === addr.roomNo
                          }
                          onChange={() => setSelectedAddress(addr)}
                          className="mr-2"
                        />
                        <span className="text-sm">
                          {addr.roomNo}, {addr.street}, {addr.city},{" "}
                          {addr.state}, {addr.pinCode}, {addr.country}
                          {addr.landmark
                            ? `, Landmark: ${addr.landmark}`
                            : ""}{" "}
                          ({addr.addressType})
                        </span>
                      </label>
                    ))}
                    <button
                      className="mt-2 text-sm text-blue-500 hover:underline dark:text-blue-400"
                      onClick={() => setShowAddAddress(true)}
                    >
                      + Add new address
                    </button>
                  </div>

                  <button
                    onClick={() => setStep(2)}
                    className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Continue to Payment →
                  </button>
                </>
              )}

              {/* Step 2: Payment */}
              {step === 2 && (
                <>
                  <div className="mb-4">
                    {["COD", "UPI", "Card", "NetBanking", "Wallet"].map(
                      (method) => (
                        <label
                          key={method}
                          className={`block border rounded-md p-2 mb-2 cursor-pointer ${
                            paymentMethod === method
                              ? "border-green-400 bg-green-50 dark:bg-green-900/20"
                              : "border-gray-300 dark:border-gray-600"
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment"
                            checked={paymentMethod === method}
                            onChange={() => setPaymentMethod(method)}
                            className="mr-2"
                          />
                          {method}
                        </label>
                      )
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setStep(1)}
                      className="w-1/2 py-3 bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-600"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => handlePlaceOrder()}
                      disabled={loading}
                      className="w-1/2 py-3 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                    >
                      {loading ? "Placing Order..." : "Place Order"}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Address Modal */}
      <AnimatePresence>
        {showAddAddress && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 ">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md 
                   max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600"
            >
              <div className="flex flex-col px-5 md:px-10 items-center justify-center w-full dark:bg-black/30 bg-black/10 py-5 rounded-md">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white text-center">
                  Add Address
                </h2>
                <div className="mt-5 w-full space-y-2">
                  <Input
                    icon={Bed}
                    type="text"
                    placeholder="Room No."
                    value={address.roomNo}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        roomNo: e.target.value,
                      }))
                    }
                  />
                  <Input
                    icon={Route}
                    type="text"
                    placeholder="Street"
                    value={address.street}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        street: e.target.value,
                      }))
                    }
                  />
                  <Input
                    icon={Building}
                    type="text"
                    placeholder="City"
                    value={address.city}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, city: e.target.value }))
                    }
                  />
                  <Input
                    icon={Map}
                    type="text"
                    placeholder="State"
                    value={address.state}
                    onChange={(e) =>
                      setAddress((prev) => ({ ...prev, state: e.target.value }))
                    }
                  />
                  <Input
                    icon={Mail}
                    type="text"
                    placeholder="PinCode"
                    value={address.pinCode}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        pinCode: e.target.value,
                      }))
                    }
                  />
                  <Input
                    icon={Globe}
                    type="text"
                    placeholder="Country"
                    value={address.country}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                  />
                  <Input
                    icon={Route}
                    type="text"
                    placeholder="Landmark"
                    value={address.landmark}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        landmark: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="w-full mt-2">
                  <select
                    value={address.addressType}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        addressType: e.target.value,
                      }))
                    }
                    className="w-full pl-2 py-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  >
                    <option value="Home">Home</option>
                    <option value="Work">Work</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="flex w-full justify-center gap-3 mt-3 items-center">
                  <Checkbox
                    checked={address.isDefault}
                    onChange={(e) =>
                      setAddress((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                  />
                  <p className="text-sm dark:text-green-400 font-bold">
                    Make this my default address
                  </p>
                </div>
                <div className="flex gap-2 w-full mt-3">
                  <Button
                    onClick={handleUseCurrentLocation}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500"
                  >
                    <LocateFixed /> Use Current Location
                  </Button>
                </div>
                <div className="flex gap-2 w-full mt-3">
                  <button
                    onClick={() => setShowAddAddress(false)}
                    className="flex-1 py-2 rounded-md bg-gray-300 dark:bg-gray-700 text-black dark:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAddress}
                    className="flex-1 py-2 rounded-md bg-green-500 text-white hover:bg-green-600"
                  >
                    Add
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Blurred Background */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

            {/* Centered Popup */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className={`relative z-10 px-6 py-4 rounded-lg shadow-lg text-center ${
                theme === "dark"
                  ? "bg-green-600 text-white"
                  : "bg-green-400 text-white"
              } w-[90%] max-w-sm sm:max-w-md`}
            >
              <motion.span
                initial={{ rotate: -15 }}
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ duration: 0.6 }}
                className="inline-block text-3xl mb-2"
              >
                🎉
              </motion.span>
              <p className="font-bold text-lg mb-3">
                Order Placed Successfully!
              </p>
              <button
                onClick={() => {
                  handleSuccess();
                }}
                className="px-4 py-2 bg-white dark:bg-gray-900 text-green-600 dark:text-green-400 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 font-semibold"
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CheckoutModal;
