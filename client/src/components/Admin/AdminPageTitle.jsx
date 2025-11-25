import React from "react";

const AdminPageTitle = ({ data, operation }) => {
  return (
    <>
      <div className="flex w-full justify-center items-center">
        <h1 className="text-md xl:text-xl 2xl:text-2xl text-black dark:text-green-500 font-bold">
          {`${operation}  ${data}`}
        </h1>
      </div>

      <div className="flex w-full justify-center items-center mt-3">
        <div className="h-[0.5px] w-3/4 bg-black/55 dark:bg-gray-400"></div>
      </div>
    </>
  );
};

export default AdminPageTitle;
