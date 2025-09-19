import { useEffect, useState } from "react"
import { useProductStore } from "../../Store/useProductStore"
import ProductGrid from "../Home/ProductCard";
import { useAuthStore } from "../../Store/authStore";
import { useNavigate } from "react-router-dom";
import LoaderAnimation from "../LoaderAnimation";



const MyReviewRating = () => {
  const {products, loading, fetchProductsRatedByMe, reviewedProducts, fetchProductsReviewedByMe} =useProductStore();
  const navigate = useNavigate();
  const { user, toggleWishlist: toggleWishlistAPI } = useAuthStore();
  const [wishlistedProducts, setWishlistedProducts] = useState({});
   const [showProducts, setShowProducts] = useState([]);
    const [showReviewdProducts, setShowReviewdProducts] = useState([]);
  useEffect(()=>{
    fetchProductsRatedByMe();
  }, [fetchProductsRatedByMe])

  useEffect(()=>{
    fetchProductsReviewedByMe();
  }, [fetchProductsReviewedByMe])

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

    // optimistic UI update
    setWishlistedProducts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    try {
      await toggleWishlistAPI(id); // backend update
    } catch (error) {
      // rollback on error
      setWishlistedProducts((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };
  useEffect(() => {
    if (products.length > 0) setShowProducts(products.slice(0, 5));
  }, [products]);
  useEffect(() => {
    if (reviewedProducts.length > 0) setShowReviewdProducts(reviewedProducts.slice(0, 5));
  }, [reviewedProducts]);
  const handleShowMoreClick = () => {
    setShowProducts((prev) => [
      ...prev,
      ...products.slice(prev.length, prev.length + 5),
    ]);
  };
  const handleShowReviewesMoreClick = () => {
    setShowReviewdProducts((prev) => [
      ...prev,
      ...reviewedProducts.slice(prev.length, prev.length + 5),
    ]);
  };
  if(loading){
    return <div className="w-full flex items-center justify-center">
      <LoaderAnimation/>
    </div>
  
  }
  return (
    <div className="w-full px-2 mt-2 flex flex-col gap-5 ">
      {/* your Ratings */}
      <div className="">
        <ProductGrid products={showProducts} title="My Ratings"  wishlistedProducts={wishlistedProducts}
        toggleWishlist={toggleWishlist}   showClickMore={handleShowMoreClick} allProducts={products} />
      </div>
      {/* your Reviews */}
      <div className="border-[0.5px] rounded-4xl  ">
        <ProductGrid products={showReviewdProducts} title="My Reviews"  wishlistedProducts={wishlistedProducts}
        toggleWishlist={toggleWishlist}   showClickMore={handleShowReviewesMoreClick} allProducts={reviewedProducts} />
      </div>

    </div>
  )
}

export default MyReviewRating