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

const CartRow = ({
  item,
  showSelect,
  selectedItems,
  setSelectedItems,
  setSelectedItemsData,
}) => {
  const isChecked = selectedItems.includes(item.product._id);
  const { updateQuantity, removeFromCart } = useCartStore();
  const navigate = useNavigate();
  const [itemQuantity, setItemQuantity] = useState(item.quantity);
  const [firstRender, setFirstRender] = useState(true);
  const [showRemoveItem, setShowRemoveItem] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const handleCheckboxChange = (e, item) => {
    const productId = item.product._id;

    if (e.target.checked) {
      setSelectedItems((prev) => [...prev, productId]);
      setSelectedItemsData((prev) => {
        const exists = prev.some((i) => i.product._id === item.product._id);
        return exists ? prev : [...prev, { ...item }];
      });
    } else {
      setSelectedItems((prev) => prev.filter((id) => id !== productId));
      setSelectedItemsData((prev) =>
        prev.filter((i) => i.product._id !== productId)
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

  return (
    <>
      <TableRow
        key={item.product._id}
        className="bg-white dark:border-gray-700 dark:bg-gray-900"
      >
        <TableCell className="whitespace-nowrap">
          <div
            className="flex flex-col lg:flex-row items-center justify-start gap-5"
            onClick={(e) => navigate(`/productdetail/${item.product._id}`)}
          >
            {/* images */}
            <div className="flex items-center justify-center rounded-md ">
              <img
                src={item.product?.images[0]}
                className="w-[63px] h-[80px] object-cover rounded-md"
                alt=""
              />
            </div>
            {/* details */}
            <div className="flex flex-col items-start gap-4">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center text-md dark:text-green-400 font-semibold">
                  {item.product.name.length > 30
                    ? item.product.name.slice(0, 30) + "..."
                    : item.product.name}
                </div>
                <div className="flex items-center">
                  <h3 className="text-xs  bg-green-800 px-2 py-1 rounded-md border-[0.5px] text-white flex gap-1">
                    <span className="block">
                      {item.product.ratings.toFixed(1)}
                    </span>{" "}
                    <span className="block mt-[1px] ">
                      {" "}
                      <AiFillStar className="size-4" />
                    </span>
                  </h3>
                </div>
              </div>
              <div className="flex flex-col items-start gap-1  ">
                <div className="flex items-center justify-start text-xs dark:text-green-400 ">
                  {item.product.description.length > 25
                    ? item.product.description.slice(0, 25) + "..."
                    : item.product.description}
                </div>
                <div className="flex items-start justify-start text-xs dark:text-green-400 ">
                  Size: {item.size ?? "Not Avialable"}
                </div>
              </div>
            </div>
          </div>
        </TableCell>

        <TableCell className="whitespace-nowrap">
          <div className="flex items-center justify-start text-red-500 text-lg font-semibold">
            {item.product.price.toFixed(2)}rs
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="flex items-center justify-start text-green-400 text-lg font-semibold">
            {item.discountPrice.toFixed(2)}rs
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="flex items-center justify-start text-yellow-400 dark:text-yellow-200 text-lg font-semibold">
            {item.product.discount}%
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="flex items-center justify-center  rounded-md ">
            <button
              className="flex-1/3 flex items-center justify-center shadow-2xl border-[0.5px] p-1 rounded-md text-sm 2xl:text-lg font-extrabold bg-red-500 text-black"
              onClick={handleDecrease}
            >
              -
            </button>
            <div className="flex-1/3 flex items-center justify-center p-2 rounded-md text-sm 2xl:text-lg font-extrabold">
              {itemQuantity}
            </div>
            <button
              className="flex-1/3 flex items-center justify-center shadow-2xl border-[0.5px] p-1 rounded-md text-sm 2xl:text-lg font-extrabold bg-green-400 text-black"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap">
          <div className="flex items-center justify-start text-green-400 text-lg font-semibold">
            {item.discountPrice * item.quantity}rs
          </div>
        </TableCell>
        <TableCell className="whitespace-nowrap ">
          <div className="flex items-center  text-red-600 ">
            <MdDeleteForever
              className="size-6"
              onClick={() => {
                setShowRemoveItem(true);
                setSelectedProduct(item);
              }}
            />
          </div>
        </TableCell>

        {showSelect && (
          <TableCell className="whitespace-nowrap">
            <Checkbox
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(e, item)}
            />
          </TableCell>
        )}
      </TableRow>

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
  );
};

export default CartRow;
