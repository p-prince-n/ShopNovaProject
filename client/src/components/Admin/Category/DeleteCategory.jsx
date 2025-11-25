import { useEffect } from "react";
import { useCategoryStore } from "../../../Store/useCategoryStore";
import Search from "../Search";
import CategoryCard from "./CategoryCard";
import { Loader } from "lucide-react";
import AdminPageTitle from "../AdminPageTitle";
import LoaderAnimation from "../../LoaderAnimation";

const DeleteCategory = () => {
  const { categories, fetchCategories, loading, error } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="border-1 w-full p-3 mt-6 rounded-xl shadow-2xl bg-gray-200 dark:bg-gray-900">
      <AdminPageTitle operation={"Delete"} data={"Category"} />

      <div className="w-full flex items-center justify-center mt-2 md:mt-5">
        <Search />
      </div>

      {loading && (
        <LoaderAnimation/>
      )}

      {!loading && (
        <div className="w-full h-full mt-3 md:mt-5 md:px-3 py-2 md:py-10 bg-gray-300 dark:bg-gray-700 rounded-xl dark:border-gray-300 border-gray-600">
          {categories.length < 1 && (
            <div className="flex justify-center mt-3">
              <h2 className="text-red-600 font-semibold text-md md:text-xl">
                {" "}
                No Category Found
              </h2>
            </div>
          )}
          <div className="flex flex-wrap gap-4 justify-start h-full w-full">
            {categories.map((category) => (
              <CategoryCard
                key={category._id}
                remove={true}
                update={false}
                product={category}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteCategory;
