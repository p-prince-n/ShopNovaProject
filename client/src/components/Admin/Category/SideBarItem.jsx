const SideBarItem = ({ text,currVal, currTab }) => {
  return (
    <div className={`flex py-2 items-center pl-10 justify-start cursor-pointer hover:bg-blue-200 hover:dark:bg-green-300 text-sm hover:text-blue-700 hover:dark:text-black hover:font-bold w-full ${(currTab.split("=")[1])===currVal && 'bg-blue-600 text-white dark:bg-green-800 dark:text-white '}`}>
      <p className="">{text}</p>
    </div>
  );
};

const SideBarItemGroup = ({icon, arr, title, HandleClick,currVal}) => {
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="flex items-center pl-5 justify-start gap-5 py-3">
          <div className="md:text-sm xl:text-md 2xl:text-xl">
            {icon}
          </div>
          <div className="uppercase md:text-sm xl:text-md ">
            <h2>{title}</h2>
          </div>
        </div>

        {arr.map((item) => (
          <div className="w-full h-full " onClick={()=>HandleClick(item.tab)}>
            <SideBarItem text={item.item} currTab={item.tab}  currVal={currVal} />
          </div>
        ))}
      </div>
      <div className="w-full h-[1px] bg-blue-500 dark:bg-gray-600"></div>
    </>
  );
};

export default SideBarItemGroup;
