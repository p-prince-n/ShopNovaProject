
// controllers/reviewController.js
import Review from "../models/review.model.js";

// ✅ Create Review
export const createReview = async (req, res) => {
  try {
    const { productId, comment } = req.body;
    const userId = req.userId; // from verifyToken middleware

    if (!comment || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "Comment and product are required" });
    }

    let newReview = new Review({
      product: productId,
      user: userId,
      comment,
    });

    await newReview.save();

    // ✅ Populate the user fields after saving
    newReview = await newReview.populate("user", "name email");

    res.status(201).json({ success: true, review: newReview });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ success: false, message: "You already reviewed this product" });
    }
    res
      .status(500)
      .json({ success: false, message: "Error creating review", error: error.message });
  }
};


// ✅ Get All Reviews for a Product
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email") // fetch reviewer name/email
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching reviews", error: error.message });
  }
};

// ✅ Update Review (only owner)
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { comment } = req.body;
    const userId = req.userId;

    const review = await Review.findById(reviewId).populate("user", "name email");

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (review.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    review.comment = comment || review.comment;
    await review.save();

    res.status(200).json({ success: true, review });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error updating review", error: error.message });
  }
};

// ✅ Delete Review (owner or admin)
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // allow owner or admin to delete
    if (review.user.toString() !== userId && !req.user?.isAdmin) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error deleting review", error: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    // check if user already liked
    const alreadyLiked = review.likes.includes(userId);

    if (alreadyLiked) {
      // remove like
      review.likes = review.likes.filter((id) => id.toString() !== userId);
    } else {
      // add like
      review.likes.push(userId);
    }

    await review.save();

    // populate user for consistency
    const populatedReview = await Review.findById(reviewId).populate("user", "name email");

    res.status(200).json({ success: true, review: populatedReview });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling like",
      error: error.message,
    });
  }
};
