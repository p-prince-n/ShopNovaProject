import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import React, { useEffect, useState } from "react";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Link } from "react-router-dom";

const DashboardCard = ({title, total, icon, data}) => {
  return (
    <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-xl dark:border-[0.5px] dark:border-gray-500 ">
      <div className="flex justify-between">
        <div>
          <h3 className="text-gray-500 font-bold dark:text-white/75 text-md uppercase">{title}</h3>
          <p className="text-2xl dark:text-green-400 ">{total}</p>
        </div>
        {icon}
      </div>
      <div className="flex gap-2 text-sm ">
        <span className="text-green-500 flex items-center ">
          <HiArrowNarrowUp />
          {data}
        </span>
        <div className="text-gray-500">Last month</div>
      </div>
    </div>
  );
};

export default DashboardCard;
