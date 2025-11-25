
import { motion } from "framer-motion";
import { useState } from "react";

const NewCommentCard = ({ onSubmit }) => {
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onSubmit(comment.trim());
    setComment("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 border border-gray-200 dark:border-gray-700"
    >
      <h3 className="text-gray-900 dark:text-white font-semibold text-base sm:text-lg">
        Add a Comment
      </h3>

      <motion.textarea
        whileFocus={{ scale: 1.01 }}
        rows="3"
        value={comment}
        onChange={(e) =>
          setComment(e.target.value.slice(0, 200))
        }
        placeholder="Write your comment..."
        className="mt-3 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* Character Counter */}
      <div className="mt-2 flex justify-between items-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
        <span>{comment.length}/200</span>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        disabled={!comment.trim()}
        onClick={handleSubmit}
        className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm sm:text-base font-medium disabled:opacity-50 shadow hover:bg-blue-700 transition"
      >
        Post Comment
      </motion.button>
    </motion.div>
  );
};

export default NewCommentCard;
