import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import LoaderAnimation from "../LoaderAnimation";

const TopCard = ({ item, currentId=null }) => {
  const navigate = useNavigate();
  const [wishlisted, setWishlisted] = useState(false);

  const handleClick = () => {
    navigate("/your-page");
  };

  const toggleWishlist = () => {
    setWishlisted(!wishlisted);
  };



  return (
    <div className="flex flex-col items-center justify-evenly mt-3 sm:mb-1 md:mb-2 pb-1    ">
      <motion.div
       onClick={()=>navigate(`/category/${item._id}`)}
        whileHover={{
          rotate: [0, 2, -2, 1, -1, 0],
          scale: 1.05,
          boxShadow: "0px 20px 40px rgba(0, 0, 0, 0.25)",
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className={`
          relative 
          ${currentId && currentId===item._id ? 'size-9 sm:size-12 md:size-15 ': ' size-5 sm:size-8 md:size-10'}
         
          cursor-pointer rounded-xl overflow-hidden shadow-md bg-transparent md:mt-4 
        `}
      >
      

        {/* Ripple animation layer */}
        <motion.div
          className="absolute inset-0 bg-green-200 opacity-0"
          whileHover={{
            opacity: [0, 0.15, 0],
            scale: [0.9, 1.1, 1.3],
          }}
          transition={{ duration: 0.8 }}
        />

        {/* Image */}
        <img
          src={item.image}
          alt="Card Example"
          onClick={handleClick}
          className="size-full object-cover rounded-2xl"
        />
      </motion.div>

      {/* Content */}
      <div className="px-4 py-2 relative z-10 ">
        <h2
          className="
            text-sm sm:text-base md:text-md 
            font-semibold text-white/80 
          "
        >
          {item.name}
        </h2>
      </div>
    </div>
  );
};



const TopCardGroup = ({categories, categoryLoading, theme, currentId=null}) => {
  return (
    <div
        className={`flex ${
          categoryLoading && "justify-center"
        } md:justify-center gap-0 md:gap-10 w-8/9 sm:w-7/9 md:w-5/6 
        h-20 sm:h-22 md:h-30 items-center  
        rounded-2xl shadow-lg p-4 
        absolute top-28 
        overflow-x-auto scrollbar-none overflow-y-hidden
        space-x-4 
        ${
          theme === "light"
            ? "from-teal-400 via-cyan-500 to-blue-600"
            : "from-emerald-900 via-green-900 to-gray-900"
        } bg-white/10 shadow-3xl shadow-black`}
      >
        {categoryLoading && <LoaderAnimation />}
        {categories.map((item, idx) => (
          <div key={idx} className="flex-shrink-0">
            <TopCard item={item} currentId={currentId} />
          </div>
        ))}
      </div>

  )
}

export default TopCardGroup


