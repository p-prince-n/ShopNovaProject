import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuthStore } from "../../Store/authStore";

const SideBarItem = ({ text, isActive }) => {
  return (
    <div
      className={`flex py-2 items-center pl-10 justify-start cursor-pointer
        hover:bg-blue-200 hover:dark:bg-green-300 text-sm
        hover:text-blue-700 hover:dark:text-black hover:font-bold w-full
        ${isActive ? 'bg-blue-600 text-white dark:bg-green-800 dark:text-white' : ''}`}
    >
      <p>{text}</p>
    </div>
  );
};

const SideBarItemGroup = ({ icon, arr, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const Icon = icon;

  const queryParams = new URLSearchParams(location.search);
  const currTab = queryParams.get("tab");

  const handleClick = (tab) => {
    navigate(`/data/${user._id}/?tab=${tab}`);
  };

  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex items-center pl-5 justify-start gap-5 py-3">
          <div className="md:text-sm xl:text-md 2xl:text-xl">{icon}</div>
          <div className="uppercase md:text-sm xl:text-md">
            <h2>{title}</h2>
          </div>
        </div>

        {arr.map((item) => (
          <div key={item.tab} className="w-full h-full" onClick={() => handleClick(item.tab)}>
            <SideBarItem text={item.name} isActive={currTab === item.tab} />
          </div>
        ))}
      </div>
      <div className="w-full h-[1px] bg-blue-500 dark:bg-gray-600"></div>
    </>
  );
};

export default SideBarItemGroup;
