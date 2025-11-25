import React from "react";
import { useAuthStore } from "../../Store/authStore";
import { useNavigate } from "react-router-dom";

const ListItem = ({ icon: Icon, text, link }) => {
  const {user}=useAuthStore();
  const navigate=useNavigate();
  const navigateToLink=()=>{

    
      navigate(link)

  }


  return (
    <li onClick={navigateToLink} className="px-4 py-2 hover:bg-blue-300 text-black dark:hover:bg-green-300 dark:hover:text-green-950 rounded-md dark:text-white flex items-center gap-2 cursor-pointer">
      <Icon /> {text}
    </li>
  );
};

export default ListItem;
