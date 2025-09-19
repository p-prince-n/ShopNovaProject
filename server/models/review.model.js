import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comment: {
      type: String,
      trim: true,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // users who liked this review
      },
    ],
  },
  { timestamps: true }
);

// prevent duplicate reviews by the same user for one product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);

export default Review;
