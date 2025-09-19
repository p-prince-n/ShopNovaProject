import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "https://picsum.photos/id/1015/800/400",
  "https://picsum.photos/id/1016/800/400",
  "https://picsum.photos/id/1018/800/400",
  "https://picsum.photos/id/1020/800/400",
];

const Slider = () => {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  // Auto slide every 5s
  useEffect(() => {
    startAutoSlide();
    return () => clearInterval(intervalRef.current);
  }, [current]);

  const startAutoSlide = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto overflow-hidden rounded-2xl shadow-2xl shadow-gray-900 ">
      {/* Slide container */}
      <div className="relative h-40 sm:h-55 md:h-66 overflow-hidden">
        <AnimatePresence>
          <motion.img
            key={current}
            src={images[current]}
            alt="slider"
            initial={{ opacity: 0, scale: 1.1, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {/* Controls */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 -translate-y-1/2 
             bg-black/40 text-white 
             px-2 py-1 text-sm      /* default small */
             sm:px-3 sm:py-2 sm:text-base  /* medium */
             md:px-4 md:py-2 md:text-lg   /* larger */
             rounded-full hover:bg-black/60 transition"
      >
        ◀
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 -translate-y-1/2 
             bg-black/40 text-white 
             px-2 py-1 text-sm      /* default small */
             sm:px-3 sm:py-2 sm:text-base  /* medium */
             md:px-4 md:py-2 md:text-lg   /* larger */
             rounded-full hover:bg-black/60 transition"
      >
        ▶
      </button>

      {/* Indicators (modern dots) */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === current ? "bg-black w-6" : "bg-gray-300 w-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Slider;
