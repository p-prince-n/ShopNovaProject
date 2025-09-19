import { useProductStore } from "../../../Store/useProductStore";
import Search from "../Search";
import ProductCard from "./Productcard";
import { useEffect } from "react";
import AdminPageTitle from "../AdminPageTitle";
import LoaderAnimation from "../../LoaderAnimation";
import { useAuthStore } from "../../../Store/authStore";

const DeleteProduct = () => {
  const { products, loading, fetchProducts } = useProductStore();
    useEffect(() => {
      fetchProducts();
    }, [fetchProducts]);
    console.log(products);
    
  

  return (
    <>
      {/* List View */}
      <div
        className={` border-1 flex flex-col gap-2 w-full p-3 mt-6 rounded-xl shadow-2xl bg-gray-200 dark:bg-gray-900`}
      >
        <AdminPageTitle operation={"Delete"} data={"Product"} />

        <div className="w-full flex items-center justify-center mt-2 md:mt-5">
          <Search product={true} />
        </div>

        {loading && (
          <LoaderAnimation/>
        )}

        {!loading && (
          <div className="w-full h-full mt-3 md:mt-5 md:px-3 py-2 md:py-10 bg-gray-300 dark:bg-gray-700 rounded-xl dark:border-gray-300 border-gray-600">
            {products.length < 1 && (
              <div className="flex justify-center mt-3">
                <h2 className="text-red-600 font-semibold text-md md:text-xl">
                  No Products Found
                </h2>
              </div>
            )}
            <div className="flex flex-wrap  gap-4 justify-start  h-full w-full px-2  ">
              {products.map((product, idx) => (
                <div className="w-18 md:w-40" key={idx}>
                  <ProductCard product={product} update={false} />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* </div> */}

        {/* <div className="flex flex-wrap gap-4 justify-start h-full mt-5 w-full px-2 ">
          {
            products.map((product, idx)=>(<div className="w-full h-full" key={idx}><ProductCard product={product} update={true} /></div>))
          }
          
        </div> */}
      </div>
    </>
  );
};

export default DeleteProduct;
