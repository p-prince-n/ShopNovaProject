import { useCategoryStore } from "../../../Store/useCategoryStore";
import { useThemeStore } from "../../../Store/useThemeStore";
import { useUploadStore } from "../../../Store/useUploadStore";
import { FileInput, Label, Button } from "flowbite-react";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import AdminPageTitle from "../AdminPageTitle";

const CreateCategory = ({ category = null, updatePage = null }) => {
  const { theme } = useThemeStore();
  const { imageUrl, uploadloading, uploaderror, progress, uploadImage } =
    useUploadStore();
  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
  } = useCategoryStore();

  const [categoryData, setcategoryData] = useState({
    name: category ? category.name : "",
    description: category ? category.description : "",
    image: category ? category.image : "",
    parentCategory: category ? category.parentCategory?._id || null : null,
  });
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (category) {
      setcategoryData({
        name: category.name || "",
        description: category.description || "",
        image: category.image || "",
        parentCategory: category ? category.parentCategory?._id || null : null,
      });
    }
  }, [category]);


  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);


  useEffect(() => {
  if (imageUrl && categoryData.name !== "" ) {
    setcategoryData((prev) => ({ ...prev, image: imageUrl }));
  }
}, [imageUrl]);


  const handleUploadImage = async (file) => {
    const filesize = file.size;
    if (filesize > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB");
      return;
    }

    await uploadImage(file);

    if (uploaderror) {
      toast.error(uploaderror);
      return;
    }

    
  };

  const HandleSubmit = async () => {
    if (!categoryData.name.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = {
      ...categoryData,
      parentCategory: categoryData.parentCategory || null,
    };

    if (category) {
      await updateCategory(category._id, payload);
    } else {
      await createCategory(payload);
    }
    if (error) {
      toast.error(error);
      return;
    }

    toast.success(`Category ${category ? "updated" : "created"} successfully`);
    if (category) {
      updatePage(false);
    } else {
      setcategoryData({
        name: "",
        description: "",
        image: "",
        parentCategory: "",
      });
    }
  };

  if (loading)
    return (
      <div className="flex h-full w-full justify-center mt-3">
        <Loader className="w-6 h-6 animate-spin dark:text-green-400 text-blue-600" />
      </div>
    );

  return (
    <div className="border-1 p-3 mt-6 rounded-xl shadow-2xl bg-gray-200 dark:bg-gray-900">
      <AdminPageTitle operation={category? "Update": "Create"} data={"Category"} />

      <div className="flex w-full flex-col justify-start mt-5">
        {/* Category Name */}
        <div className="flex items-center justify-start py-5 px-10">
          <input
            type="text"
            disabled={loading || uploadloading}
            onChange={(e) =>
              setcategoryData((prev) => ({ ...prev, name: e.target.value }))
            }
            value={categoryData.name}
            placeholder="Category Name"
            className={`w-full md:w-6/7 lg:w-5/7 2xl:w-3/7 px-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
            }`}
          />
        </div>

        {/* Category Description */}
        <div className="flex items-center justify-start py-5 px-10">
          <textarea
            disabled={loading || uploadloading}
            onChange={(e) =>
              setcategoryData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            value={categoryData.description}
            rows={5}
            placeholder="Category Description (optional)"
            className={`w-full md:w-6/7 lg:w-5/7 2xl:w-3/7 px-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 transition-all duration-200 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
            }`}
          ></textarea>
        </div>

        {/* Display Uploaded Image */}
        {(categoryData.image!=="" ) && (
          <div className="flex items-center justify-center w-full py-5 px-10">
            <img
              className="w-1/5"
              src={categoryData.image }
              alt="Category"
            />
          </div>
        )}

        {/* File Upload */}
        <div className="flex items-center justify-start py-5 px-10">
          <div className="flex w-full items-center justify-center">
            <Label
              htmlFor="dropzone-file"
              className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
              <div className="flex flex-col items-center justify-center pb-6 pt-5 px-2">
                <svg
                  className="mb-4 h-8 w-8 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 ">
                  SVG, PNG, JPG or GIF (MAX. 800x400px) for category
                </p>
              </div>
              <FileInput
                disabled={uploadloading || loading}
                id="dropzone-file"
                className="hidden"
                onChange={(e) => handleUploadImage(e.target.files[0])}
              />
            </Label>
          </div>
        </div>

        {/* Upload Progress */}
        {progress > 0 && uploadloading && (
          <div className="w-full bg-gray-200 rounded h-2 mb-3">
            <div
              className="bg-blue-500 h-2 rounded transition-all"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Parent Category Dropdown */}
        <div className="flex justify-start px-10 mt-2 ">
          {categories.length > 0 && (
            <>
              <label className="block mb-2 font-semibold dark:text-green-400">
                Parent Category
              </label>
              <div
                className="border rounded w-full p-2 mb-4 dark:bg-gray-600 dark:text-white  relative cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {categoryData.parentCategory
                  ? categories.find(
                      (c) => c._id === categoryData.parentCategory
                    )?.name || "Select Parent (optional)"
                  : "Select Parent (optional)"}

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 right-0 bg-white dark:bg-gray-700 dark:hover:bg-gray-600 dark:hover:text-black border rounded shadow-lg z-50 max-h-48 overflow-y-auto"
                    >
                      <li
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          setcategoryData({
                            ...categoryData,
                            parentCategory: null,
                          });
                          setDropdownOpen(false);
                        }}
                      >
                        None
                      </li>

                      {categories.map((cat) => (
                        <li
                          key={cat._id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setcategoryData({
                              ...categoryData,
                              parentCategory: cat._id,
                            });
                            setDropdownOpen(false);
                          }}
                        >
                          {cat.name}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex w-full items-center justify-center px-10 pb-5">
          <Button
            className={`w-full shadow-xl ${
              theme === "dark"
                ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:bg-gradient-to-br focus:ring-purple-300 dark:focus:ring-purple-800"
                : "bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white hover:bg-gradient-to-br focus:ring-cyan-300 dark:focus:ring-cyan-800"
            }`}
            disabled={loading || uploadloading}
            onClick={HandleSubmit}
          >
            {`${category ? "Update" : "Create"} Category`}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCategory;
