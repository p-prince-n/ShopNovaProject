import { useLocation } from "react-router-dom";
import { useThemeStore } from "../../Store/useThemeStore";
import { useAuthStore } from "../../Store/authStore";
import { useState, useEffect } from "react";
import ProductGrid from "../../components/Home/ProductCard";

const QrScanProducts = () => {
  const location = useLocation();
  const { theme } = useThemeStore();
  const { user, toggleWishlist: toggleWishlistAPI } = useAuthStore();
  const [wishlistedProducts, setWishlistedProducts] = useState({});
  const { products } = location.state || {};
  const [showProducts, setShowProducts] = useState([]);

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
    if (products.length > 0) setShowProducts(products.slice(0, 12));
  }, [products]);
  const handleShowMoreClick = () => {
    setShowProducts((prev) => [
      ...prev,
      ...products.slice(prev.length, prev.length + 12),
    ]);
  };

  return (
    <div
      div
      className="relative w-full min-h-screen overflow-y-scroll scrollbar-hide"
    >
      <div className="absolute top-20 flex flex-col items-center justify-start w-full md:px-10 py-5 min-h-screen">
        <div
          className={`flex w-full md:w-1/2 items-center justify-center text-xl md:text-3xl dark:text-green-400 font-bold mb-5 ${
            theme === "light"
              ? "bg-white/90 border-1 shadow-xl drop-shadow-2xl/50"
              : "bg-gray-800"
          }   bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl  py-2 border-[0.5px] dark:border-green-500`}
        >
          Scan Products
        </div>
        {products.length>0 ? (
          <div className="w-full">
            <ProductGrid
              title=""
              products={showProducts}
              wishlistedProducts={wishlistedProducts}
              toggleWishlist={toggleWishlist}
              showClickMore={handleShowMoreClick}
              allProducts={products}
            />
          </div>
        ) : (
          <div className="w-full flex items-center justify-center text-lg dark:text-green-400">
            No Product found!!
          </div>
        )}
      </div>
    </div>
  );
};

export default QrScanProducts;
