import { useState, useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { Button } from "flowbite-react";
import { useOrderStore } from "../../Store/useOrderStore";
import toast from "react-hot-toast";
import LoaderAnimation from "../LoaderAnimation";
import VerifyCodeDelivery from "./VerifyCodeDelivery";

const DeliveryProductDetailsPage = ({
  item,
  order,
  HandleBackButton,
  deliver = false,
  ship = false,
  verify = false,
}) => {
  const {
    fetchDeliveryUnassignedOrders,
    deliveryManAcceptShippedOrder,
  } = useOrderStore();
  const [selectedImage, setSelectedImage] = useState(item.product.images[0]);
  const [fullSizeImage, setFullSizeImage] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCategoriesString = (categories) => {
    let category = "";
    categories?.forEach((cat) => (category += cat.name + ", "));
    return category.slice(0, category.length - 2);
  };

  const getIngredientsString = (ingredients) => {
    let ing = "";
    ingredients?.forEach((ingItem) => (ing += ingItem + ", "));
    return ing.slice(0, ing.length - 2);
  };

  const getAttribute = (product) => {
    return (
      product?.attributes?.map((attr) => {
        if ("key" in attr && "value" in attr) return attr;
        const key = Object.keys(attr)[0];
        const value = attr[key];
        return { key, value };
      }) || []
    );
  };

  const handleAcceptProduct = async () => {
    setLoading(true);
    try {
      const response = await deliveryManAcceptShippedOrder(
        order._id,
        item.product._id
      );
      toast.success(`OTP sent to user: ${response.otp}`);
      fetchDeliveryUnassignedOrders();
      HandleBackButton();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err.message ||
          "Failed to accept product"
      );
    } finally {
      setLoading(false);
    }
  };

  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  
  console.log({item});
  return (
    <div className="bg-transparent w-full min-h-screen flex flex-col items-center  relative overflow-y-scroll scrollbar-hide">
      <div className={`${fullSizeImage ? "backdrop-blur-md" : ""} `}>
        <div className="w-full flex flex-col gap-2 ">
          <div className="w-full flex flex-col  2xl:flex-row items-center gap-2 md:gap-5 ">
            {/* Thumbnails and main image */}
            <div
              className={`flex-2/5 py-5 bg-transparent/30    bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl  overflow-hidden `}
            >
              <div className="w-full flex flex-col-reverse md:flex-row gap-2 md:px-2 border-[0.5px] py-5 rounded-md shadow-2xl bg-white/10  ">
                <div className="flex-1/5 py-2">
                  <div className="px-1 md:px-5 flex items-center justify-center flex-row md:flex-col md:gap-3">
                    {item.product?.images?.map((item, idx) => (
                      <div
                        key={idx}
                        className={`w-12 h-12 py-2 px-2 ${
                          selectedImage === item &&
                          "border-[2px] border-amber-50 rounded-md"
                        } flex items-center justify-center object-contain`}
                      >
                        <img
                          onClick={() => setSelectedImage(item)}
                          src={item}
                          className="size-10 w-12  rounded-md cursor-pointer"
                          alt={`thumbnail-${idx}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-4/5 flex flex-col items-center flex-wrap justify-center gap-10 w-full">
                  <div className="w-full flex items-center justify-center md:border-1 rounded-md p-5">
                    <img
                      onClick={() => setFullSizeImage(true)}
                      src={selectedImage}
                      className="size-70 md:size-50 rounded-md object-contain cursor-pointer"
                      alt="selected product"
                    />
                  </div>
                </div>
              </div>
              <div className=" flex flex-col gap-5 mt-5 border-[0.5px] px-4 py-5 rounded-md shadow-xl">
                <h1 className="text-xl lg:text-2xl font-bold text-amber-700 dark:text-green-400 flex items-center justify-center mb-1">
                  User Details
                </h1>
                <div className="flex flex-col ">
                  <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                    Order By :
                  </h3>
                  <div className="pl-5">
                    <div className="flex gap-5 ">
                      <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                        Name :
                      </h3>
                      <h3 className="text-base lg:text-lg text-black/50 dark:text-green-300">
                        {order.user.name}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-1 mb-1 ">
                      <h3 className="text-sm lg:text-lg  text-blue-500 dark:text-white">
                        Email :
                      </h3>
                      <h3 className=" pl-2 text-sm lg:text-lg text-black/50 dark:text-green-300 lg:mt-1">
                        {order.user.email}
                      </h3>
                    </div>
                    <div className="flex flex-col gap-1 lg:gap-5 ">
                      <h3 className="text-sm lg:text-lg text-blue-500 dark:text-white">
                        Mobile Number :
                      </h3>
                      <h3 className="pl-2 text-sm lg:text-lg text-black/50 dark:text-green-300">
                        {order.user.mobileNumber}
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col  ">
                  <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                    Order Details :
                  </h3>
                  <div className="pl-5">
                    <div className="flex gap-5 ">
                      <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                        No. of Qty :
                      </h3>
                      <h3 className="text-base lg:text-lg text-black/50 dark:text-green-300">
                        {item.quantity}
                      </h3>
                    </div>
                    {item.size && (
                      <div className="flex gap-5 ">
                        <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                          Selected Size :
                        </h3>
                        <h3 className="text-base lg:text-lg text-black/50 dark:text-green-300">
                          {item.size}
                        </h3>
                      </div>
                    )}
                    <div className="flex gap-5 ">
                      <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                        Actual Price :
                      </h3>
                      <h3 className="text-base lg:text-lg line-through text-red-500 font-bold">
                        {item.price}rs
                      </h3>
                    </div>
                    <div className="flex gap-5 ">
                      <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                        Discount Price :
                      </h3>
                      <h3 className="text-base lg:text-lg text-black/50 dark:text-green-300 font-bold">
                        {item.discountPrice}rs
                      </h3>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col ">
                  <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                    Address :
                  </h3>
                  <h3 className="text-base lg:text-lg text-black/50 dark:text-green-300 pl-5">
                    <span className="text-sm">
                      {order.shippingAddress.roomNo},{" "}
                      {order.shippingAddress.street},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.state},{" "}
                      {order.shippingAddress.pinCode},{" "}
                      {order.shippingAddress.country}
                      {order.shippingAddress.landmark
                        ? `, Landmark: ${order.shippingAddress.landmark}`
                        : ""}
                    </span>
                  </h3>
                </div>
              </div>
            </div>

            <div className="flex-3/5 md:h-[calc(100vh-8rem)] overflow-y-scroll scrollbar-hide bg-white/5 dark:bg-black/20 backdrop-blur-2xl py-5 rounded-md border-[0.5px] shadow-2xl">
              <div className="w-full h-full p-5">
                <h1 className="text-xl lg:text-2xl font-bold text-amber-700 dark:text-green-400 flex items-center justify-center mb-4">
                  {item.product?.name}
                </h1>

                <div className="flex items-center justify-center ">
                  <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                    {item.product?.description}
                  </h3>
                </div>

                <div className="flex items-center justify-start mt-3 md:px-2">
                  <h3 className="text-xs lg:text-sm bg-green-800 px-3 py-2 rounded-md border-[0.5px] text-white flex gap-1">
                    <span className="block">{item.product.ratings}</span>{" "}
                    <span className="block mt-[1px] ">
                      <AiFillStar className="size-4" />
                    </span>
                  </h3>
                </div>

                <div className="flex mt-3 flex-col md:flex-row md:items-center md:justify-between md:px-2 md:mt-5 ">
                  <div className="flex flex-col ">
                    <h3 className="text-base lg:text-lg text-blue-500 dark:text-white">
                      Categories :
                    </h3>
                    <h3 className="text-base lg:text-lg text-black/50 dark:text-green-300">
                      {getCategoriesString(item.product?.categories)}
                    </h3>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-center">
                    <h3 className="text-base lg:text-lg text-shadow-yellow-500 dark:text-yellow-300 font-bold ">
                      {item.product?.stockQuantity < 10 &&
                        item.product?.stockQuantity > 0 &&
                        "Few In Stock"}
                    </h3>
                    <h3 className="text-base lg:text-lg text-black/50 dark:text-green-300 ">
                      <span className="text-base lg:text-lg text-blue-500 dark:text-white">
                        {item.product?.stockQuantity < 1
                          ? "Out of Stock"
                          : "In Stock"}{" "}
                      </span>
                      : {item.product?.stockQuantity}
                    </h3>
                  </div>
                </div>

                <div className="flex mt-3 flex-col md:flex-row md:items-center justify-start md:justify-between md:px-2 ">
                  {item.product?.ingredients?.length !== 0 && (
                    <div className="flex flex-col  md:mt-5 ">
                      <h3 className="text-base lg:text-lg text-blue-500 dark:text-white ">
                        Ingredients:
                      </h3>
                      <h3 className="text-base lg:text-lg text-black/50 dark:text-green-300 ">
                        {getIngredientsString(item.product?.ingredients)}
                      </h3>
                    </div>
                  )}
                  <div className="mt-3 md:mt-0">
                    <h3 className="text-base lg:text-lg text-blue-500 dark:text-white ">
                      Brand:
                    </h3>
                    <h3 className="text-base lg:text-lg text-black/50 dark:text-green-300 ">
                      {item.product?.brand}
                    </h3>
                  </div>
                </div>

                <div className="flex mt-3 flex-col md:pl-2 md:mt-5 ">
                  <div>
                    <p className="text-sm text-blue-500 dark:text-white font-bold">
                      Special Offer
                    </p>
                  </div>
                  <div className="flex items-baseline-last justify-start  gap-5">
                    <h3 className="text-lg lg:text-xl text-green-400 font-bold">
                      {item.discountPrice}rs
                    </h3>
                    <h5 className="text-sm lg:text-base text-red-500 font-semibold line-through">
                      {item.product?.price}rs
                    </h5>
                    <p className="text-xs lg:text-sm text-yellow-300 ">
                      {item.product?.discount}% off
                    </p>
                  </div>
                </div>

                <div className="flex mt-3  flex-col items-center justify-center md:mt-5md:px-2 ">
                  <h2 className="text-xl lg:text-2xl font-bold text-amber-700 dark:text-green-400 flex items-center justify-center ">
                    Features
                  </h2>

                  {item.product?.attributes &&
                    getAttribute(item.product).map((i, idx) => (
                      <div
                        className={`flex flex-col gap-3 w-full mt-5 ${
                          item.product?.attributes.length - 1 === idx && "mb-4"
                        }`}
                        key={idx}
                      >
                        <div className="flex items-center gap-5 justify-between w-full px-3 md:px-6">
                          <h2 className="text-sm md:text-base font-semibold text-black/50 dark:text-green-400 flex-1/2">
                            {i.key}
                          </h2>
                          <h2 className="text-sm md:text-base font-semibold text-black/50 dark:text-green-400 flex justify-end md:justify-start  flex-1/2">
                            {typeof i.value === "boolean"
                              ? i.value
                                ? "Yes"
                                : "No"
                              : i.value}
                          </h2>
                        </div>
                        {item.product?.attributes.length - 1 !== idx && (
                          <div className="w-full h-[1px] bg-blue-200 dark:bg-green-500  "></div>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
          {!verify && (
            <div className="flex items-center justify-center w-full mt-5">
              <Button
                onClick={handleAcceptProduct}
                disabled={loading}
                className="bg-gradient-to-br w-full from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                {loading ? <LoaderAnimation /> : "Accept Product"}
              </Button>
            </div>
          )}
          {verify && (
            <div className="flex items-center justify-center w-full mt-5">
              <Button
                onClick={()=>setIsVerifyOpen(true)}
                disabled={loading}
                className="bg-gradient-to-br w-full from-purple-600 to-blue-500 text-white hover:bg-gradient-to-bl focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                {loading ? <LoaderAnimation /> : "Verify By Code"}
              </Button>
            </div>
          )}

          {isVerifyOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/10">
              <div className="relative">
                <button
                  onClick={() => setIsVerifyOpen(false)}
                  className="absolute top-2 right-2 text-white text-2xl z-50"
                >
                  ×
                </button>
                <VerifyCodeDelivery
                  orderId={order._id}
                  productId={item.product._id}
                  setIsOpen={setIsVerifyOpen}
                  isOpen={isVerifyOpen}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {fullSizeImage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm"></div>
          <button
            onClick={() => setFullSizeImage(false)}
            className="absolute top-5 right-5 text-white text-3xl font-bold z-50 hover:text-gray-300"
          >
            ×
          </button>
          <img
            src={selectedImage}
            className="max-h-[90%] max-w-[90%] md:min-h-[30%] md:min-w-[30%] rounded-md object-contain shadow-lg z-50"
            alt="full size"
          />
        </div>
      )}
    </div>
  );
};

export default DeliveryProductDetailsPage;
