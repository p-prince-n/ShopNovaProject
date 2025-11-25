import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProductStore } from "../../Store/useProductStore";
import { useAuthStore } from "../../Store/authStore";
import { PiShoppingCartThin } from "react-icons/pi";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { motion } from "framer-motion";
import { useThemeStore } from "../../Store/useThemeStore";
import LoaderAnimation from "../../components/LoaderAnimation";
import ProductGrid from "../../components/Home/ProductCard";
import CommentsList from "../../components/CommentList";
import { toast } from "react-hot-toast";
import { useCartStore } from "../../Store/useCartStore";
import CheckoutModal from "./CheckOutModel";

const ProductDetail = () => {
  const { theme } = useThemeStore();
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    addToCart,
    removeFromCart,
    cart,
    loading: cartLoading,
    error: cartError,
    message,
    getCart,
  } = useCartStore();
  const {
    fetchProductById,
    product,
    rateProduct,
    productsByCategories,
    fetchProductsByCategories,
    loading,
  } = useProductStore();
  const { user, wishlist, toggleWishlist: toggleWishlistAPI } = useAuthStore();

  const [selectedImage, setSelectedImage] = useState("");
  const [fullSizeImage, setFullSizeImage] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [wishlistedProducts, setWishlistedProducts] = useState({});
  const [showProducts, setShowProducts] = useState([]);


  useEffect(() => {
    fetchProductById(id).then((prod) => {
      if (prod?.userRatings?.length > 0 && user) {
        const myRating = prod.userRatings.find((r) => r.userId === user._id);
        if (myRating) {
          setUserRating(myRating.rating);
        } else {
          setUserRating(0);
        }
      } else {
        setUserRating(0);
      }
    });
  }, [fetchProductById, id, user]);

  useEffect(() => {
    if (product?.images?.length > 0) setSelectedImage(product.images[0]);
  }, [product]);

  const handleRating = async (newRating) => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    setUserRating(newRating);
    const res = await rateProduct(product._id, newRating);
    if (!res.success) {
      console.error("Failed to update rating:", res.error);
    }
  };

  const price = product?.price;
  const discount = product?.discount;
  const discountPrice = (price - (price * discount) / 100).toFixed(0);

  const getCategoriesString = (categories) => {
    let category = "";
    categories?.map((item) => (category += item.name + ", "));
    return category.slice(0, category.length - 2);
  };

  const getIngredientsString = (ingredients) => {
    let ingedient = "";
    ingredients?.map((item) => (ingedient += item + ", "));
    return ingedient.slice(0, ingedient.length - 2);
  };

  const getAttribute = (product) => {
    return (
      product?.attributes?.map((attr) => {
        if ("key" in attr && "value" in attr) {
          return attr;
        } else {
          const key = Object.keys(attr)[0];
          const value = attr[key];
          return { key, value };
        }
      }) || []
    );
  };

  useEffect(() => {
    fetchProductsByCategories(product?.categories.map((item) => item._id));
  }, [product]);

  useEffect(() => {
    if (user?.wishlist) {
      const initialWishlist = {};
      user.wishlist.forEach((id) => (initialWishlist[id] = true));
      setWishlistedProducts(initialWishlist);
    }
  }, [user]);

  const toggleWishlist = async (id) => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    setWishlistedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    try {
      await toggleWishlistAPI(id);
    } catch (error) {
      setWishlistedProducts((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  useEffect(() => {
    if (productsByCategories?.length > 0)
      setShowProducts(productsByCategories.slice(0, 6));
  }, [productsByCategories]);

  const handleShowMoreClick = () => {
    setShowProducts((prev) => [
      ...prev,
      ...productsByCategories?.slice(prev.length, prev.length + 12),
    ]);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);












  const getAveragerating = () => {
  if (!product?.ratings) return "0.0";
  return Number(product.ratings).toFixed(1);
};


  const isInCart = cart?.items?.some((item) => {
    const itemProductId =
      typeof item.product === "object" ? item.product._id : item.product;


    if (product?.size?.length > 0) {
      return itemProductId === product?._id && item.size === selectedSize;
    }


    return itemProductId === product?._id;
  });


  const handleCartAction = async () => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    if (!selectedSize && product?.size?.length > 0) {
      toast.error("Please select a size first");
      return;
    }

    try {
      if (isInCart) {
        await removeFromCart(product._id, selectedSize);
        toast.error("Removed from cart");
      } else {
        await addToCart(product._id, selectedSize, 1);
        toast.success("Added to cart");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Cart action failed");
    }
  };

  useEffect(() => {
    getCart();
  }, []);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutItem, setCheckoutItem] = useState(null);

  const handleBuyNow = () => {
    if (!user) {
      navigate("/sign-in");
      return;
    }

    if (!selectedSize && product?.size?.length > 0) {
      toast.error("Please select a size first");
      return;
    }


    

  setCheckoutItem([{
    product, quantity:1, size: selectedSize, discountPrice, price: product.price
  }]);
  setShowCheckout(true);
  };

  return (
    <div className="bg-transparent min-w-screen flex flex-col items-center min-h-screen relative overflow-y-scroll scrollbar-hide">
      <div
        className={`${
          fullSizeImage ? "backdrop-blur-md" : ""
        } absolute top-28 w-full px-5 md:px-10 2xl:px-50`}
      >
        <div className="w-full flex flex-col gap-2 md:gap-5 xl:gap-10">
          <div className="w-full flex flex-col xl:flex-row gap-2 md:gap-5 xl:gap-10">
            {/* Thumbnails and main image */}
            <div
              className={`flex-2/5 py-5 bg-transparent/30    bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl  overflow-hidden `}
            >
              <div className="w-full flex flex-col-reverse md:flex-row gap-2 md:px-2 border-[0.5px] py-5 rounded-md shadow-2xl bg-white/10  ">
                <div className="flex-1/5 py-2">
                  <div className="px-1 md:px-5 flex items-center justify-center flex-row md:flex-col md:gap-3">
                    {product?.images?.map((item, idx) => (
                      <div
                        key={idx}
                        className={`w-20 h-22 py-2 px-2 ${
                          selectedImage === item &&
                          "border-[2px] border-amber-50 rounded-md"
                        } flex items-center justify-center object-contain`}
                      >
                        <img
                          onClick={() => setSelectedImage(item)}
                          src={item}
                          className="size-18 rounded-md cursor-pointer"
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
                      className="size-70 md:size-100 rounded-md object-contain cursor-pointer"
                      alt="selected product"
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="hidden w-full md:flex items-center justify-center gap-5">
                    <button
                      type="button"
                      disabled={cartLoading}
                      onClick={handleCartAction}
                      className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl 
                     focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 
                     font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                    >
                      <div className="flex items-center justify-center gap-5">
                        <PiShoppingCartThin className="size-7" />
                        <span>
                          {cartLoading
                            ? "Processing..."
                            : isInCart
                            ? "Remove from Cart"
                            : "Add to Cart"}
                        </span>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                    >
                      <div className="flex items-center justify-center gap-5">
                        <PiShoppingCartThin className="size-7" />
                        <span>Buy Now</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product info */}
            <div className="flex-3/5  md:h-[calc(100vh-8rem)] overflow-y-scroll scrollbar-hide bg-white/5 dark:bg-black/20 backdrop-blur-2xl py-5 rounded-md border-[0.5px] shadow-2xl">
              <div className="w-full h-full p-5">
                <h1 className="text-2xl lg:text-3xl font-bold text-amber-700 dark:text-green-400 flex items-center justify-center mb-4">
                  {product?.name}
                </h1>

                {/* ⭐ Interactive Star Rating */}
                <div className="flex items-center justify-center mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => handleRating(star)}
                      className="cursor-pointer"
                    >
                      {star <= userRating ? (
                        <AiFillStar className="text-yellow-400 size-8" />
                      ) : (
                        <AiOutlineStar className="text-yellow-400 size-8" />
                      )}
                    </span>
                  ))}
                  <span className="ml-2 text-yellow-400 dark:text-yellow-200">
                    ({product?.ratingsCount || 0} ratings)
                  </span>
                </div>
                <div className="flex items-center justify-center ">
                  <h3 className="text-lg lg:text-xl text-blue-500 dark:text-white ">
                    {product?.description}
                  </h3>
                </div>
                <div className="flex items-center justify-start mt-3 md:px-20">
                  <h3 className="text-sm lg:text-md bg-green-800 px-3 py-2 rounded-md border-[0.5px] text-white flex gap-1">
                    <span className="block">{getAveragerating()}</span>{" "}
                    <span className="block mt-[1px] ">
                      {" "}
                      <AiFillStar className="size-4" />
                    </span>
                  </h3>
                </div>
                <div className="flex mt-3 flex-col md:flex-row md:items-center md:justify-between md:px-20 md:mt-5 ">
                  <div className="flex flex-col ">
                    <h3 className="text-lg lg:text-xl text-blue-500 dark:text-white">
                      Categories :
                    </h3>
                    <h3 className="text-lg lg:text-xl text-white/80 dark:text-green-300">
                      {getCategoriesString(product?.categories)}
                    </h3>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-center">
                    <h3 className="text-lg lg:text-xl text-shadow-yellow-500 dark:text-yellow-300 font-bold ">
                      {product?.stockQuantity < 10 &&
                        product?.stockQuantity > 0 &&
                        "Few In Stock"}
                    </h3>
                    <h3 className="text-lg lg:text-xl text-white/80 dark:text-green-300 ">
                      <span className="text-lg lg:text-xl text-blue-500 dark:text-white">
                        {product?.stockQuantity < 1
                          ? "Out of Stock"
                          : "In Stock"}{" "}
                      </span>
                      : {product?.stockQuantity}
                    </h3>
                  </div>
                </div>
                <div className="flex mt-3 flex-col md:flex-row md:items-center justify-start md:justify-between md:px-20 ">
                  {product?.ingredients.length !== 0 && (
                    <div className="flex flex-col  md:mt-5 ">
                      <h3 className="text-lg lg:text-xl text-blue-500 dark:text-white ">
                        Ingredients:
                      </h3>
                      <h3 className="text-lg lg:text-xl text-white/80 dark:text-green-300 ">
                        {getIngredientsString(product?.ingredients)}
                      </h3>
                    </div>
                  )}
                  <div className="mt-3 md:mt-0">
                    <h3 className="text-lg lg:text-xl text-blue-500 dark:text-white ">
                      Brand:
                    </h3>
                    <h3 className="text-lg lg:text-xl text-white/80 dark:text-green-300 ">
                      {product?.brand}
                    </h3>
                  </div>
                </div>
                <div className="flex mt-3 flex-col md:pl-20 md:mt-5 ">
                  <div>
                    <p className="text-md text-blue-500 dark:text-white font-bold">
                      Special Offer
                    </p>
                  </div>
                  <div className="flex items-baseline-last justify-start  gap-5">
                    <h3 className="text-xl lg:text-2xl text-green-400 font-bold">
                      {discountPrice}rs
                    </h3>
                    <h5 className="text-md lg:text-xl text-red-500 font-semibold line-through">
                      {product?.price}rs
                    </h5>
                    <p className="text-sm lg:text-md text-yellow-300 ">
                      {product?.discount}% off
                    </p>
                  </div>
                </div>
                {product?.size.length !== 0 && (
                  <div className="flex items-center justify-Start md:pl-20 mt-5">
                    <div>
                      <h2 className="text-2xl text-white">Sizes</h2>
                      <div className="flex items-center gap-3">
                        {product?.size.map((item, idx) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedSize(item)}
                            className={`${
                              selectedSize === item &&
                              "border-2  flex items-center justify-center border-white/80 rounded-md"
                            } p-1 mt-2`}
                          >
                            <motion.button
                              whileHover={{
                                scale: 1.05,
                                boxShadow: "0px 10px 20px rgba(0,0,0,0.3)",
                                background:
                                  theme === "dark"
                                    ? "linear-gradient(135deg, #166534, #22c55e, #4ade80)"
                                    : "linear-gradient(135deg, #f97316, #f59e0b)",
                              }}
                              whileTap={{
                                scale: 0.9,
                                rotate: -2,
                                boxShadow: "0px 5px 15px rgba(0,0,0,0.5)",
                                background:
                                  theme === "dark"
                                    ? "linear-gradient(135deg, #065f46, #10b981)"
                                    : "linear-gradient(135deg, #f59e0b, #d97706)",
                              }}
                              transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                              }}
                              className={`size-18  rounded-lg shadow-2xl border-2 flex items-center justify-center ${
                                theme === "dark"
                                  ? "border-gray-800 text-white"
                                  : "border-orange-400 text-white bg-orange-500"
                              }`}
                              style={{
                                background: `${
                                  theme === "dark"
                                    ? "linear-gradient(135deg, #065f46, #10b981)"
                                    : "#FF8A4C"
                                }`,
                              }}
                            >
                              <span className="text-xl font-bold">{item}</span>
                            </motion.button>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* <SizeSelector/> */}
                  </div>
                )}
                <div className="flex mt-3  flex-col items-center justify-center md:mt-5 md:px-20 ">
                  <h2 className="text-2xl lg:text-3xl font-bold text-amber-700 dark:text-green-400 flex items-center justify-center ">
                    Features
                  </h2>

                  {product?.attributes &&
                    getAttribute(product).map((item, idx) => (
                      <div
                        className={`flex flex-col gap-3 w-full mt-5 ${
                          product?.attributes.length - 1 === idx && "mb-4"
                        }`}
                        key={idx}
                      >
                        <div className="flex items-center gap-5 justify-between w-full px-3 md:px-6">
                          <h2 className="text-md md:text-xl font-semibold text-white/80 dark:text-green-400 flex-1/2">
                            {item.key}
                          </h2>
                          <h2 className="text-md md:text-xl font-semibold text-white/80 dark:text-green-400 flex justify-end md:justify-start  flex-1/2">
                            {typeof item.value === "boolean"
                              ? item.value
                                ? "Yes"
                                : "No"
                              : item.value}
                          </h2>
                        </div>
                        {product?.attributes.length - 1 !== idx && (
                          <div className="w-full h-[1px] bg-blue-200 dark:bg-green-500  "></div>
                        )}
                      </div>
                    ))}
                </div>
                <div className="md:hidden w-full flex flex-col items-center justify-center gap-5 mt-5">
                  <button
                    type="button"
                    disabled={cartLoading}
                    onClick={handleCartAction}
                    className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl 
                     focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 
                     font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                  >
                    <div className="flex items-center justify-center gap-5">
                      <PiShoppingCartThin className="size-7" />
                      <span>
                        {cartLoading
                          ? "Processing..."
                          : isInCart
                          ? "Remove from Cart"
                          : "Add to Cart"}
                      </span>
                    </div>
                  </button>
                  <button
                    type="button"
                    className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center w-full"
                  >
                    <div className="flex items-center justify-center gap-5">
                      <PiShoppingCartThin className="size-7" />
                      <span>Buy Now</span>
                    </div>
                  </button>
                </div>
                <div className="flex flex-col items-center justify-center mt-5">
                  <h1 className="text-lg lg:text-xl font-bold text-amber-700 dark:text-green-400 flex items-center justify-center">
                    Reviwes
                  </h1>
                  <CommentsList productId={product?._id} />
                </div>
              </div>
            </div>
          </div>
          <div
            className={`w-full items-center ${
              loading ? "justify-center" : "justify-start"
            }`}
          >
            {loading && <LoaderAnimation />}
            {!loading && (
              <div className="mt-2">
                <ProductGrid
                  title="Suggested Products"
                  products={showProducts}
                  wishlistedProducts={wishlistedProducts}
                  toggleWishlist={toggleWishlist}
                  showClickMore={handleShowMoreClick}
                  allProducts={productsByCategories}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Fullscreen overlay */}
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
      {showCheckout && checkoutItem && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          selectedItems={checkoutItem}
        />
      )}
    </div>
  );
};

export default ProductDetail;
