// routes/reviewRoutes.js
import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleLike,   // 👈 import
} from "../Controller/review.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const reviewRouter = express.Router();

// create a review
reviewRouter.post("/", verifyToken, createReview);

// get all reviews of a product
reviewRouter.get("/:productId", getProductReviews);

// update review (only owner)
reviewRouter.put("/:reviewId", verifyToken, updateReview);

// delete review (owner or admin)
reviewRouter.delete("/:reviewId", verifyToken, deleteReview);

// ✅ toggle like
reviewRouter.put("/:reviewId/like", verifyToken, toggleLike);


export default reviewRouter;
