import { useEffect, useState } from "react";
import { useAuthStore } from "../../Store/authStore";
import LoaderAnimation from "../../components/LoaderAnimation";
import ProductGrid from "../../components/Home/ProductCard";
import { useNavigate } from "react-router-dom";

const Wishlist = () => {
  const { wishlist, error, isLoading, getWishlist, user, toggleWishlist: toggleWishlistAPI } = useAuthStore();
  const navigate = useNavigate();
  const [wishlistedProducts, setWishlistedProducts] = useState({});

  // Fetch wishlist on mount
  useEffect(() => {
    getWishlist();
  }, [getWishlist, toggleWishlistAPI]);

  // Initialize local wishlistedProducts state from user
  useEffect(() => {
    if (user?.wishlist) {
      const initialWishlist = {};
      user.wishlist.forEach((id) => (initialWishlist[id] = true));
      setWishlistedProducts(initialWishlist);
    }
  }, [user]);

  // Toggle wishlist with optimistic UI
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
      // rollback on error
      setWishlistedProducts((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  // Filter products based on wishlistedProducts
  const filteredWishlist = wishlist.filter((product) => wishlistedProducts[product._id]);

  return (
    <div className="bg-transparent min-w-screen flex flex-col items-center min-h-screen relative overflow-y-scroll scrollbar-hide">
      {isLoading && <LoaderAnimation />}
      <div className="absolute top-23 w-full md:px-5 xl:px-50">
        <h1 className="text-xl md:text-2xl xl:text-3xl text-white dark:text-green-400 font-bold mb-5 flex items-center justify-center">
          Your WishList
        </h1>

        <div className={`${filteredWishlist.length === 0 && 'hidden'} w-full`}>
          <ProductGrid
            products={filteredWishlist}
            showHeading={false}
            wishlistedProducts={wishlistedProducts}
            toggleWishlist={toggleWishlist}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
