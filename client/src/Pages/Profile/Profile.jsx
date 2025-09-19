import SideBarItemGroup from "../../components/Profile/SideBarItem";
import { useAuthStore } from "../../Store/authStore";
import { ImFolderUpload, ImArrowRight2, ImUser } from "react-icons/im";
import { FaWallet } from "react-icons/fa";
import { FaClipboardUser } from "react-icons/fa6";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { useThemeStore } from "../../Store/useThemeStore";

import PersonalInformation from "../../components/Profile/PersonalInformation.jsx";
import UpiFaqs from "../../components/Profile/UpiFaqs.jsx";
import CardFaqs from "../../components/Profile/CardFaqs.jsx";
import { useState, useEffect } from "react";
import ManageAddress from "../../components/Profile/ManageAddress.jsx";
import MyReviewRating from "../../components/Profile/MyReviewRating.jsx";
import Notification from "../../components/Profile/Notification.jsx";
import MyWishList from "../../components/Profile/MyWishList.jsx";
import DropdownMenuSlider from "./SideBarItem.jsx";
import { useSearchParams } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [rightDetailPage, setRightDetailPage] = useState("Profile Information");
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "profile"; // default to profile
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useThemeStore();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const SideBarItemSmallDevice = [
    "Profile Information",
    "Manage Address",
    "Saved UPI",
    "Saved Cards",
    "My Review & Ratings",
    "All Notifications",
    "My WishList",
  ];
  const siderBarData = [
    {
      id: 1,
      title: "Account Settings",
      items: [
        { name: "Profile Information", tab: `profile` },
        { name: "Manage Address", tab: `address` },
      ],
      icon: <ImUser />,
    },
    {
      id: 2,
      title: "Payments",
      items: [
        { name: "Saved UPI", tab: `savedUPI` },
        { name: "Saved Cards", tab: `saveCard` },
      ],
      icon: <FaWallet />,
    },
    {
      id: 3,
      title: "My Stuff",
      items: [
        { name: "My Review & Ratings", tab: `reviewrating` },
        { name: "All Notifications", tab: `notification` },
        { name: "My WishList", tab: `wishlist` },
      ],
      icon: <FaClipboardUser />,
    },
  ];
  console.log(tab);

  // const siderBarData = [
  //   {
  //     id: 1,
  //     title: "Account Settings",
  //     items: ["Profile Information", "Manage Address"],
  //     icon: <ImUser />,
  //   },
  //   {
  //     id: 2,
  //     title: "Payments",
  //     items: ["Saved UPI", "Saved Cards"],
  //     icon: <FaWallet />,
  //   },
  //   {
  //     id: 3,
  //     title: "My Stuff",
  //     items: ["My Review & Ratings", "All Notifications", "My WishList"],
  //     icon: <FaClipboardUser />,
  //   },
  // ];
  // const handleClickonItem = (item) => {
  //   setRightDetailPage(item);
  // };

  const handleClickonItem = (itemTab) => {
    setSearchParams({ tab: itemTab });
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
      <div className="absolute top-10 md:top-20 left-0 overflow-x-auto px-2 md:px-10 xl:px-30 2xl:px-6s0 py-10  w-full">
        <div className="flex flex-col md:flex-row justify-center items-start">
          {/* left sidebar */}
          <div className="md:hidden min-w-screen flex items-center justify-center py-5">
            <div className={` relative w-full ${isOpen && "h-70 "}`}>
              <DropdownMenuSlider
                currVal={rightDetailPage}
                handleSeletedData={handleClickonItem}
              />
            </div>
          </div>

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
                  <h6 className="dark:text-green-400 md:text-sm xl:text-md">
                    Hello,
                  </h6>
                  <h2 className="font-bold dark:text-green-400 md:text-sm xl:text-md">
                    {user.name}
                  </h2>
                </div>
              </div>
              {/* left down  */}
              <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md dark:text-green-400 shadow-black ">
                <div
                  className="flex items-center md:gap-5 xl:gap-30 hover:text-blue-700 hover:bg-blue-200 dark:hover:bg-green-300 dark:hover:text-black hover:font-bold rounded-t-xl w-full justify-center "
                  onClick={() => navigate("/orders")}
                >
                  <div className="flex gap-3 items-center py-3 md:text-sm xl:text-md ">
                    <div>
                      <ImFolderUpload />
                    </div>
                    <div>
                      <h3>My Order</h3>
                    </div>
                  </div>
                  <div>
                    <ImArrowRight2 />
                  </div>
                </div>
                <div className="w-full h-[1px] bg-blue-500 dark:bg-gray-600"></div>
                {siderBarData.map((item) => (
                  <SideBarItemGroup
                    key={item.id}
                    title={item.title}
                    arr={item.items}
                    icon={item.icon}
                    currVal={rightDetailPage}
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
            className={`flex-5/7 h-screen md:h-[calc(100vh-8rem)] 
             rounded-xl px-3 md:px-7 overflow-y-auto scrollbar-hide ${
               isMobile && "flex items-center justify-center w-full"
             }`}
          >
            <div className="bg-white dark:bg-gray-800 p-5 min-h-full  ">
              {tab === "profile" && <PersonalInformation />}
              {tab === "address" && <ManageAddress />}
              {tab === "savedUPI" && <UpiFaqs />}
              {tab === "saveCard" && <CardFaqs />}
              {tab === "reviewrating" && <MyReviewRating />}
              {tab === "notification" && <Notification />}
              {tab === "wishlist" && <MyWishList />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
