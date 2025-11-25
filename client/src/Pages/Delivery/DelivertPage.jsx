import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDeliveryManStore } from "../../Store/useDeliveryMan";
import { useAuthStore } from "../../Store/authStore";
import { House, Package, TruckIcon, Clipboard, Inbox } from "lucide-react";
import DeliveryProfile from "../../components/Delivery/DeliveryProfile";
import DeliverShipProduct from "../../components/Delivery/DeliverShipProduct";
import VerifieddeliveryPage from "../../components/Delivery/VerifiedDeliveryPage";
import DeliverySidebar from "./DeliverySidebar";

const DeliveryPage = () => {
  const { user } = useAuthStore();
  const { deliveryManProfile, getDeliveryManProfile } = useDeliveryManStore();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const sidebarItem = [
    {
      id: 0,
      title: "Profile",
      icon: <House />,
      link: "/delivery-page?tab=profile",
    },
    {
      id: 2,
      title: "Shipments",
      icon: <Package />,
      link: "/delivery-page?tab=shipments",
    },
    {
      id: 4,
      title: "Delivery Tasks",
      icon: <TruckIcon />,
      link: "/delivery-page?tab=tasks",
    },
  ];

  useEffect(() => {
    if (user?.isDeliveryMan && user?.isDeliveryManVerification) {
      getDeliveryManProfile();
    }
  }, [user?.isDeliveryMan, user?.isDeliveryManVerification, getDeliveryManProfile]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) setSelectedTab(tabFromUrl);
  }, [location.search]);

  const handleClickonItem = (link) => {
    navigate(link);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      className={`min-w-screen min-h-screen relative ${
        isMobile ? "overflow-y-auto scrollbar-hide" : ""
      }`}
    >
      <div
        className={`flex items-center justify-center mt-10 md:mt-20 left-0 overflow-x-auto px-2 md:px-10 xl:px-30 py-10 min-w-screen md:w-full`}
      >
        <div className="flex flex-1 flex-col md:flex-row justify-center items-center md:items-start">
          {/* Sidebar */}
          <DeliverySidebar/>
          <div className="hidden md:block md:flex-2/7 xl:w-xs">
            <div className="flex flex-col gap-6 w-5/6">
              {/* Top Info */}
              <div className="flex gap-2 items-center bg-white dark:bg-gray-800 rounded-xl shadow-md shadow-black md:text-md">
                <div className="overflow-hidden rounded-full size-20 flex items-center justify-center">
                  <img
                    src={"https://img.freepik.com/premium-vector/express-delivery-logo-design-vector-template_441059-204.jpg?semt=ais_hybrid&w=740&q=80"}
                    alt={deliveryManProfile?.name}
                    className="rounded-full size-15"
                  />
                </div>
                <div>
                  <h1 className="text-red-800 text-xl dark:text-red-500 font-bold underline">
                    Delivery
                  </h1>
                  <h6 className="dark:text-green-400 md:text-sm xl:text-md">
                    Welcome,
                  </h6>
                  <h2 className="font-bold dark:text-green-400 md:text-sm xl:text-md">
                    {deliveryManProfile?.user?.name}
                  </h2>
                </div>
              </div>
              {/* Sidebar Items */}
              <div className="flex pb-5 flex-col items-center bg-white dark:bg-gray-800 rounded-xl shadow-md dark:text-green-400 shadow-black">
                {sidebarItem.map((item) => (
                  <div key={item.id} className="w-full">
                    <div
                      className={`flex flex-col w-full cursor-pointer hover:bg-blue-200 hover:dark:bg-green-300 text-sm hover:text-blue-700 hover:dark:text-black hover:font-bold ${
                        item.link.split("=")[1] ===
                          selectedTab.toLocaleLowerCase() &&
                        "hover:bg-blue-600 hover:text-white bg-blue-600 text-white hover:dark:bg-green-800 dark:bg-green-800 hover:dark:text-white dark:text-white "
                      }`}
                      onClick={() => handleClickonItem(item.link)}
                    >
                      <div className="flex items-center pl-5 justify-start gap-5 py-3">
                        <div className="md:text-sm xl:text-md 2xl:text-xl">{item.icon}</div>
                        <div className="uppercase md:text-sm xl:text-md ">
                          <h2>{item.title}</h2>
                        </div>
                      </div>
                    </div>
                    <div className="w-full h-[1px] bg-blue-500 dark:bg-gray-600"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Right Side Content */}
          <div
            className="flex-5/7 h-screen md:h-[calc(100vh-8rem)] rounded-xl px-3 md:px-7 overflow-y-auto scrollbar-hide"
          >
            <div className="bg-white dark:bg-gray-800 p-5 min-h-full">
              {selectedTab === "profile" && <DeliveryProfile/>}
              {selectedTab === "shipments" && <DeliverShipProduct/>}
              {selectedTab === "tasks" && <VerifieddeliveryPage/>}
              {/* {selectedTab === "orders" && <DeliveryOrders />}
              {selectedTab === "shipments" && <Shipments />}
              {selectedTab !== "orders" && selectedTab !== "shipments" && (
                <DeliveryProfile profile={deliveryProfile} />
              )} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPage;
