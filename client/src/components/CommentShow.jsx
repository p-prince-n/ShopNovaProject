
import { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, Edit3, Trash2, Check, X } from "lucide-react";
import { useAuthStore } from "../Store/authStore";
import { useNavigate } from "react-router-dom";

const CommentCard = ({
  username,
  time,
  content,
  likes = [],
  onLike,
  onEdit,
  isLiked,
  onDelete,
  canEdit = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(content);
    const {user}=useAuthStore();
    const navigate=useNavigate();
  const handleSave = () => {
    if (editValue.trim()) {
      onEdit(editValue);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditValue(content);
    setIsEditing(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-md p-4 sm:p-5 md:p-6 border border-gray-200 dark:border-gray-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
          <span className="font-semibold text-gray-900 dark:text-white">
            {username}
          </span>
          <span>{time}</span>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="mt-3 flex flex-col gap-2">
            <textarea
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm resize-none"
              rows={3}
            />
            <div className="flex gap-2">
              <button
                onClick={handleSave}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition"
              >
                <Check size={16} /> Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-3 py-1 bg-gray-400 text-white text-sm rounded-lg hover:bg-gray-500 transition"
              >
                <X size={16} /> Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-2 text-gray-700 dark:text-gray-200 text-base sm:text-sm md:text-base">
            {content}
          </p>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-4">
          {/* 👍 Like */}
          <button
            onClick={()=>user ? onLike() : navigate('/sign-in')}
            className={`flex items-center gap-1 transition ${
              isLiked
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <ThumbsUp
              size={18}
              className={`${isLiked ? "currentColor" : "none"}`}
              fill={isLiked ? "currentColor" : "none"}
              stroke="currentColor"
            />
            <span>
              {likes.length} {likes.length < 2 ? "like" : "likes"}
            </span>
          </button>

          {/* Edit/Delete only if allowed */}
          {canEdit && !isEditing && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition"
              >
                <Edit3 size={18} />
                <span>Edit</span>
              </button>

              <button
                onClick={onDelete}
                className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition"
              >
                <Trash2 size={18} />
                <span>Delete</span>
              </button>
            </>
          )}
        </div>
      </motion.div>
     
    </>
  );
};

export default CommentCard;
