
import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleLike,
} from "../Controller/review.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";

const reviewRouter = express.Router();


reviewRouter.post("/", verifyToken, createReview);


reviewRouter.get("/:productId", getProductReviews);


reviewRouter.put("/:reviewId", verifyToken, updateReview);


reviewRouter.delete("/:reviewId", verifyToken, deleteReview);


reviewRouter.put("/:reviewId/like", verifyToken, toggleLike);


export default reviewRouter;
