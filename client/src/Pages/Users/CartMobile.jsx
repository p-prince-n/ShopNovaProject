import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
  CheckIcon,
  Checkbox,
} from "flowbite-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "../../Store/useCartStore";
import toast from "react-hot-toast";
import { useThemeStore } from "../../Store/useThemeStore";

const CartMobile = ({ item, showSelect, selectedItems, setSelectedItems, setSelectedItemsData }) => {
    const isChecked = selectedItems.includes(item.product._id);
  const { updateQuantity, removeFromCart } = useCartStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const [itemQuantity, setItemQuantity] = useState(item.quantity);
  const [firstRender, setFirstRender] = useState(true);
  const [showRemoveItem, setShowRemoveItem] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleCheckboxChange = (e) => {
    if (e.target.checked) {
      setSelectedItems((prev) => [...prev, item.product._id]);
      setSelectedItemsData((prev) => {
        const exists = prev.some((i) => i.product._id === item.product._id);
        return exists ? prev : [...prev, { ...item }];
      });
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== item.product._id));
      setSelectedItemsData((prev) =>
        prev.filter((i) => i.product._id !== item.product._id)
      );
    }
  };

  useEffect(() => {
    if (firstRender) {
      setFirstRender(false);
      return;
    }

    const handler = setTimeout(() => {
      if (itemQuantity < 1) {
        removeFromCart(item.product._id, item.size);
        toast.error("Product removed from cart");
      } else {
        updateQuantity(item.product._id, item.size, itemQuantity);
        toast.success("Quantity updated");
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [itemQuantity]);

  const handleIncrease = () => {
    const newQty = itemQuantity + 1;
    setItemQuantity(newQty);
    updateQuantity(item.product._id, item.size, newQty);
  };

  const handleDecrease = () => {
    const newQty = itemQuantity - 1;
    if (newQty < 1) {
      setShowRemoveItem(true);
      setSelectedProduct(item);
    } else {
      setItemQuantity(newQty);
      updateQuantity(item.product._id, item.size, newQty);
    }
  };
  const HandleRemove = () => {
    removeFromCart(selectedProduct.product._id, selectedProduct.size);
    setShowRemoveItem(false);
  };
  console.log(item);
  return (
    <>
   <div
        className={`md:hidden relative flex flex-col items-center justify-between py-3 px-5 ${
          theme === "light" ? "bg-white/90" : "bg-black/30"
        } rounded-md shadow-xl gap-2 w-63`}
      >
        {showSelect && (
          <div className="absolute top-2 right-2">
            <Checkbox checked={isChecked} onChange={handleCheckboxChange} />
          </div>
        )}
        <div className="flex items-start justify-between gap-6 ">
          <div className="flex items-center justify-center" onClick={()=> navigate(`/productdetail/${item.product._id}`)}>
            <img
              src={item.product?.images[0]}
              className="w-[200px] h-28 object-cover  rounded-md"
              alt="empty"
            />
          </div>
          <div className="flex flex-col items-start justify-start">
            <h1 className="text-lg dark:text-green-400 font-bold line-clamp-1">
              {item.product?.name}
            </h1>
            <p className="text-sm dark:text-green-400 font-semibold  line-clamp-1">
              {item.product?.description}
            </p>
            <p className="text-sm dark:text-green-400 font-semibold  line-clamp-1">
              Size: {item.size ?? "Not Avialable"}
            </p>
            

            <h3 className="mt-1 text-xs bg-blue-500  dark:bg-green-800 px-2 py-1 rounded-md border-[0.5px] text-white flex gap-1">
              <span className="block">{item.product.ratings.toFixed(1)}</span>{" "}
              <span className="block mt-[1px] ">
                {" "}
                <AiFillStar className="size-3" />
              </span>
            </h3>
            <h1 className="text-lg dark:text-green-400 font-bold line-clamp-1 mt-1">
              {item.discountPrice}rs
            </h1>
          </div>
        </div>
        <div className="flex items-start justify-between gap-6 w-full ">
          <div className="flex items-center justify-start">
            <div className="flex items-center justify-start  rounded-md ">
              <button
                onClick={handleDecrease}
                className="w-8 flex items-center justify-center shadow-2xl border-[0.5px] p-0.5 rounded-md text-sm  font-bold bg-red-500 text-black"
              >
                -
              </button>
              <div className="w-8 flex items-center justify-center p-1 rounded-md text-sm dark:text-green-400  font-bold">
                {itemQuantity}
              </div>
              <button
                onClick={handleIncrease}
                className="w-8 flex items-center justify-center shadow-2xl border-[0.5px] p-0.5 rounded-md text-sm  font-bold bg-green-400 text-black"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-start mt-1">
            <div className="flex items-center  text-red-600 ">
              <MdDeleteForever
                onClick={() => {
                  setShowRemoveItem(true);
                  setSelectedProduct(item);
                }}
                className="size-7"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between "></div>
      </div>
        {showRemoveItem && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl w-[90%] max-w-sm"
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Confirm You Want Remove Cart
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Are you sure you want to remove{" "}
              <b>{selectedProduct.product.name}</b> Product from Cart ?
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowRemoveItem(false)}
                className="px-4 py-2 rounded-xl bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 text-black dark:text-white"
              >
                Cancel
              </button>
              <button

                onClick={HandleRemove}
                className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
      </>
  )
}

export default CartMobile