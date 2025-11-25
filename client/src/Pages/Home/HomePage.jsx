import { useEffect, useState, useRef } from "react";
import { useThemeStore } from "../../Store/useThemeStore";
import { useChatbotStore } from "../../Store/useChatbotStore";
import Slider from "../../components/Home/Slider";
import ProductGrid from "../../components/Home/ProductCard";
import { useCategoryStore } from "../../Store/useCategoryStore";
import LoaderAnimation from "../../components/LoaderAnimation";
import ProductCategoryDiscount from "../../components/Home/ParentCategoryDiscount";
import { useProductStore } from "../../Store/useProductStore";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";
import TopCardGroup from "../../components/Home/TopCard";

import { ToltipExample } from "./ToltipExample";
import { CityToltip } from "./CityToltip";
import { RefreshCcwIcon, BotIcon, XIcon } from "lucide-react";
import { useRecommendationStore } from "../../Store/useRecommendationStore";

export default function HomePage() {
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const { user, toggleWishlist: toggleWishlistAPI } = useAuthStore();
  const [wishlistedProducts, setWishlistedProducts] = useState({});
  const [openWeatherProduct, setOpenWeatherProduct] = useState(false);
  const [openCityProduct, setOpenCityProduct] = useState(false);
  const [city, setCity] = useState(null);

  const { messages, input, setInput, sendMessage, clearMessages, loading } = useChatbotStore();

  const [openChatbot, setOpenChatbot] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const chatEndRef = useRef(null);

  const {
    categories,
    totalCategories,
    loading: categoryLoading,
    error: categoryError,
    getRootCategories,
  } = useCategoryStore();
  const {recommendedProducts, loading:recommandLoading, error, fetchPurchaseBasedRecommendations}=useRecommendationStore();

  const {
    fetchAllRandomProducts,
    totalProducts,
    products,
    categoryDiscountProducts,
    mensDiscount,
    womansDiscount,
    fetchDiscountProductsByCategory,
    fetchDiscountProductsforMens,
    fetchDiscountProductsforWomens,
    loading: productLoading,
    error: productError,
    cityloading,
    productsByWeather,
    fetchProductsByWeather,
    productsByCity,
    fetchProductsByCity,
  } = useProductStore();
  console.log(mensDiscount);
  const [showProducts, setShowProducts] = useState([]);

  useEffect(() => {
    fetchAllRandomProducts();
  }, []);

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
    if (products.length > 0) setShowProducts(products.slice(0, 12));
  }, [products]);

  useEffect(() => {
    fetchDiscountProductsforMens(4);
  }, [fetchDiscountProductsforMens]);

  useEffect(() => {
    fetchDiscountProductsforWomens(4);
  }, [fetchDiscountProductsforWomens]);

  useEffect(() => {
    if (categories.length > 0) {
      categories.forEach((cat) => {
        fetchDiscountProductsByCategory(cat._id, cat.name);
      });
    }
  }, [categories, fetchDiscountProductsByCategory]);


  useEffect(() => {
    getRootCategories();
  }, [getRootCategories]);

  useEffect(()=>{
    if(user){
      fetchPurchaseBasedRecommendations();
    }
  }, [fetchPurchaseBasedRecommendations])

  const handleShowMoreClick = () => {
    setShowProducts((prev) => [
      ...prev,
      ...products.slice(prev.length, prev.length + 12),
    ]);
  };

  const HandleDataSubmit = async () => {
    handleUseCurrentLocation();
    if (city) {
      await fetchProductsByWeather(city);
    }
  };
  const HandleCityDataSubmit = async () => {
    handleUseCurrentLocation();
    if (city) {
      await fetchProductsByCity(city);
    }
  };
  useEffect(() => {
    if (city) {
      fetchProductsByWeather(city);
    }
  }, [fetchProductsByWeather]);
  useEffect(() => {
    if (city) {
      fetchProductsByCity(city);
    }
  }, [fetchProductsByCity]);
  console.log({recommendedProducts});
  
  
  
  
useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);
  console.log(messages);
  

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          if (data && data.address) {
            const addr = data.address;
            setCity(addr.city);
          }
        } catch (err) {
          toast.error("Failed to fetch address from location");
        }
      },
      (err) => {
        toast.error("Unable to get your location");
      }
    );
  };
  return (
    <div className="bg-transparent min-w-screen  flex flex-col items-center min-h-screen relative overflow-y-scroll scrollbar-hide">
      {/* Categories */}
      <TopCardGroup
        categories={categories}
        categoryLoading={categoryLoading}
        theme={theme}
      />
      {/* Slider */}
      <div className="absolute w-full top-53 sm:top-56 md:top-63 px-5 sm:px-10 md:px-20">
        <Slider />
      </div>

      {/* Product Discount Sections */}
      <div className="px-5 sm:px-10 2xl:px-20 absolute flex flex-col gap-5 top-103 sm:top-118 md:top-136">
        <div className="flex flex-col gap-2 ">
          {productLoading && <LoaderAnimation />}

          {Object.keys(categoryDiscountProducts).map((categoryName) => {
            const products = categoryDiscountProducts[categoryName];
            if (!products || products.length === 0) return <div></div>;

            return (
              <ProductCategoryDiscount
                key={categoryName}
                categoryName={categoryName}
                products={products.slice(0, 6)}
              />
            );
          })}
        </div>

        <div className="flex flex-col gap-2 ">
          {recommandLoading && <LoaderAnimation />}
          {
            (user && recommendedProducts?.length > 0) && (
              <ProductCategoryDiscount
              categoryName={"Recommanded By Order"}
              products={recommendedProducts?.slice(0, 6)}
              discount={false}
            />
            )
          }

        
        </div>
        
        {openWeatherProduct &&
          (productLoading ? (
            <LoaderAnimation />
          ) : productsByWeather.length > 0 ? (
            <ProductCategoryDiscount
              categoryName={"Weather Related Products"}
              products={productsByWeather.slice(0, 6)}
              discount={false}
            />
          ) : (
            <div className="w-full bg-transparent/20 my-2 flex items-center justify-center">
              <p className="flex items-center justify-center text-white dark:text-green-400">
                <RefreshCcwIcon /> No Product found according to current weather
                yet
              </p>
            </div>
          ))}

        {openCityProduct &&
          (cityloading ? (
            <LoaderAnimation />
          ) : productsByCity.length > 0 ? (
            <ProductCategoryDiscount
              categoryName={"City Related Products"}
              products={productsByCity.slice(0, 6)}
              discount={false}
            />
          ) : (
            <div className="w-full bg-transparent/20 my-2 flex items-center justify-center">
              <p className="flex items-center justify-center gap-2 text-white dark:text-green-400">
                <RefreshCcwIcon /> No Product found according to{" "}
                <span className="font-bold">{city && ` ${city} `}</span> City
              </p>
            </div>
          ))}

        <div className=" flex flex-col lg:flex-row justify-center gap-2">
          <div className="flex flex-col gap-2  lg:w-120">
            <ProductCategoryDiscount
              categoryName={"Men's Wear"}
              products={mensDiscount.slice(0, 4)}
            />
          </div>
          <div className="flex flex-col gap-2  lg:w-120">
            <ProductCategoryDiscount
              categoryName={"Women's Wear"}
              products={womansDiscount.slice(0, 4)}
            />
          </div>
        </div>
        <div>
          <ProductGrid
            products={showProducts}
            wishlistedProducts={wishlistedProducts}
            toggleWishlist={toggleWishlist}
            showClickMore={handleShowMoreClick}
            allProducts={products}
          />
        </div>
      </div>
      <button
        className={`fixed bottom-20 sm:bottom-25 left-5 sm:left-10 md:left-10 lg:bottom-33 lg:left-16 2xl:bottom-40 2xl:left-20 
          w-12 h-12 hover:size-12 hover:md:size-16 transition-colors  animate-bounce hover:animate-none z-50 ${
            theme === "dark" ? "text-white/60" : "text-blue-500/80"
          } rounded-full dark:bg-gray-500 p-2 shadow-xl`}
      >
        <CityToltip
          openCityProduct={setOpenCityProduct}
          HandleDataSubmit={HandleCityDataSubmit}
        />
      </button>

      <button
        className={`fixed bottom-5 left-5 sm:bottom-10 sm:left-10 lg:bottom-16 lg:left-16 2xl:bottom-20 2xl:left-20 
          w-12 h-12 hover:size-12 hover:md:size-16 transition-colors  animate-bounce hover:animate-none z-50 ${
            theme === "dark" ? "text-white/60" : "text-blue-500/80"
          } rounded-full dark:bg-gray-500 p-3 shadow-xl`}
      >
        <ToltipExample
          openWeatherProduct={setOpenWeatherProduct}
          HandleDataSubmit={HandleDataSubmit}
        />
      </button>

      

        <div
        className={`fixed bottom-5 sm:bottom-10 lg:bottom-16 2xl:bottom-20 
        right-5 sm:right-10 lg:right-16 2xl:right-20 flex flex-col items-end z-50`}
      >
        {/* Tooltip */}
        <div
          className={`mb-2 md:mb-5 px-3 py-1 rounded-md text-sm font-medium transition-all duration-300
            transform scale-90 opacity-0 origin-bottom ${showTooltip ? "scale-100 opacity-100" : ""}
            ${theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-900"} shadow-lg pointer-events-none`}
        >
          AI Chatbot: Ask for product assistance!
        </div>

        <button
          onClick={() => setOpenChatbot(true)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full shadow-xl p-3
            transition-all duration-300 hover:scale-110 active:scale-95
            ${theme === "dark" ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-blue-500 text-white hover:bg-blue-400"} 
            animate-bounce`}
        >
          <BotIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      {/* Chat Modal */}
      {openChatbot && (
        <div className="fixed inset-0 z-50 flex justify-center items-end bg-black/40">
          <div className={`w-full max-w-md h-5/6 bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl flex flex-col`}>
            
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b dark:border-gray-700">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white flex gap-2"> <div className="flex"><p className="text-black dark:text-white">Shop</p>
                <p className="text-emerald-600">Nova</p></div><div>
                  {" Assistant"}</div> </h2>
              <div className="flex items-center gap-2">
                <button onClick={clearMessages} className="text-sm text-red-500 hover:underline">Clear</button>
                <button onClick={() => setOpenChatbot(false)} className="text-gray-500 dark:text-gray-300">
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "bot" && msg.products ? (
                    <div className={`flex flex-col max-w-full md:max-w-xs p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white`}>
                      {/* Show message with total matches */}
                      <p className="mb-2 font-medium">{msg.message} ({msg.totalMatches} items found)</p>
                      
                      {/* List of product names with clickable URL */}
                      <div className="flex flex-col space-y-1">
                        {msg.products.map((p) => (
                          <a
                            key={p._id}
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            {p.name}
                          </a>
                        ))}
                      </div>

                      {/* Suggestions */}
                      {msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 space-y-1">
                          {msg.suggestions.map((s, i) => <div key={i}>💡 {s}</div>)}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className={`max-w-xs p-2 rounded-lg break-words
                      ${msg.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"}`}>
                      {msg.text}
                    </div>
                  )}
                </div>
              ))}

              {/* Skeleton loader */}
              {loading && (
                <div className="flex justify-start">
                  <div className="max-w-xs p-2 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse">
                    <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                    <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded mb-1"></div>
                    <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="flex p-3 border-t dark:border-gray-700">
              <input
                type="text"
                className="flex-1 px-3 py-2 rounded-l-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}
