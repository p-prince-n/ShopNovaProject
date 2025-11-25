import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


export default function PageNotFound() {
    const navigate=useNavigate();
  return (
    <div className="relative min-w-screen flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 text-center overflow-hidden px-6">
      {/* Floating 3D Sphere */}
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-gray-200 dark:bg-gray-800 shadow-2xl"
        style={{
          boxShadow:
            "0 0 80px rgba(0,0,0,0.1), inset 0 0 40px rgba(255,255,255,0.05)",
        }}
        animate={{
          y: [0, -30, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Subtle floating shadows */}
      <motion.div
        className="absolute bottom-20 w-56 h-10 bg-black/10 dark:bg-white/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating 404 Text */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
        className="text-[8rem] md:text-[10rem] font-extrabold text-gray-900 dark:text-gray-100 relative z-10 drop-shadow-md select-none"
      >
        404
      </motion.h1>

      {/* Title and message */}
      <div className="relative z-10 max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Oops! Page Not Found
        </h2>
        <p className="mt-3 text-gray-600 dark:text-gray-400 text-sm md:text-base">
          It seems this page drifted off into space. Let’s help you get back to
          the main orbit.
        </p>
      </div>

      {/* Floating Button */}
      <motion.button
      onClick={()=>navigate('/home')}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.97 }}
        className="mt-25 md:mt-10 z-10 bg-gradient-to-br from-green-400 to-blue-600 text-white hover:bg-gradient-to-bl focus:ring-green-200 dark:focus:ring-green-800 w-[200px] h-[50px] lg:w-1/3 lg:h-[3.5vw] xl:w-1/6 xl:h-[2.5vw] rounded-3xl"
      >
        Go Home
      </motion.button>

      {/* Small orbiting element */}
      <motion.div
        className="absolute w-6 h-6 bg-gray-400 dark:bg-gray-600 rounded-full shadow-lg"
        animate={{
          rotate: 360,
        }}
        transition={{
          repeat: Infinity,
          duration: 10,
          ease: "linear",
        }}
        style={{
          top: "50%",
          left: "50%",
          transformOrigin: "150px 0",
        }}
      />

      {/* Footer */}
      <footer className="absolute bottom-6 text-xs text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} — Lost but not forgotten.
      </footer>
    </div>
  );
}
