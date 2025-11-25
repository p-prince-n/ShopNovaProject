
import { useEffect, useState } from "react";
import CommentCard from "./CommentShow";
import NewCommentCard from "./NewCommentCard";
import { useReviewStore } from "../Store/useReviewStore";
import { useAuthStore } from "../Store/authStore";
import { useNavigate } from "react-router-dom";
import LoaderAnimation from "./LoaderAnimation";

const CommentsList = ({ productId }) => {
  const {
    reviews,
    getReviews,
    createReview,
    updateReview,
    deleteReview,
    toggleLike,
    loading,
  } = useReviewStore();
  const navigate = useNavigate();

  const { user } = useAuthStore();
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    if (productId) getReviews(productId);
  }, [productId, getReviews]);

  const addComment = (text) => {
    if (!text.trim()) return;
    createReview(productId, text);
    setVisibleCount(3);
  };

  const handleShowMore = () => setVisibleCount((prev) => prev + 3);

  const displayedReviews = reviews.slice(0, visibleCount);
  console.log(displayedReviews);

  return (
    <div className="flex flex-col items-center gap-4 p-4 w-full">
      {loading && <LoaderAnimation />}

      {displayedReviews.length > 0 &&
        displayedReviews.map((r) => (
          <CommentCard
            key={r._id}
            username={r.user?.name || "Anonymous"}
            time={new Date(r.createdAt).toLocaleString()}
            content={r.comment}
            likes={r.likes}
            isLiked={r.likes.includes(user?._id)}
            onLike={() => toggleLike(r._id)}
            onEdit={(content) => {
              updateReview(r._id, content);
            }}
            onDelete={() => deleteReview(r._id)}
            canEdit={r.user?._id === user?._id}
          />
        ))}

      {visibleCount < reviews.length && (
        <button
          onClick={handleShowMore}
          className="px-4 py-2 mt-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Show more reviews
        </button>
      )}

      {user ? (
        <NewCommentCard onSubmit={addComment} />
        
      ) : (
        <p className="text-white/70 dark:text-green-400 ">
          Sign in to post review{" "}
          <span
            className="hover:underline font-bold"
            onClick={() => navigate("/sign-in")}
          >
            Click Me
          </span>
        </p>
      )}
      {displayedReviews.length < 1 &&(
        !loading && <p className="text-gray-300">No reviews yet. Be the first!</p>
      )}
    </div>
  );
};

export default CommentsList;
