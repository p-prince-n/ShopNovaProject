import { HiOutlineUserGroup } from "react-icons/hi";
import { FaTags, FaShoppingBag } from "react-icons/fa";
import DashboardCard from "./DashboardCard";
import { useCategoryStore } from "../../../Store/useCategoryStore";
import { useUserStore } from "../../../Store/useUserStore";
import { useProductStore } from "../../../Store/useProductStore";
import { useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";

import LoaderAnimation from "../../LoaderAnimation";
import { motion } from "framer-motion"; 
import AdminAnalytics from "../../../Pages/AdminAnalytics";


const AdminDashboard = () => {
  const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const fadeDown = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

  const categoryLoading = useCategoryStore((state) => state.loading);
  const totalCategories = useCategoryStore((state) => state.totalCategories);
  const getCategories = useCategoryStore((state) => state.getCategories);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);
  const categories = useCategoryStore((state) => state.categories);

  const userLoading = useUserStore((state) => state.loading);
  const totalUsers = useUserStore((state) => state.totalUsers);
  const getUsers = useUserStore((state) => state.getAllUsers);
  const getAllUsers = useUserStore((state) => state.getAllUsers);
  const users = useUserStore((state) => state.users);

  const productLoading = useProductStore((state) => state.loading);
  const totalProducts = useProductStore((state) => state.totalProducts);
  const getProducts = useProductStore((state) => state.getProducts);
  const fetchProducts = useProductStore((state) => state.fetchProducts);
  const products = useProductStore((state) => state.products);
  console.log("product", products);

  useEffect(() => {
    getCategories();
    fetchCategories(0, 5);
  }, [getCategories, totalCategories, fetchCategories]);
  useEffect(() => {
    getUsers();
    getAllUsers(0, 5);
  }, [getUsers, totalUsers, getAllUsers]);
  useEffect(() => {
    getProducts();
    fetchProducts(0, 5);
  }, [getProducts, totalProducts, fetchProducts]);

  if (categoryLoading || userLoading || productLoading)
    return <LoaderAnimation />;

  const cardData = [
    {
      title: "Total Users",
      total: totalUsers,
      icon: (
        <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg " />
      ),
      data: "lastMonthsUsers",
    },
    {
      title: "Total Categories",
      total: totalCategories,
      icon: (
        <FaTags className="bg-red-500 text-black rounded-full text-5xl p-3 shadow-lg " />
      ),
      data: "lastMonthsCategories",
    },
    {
      title: "Total Products",
      total: totalProducts,
      icon: (
        <FaShoppingBag className="bg-blue-800 text-white rounded-full text-5xl p-3 shadow-lg " />
      ),
      data: "lastMonthsProducts",
    },
  ];
  return (
    <div className="py-3 px-1 md:mx-auto flex flex-col gap-3 ">
      <motion.div
        className="flex flex-wrap gap-2 justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
      >
        {cardData.map((item, idx) => (
          <motion.div key={idx} variants={fadeUp}>
            <DashboardCard
              title={item.title}
              icon={item.icon}
              total={item.total}
              data={item.data}
            />
          </motion.div>
        ))}
      </motion.div>
      <AdminAnalytics/>
     
      <motion.div className="flex flex-wrap gap-4 py-3 mx-auto justify-center "   initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}>
        <motion.div
          variants={fadeDown} className="flex flex-col w-full md:w-auto shadow-md py-2 rounded-md dark:bg-gray-900">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center dark:text-green-400 p-2">
              Recent Users
            </h1>
            <Button
              className=" bg-transparent dark:bg-transparent text-black dark:text-white border-1 border-purple-500  
                             hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500  hover:text-white hover:border-0
                             active:bg-gradient-to-r active:from-purple-700 active:to-pink-600 active:text-white active:border-0
                             transition-all duration-300 ease-in-out 
                             focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <Link to={"/admin?tab=users"}> see all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Mobile</TableHeadCell>
            </TableHead>
            {users &&
              users.map((user) => (
                <TableBody key={user._id} className="divide-y">
                  <TableRow className="bg-white dark:border-gray-300 dark:bg-gray-900">
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.mobileNumber}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </motion.div>
        <motion.div
          variants={fadeUp} className="flex flex-col w-full md:w-auto shadow-md py-2 rounded-md dark:bg-gray-900">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center dark:text-green-400 p-2">
              Recent Categories
            </h1>
            <Button
              className=" bg-transparent dark:bg-transparent text-black dark:text-white border-1 border-purple-500  
                             hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500  hover:text-white hover:border-0
                             active:bg-gradient-to-r active:from-purple-700 active:to-pink-600 active:text-white active:border-0
                             transition-all duration-300 ease-in-out 
                             focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <Link to={"/admin?tab=categories"}> see all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>image</TableHeadCell>
              <TableHeadCell>name</TableHeadCell>
            </TableHead>
            {categories &&
              categories.map((category) => (
                <TableBody key={category._id} className="divide-y">
                  <TableRow className="bg-white dark:border-gray-300 dark:bg-gray-900">
                    <TableCell>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="size-10 rounded-full bg-gray-500"
                      />
                    </TableCell>
                    <TableCell>{category.name}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </motion.div>
        <motion.div
          variants={fadeDown} className="flex flex-col w-full md:w-auto shadow-md py-2 rounded-md dark:bg-gray-900">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center dark:text-green-400 p-2">
              Recent Products
            </h1>
            <Button
              className=" bg-transparent dark:bg-transparent text-black dark:text-white border-1 border-purple-500  
                             hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500  hover:text-white hover:border-0
                             active:bg-gradient-to-r active:from-purple-700 active:to-pink-600 active:text-white active:border-0
                             transition-all duration-300 ease-in-out 
                             focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              <Link to={"/admin?tab=products"}> see all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Image</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Rating </TableHeadCell>
            </TableHead>
            {products &&
              products.map((product) => (
                <TableBody key={product._id} className="divide-y">
                  <TableRow className="bg-white dark:border-gray-300 dark:bg-gray-900">
                    <TableCell>
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="size-10 rounded-full bg-gray-500"
                      />
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.ratings}/5</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </motion.div>
      </motion.div>
      </div>
  
  );
};

export default AdminDashboard;
