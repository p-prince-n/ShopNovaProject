import { motion } from "framer-motion";
import { FaFacebook, FaTwitter, FaInstagram, FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <motion.footer
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 80, damping: 15 }}
      className="w-full  bg-white shadow-xl shadow-cyan-700 dark:shadow-black dark:bg-gray-900 backdrop-blur-md border-t border-gray-200 dark:border-gray-700"
    >
      {/* Top Sections */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <motion.h1
            whileHover={{ scale: 1.05 }}
            className="text-2xl font-bold text-cyan-700 dark:text-cyan-400"
          >
            ShopNova
          </motion.h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Discover the future of shopping with ShopNova — where quality,
            trust, and innovation meet.
          </p>
          <div className="flex items-center gap-5 mt-4 text-gray-600 dark:text-gray-400">
            {[FaFacebook, FaTwitter, FaInstagram, FaGithub].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, rotate: 8 }}
                whileTap={{ scale: 0.9 }}
                className="transition-colors hover:text-cyan-500 dark:hover:text-cyan-300"
              >
                <Icon size={22} />
              </motion.a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Quick Links
          </h2>
          <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400">
            <li><a href="/home" className="hover:text-cyan-500 dark:hover:text-cyan-300">Home</a></li>
            <li><a href="#" className="hover:text-cyan-500 dark:hover:text-cyan-300">Shop</a></li>
            <li><a href="/about" className="hover:text-cyan-500 dark:hover:text-cyan-300">About Us</a></li>
            <li><a href="#" className="hover:text-cyan-500 dark:hover:text-cyan-300">Contact</a></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Resources
          </h2>
          <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400">
            <li><a href="#" className="hover:text-cyan-500 dark:hover:text-cyan-300">Blog</a></li>
            <li><a href="#" className="hover:text-cyan-500 dark:hover:text-cyan-300">FAQs</a></li>
            <li><a href="#" className="hover:text-cyan-500 dark:hover:text-cyan-300">Support</a></li>
            <li><a href="/privacy" className="hover:text-cyan-500 dark:hover:text-cyan-300">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Stay Updated
          </h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Subscribe to ShopNova’s newsletter for exclusive deals, latest trends, and product launches.
          </p>
          <form className="mt-4 flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-3 py-2 rounded-l-xl border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-800 dark:text-gray-200"
            />
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="px-4 py-2 bg-cyan-600 text-white rounded-r-xl hover:bg-cyan-700 transition"
            >
              Subscribe
            </motion.button>
          </form>
        </div>
      </div>

      {/* Bottom */}
      <div className="text-center py-5 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
        © {new Date().getFullYear()} <span className="font-semibold text-cyan-600 dark:text-cyan-400">ShopNova</span>. All rights reserved.
      </div>
    </motion.footer>
  );
};

export default Footer;
