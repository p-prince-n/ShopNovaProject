// import { motion, AnimatePresence } from "framer-motion";
// import { NavBarLinks } from "./data.js";

// const ResponsiveMenu = ({ open }) => {
//   return (
//     <AnimatePresence mode="wait">
//       {open && (
//         <motion.div
//           initial={{ opacity: 0, y: -100 }}
//           animate={{ opacity: 1, y: 0 }}
//           exit={{ opacity: 0, y: -100 }}
//           transition={{ duration: 0.5 }}
//           className="absolute top-20 left-0 w-full h-screen z-20 "
//         >
//           <div className="text-xl font-semibold uppercase bg-blue-300 text-black/55 dark:bg-emerald-400 dark:text-white py-5 m-6 rounded-3xl ">
//             <ul className="flex flex-col justify-center items-center gap-4 ">
//               {NavBarLinks.map((item) => (
              
//                 <li
//                   key={item.id}
//                   className=" w-[90%] bg-blue-500 dark:bg-emerald-600 h-12 flex items-center justify-center rounded-xl"
//                 >
//                   <a href={item.link}>{item.title}</a>
//                 </li>
                
//               ))}
//             </ul>
//           </div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ResponsiveMenu;
