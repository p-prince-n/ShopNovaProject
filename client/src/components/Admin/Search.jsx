import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { useThemeStore } from "../../Store/useThemeStore";
import { useCategoryStore } from "../../Store/useCategoryStore";
import { useProductStore } from "../../Store/useProductStore";
import { useNavigate, useLocation } from "react-router-dom";

const Search = ({ product = false }) => {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();


  const urlParams = new URLSearchParams(location.search);
  const initialSearch = urlParams.get("search") || "";

  const [search, setSearch] = useState(initialSearch);


  const { searchCategory, fetchCategories } = useCategoryStore();

  const { searchProducts, fetchProducts } = useProductStore();

  useEffect(() => {
    const delayDebounce = setTimeout(() => {

      const params = new URLSearchParams(location.search);
      if (search.trim() !== "") {
        params.set("search", search);
        product ? searchProducts(search) : searchCategory(search);
      } else {
        params.delete("search");
        product ? fetchProducts() : fetchCategories();
      }
      navigate(`${location.pathname}?${params.toString()}`, { replace: true });
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [
    search,
    product,
    searchProducts,
    fetchProducts,
    searchCategory,
    fetchCategories,
    navigate,
    location.pathname,
    location.search
  ]);

  return (
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
        placeholder={product ? "Search Products..." : "Search Categories..."}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
};

export default Search;
