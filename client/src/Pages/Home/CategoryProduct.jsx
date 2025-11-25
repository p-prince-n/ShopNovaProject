import TopCardGroup from "../../components/Home/TopCard";
import { useCategoryStore } from "../../Store/useCategoryStore";
import { useEffect, useState } from "react";
import { useThemeStore } from "../../Store/useThemeStore";
import { useParams } from "react-router-dom";
import { useProductStore } from "../../Store/useProductStore";
import { useAuthStore } from "../../Store/authStore";
import ProductGrid from "../../components/Home/ProductCard";
import LoaderAnimation from "../../components/LoaderAnimation";

const CategoryProduct = () => {
  const { theme } = useThemeStore();

  const { id } = useParams();
  const { user, toggleWishlist: toggleWishlistAPI } = useAuthStore();
    const [wishlistedProducts, setWishlistedProducts] = useState({});
  const {
    categories,
    totalCategories,
    loading: categoryLoading,
    error: categoryError,
    getRootCategories,
  } = useCategoryStore();

  const {getProductByCategoriesId, productsByCategories, loading:productLoading}=useProductStore();
   const [showProducts, setShowProducts] = useState([]);
   

  useEffect(() => {
   getProductByCategoriesId(id)
    
  }, [id, getProductByCategoriesId])


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
      if (productsByCategories.length > 0) setShowProducts(productsByCategories.slice(0, 12));
    }, [productsByCategories]);

  const handleShowMoreClick = () => {
    setShowProducts((prev) => [
      ...prev,
      ...productsByCategories.slice(prev.length, prev.length + 12),
    ]);
  };

  

  useEffect(() => {
    getRootCategories();
  }, [getRootCategories]);
  return (
    <div className="bg-transparent min-w-screen  flex flex-col items-center min-h-screen relative overflow-y-scroll scrollbar-hide">
      {/* Categories */}
      <TopCardGroup
        categories={categories}
        categoryLoading={categoryLoading}
        theme={theme}
    currentId={id}
      />
      <div className="absolute w-full top-53 sm:top-56 md:top-63 px-5 sm:px-10 2xl:px-50 flex flex-col gap-5 ">
        {productLoading && <LoaderAnimation/>}
        {!productLoading && <ProductGrid products={showProducts}  wishlistedProducts={wishlistedProducts}
        toggleWishlist={toggleWishlist}   showClickMore={handleShowMoreClick} allProducts={productsByCategories} />}
      </div>
    </div>
  );
};

export default CategoryProduct;
