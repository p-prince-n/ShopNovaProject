import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useCategoryStore } from "../../Store/useCategoryStore";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useAuthStore } from "../../Store/authStore";
import ShowAlertBox from "./ShowAlertBox";
import LoaderAnimation from "../LoaderAnimation";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { useThemeStore } from "../../Store/useThemeStore";

const DashCategories = () => {
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const initialSearch = urlParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const categoryLoading = useCategoryStore((state) => state.loading);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const categories = useCategoryStore((state) => state.categories);
  const deleteCategory = useCategoryStore((state) => state.deleteCategory);
  const totalCategories = useCategoryStore((state) => state.totalCategories);
  const getCategories = useCategoryStore((state) => state.getCategories);
  const searchCategory = useCategoryStore((state) => state.searchCategory);


  const { theme } = useThemeStore();

  const [showConfirm, setShowConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);




  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(location.search);

      if (search.trim() !== "") {
        params.set("search", search);
        searchCategory(search);
      } else {
        params.delete("search");
        fetchCategories(0);
      }

      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, 500);

    return () => clearTimeout(handler);
  }, [search, fetchCategories,getCategories,user?.isAdmin, navigate, location.pathname, location.search]);


  const handleShowMore = async () => {
    await fetchCategories(categories.length);
  };


  const HandleDeleteCategory = async () => {
    if (categoryToDelete) {
      await deleteCategory(categoryToDelete._id);
      setShowConfirm(false);
    }
  };

  if (categoryLoading) return <LoaderAnimation />;

  return (
    <div div className="w-full flex flex-col md:px-10 md:items-center">
      <div className="relative">
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
          placeholder={"Search Categories..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="md:px-10 py-5 w-full table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
        {user?.isAdmin && categories.length > 0 ? (
          <>
            <Table hoverable className="shadow-xl">
              <TableHead>
                <TableHeadCell>Date Updated</TableHeadCell>
                <TableHeadCell>Images</TableHeadCell>
                <TableHeadCell>Name</TableHeadCell>
                <TableHeadCell>Parent</TableHeadCell>
                <TableHeadCell>Update</TableHeadCell>
                <TableHeadCell>Delete</TableHeadCell>
              </TableHead>
              <TableBody className="divide-y">
                {categories.map((c) => (
                  <TableRow
                    key={c._id}
                    className="bg-white dark:border-gray-700 dark:bg-gray-900"
                  >
                    <TableCell className="whitespace-nowrap">
                      {new Date(c.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <img
                        src={c.image}
                        alt={c.title}
                        className="size-10 rounded-full object-cover bg-gray-500"
                      />
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {c.name}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {!c.parentCategory ? (
                        <FaCheck className="text-green-500 " />
                      ) : (
                        <FaTimes className="text-red-500 " />
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Link
                        to={`/admin?tab=updateCategory&search=${c.name}`}
                        className="font-medium text-teal-500 dark:text-orange-300 hover:underline cursor-pointer"
                      >
                        Edit
                      </Link>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span
                        onClick={() => {
                          setShowConfirm(true);
                          setCategoryToDelete(c);
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
            {categories.length < totalCategories && (
              <button
                onClick={handleShowMore}
                className="w-full text-teal-500 self-center text-sm py-7"
              >
                Show More
              </button>
            )}
          </>
        ) : (
          <p className="dark:text-green-400">{search? "Category Not found":"You have no categories yet!"}</p>
        )}

        {/* ✅ Confirm Delete Modal */}
        {showConfirm && !categoryLoading && (
          <div className="w-full h-full mt-3 md:mt-5 md:px-3 py-2 md:py-10 bg-gray-300 dark:bg-gray-700 rounded-xl dark:border-gray-300 border-gray-600">
            <div className="flex flex-wrap gap-4 justify-start h-full w-full">
              <ShowAlertBox
                data={categoryToDelete}
                product={false}
                showConfirm={() => setShowConfirm(false)}
                handleDelete={HandleDeleteCategory}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashCategories;
