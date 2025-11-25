import {
  Table,
  TableBody,
  TableHead,
  TableHeadCell,
  Checkbox,
} from "flowbite-react";
import { useCartStore } from "../../Store/useCartStore";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../Store/authStore";
import LoaderAnimation from "../../components/LoaderAnimation";
import { QRCodeCanvas } from "qrcode.react";
import { AiFillStar } from "react-icons/ai";
import CartRow from "./CartRow";
import toast from "react-hot-toast";
import { useThemeStore } from "../../Store/useThemeStore";
import EmptyCartImg from "../../assets/images/EmptyCart.webp";
import { useNavigate } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import CartMobile from "./CartMobile";
import CheckoutModal from "./CheckOutModel";

const Cart = () => {
  const { cart, loading, error, message, getCart } = useCartStore();
  const { user } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();
  const [showSelect, setShowSelect] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemsData, setSelectedItemsData] = useState([]);
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  

  useEffect(() => {
    if (user) {
      getCart();
    }
  }, [user]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  if (loading) return <LoaderAnimation />;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(cart.items.map((item) => item.product._id));
      setSelectedItemsData(cart.items.map((item) => item));
    } else {
      setSelectedItems([]);
      setSelectedItemsData([])
    }
  };


  const generateQRDataUrl = () => {
    const canvas = document.getElementById("share-qr-code");
    if (!canvas) return null;
    const dataUrl = canvas.toDataURL("image/png");
    setQrDataUrl(dataUrl);
    return dataUrl;
  };


  const shareQRCodeAsImage = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items first");
      return;
    }

    const canvas = document.getElementById("share-qr-code");
    if (!canvas) return;

    if (navigator.canShare && navigator.canShare({ files: [] })) {

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "cart_qrcode.png", { type: "image/png" });

        try {
          await navigator.share({
            files: [file],
            title: "My Cart QR",
            text: "Here is my selected items QR code",
          });
          toast.success("QR code shared!");
        } catch (err) {
          console.error(err);
          toast.error("Failed to share QR code");
        }
      });
    } else {

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          toast.success(
            "QR code copied to clipboard! You can paste it anywhere."
          );
          generateQRDataUrl();
        } catch (err) {
          console.error(err);
          toast.error("Failed to copy QR code");
        }
      });
    }
  };



 

  
  

 
  return (
    <div
      div
      className="relative w-full min-h-screen overflow-y-scroll scrollbar-hide"
    >
      {/* desktop size  */}
      <div className="absolute top-20 flex flex-col items-center justify-start w-full md:px-10 py-5 min-h-screen px-6 ">
        <div
          className={`flex w-full md:w-1/2 items-center justify-center text-xl md:text-3xl dark:text-green-400 font-bold mb-5 ${
            theme === "light"
              ? "bg-white/90 border-1 shadow-xl drop-shadow-2xl/50"
              : "bg-gray-800"
          }   bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl  py-2 border-[0.5px] dark:border-green-500`}
        >
          Your Cart
        </div>
        {/* mobile size */}

        {cart?.items.length > 0 ? (
          <>
            <div
              className={`flex ${
                showSelect ? "justify-between" : "justify-center"
              } md:justify-end w-full mb-3`}
            >
              <button
                onClick={() => setShowSelect((prev) => !prev)}
                className={`px-4 py-2 rounded-md shadow-md ${
                  theme === "dark"
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-cyan-500 text-white hover:bg-cyan-600"
                }`}
              >
                {showSelect ? "Hide Selection" : "Select Items"}
              </button>
              <div
                className={`${
                  !showSelect && "hidden"
                } md:hidden  flex items-center`}
              >
                <Checkbox
                  checked={
                    selectedItems.length === cart.items.length &&
                    cart.items.length > 0
                  }
                  className=" size-5  "
                  onChange={handleSelectAll}
                />
              </div>
            </div>

            <div className="md:hidden flex gap-5 flex-wrap items-center justify-center bg-white/20 dark:bg-black/35 w-full py-5 px-2 ">
              {cart?.items.map((item) => (
                <CartMobile
                  key={item.product._id}
                  item={item}
                  showSelect={showSelect}
                  selectedItems={selectedItems}
                  setSelectedItems={setSelectedItems}
                  setSelectedItemsData={setSelectedItemsData}
                />
              ))}
            </div>
            <div className="hidden md:block table-auto overflow-x-scroll md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500 w-full">
              <Table className="shadow-xl">
                <TableHead>
                  <TableHeadCell>Product</TableHeadCell>
                  <TableHeadCell>Actual Price</TableHeadCell>
                  <TableHeadCell>Discount Price</TableHeadCell>
                  <TableHeadCell>Discount</TableHeadCell>
                  <TableHeadCell>Quantity</TableHeadCell>
                  <TableHeadCell>Total Price</TableHeadCell>
                  <TableHeadCell>Remove</TableHeadCell>
                  {showSelect && (
                    <TableHeadCell>
                      <Checkbox
                        checked={
                          selectedItems.length === cart.items.length &&
                          cart.items.length > 0
                        }
                        onChange={handleSelectAll}
                      />
                    </TableHeadCell>
                  )}
                </TableHead>
                <TableBody className="divide-y">
                  {cart?.items.map((item) => (
                    <CartRow
                      key={item.product._id}
                      item={item}
                      showSelect={showSelect}
                      selectedItems={selectedItems}
                      setSelectedItems={setSelectedItems}
                      setSelectedItemsData={setSelectedItemsData}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* QR Code & Share Section */}
            {selectedItems.length > 0 && (
              <div className="flex flex-col-reverse md:flex-row gap-10">
                <div className="mt-6 flex flex-col items-center gap-4">
                  <p className="text-sm font-semibold dark:text-green-400">
                    Share your selected items QR code:
                  </p>

                  {/* Hidden QR Code */}
                  <QRCodeCanvas
                    id="share-qr-code"
                    value={JSON.stringify(selectedItems)}
                    size={180}
                    level={"H"}
                    includeMargin={true}
                    style={{ display: "none" }}
                  />

                  <button
                    onClick={shareQRCodeAsImage}
                    className="px-4 py-2 rounded-md bg-green-500 text-white shadow hover:bg-green-600"
                  >
                    Share / Copy QR Code
                  </button>

                  {/* Desktop preview */}
                  {qrDataUrl && (
                    <div className="flex flex-col items-center mt-3">
                      <p className="text-sm dark:text-green-400">
                        QR Code Preview (Desktop)
                      </p>
                      <img
                        src={qrDataUrl}
                        alt="QR Code"
                        className="w-40 h-40 mt-1"
                      />
                    </div>
                  )}
                </div>
                <div className="mt-6 flex flex-col items-center gap-4">
                  <p className="text-sm font-semibold dark:text-green-400">
                    Share your selected items QR code:
                  </p>
                  {/* <button className="px-4 py-2 rounded-md bg-green-500 text-white shadow hover:bg-green-600">
                    Order
                  </button> */}
                  <button
                    onClick={() => {
                      if (selectedItems.length === 0) {
                        toast.error("Select items first");
                        return;
                      }
                      setShowCheckout(true);
                    }}
                    className="px-4 py-2 rounded-md bg-green-500 text-white shadow hover:bg-green-600"
                  >
                    Order Selected Items
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div
            className={`flex flex-col gap-10 w-2/3 items-center justify-center text-3xl dark:text-green-400 font-bold mb-5 ${
              theme === "light"
                ? "bg-white/90 border-1 shadow-xl drop-shadow-2xl/50"
                : "bg-gray-800"
            }   bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl  py-10 border-[0.5px] dark:border-green-500`}
          >
            <div className="size-50 flex flex-col gap-5 ">
              <img
                src={EmptyCartImg}
                className="size-full object-center"
                alt=""
              />
              <div className="flex flex-col items-center justify-center">
                <div className="dark:text-green-500 text-lg">
                  Your cart is empty!
                </div>
                <div className="dark:text-green-500 text-sm font-normal">
                  Add items to it now.
                </div>
              </div>
            </div>

            <div className="mt-5">
              <button
                className={` ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white hover:bg-gradient-to-br focus:ring-green-300 dark:focus:ring-green-800"
                    : "bg-gradient-to-r from-cyan-400 via-cyan-500 to-cyan-600 text-white hover:bg-gradient-to-br focus:ring-cyan-300 dark:focus:ring-cyan-800"
                } text-lg py-2 px-5 rounded-md shadow-lg`}
                onClick={() => navigate("/home")}
              >
                Shop Now
              </button>
            </div>
          </div>
        )}
      </div>
      {showCheckout && (
        <CheckoutModal
          isOpen={showCheckout}
          onClose={() => setShowCheckout(false)}
          selectedItems={selectedItemsData}
        />
      )}
    </div>
  );
};

export default Cart;
