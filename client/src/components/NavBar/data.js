import { FaUserCircle, FaGift, FaHeart } from "react-icons/fa";
import { MdOutlineLocalOffer } from "react-icons/md";
import { BsBoxSeam } from "react-icons/bs";
import { RiCouponLine } from "react-icons/ri";



export const NavBarLinks = [
  { id: 1, title: "home", link: "/home" },
  { id: 2, title: "about", link: "/about" },
  { id: 3, title: "products", link: "/products" },
  { id: 4, title: "contact", link: "/contact" },
  { id: 5, title: "hello", link: "/hello" },
];

export const DropDownItem = [
  { id: 1, title: "My Profile", icon: FaUserCircle, link : `/data/profile`, },
  { id: 2, title: "ShopNova Plus Zone", icon: MdOutlineLocalOffer, link : "/plus-zone", },
  { id: 3, title: "Orders", icon: BsBoxSeam, link : "/orders", },
  { id: 4, title: "Wishlist", icon: FaHeart, link : "/wishlist", },
  { id: 5, title: "Rewards", icon: RiCouponLine, link : "/rewards", },
  { id: 6, title: "Gift Cards", icon: FaGift, link : "/gift-card", },
];
