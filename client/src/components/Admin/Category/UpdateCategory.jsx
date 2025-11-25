import { useEffect, useState } from "react";
import { useCategoryStore } from "../../../Store/useCategoryStore";
import Search from "../Search";
import CategoryCard from "./CategoryCard";
import { Loader } from "lucide-react";
import CreateCategory from "./CreateCategory";
import AdminPageTitle from "../AdminPageTitle";
import LoaderAnimation from "../../LoaderAnimation";

const UpdateCategory = () => {
  const { categories, fetchCategories, loading } = useCategoryStore();
  const [updateOn, setUpdateOn] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const HandleUpdateCategory = (category) => {
    setUpdateOn(true);
   setSelectedCategory({
  ...category,
  parentCategory: category.parentCategory?._id || category.parentCategory || "",
});

  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      {/* List View */}
      <div className={`${updateOn && "hidden"} border-1 w-full p-3 mt-6 rounded-xl shadow-2xl bg-gray-200 dark:bg-gray-900`}>
      <AdminPageTitle operation={"Update"} data={"Category"} />

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
                  No Category Found
                </h2>
              </div>
            )}
            <div className="flex flex-wrap gap-4 justify-start h-full w-full px-2 ms:px-5">
              {categories.map((category) => (
                <CategoryCard
                  updateOn={HandleUpdateCategory}
                  key={category._id}
                  remove={false}
                  update={true}
                  product={category}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit View */}
      <div className={`${!updateOn && "hidden"}`}>
        <CreateCategory updatePage={setUpdateOn} category={selectedCategory} />
      </div>
    </>
  );
};

export default UpdateCategory;
