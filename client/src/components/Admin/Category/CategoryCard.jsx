import { motion } from "framer-motion";
import { useCategoryStore } from "../../../Store/useCategoryStore";
import { useState } from "react";
import ShowAlertBox from "../ShowAlertBox";

const CategoryCard = ({ update = false, product, updateOn = () => {} }) => {
  const { deleteCategory } = useCategoryStore();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async (id) => {
    await deleteCategory(id);
    setShowConfirm(false);
  };
  return (
    <>
      <motion.div
        className="hidden bg-white dark:bg-black/20 rounded-2xl border-[0.5px] border-gray-300 shadow-lg overflow-hidden cursor-pointer 
             hover:shadow-xl transition-all md:flex flex-col w-full max-w-[200px] md:w-40 "
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
      >
        {/* Image */}
        <div className="relative w-full h-full overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            className="h-36  w-full object-cover"
            initial={{ scale: 1.2 }}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Content */}
        <div className="py-2 px-2 flex flex-col flex-grow">
          <h3 className=" text-md font-semibold text-gray-800 dark:text-green-400 line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs md:text-sm  text-gray-500 dark:text-shadow-gray-400 line-clamp-2 flex-grow">
            {product.description}
          </p>

          {/* Price + Button */}
          <div className="mt-1 md:mt-3 flex items-center justify-start ">
            {/* <span className="text-md md:text-xl font-bold text-black dark:text-green-400">
            199$    
          </span> */}
            <motion.button
              onClick={() => {
                if (update) {
                  updateOn(product);
                } else {
                  setShowConfirm(true);
                }
              }}
              className={`${
                update ? "bg-green-500" : "bg-red-500"
              } text-white px-2 py-1 rounded-xl w-full`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {update ? "Update" : "Delete"}
            </motion.button>
          </div>
        </div>
      </motion.div>

      <motion.div
      className="md:hidden  bg-white dark:bg-gray-600 rounded-lg shadow-xl  p-1 w-20  "
      whileHover={{ scale: 1.05, boxShadow: "0px 4px 16px rgba(0,0,0,0.2)" }}
      whileTap={{ scale: 0.97 }}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.img
        src={product.image}
        alt={product.name}
        className="rounded-md h-22 w-full object-cover mb-2"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
      />

      <h2 className="text-[0.575rem] font-semibold mb-1 truncate dark:text-green-300">
        {product.name}
      </h2>

      {update ? (
        <motion.button
          className="w-full rounded-md bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white hover:bg-gradient-to-br focus:ring-cyan-300 dark:focus:ring-cyan-800 py-[0.15rem] text-[0.5rem]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => updateOn(product)}
        >
          Update
        </motion.button>
      ) : (
        <motion.button
        onClick={()=>setShowConfirm(true)}
          className="w-full rounded-md bg-gradient-to-r from-red-400 via-red-500 to-red-600 text-white hover:bg-gradient-to-br focus:ring-red-300 dark:focus:ring-red-800 py-[0.15rem] text-[0.5rem]"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Delete
        </motion.button>
      )}
    </motion.div>

      {showConfirm && (
       
        <ShowAlertBox
          data={product}
          product={false}
          showConfirm={() => setShowConfirm(false)}
          handleDelete={handleDelete}
        />
      )}
    </>
  );
};

export default CategoryCard;
