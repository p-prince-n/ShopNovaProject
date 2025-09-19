import {useEffect, useState} from 'react';
import { useAuthStore } from '../../Store/authStore';
import ProductGrid from '../Home/ProductCard';
import { useNavigate } from 'react-router-dom';

const MyWishList = () => {
  const { wishlist, error, isLoading, getWishlist, user, toggleWishlist: toggleWishlistAPI } = useAuthStore();
  const navigate = useNavigate();
  const [wishlistedProducts, setWishlistedProducts] = useState({});

  useEffect(() => {
    getWishlist();
  }, [getWishlist, toggleWishlistAPI]);

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

    // optimistic UI
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

  // Filter wishlist products based on wishlistedProducts
  const filteredWishlist = wishlist.filter((product) => wishlistedProducts[product._id]);

  return (
    <div className="md:px-5 w-full flex items-center justify-center flex-col">
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
  );
};



export default MyWishList;
