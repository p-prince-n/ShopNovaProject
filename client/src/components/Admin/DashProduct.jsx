import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useAuthStore } from "../../Store/authStore";
import ShowAlertBox from "./ShowAlertBox";
import LoaderAnimation from "../LoaderAnimation";
import { motion } from "framer-motion";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useProductStore } from "../../Store/useProductStore";
import { CiSearch } from "react-icons/ci";
import { useThemeStore } from "../../Store/useThemeStore";

const DashProducts = () => {
  const { theme } = useThemeStore();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialSearch = urlParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const productLoading = useProductStore((state) => state.loading);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);
  const deleteProduct = useProductStore((state) => state.deleteProduct);
  const totalProducts = useProductStore((state) => state.totalProducts);
  const getProducts = useProductStore((state) => state.getProducts);
  const searchProducts = useProductStore((state) => state.searchProducts);
  const downloadProductsExcel = useProductStore(
    (state) => state.downloadProductsExcel
  );

  const [showConfirm, setShowConfirm] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  console.log(products.length, totalProducts);



  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(location.search);

      if (search.trim() !== "") {
        params.set("search", search);
        searchProducts(search);
      } else {
        params.delete("search");
        fetchProducts(0);
      }

      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, 500);

    return () => clearTimeout(handler);
  }, [
    search,
    fetchProducts,
    getProducts,
    user?.isAdmin,
    navigate,
    location.pathname,
    location.search,
  ]);


  const handleShowMore = async () => {
    await fetchProducts(products.length);
  };


  const HandleDeleteProduct = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete._id);
      setShowConfirm(false);
    }
  };

  if (productLoading) return <LoaderAnimation />;

  return (
    <div div className="w-full flex flex-col md:px-10 md:items-center ">
      <div className="relative ">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <CiSearch
            className={`size-5 ${
              theme === "dark" ? "text-green-500" : "text-blue-600"
            }`}
          />
        </div>
        <input
          className={`w-full md:w-xs lg:w-xl pl-10 pr-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border transition-all duration-200 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
              : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
          }`}
          type="text"
          placeholder={"Search Products..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className=" py-5 w-full table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {user?.isAdmin && products.length > 0 ? (
          <div className="flex flex-col gap-5   w-full">
           <div className="flex justify-center">
             <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={downloadProductsExcel}
              className="px-4 py-2  bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition-colors text-sm md:text-base self-center md:self-auto md:w-1/2"
            >
              Download Excel
            </motion.button>
           </div>
            <Table hoverable className="shadow-xl">
              <TableHead>
                <TableHeadCell>Date Updated</TableHeadCell>
                <TableHeadCell>Images</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Price</TableHeadCell>
                <TableHeadCell>discount</TableHeadCell>
                <TableHeadCell>stock</TableHeadCell>
                <TableHeadCell>rating</TableHeadCell>
                <TableHeadCell>Update</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {products.map((p) => (
                  <TableRow
                    key={p._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-900"
                  >
                    <TableCell className="whitespace-nowrap">
                      {new Date(p.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="size-10 rounded-full object-cover bg-gray-500"
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {p.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {p.price}$
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {p.discount}%
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {p.stockQuantity}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {p.ratings}/5
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Link
                        to={`/admin?tab=updateProduct&search=${p.name}`}
                        className="font-medium text-teal-500 dark:text-orange-300 hover:underline cursor-pointer"
                      >
                        Edit
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span
                        onClick={() => {
                          setShowConfirm(true);
                          setProductToDelete(p);
                        }}
                        className="font-medium text-red-500 hover:underline cursor-pointer"
                      >
                        Delete
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* ✅ Show More button only if there are more users */}
            {products.length < totalProducts && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-7"
              >
                Show More
              </button>
            )}
          </div>
        ) : (
          <p className="dark:text-green-400">
            {search ? "Product Not found" : "You have no products yet!"}
          </p>
        )}

        {/* ✅ Confirm Delete Modal */}
        {showConfirm && !productLoading && (
          <div className="w-full h-full mt-3 md:mt-5 md:px-3 py-2 md:py-10 bg-gray-300 dark:bg-gray-700 rounded-xl dark:border-gray-300 border-gray-600">
            <div className="flex flex-wrap gap-4 justify-start h-full w-full">
              <ShowAlertBox
                data={productToDelete}
                product={true}
                showConfirm={() => setShowConfirm(false)}
                handleDelete={HandleDeleteProduct}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashProducts;
