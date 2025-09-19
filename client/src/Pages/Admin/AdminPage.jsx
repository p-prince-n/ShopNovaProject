import SideBarItemGroup from "../../components/Admin/Category/SideBarItem.jsx"
import { useAuthStore } from "../../Store/authStore";
import { IoMdAddCircleOutline } from "react-icons/io"
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
import { Home, Monitor } from "lucide-react";
import DashUsers from "../../components/Admin/DashUsers.jsx";
import DashCategories from "../../components/Admin/DashCategories.jsx";
import DashProducts from "../../components/Admin/DashProduct.jsx";
import AdminSidebar from "../../components/Admin/AdminSlideBar.jsx";
import SellerVerificationPage from "../../components/Admin/Seller/SellerVerificationPage.jsx";
import DashVerifiedSeller from "../../components/Admin/DashVerifiedSeller.jsx";

const AdminPage = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab]=useState('');
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
    {name:"Dashboard", tab: "/admin?tab=dashboard"},
    {name:"New Category", tab: "/admin?tab=newCategory"},
    {name:"New Product", tab: "/admin?tab=newProduct"},
    {name:"Update Category", tab: "/admin?tab=updateCategory"},
    {name:"Update Product", tab: "/admin?tab=updateProduct"},
    {name:"Delete Category", tab: "/admin?tab=deleteCategory"},
    {name:"Delete Product", tab: "/admin?tab=deleteProduct"},
    {name:"Users", tab: "/admin?tab=users"},
    {name:"Categories" , tab:"/admin?tab=categories"},
     {name:"Products" , tab:"/admin?tab=products"},
     {name:"Seller Verification" , tab:"/admin?tab=sellerVerification"},
     {
          name:"Seller",
          tab:"/admin?tab=verifiedSeller"
        },
  ];
const currentItem = SideBarItemSmallDevice.find(item => item.tab.includes(selectedTab));
  const siderBarData = [
    {
      id: 1,
      title: "Add Data",
      items:[
        {
          item:"New Category",
          tab:"/admin?tab=newCategory"
        },
        {
          item:"New Product",
          tab:"/admin?tab=newProduct"
        }
      ],
      // items: ["New Category", "New Product"],
      icon: <IoMdAddCircleOutline />,
    },
    {
      id: 2,
      title: "Updates",
      items:[{
          item:"Update Category",
          tab:"/admin?tab=updateCategory"
        },
        {
          item:"Update Product",
          tab:"/admin?tab=updateProduct"
        },
      ],
      // items: ["Update Category", "Update Product"],
      icon: <MdUpdate />,
    },
    {
      id: 3,
      title: "Delete",
      items:[
        {
          item:"Delete Category",
          tab:"/admin?tab=deleteCategory"
        },
        {
          item:"Delete Product",
          tab:"/admin?tab=deleteProduct"
        },
      ],
      // items: ["Delete Category", "Delete Product"],
      icon: <FiTrash2 />,
    },
    {
      id: 4,
      title: "Display",
      items:[
        {
          item:"Users",
          tab:"/admin?tab=users"
        },
        {
          item:"Categories",
          tab:"/admin?tab=categories"
        },
        {
          item:"Products",
          tab:"/admin?tab=products"
        },
         {
          item:"Seller",
          tab:"/admin?tab=verifiedSeller"
        },
      ],
      // items: ["Delete Category", "Delete Product"],
      icon:<Monitor className="size-6" />,
    },
  ];
  const handleClickonItem = (link) => {
    navigate(link)
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
      <div className={`absolute  top-10 md:top-20 left-0 overflow-x-auto px-2 md:px-10 xl:px-30  py-10 min-w-screen md:w-full`}>
        <div className="flex flex-col md:flex-row justify-center items-center md:items-start">
          <AdminSidebar data={currentItem.name} />
          {/* left sidebar */}
          

          <div className="hidden md:block md:flex-2/7   xl:w-xs ">
            <div className="flex flex-col gap-6 w-5/6 ">
              {/* left upper */}
              <div className="flex gap-2 items-center bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-black md:text-md">
                <div className="overflow-hidden rounded-full size-20 flex items-center justify-center">
                  <img
                    src="data:image/png;base64,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"
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
              <div className="flex flex-col items-center bg-white  dark:bg-gray-800 rounded-xl shadow-md dark:text-green-400 shadow-black ">
                <div className="flex flex-col w-full ">
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
                    onClick={() => handleClickonItem("/admin?tab=sellerVerification")}
                  >
                    <div className="md:text-sm xl:text-md 2xl:text-xl">
                      <Home />
                    </div>
                    <div className="uppercase md:text-sm xl:text-md ">
                      <h2>Verify Seller</h2>
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
            className="flex-5/7 h-screen md:h-[calc(100vh-8rem)]
             rounded-xl px-3 md:px-7 overflow-y-auto  scrollbar-hide"
          >
            <div className="bg-white dark:bg-gray-800 p-5 min-h-full ">
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
              {selectedTab === "sellerVerification" && <SellerVerificationPage/>}
              {selectedTab === "verifiedSeller" && <DashVerifiedSeller/>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
