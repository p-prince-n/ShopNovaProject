import { useProductStore } from "../../../Store/useProductStore";
import { useThemeStore } from "../../../Store/useThemeStore";
import { useUploadStore } from "../../../Store/useUploadStore";
import { FileInput, Label, Button } from "flowbite-react";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader } from "lucide-react";
import { useRef } from "react";
import { useCategoryStore } from "../../../Store/useCategoryStore";
import AdminPageTitle from "../AdminPageTitle";
import MultiSelectWithChips from "./MultiSelectWithChips";

const CreateProduct = ({ product = null, updatePage = null }) => {
  const { theme } = useThemeStore();
  const { imageUrl, uploadloading, uploaderror, progress, uploadImage } =
    useUploadStore();

  const { categories, fetchCategories } = useCategoryStore();
  const dropdownRef = useRef(null);
  const {
    products,
    loading,
    error,
    createProduct,
    updateProduct,
    fetchProducts,
  } = useProductStore();

  const [productData, setProductData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    discount: product?.discount || "",
    stockQuantity: product?.stockQuantity || "",
    brand: product?.brand || "",
    images: product?.images || [],
    categories: product?.categories?.map((c) => c._id) || [],
    attributes: product?.attributes || [],
    size: product?.size || [],
    material: product?.material || "",
    expiryDate: product?.expiryDate || "",
    isPerishable: product?.isPerishable || false,
    ingredients: product?.ingredients || [],

    weatherTags: product?.weatherTags || [],
    famousInCities: product?.famousInCities || [],
  });

  const [citiesInput, setCitiesInput] = useState(
    (productData.famousInCities || []).join(", ")
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (product) {
      setProductData({
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || "",
        discount: product?.discount || "",
        stockQuantity: product?.stockQuantity || "",
        brand: product?.brand || "",
        images: product?.images || [],
        categories: product?.categories || [],

        attributes: product?.attributes || [],
        size: product?.size || [],
        material: product?.material || "",
        expiryDate: product?.expiryDate || "",
        isPerishable: product?.isPerishable || false,
        ingredients: product?.ingredients || [],

        weatherTags: product?.weatherTags || [],
        famousInCities: product?.famousInCities || [],
      });
    }
  }, [product]);

  useEffect(() => {
    setCitiesInput((productData.famousInCities || []).join(", "));
  }, [productData.famousInCities]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    if (product) {
      setProductData({
        ...product,
        attributes:
          product.attributes?.map((attr) => {
            if ("key" in attr && "value" in attr) {

              return attr;
            } else {

              const key = Object.keys(attr)[0];
              const value = attr[key];
              return { key, value };
            }
          }) || [],
      });
    }
  }, [product]);


  useEffect(() => {
    if (imageUrl) {
      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }));
    }
  }, [imageUrl]);


  const handleUploadImages = async (files) => {
    const selectedFiles = Array.from(files);

    for (let file of selectedFiles) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error(`File ${file.name} exceeds 2MB`);
        continue;
      }

      await uploadImage(file);
      if (uploaderror) toast.error(uploaderror);
    }
  };

  const addAttributeGroup = () => {
    setProductData((prev) => ({
      ...prev,
      attributes: [...prev.attributes, { key: "", value: "" }],
    }));
  };

  const updateAttribute = (index, field, value) => {
    if (index < 0 || index >= productData.attributes.length) return;
    if (!["key", "value"].includes(field)) return;

    const updated = [...productData.attributes];
    updated[index][field] = value;
    setProductData((prev) => ({ ...prev, attributes: updated }));
  };

  const removeAttribute = (index) => {
    if (index < 0 || index >= productData.attributes.length) return;

    setProductData((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    const name = productData.name.trim();
    if (!name) {
      toast.error("Product name is required");
      return;
    }


    const numberRegex = /^\d+(\.\d+)?$/;


    const price = Number(productData.price);
    if (!numberRegex.test(productData.price) || price <= 0) {
      toast.error("Price must be a number and greater than 0");
      return;
    }


    const discount =
      productData.discount === "" ? 0 : Number(productData.discount);
    if (isNaN(discount) || discount < 0) {
      toast.error("Discount must be a number equal to or greater than 0");
      return;
    }


    const stockQuantity = Number(productData.stockQuantity);
    if (!numberRegex.test(productData.stockQuantity) || stockQuantity < 0) {
      toast.error("Stock Quantity must be a number equal to or greater than 0");
      return;
    }

    try {
      if (product) {
        await updateProduct(product._id, productData);
      } else {
        await createProduct(productData);

        setProductData({
          name: "",
          description: "",
          price: 0,
          discount: 0,
          stockQuantity: 0,
          brand: "",
          images: [],
          categories: [],
          attributes: [],

          size: [],
          material: "",
          expiryDate: "",
          isPerishable: false,
          ingredients: [],
        });
      }

      toast.success(`Product ${product ? "updated" : "created"} successfully`);

      if (product) updatePage(false);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (loading)
    return (
      <div className="flex h-full w-full justify-center mt-3">
        <Loader className="w-6 h-6 animate-spin dark:text-green-400 text-blue-600" />
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="border-1 w-full p-3 mt-6 rounded-xl shadow-2xl bg-gray-200 dark:bg-gray-900 "
    >
      <div className="flex flex-col gap-1 mb-2 md:mb-5">
        <AdminPageTitle
          operation={product ? "Update" : "Create"}
          data={"Product"}
        />
      </div>

      {/* Product Name */}
      <div className="my-3 md:px-10">
        <input
          type="text"
          placeholder="Product Name"
          value={productData.name}
          onChange={(e) =>
            setProductData({ ...productData, name: e.target.value })
          }
          className={`w-full px-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
              : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
          }`}
        />
      </div>

      {/* Description */}
      <div className="my-3 md:px-10">
        <textarea
          rows={4}
          placeholder="Description"
          value={productData.description}
          onChange={(e) =>
            setProductData({ ...productData, description: e.target.value })
          }
          className={`w-full px-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
              : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
          }`}
        />
      </div>

      {/* Price, Discount, Stock */}
      <div className="flex gap-3 md:px-10 my-3 flex-wrap">
        <input
          type="text"
          placeholder="Price"
          value={productData.price}
          onChange={(e) =>
            setProductData({ ...productData, price: e.target.value })
          }
          className={`px-3 py-2 w-full sm:w-2/5 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
              : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
          }`}
        />
        <input
          type="text"
          placeholder="Discount"
          value={productData.discount}
          onChange={(e) =>
            setProductData({ ...productData, discount: e.target.value })
          }
          className={`px-3 py-2 w-full sm:w-2/5 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
              : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
          }`}
        />
        <input
          type="text"
          placeholder="Stock Quantity"
          value={productData.stockQuantity}
          onChange={(e) =>
            setProductData({ ...productData, stockQuantity: e.target.value })
          }
          className={`px-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
              : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
          } w-full sm:w-2/5`}
        />
      </div>

      {/* Brand */}
      <div className="my-3 md:px-10">
        <input
          type="text"
          placeholder="Brand"
          value={productData.brand}
          onChange={(e) =>
            setProductData({ ...productData, brand: e.target.value })
          }
          className={`w-full px-3 py-2 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
              : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
          }`}
        />
      </div>

      {/* ================= Extra Fields by Category ================= */}

      {productData.categories.some((c) =>
        ["fashion", "clothing", "men", "women", "shoes"].includes(
          c.name.toLowerCase()
        )
      ) && (
        <div className="md:px-10 mt-4">
          <h3 className="font-semibold dark:text-green-400 mb-2">
            Fashion Details
          </h3>

          <MultiSelectWithChips
            label="Sizes"
            options={["XS", "S", "M", "L", "XL", "XXL"]}
            selected={productData.size || []}
            onChange={(newSizes) =>
              setProductData({ ...productData, size: newSizes })
            }
            theme={theme}
          />
        </div>
      )}

      {productData.categories.some((c) =>
        ["food", "grocery"].includes(c.name.toLowerCase())
      ) && (
        <div className="md:px-10 mt-4">
          <h3 className="font-semibold dark:text-green-400 mb-2">
            Food Details
          </h3>

          <MultiSelectWithChips
            label="Ingredients"
            options={["Milk", "Sugar", "Salt", "Rice", "Eggs", "Butter"]}
            selected={productData.ingredients || []}
            onChange={(newIngs) =>
              setProductData({ ...productData, ingredients: newIngs })
            }
            theme={theme}
          />

          {/* Expiry date input */}
          <div className="mt-3">
            <label className="dark:text-green-400 font-medium">
              Expiry Date
            </label>
            <input
              type="date"
              value={productData.expiryDate || ""}
              onChange={(e) =>
                setProductData({ ...productData, expiryDate: e.target.value })
              }
              className={`w-full px-3 py-2 rounded-lg border ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-gray-300 border-blue-700 text-black"
              }`}
            />
          </div>

          {/* Is Perishable (Toggle) */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="checkbox"
              id="isPerishable"
              checked={productData.isPerishable || false}
              onChange={(e) =>
                setProductData({
                  ...productData,
                  isPerishable: e.target.checked,
                })
              }
              className="w-5 h-5 text-green-500 border-gray-300 rounded focus:ring-green-500"
            />
            <label
              htmlFor="isPerishable"
              className="font-medium dark:text-green-400 text-gray-800"
            >
              Is Perishable?
            </label>
          </div>
        </div>
      )}

      {/* Selected Categories */}
      <div className="flex flex-wrap gap-2 mt-2 md:px-10">
        {productData.categories.map((cat) => (
          <div
            key={cat._id}
            className={`flex items-center gap-1 px-2 py-1 focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
              theme === "dark"
                ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
            } rounded-full`}
          >
            <span>{cat.name}</span>
            <button
              type="button"
              onClick={() =>
                setProductData({
                  ...productData,
                  categories: productData.categories.filter(
                    (c) => c._id !== cat._id
                  ),
                })
              }
              className="font-bold ml-1 text-red-500"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Category Multi-select Dropdown */}
      <div className="md:px-10 my-3 relative">
        <label className="block mb-2 font-semibold dark:text-green-400">
          Categories
        </label>
        <div
          ref={dropdownRef}
          className={` focus:ring-2 bg-opacity-50 rounded-lg border dark:border-green-400 ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
              : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
          } p-2 cursor-pointer dark:bg-gray-600 dark:text-white`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          {productData.categories.length > 0
            ? productData.categories.map((c) => c.name).join(", ")
            : "Select Categories"}
        </div>

        <AnimatePresence>
          {dropdownOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute rounded-xl top-full left-0 right-0 bg-white dark:bg-emerald-600 border shadow-lg z-50 max-h-48 overflow-y-auto"
            >
              {categories.map((cat) => {
                const alreadySelected = productData.categories.some(
                  (c) => c._id === cat._id
                );
                return (
                  <li
                    key={cat._id}
                    className="p-2 hover:bg-gray-200 hover:dark:text-gray-600 dark:hover:bg-emerald-300 cursor-pointer"
                    onClick={() => {
                      const updated = alreadySelected
                        ? productData.categories.filter(
                            (c) => c._id !== cat._id
                          )
                        : [...productData.categories, cat];
                      setProductData({ ...productData, categories: updated });
                    }}
                  >
                    {cat.name}
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Image Upload Section */}
      <div className="flex items-center justify-start py-5 md:px-10">
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG or GIF (MAX. 800x400px). You can select multiple
                images.
              </p>
            </div>
            <FileInput
              disabled={uploadloading || loading}
              id="dropzone-file"
              className="hidden"
              multiple
              onChange={(e) => handleUploadImages(e.target.files)}
            />
          </Label>
        </div>
      </div>
      {productData.images.length > 0 && (
        <div className="px-2 md:px-10 my-3 flex flex-col items-center justify-start mt-3 sm:mb-1 md:mb-2 pb-1 ">
          <h3 className="font-semibold mb-2 dark:text-green-400">
            Uploaded Images
          </h3>
          <div
            className="flex px-2 mt-1 h-40 overflow-x-scroll scrollbar-none overflow-y-hidden whitespace-nowrap w-full 
              gap-2 "
          >
            {productData.images.map((item, idx) => (
              <div key={idx} className="flex-shrink-0 relative ">
                <div className="size-full">
                  <img
                    src={item}
                    alt={`Uploaded ${idx}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  onClick={() =>
                    setProductData({
                      ...productData,
                      images: productData.images.filter((_, i) => i !== idx),
                    })
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="md:px-10 mt-4">
        <h3 className="font-semibold dark:text-green-400 mb-2">Weather Tags</h3>
        <MultiSelectWithChips
          label="Applicable Weather"
          options={[
            "Clear",
            "Clouds",
            "Rain",
            "Snow",
            "Drizzle",
            "Thunderstorm",
            "Mist",
            "Fog",
            "Haze",
          ]}
          selected={productData.weatherTags}
          onChange={(tags) =>
            setProductData({ ...productData, weatherTags: tags })
          }
          theme={theme}
        />
      </div>

      <div className="md:px-10 mt-4">
        <h3 className="font-semibold dark:text-green-400 mb-2">
          Famous In Cities
        </h3>
        <input
          type="text"
          placeholder="Enter cities separated by commas"
          value={citiesInput}
          onChange={(e) => setCitiesInput(e.target.value)}
          onBlur={() =>
            setProductData({
              ...productData,
              famousInCities: citiesInput
                .split(",")
                .map((c) => c.trim())
                .filter((c) => c),
            })
          }
          className={`w-full px-3 py-2 rounded-lg border ${
            theme === "dark"
              ? "bg-gray-800 border-gray-700 text-white"
              : "bg-gray-300 border-blue-700 text-black"
          }`}
        />
        <small className="text-gray-500 dark:text-gray-300">
          Example: Mumbai, Delhi, Bangalore
        </small>
      </div>

      {/* Attributes Section */}
      <div className="md:px-10 my-3">
        {productData.attributes.length > 0 && (
          <h3 className="font-semibold mb-2 dark:text-green-400">Attributes</h3>
        )}
        {productData.attributes.map((attr, index) => (
          <div
            key={index}
            className="flex w-full gap-2 mb-2 flex-nowrap items-center overflow-x-auto"
          >
            <input
              type="text"
              placeholder="Key"
              value={attr.key}
              onChange={(e) => updateAttribute(index, "key", e.target.value)}
              className={`px-2 py-1 w-32 flex-shrink-0 sm:w-1/3 xl:w-2/5 rounded-lg border dark:border-green-400 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
              }`}
            />
            <input
              type="text"
              placeholder="Value"
              value={attr.value}
              onChange={(e) => updateAttribute(index, "value", e.target.value)}
              className={`px-2 py-1 w-32 flex-shrink-0 sm:w-1/3 xl:w-2/5 rounded-lg border dark:border-green-400 ${
                theme === "dark"
                  ? "bg-gray-800 border-gray-700 focus:ring-green-500 text-white focus:border-gray-500 placeholder-gray-400"
                  : "bg-gray-300 focus:border-blue-500 focus:ring-blue-500 border-blue-700 placeholder-black/45"
              }`}
            />
            <Button
              onClick={() => removeAttribute(index)}
              className="bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800 flex-shrink-0"
            >
              Remove
            </Button>
          </div>
        ))}

        <Button
          className={`${
            theme === "dark"
              ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:bg-gradient-to-br focus:ring-green-300 dark:focus:ring-green-800"
              : "bg-gradient-to-r from-lime-200 via-lime-400 to-lime-500 text-gray-900 hover:bg-gradient-to-br focus:ring-lime-300 dark:focus:ring-lime-800"
          }`}
          onClick={addAttributeGroup}
        >
          Add Attribute
        </Button>
      </div>

      {/* Submit */}
      <div className="md:px-10 my-3">
        <Button
          type="submit"
          className={`w-full shadow-xl ${
            theme === "dark"
              ? "bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:bg-gradient-to-br focus:ring-purple-300 dark:focus:ring-purple-800"
              : "bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white hover:bg-gradient-to-br focus:ring-cyan-300 dark:focus:ring-cyan-800"
          }`}
        >
          {product ? "Update" : "Create"} Product
        </Button>
      </div>
    </form>
  );
};

export default CreateProduct;
