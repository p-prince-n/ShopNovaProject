import SideBarItemGroup from "../../components/Admin/Category/SideBarItem.jsx";
import { useAuthStore } from "../../Store/authStore";
import { IoMdAddCircleOutline } from "react-icons/io";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { MdIncompleteCircle } from "react-icons/md";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { MdUpdate } from "react-icons/md";
import CreateProduct from "../../components/Admin/Product/CreateProduct.jsx";
import CreateCategory from "../../components/Admin/Category/CreateCategory.jsx";
import UpdateCategory from "../../components/Admin/Category/UpdateCategory.jsx";
import UpdateProduct from "../../components/Admin/Product/UpdateProduct.jsx";
import DeleteCategory from "../../components/Admin/Category/DeleteCategory.jsx";
import DeleteProduct from "../../components/Admin/Product/DeleteProduct.jsx";
import AdminDashboard from "../../components/Admin/Dashboard/AdminDashboard.jsx";
import { FiTrash2 } from "react-icons/fi";
import { Home, Monitor, TruckElectricIcon } from "lucide-react";
import DashUsers from "../../components/Admin/DashUsers.jsx";
import DashCategories from "../../components/Admin/DashCategories.jsx";
import DashProducts from "../../components/Admin/DashProduct.jsx";
import AdminSidebar from "../../components/Admin/AdminSlideBar.jsx";
import SellerVerificationPage from "../../components/Admin/Seller/SellerVerificationPage.jsx";
import DashVerifiedSeller from "../../components/Admin/DashVerifiedSeller.jsx";
import DeliveryManVerificationPage from "../../components/Admin/Delivery/DeliveryManVerificationPage.jsx";
import DashVerifiedDelivery from "../../components/Admin/DashVerifiedDelivery.jsx";
import DashOrder from "../../components/Admin/DashOrder.jsx";

const AdminPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");

    if (tabFromUrl) {
      setSelectedTab(tabFromUrl);
    }
  }, [location.search]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log(selectedTab);

  const SideBarItemSmallDevice = [
    { name: "Dashboard", tab: "/admin?tab=dashboard" },
    { name: "New Category", tab: "/admin?tab=newCategory" },
    { name: "New Product", tab: "/admin?tab=newProduct" },
    { name: "Update Category", tab: "/admin?tab=updateCategory" },
    { name: "Update Product", tab: "/admin?tab=updateProduct" },
    { name: "Delete Category", tab: "/admin?tab=deleteCategory" },
    { name: "Delete Product", tab: "/admin?tab=deleteProduct" },
    { name: "Users", tab: "/admin?tab=users" },
    { name: "Categories", tab: "/admin?tab=categories" },
    { name: "Products", tab: "/admin?tab=products" },
    { name: "Seller Verification", tab: "/admin?tab=sellerVerification" },
    {
      name: "Seller",
      tab: "/admin?tab=verifiedSeller",
    },
    {
      name: "Delivery Verification",
      tab: "/admin?tab=deliveryVerification",
    },
    { name: "Delivery", tab: "/admin?tab=verifieddelivery" },
    { name: "OrderItems", tab: "/admin?tab=tab=OrderItem" },

  ];

  const currentItem = SideBarItemSmallDevice.find((item) =>
    item.tab.includes(selectedTab)
  );
  const siderBarData = [
    {
      id: 1,
      title: "Add Data",
      items: [
        {
          item: "New Category",
          tab: "/admin?tab=newCategory",
        },
        {
          item: "New Product",
          tab: "/admin?tab=newProduct",
        },
      ],

      icon: <IoMdAddCircleOutline />,
    },
    {
      id: 2,
      title: "Updates",
      items: [
        {
          item: "Update Category",
          tab: "/admin?tab=updateCategory",
        },
        {
          item: "Update Product",
          tab: "/admin?tab=updateProduct",
        },
      ],

      icon: <MdUpdate />,
    },
    {
      id: 3,
      title: "Delete",
      items: [
        {
          item: "Delete Category",
          tab: "/admin?tab=deleteCategory",
        },
        {
          item: "Delete Product",
          tab: "/admin?tab=deleteProduct",
        },
      ],

      icon: <FiTrash2 />,
    },
    {
      id: 4,
      title: "Display",
      items: [
        {
          item: "Users",
          tab: "/admin?tab=users",
        },
        {
          item: "Categories",
          tab: "/admin?tab=categories",
        },
        {
          item: "Products",
          tab: "/admin?tab=products",
        },
        {
          item: "Seller",
          tab: "/admin?tab=verifiedSeller",
        },
        {
          item: "Delivery Man",
          tab: "/admin?tab=verifieddelivery",
        },
        {
          item: "Order Items",
          tab: "/admin?tab=OrderItem",
        },
      ],

      icon: <Monitor className="size-6" />,
    },
  ];
  const handleClickonItem = (link) => {
    navigate(link);
  };
  const HandleLogOut = () => {
    logout();
    navigate("/sign-in");
  };

  
  return (
    <div
      className={`min-w-screen min-h-screen relative ${
        isMobile ? "overflow-y-auto scrollbar-hide" : ""
      }`}
    >
      <div
        className={`flex   mt-10 md:mt-20 left-0 overflow-x-auto px-2 md:px-10 xl:px-30  py-10 min-w-screen md:w-full`}
      >
        <div className="flex flex-col flex-1 md:flex-row justify-center items-center">
          <AdminSidebar data={currentItem.name} />
          {/* left sidebar */}

          <div className="hidden md:block md:flex-2/7   xl:w-xs ">
            <div className="flex flex-col gap-6 w-5/6 ">
              {/* left upper */}
              <div className="flex gap-2 items-center bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-black md:text-md">
                <div className="overflow-hidden rounded-full size-20 flex items-center justify-center">
                  <img
                    src="https://img.freepik.com/free-vector/business-user-cog_78370-7040.jpg?semt=ais_hybrid&w=740&q=80"
                    alt=""
                    className="rounded-full size-15"
                  />
                </div>
                <div>
                  <h1 className="text-red-800 text-xl dark:text-red-500 font-bold underline">
                    Admin
                  </h1>
                  <h6 className="dark:text-green-400 md:text-sm xl:text-md">
                    Hello,
                  </h6>
                  <h2 className="font-bold dark:text-green-400 md:text-sm xl:text-md">
                    {user.name}
                  </h2>
                </div>
              </div>
              {/* left down  */}
              <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md dark:text-green-400 shadow-black">
                <div className="flex flex-col w-full h-full ">
                  <div
                    className={`flex items-center pl-5 justify-start gap-5 py-3 cursor-pointer hover:bg-blue-200 hover:dark:bg-green-300 text-sm hover:text-blue-700 hover:dark:text-black hover:font-bold w-full ${
                      selectedTab === "dashboard" &&
                      "bg-blue-600 text-white dark:bg-green-800 dark:text-white "
                    }`}
                    onClick={() => handleClickonItem("/admin?tab=dashboard")}
                  >
                    <div className="md:text-sm xl:text-md 2xl:text-xl rotate-105">
                      <MdIncompleteCircle />
                    </div>
                    <div className="uppercase md:text-sm xl:text-md ">
                      <h2>Dashboard</h2>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-blue-500 dark:bg-gray-600"></div>
                <div className="flex flex-col w-full ">
                  <div
                    className={`flex items-center pl-5 justify-start gap-5 py-3 cursor-pointer hover:bg-blue-200 hover:dark:bg-green-300 text-sm hover:text-blue-700 hover:dark:text-black hover:font-bold w-full ${
                      selectedTab === "sellerVerification" &&
                      "bg-blue-600 text-white dark:bg-green-800 dark:text-white "
                    }`}
                    onClick={() =>
                      handleClickonItem("/admin?tab=sellerVerification")
                    }
                  >
                    <div className="md:text-sm xl:text-md 2xl:text-xl">
                      <Home />
                    </div>
                    <div className="uppercase md:text-sm xl:text-md ">
                      <h2>Verify Seller</h2>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full ">
                  <div
                    className={`flex items-center pl-5 justify-start gap-5 py-3 cursor-pointer hover:bg-blue-200 hover:dark:bg-green-300 text-sm hover:text-blue-700 hover:dark:text-black hover:font-bold w-full ${
                      selectedTab === "deliveryVerification" &&
                      "bg-blue-600 text-white dark:bg-green-800 dark:text-white "
                    }`}
                    onClick={() =>
                      handleClickonItem("/admin?tab=deliveryVerification")
                    }
                  >
                    <div className="md:text-sm xl:text-md 2xl:text-xl">
                      <TruckElectricIcon />
                    </div>
                    <div className="uppercase md:text-sm xl:text-md ">
                      <h2>Verify Delivery</h2>
                    </div>
                  </div>
                </div>
                <div className="w-full h-[1px] bg-blue-500 dark:bg-gray-600"></div>
                {siderBarData.map((item) => (
                  <SideBarItemGroup
                    key={item.id}
                    title={item.title}
                    arr={item.items}
                    icon={item.icon}
                    currVal={selectedTab}
                    HandleClick={handleClickonItem}
                  />
                ))}
                <div className="flex justify-start ">
                  <div className="flex gap-3 items-center justify-start py-3 text-md ">
                    <div>
                      <TbLogout2
                        onClick={HandleLogOut}
                        className="hover:text-red-600 hover:underline hover:font-bold cursor-pointer"
                      />
                    </div>
                    <div>
                      <h3
                        className="hover:text-red-600 hover:underline hover:font-bold cursor-pointer"
                        onClick={HandleLogOut}
                      >
                        Logout
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* right side */}
          {/* right side */}
          <div
            className="flex-5/7 h-screen md:h-screen
             rounded-xl px-3 md:px-7 overflow-y-auto  scrollbar-hide"
          >
            <div className="bg-white dark:bg-gray-800 p-5 min-h-full rounded-lg ">
              {selectedTab === "dashboard" && <AdminDashboard />}
              {selectedTab === "newCategory" && <CreateCategory />}
              {selectedTab === "newProduct" && <CreateProduct />}
              {selectedTab === "updateCategory" && <UpdateCategory />}
              {selectedTab === "updateProduct" && <UpdateProduct />}
              {selectedTab === "deleteCategory" && <DeleteCategory />}
              {selectedTab === "deleteProduct" && <DeleteProduct />}
              {selectedTab === "users" && <DashUsers />}
              {selectedTab === "categories" && <DashCategories />}
              {selectedTab === "products" && <DashProducts />}
              {selectedTab === "deliveryVerification" && (
                <DeliveryManVerificationPage />
              )}
              {selectedTab === "sellerVerification" && (
                <SellerVerificationPage />
              )}
              {selectedTab === "verifiedSeller" && <DashVerifiedSeller />}
              {selectedTab === "verifieddelivery" && <DashVerifiedDelivery />}
               {selectedTab === "OrderItem" && <DashOrder />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
